import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { MUTATIONS } from './graphql/mutations';
import { bootstrap } from '../src/main';
import { resetDB } from './database/mongoose-connection';
import { Admincredentials, user1, user2 } from './mocks/user.mock';
import { QUERIES } from './graphql/queries';

afterAll(async () => {
  await new Promise<void>((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
  await resetDB();
});

describe('User (e2e)', () => {
  let app: INestApplication;

  let createdUser;
  let createdUserToBeDeleted;

  beforeAll(async () => {
    await resetDB();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    bootstrap(app);
    await app.init();
  });

  afterAll(async () => {
    await resetDB();
    await app.close();
  });

  describe('Manage Users with Admin Account', () => {
    it('Create (Should create the user)', async () => {
      const loginRes = await login(app, Admincredentials);
      const createUserResponse: any = await createUser(
        app,
        loginRes.cookies,
        user1,
      );

      expect(JSON.parse(createUserResponse.res.text)).toMatchObject({
        data: {
          user_create: {
            firstName: user1.firstName,
          },
        },
      });

      createdUser = JSON.parse(createUserResponse.res.text).data.user_create;
    });

    it('Creates User to be deleted later (Should create the user)', async () => {
      const loginRes = await login(app, Admincredentials);
      const createUserResponse: any = await createUser(
        app,
        loginRes.cookies,
        user2,
      );

      expect(JSON.parse(createUserResponse.res.text)).toMatchObject({
        data: {
          user_create: {
            firstName: user2.firstName,
          },
        },
      });

      createdUserToBeDeleted = JSON.parse(createUserResponse.res.text).data
        .user_create;
    });

    it('Users List (Should return the list of users)', async () => {
      const loginRes = await login(app, Admincredentials);
      const usersListResponse: any = await usersList(app, loginRes.cookies);

      expect(JSON.parse(usersListResponse.res.text)).toMatchObject({
        data: {
          user_list: {},
        },
      });
    });

    it('One user (Should return a spesific user)', async () => {
      const loginRes = await login(app, Admincredentials);
      const oneUserResponse: any = await oneUser(
        app,
        loginRes.cookies,
        createdUser,
      );

      expect(JSON.parse(oneUserResponse.res.text)).toMatchObject({
        data: {
          user: {},
        },
      });
    });

    it('Update User (Should update a spesific user)', async () => {
      const loginRes = await login(app, Admincredentials);
      const updateResponse: any = await updateUser(
        app,
        loginRes.cookies,
        createdUser,
      );

      expect(JSON.parse(updateResponse.res.text)).toMatchObject({
        data: {
          user_update: {},
        },
      });
    });

    it('Delete User (Should delete a spesific user)', async () => {
      const loginRes = await login(app, Admincredentials);
      const deleteResponse: any = await deleteUser(
        app,
        loginRes.cookies,
        createdUserToBeDeleted,
      );

      expect(JSON.parse(deleteResponse.res.text)).toMatchObject({
        data: {
          user_delete: true,
        },
      });
    });

    it('Delete User (himself) (Should fail and return false)', async () => {
      const loginRes = await login(app, Admincredentials);
      const deleteResponse: any = await deleteUser(
        app,
        loginRes.cookies,
        loginRes.connectedUser,
      );

      expect(JSON.parse(deleteResponse.res.text)).toMatchObject({
        data: {
          user_delete: false,
        },
      });
    });
  });

  describe('Manage Users with a normal User Account (Should Fail)', () => {
    it('Create User (Should Fail and return WRONGACCESS )', async () => {
      const loginRes = await login(app, {
        username: user1.username,
        password: user1.password,
      });

      const createUserResponse: any = await createUser(
        app,
        loginRes.cookies,
        user1,
      );

      expect(JSON.parse(createUserResponse.res.text)).toMatchObject({
        errors: [
          {
            message: 'WRONGACCESS',
          },
        ],
      });
    });

    it('Create User to be deleted later (Should Fail and return WRONGACCESS )', async () => {
      const loginRes = await login(app, {
        username: user1.username,
        password: user1.password,
      });

      const createUserResponse: any = await createUser(
        app,
        loginRes.cookies,
        user2,
      );

      expect(JSON.parse(createUserResponse.res.text)).toMatchObject({
        errors: [
          {
            message: 'WRONGACCESS',
          },
        ],
      });
    });

    it('Users List (Should Fail and return WRONGACCESS )', async () => {
      const loginRes = await login(app, {
        username: user1.username,
        password: user1.password,
      });
      const usersListResponse: any = await usersList(app, loginRes.cookies);

      expect(JSON.parse(usersListResponse.res.text)).toMatchObject({
        errors: [
          {
            message: 'WRONGACCESS',
          },
        ],
      });
    });

    it('One user (Should Fail and return WRONGACCESS )', async () => {
      const loginRes = await login(app, {
        username: user1.username,
        password: user1.password,
      });
      const oneUserResponse: any = await oneUser(
        app,
        loginRes.cookies,
        createdUser,
      );

      expect(JSON.parse(oneUserResponse.res.text)).toMatchObject({
        errors: [
          {
            message: 'WRONGACCESS',
          },
        ],
      });
    });

    it('Update User (Should Fail and return WRONGACCESS )', async () => {
      const loginRes = await login(app, {
        username: user1.username,
        password: user1.password,
      });
      const updateResponse: any = await updateUser(
        app,
        loginRes.cookies,
        createdUser,
      );

      expect(JSON.parse(updateResponse.res.text)).toMatchObject({
        errors: [
          {
            message: 'WRONGACCESS',
          },
        ],
      });
    });

    it('Delete User (Should Fail and return WRONGACCESS )', async () => {
      const loginRes = await login(app, {
        username: user1.username,
        password: user1.password,
      });
      const deleteResponse: any = await deleteUser(
        app,
        loginRes.cookies,
        createdUserToBeDeleted,
      );

      expect(JSON.parse(deleteResponse.res.text)).toMatchObject({
        errors: [
          {
            message: 'WRONGACCESS',
          },
        ],
      });
    });
  });
});

const login = async (app: any, credentials: any) => {
  const response = await request(app.getHttpServer())
    .post('/graphql')
    .send({
      operationName: null,
      query: MUTATIONS.LOGIN,
      variables: {
        credentials,
      },
    })
    .expect(200);

  const { res, header } = response as any;
  const cookies = header['set-cookie'];

  expect(JSON.parse(res.text)).toMatchObject({
    data: {
      login: {
        profile: {
          username: credentials.username,
        },
      },
    },
  });

  const connectedUser = JSON.parse(res.text).data.login.profile;

  return { connectedUser, cookies };
};

const createUser = async (app: any, cookies: any, user: any) => {
  const createUserResponse: any = await request(app.getHttpServer())
    .post('/graphql')
    .set('Cookie', cookies)
    .set('Accept', 'application/json')
    .send({
      operationName: null,
      query: MUTATIONS.USER_CREATE,
      variables: {
        user,
      },
    })
    .expect(200);
  return createUserResponse;
};

const usersList = async (app: any, cookies: any) => {
  const usersListResponse: any = await request(app.getHttpServer())
    .post('/graphql')
    .set('Cookie', cookies)
    .set('Accept', 'application/json')
    .send({
      operationName: null,
      query: QUERIES.USER_LIST,
      variables: {
        filters: {},
        pagination: {
          page: 1,
          size: 10,
        },
      },
    })
    .expect(200);
  return usersListResponse;
};

const oneUser = async (app: any, cookies: any, createdUser: any) => {
  const oneUserResponse: any = await request(app.getHttpServer())
    .post('/graphql')
    .set('Cookie', cookies)
    .set('Accept', 'application/json')
    .send({
      operationName: null,
      query: QUERIES.USER,
      variables: {
        _id: createdUser._id,
      },
    })
    .expect(200);
  return oneUserResponse;
};

const updateUser = async (app: any, cookies: any, createdUser: any) => {
  const updateResponse: any = await request(app.getHttpServer())
    .post('/graphql')
    .set('Cookie', cookies)
    .set('Accept', 'application/json')
    .send({
      operationName: null,
      query: MUTATIONS.USER_UPDATE,
      variables: {
        user: {
          _id: createdUser._id,
          firstName: 'New FirstName',
        },
      },
    })
    .expect(200);

  return updateResponse;
};

const deleteUser = async (app: any, cookies: any, createdUser: any) => {
  const deleteResponse: any = await request(app.getHttpServer())
    .post('/graphql')
    .set('Cookie', cookies)
    .set('Accept', 'application/json')
    .send({
      operationName: null,
      query: MUTATIONS.USER_DELETE,
      variables: {
        _id: createdUser._id,
      },
    })
    .expect(200);

  return deleteResponse;
};
