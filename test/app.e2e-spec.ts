import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { bootstrap } from '../src/main';
import { resetDB } from './database/mongoose-connection';
import { Admincredentials, user1, user2 } from './mocks/user.mock';
import {
  createTask,
  createUser,
  deleteTask,
  deleteUser,
  login,
  oneTask,
  oneUser,
  shareTask,
  updateTask,
  updateUser,
  usersList,
} from './graphql/api-calls';
import { task1 } from './mocks/task.mock';

describe('App (e2e)', () => {
  let app: INestApplication;

  let firstUser;
  let createdUserToBeDeleted;

  beforeAll(async () => {
    await resetDB();
  });

  afterAll(async () => {
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

  afterEach(async () => {
    await app.close();
  });

  describe('Manage Users with Admin Account', () => {
    it('Create (Should create the user)', async () => {
      const loginRes = await login(app, Admincredentials);
      const response: any = await createUser(app, loginRes.cookies, user1);

      expect(JSON.parse(response.res.text)).toMatchObject({
        data: {
          user_create: {
            firstName: user1.firstName,
          },
        },
      });

      firstUser = JSON.parse(response.res.text).data.user_create;
    });

    it('Creates User to be deleted later (Should create the user)', async () => {
      const loginRes = await login(app, Admincredentials);
      const response: any = await createUser(app, loginRes.cookies, user2);

      expect(JSON.parse(response.res.text)).toMatchObject({
        data: {
          user_create: {
            firstName: user2.firstName,
          },
        },
      });

      createdUserToBeDeleted = JSON.parse(response.res.text).data.user_create;
    });

    it('Users List (Should return the list of users)', async () => {
      const loginRes = await login(app, Admincredentials);
      const response: any = await usersList(app, loginRes.cookies);

      expect(JSON.parse(response.res.text)).toMatchObject({
        data: {
          user_list: {},
        },
      });
    });

    it('One user (Should return a spesific user)', async () => {
      const loginRes = await login(app, Admincredentials);
      const response: any = await oneUser(app, loginRes.cookies, firstUser);

      expect(JSON.parse(response.res.text)).toMatchObject({
        data: {
          user: {},
        },
      });
    });

    it('Update User (Should update a spesific user)', async () => {
      const loginRes = await login(app, Admincredentials);
      const response: any = await updateUser(app, loginRes.cookies, firstUser);

      expect(JSON.parse(response.res.text)).toMatchObject({
        data: {
          user_update: {},
        },
      });
    });

    it('Delete User (Should delete a spesific user)', async () => {
      const loginRes = await login(app, Admincredentials);
      const response: any = await deleteUser(
        app,
        loginRes.cookies,
        createdUserToBeDeleted,
      );

      expect(JSON.parse(response.res.text)).toMatchObject({
        data: {
          user_delete: true,
        },
      });
    });

    it('Delete User (himself) (Should fail and return false)', async () => {
      const loginRes = await login(app, Admincredentials);
      const response: any = await deleteUser(
        app,
        loginRes.cookies,
        loginRes.connectedUser,
      );

      expect(JSON.parse(response.res.text)).toMatchObject({
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

      const response: any = await createUser(app, loginRes.cookies, user1);

      expect(JSON.parse(response.res.text)).toMatchObject({
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

      const response: any = await createUser(app, loginRes.cookies, user2);

      expect(JSON.parse(response.res.text)).toMatchObject({
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
      const response: any = await usersList(app, loginRes.cookies);

      expect(JSON.parse(response.res.text)).toMatchObject({
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
      const response: any = await oneUser(app, loginRes.cookies, firstUser);

      expect(JSON.parse(response.res.text)).toMatchObject({
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
      const response: any = await updateUser(app, loginRes.cookies, firstUser);

      expect(JSON.parse(response.res.text)).toMatchObject({
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
      const response: any = await deleteUser(
        app,
        loginRes.cookies,
        createdUserToBeDeleted,
      );

      expect(JSON.parse(response.res.text)).toMatchObject({
        errors: [
          {
            message: 'WRONGACCESS',
          },
        ],
      });
    });
  });

  describe('Manage Tasks by an authenticated user)', () => {
    let secondUser;
    let firstTask;
    it('Create Task by the first user (Should create the task )', async () => {
      const loginRes = await login(app, {
        username: user1.username,
        password: user1.password,
      });

      const response: any = await createTask(app, loginRes.cookies, task1);

      expect(JSON.parse(response.res.text)).toMatchObject({
        data: {
          task_create: {
            description: task1.description,
            title: task1.title,
          },
        },
      });

      firstTask = JSON.parse(response.res.text).data.task_create;
    });

    it('Create The Second user (Should create the user)', async () => {
      const loginRes = await login(app, Admincredentials);
      const response: any = await createUser(app, loginRes.cookies, user2);

      expect(JSON.parse(response.res.text)).toMatchObject({
        data: {
          user_create: {
            firstName: user2.firstName,
          },
        },
      });

      secondUser = JSON.parse(response.res.text).data.user_create;
    });

    it('Get the created task by the second user ( Should Fail )', async () => {
      const loginRes = await login(app, {
        username: user2.username,
        password: user2.password,
      });

      const response: any = await oneTask(app, loginRes.cookies, firstTask);

      expect(JSON.parse(response.res.text)).toMatchObject({
        errors: [
          {
            message: 'WRONGACCESS',
          },
        ],
      });
    });

    it('Share the task with the second user by the first user ( Should Share the task )', async () => {
      const loginRes = await login(app, {
        username: user1.username,
        password: user1.password,
      });

      const response: any = await shareTask(
        app,
        loginRes.cookies,
        firstTask,
        secondUser,
      );

      expect(JSON.parse(response.res.text)).toMatchObject({
        data: {
          task_share: true,
        },
      });
    });

    it('Delete the task by the second user ( Should Fail )', async () => {
      const loginRes = await login(app, {
        username: user2.username,
        password: user2.password,
      });

      const response: any = await deleteTask(app, loginRes.cookies, firstTask);

      expect(JSON.parse(response.res.text)).toMatchObject({
        errors: [
          {
            message: 'WRONGACCESS',
          },
        ],
      });
    });

    it('Update the task by the second user ( Should Update the task )', async () => {
      const loginRes = await login(app, {
        username: user2.username,
        password: user2.password,
      });

      const response: any = await updateTask(app, loginRes.cookies, firstTask);

      expect(JSON.parse(response.res.text)).toMatchObject({
        data: {
          task_update: true,
        },
      });
    });
  });
});
