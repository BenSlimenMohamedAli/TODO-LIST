import { MUTATIONS } from './mutations';
import { QUERIES } from './queries';
import * as request from 'supertest';

export const login = async (app: any, credentials: any) => {
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

export const createUser = async (app: any, cookies: any, user: any) => {
  const response: any = await request(app.getHttpServer())
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
  return response;
};

export const usersList = async (app: any, cookies: any) => {
  const response: any = await request(app.getHttpServer())
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
  return response;
};

export const oneUser = async (app: any, cookies: any, createdUser: any) => {
  const response: any = await request(app.getHttpServer())
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
  return response;
};

export const updateUser = async (app: any, cookies: any, createdUser: any) => {
  const response: any = await request(app.getHttpServer())
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

  return response;
};

export const deleteUser = async (app: any, cookies: any, createdUser: any) => {
  const response: any = await request(app.getHttpServer())
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

  return response;
};

export const createTask = async (app: any, cookies: any, task: any) => {
  const response: any = await request(app.getHttpServer())
    .post('/graphql')
    .set('Cookie', cookies)
    .set('Accept', 'application/json')
    .send({
      operationName: null,
      query: MUTATIONS.TASK_CREATE,
      variables: {
        task,
      },
    })
    .expect(200);
  return response;
};

export const oneTask = async (app: any, cookies: any, createdTask: any) => {
  const response: any = await request(app.getHttpServer())
    .post('/graphql')
    .set('Cookie', cookies)
    .set('Accept', 'application/json')
    .send({
      operationName: null,
      query: QUERIES.TASK,
      variables: {
        _id: createdTask._id,
      },
    })
    .expect(200);
  return response;
};

export const shareTask = async (
  app: any,
  cookies: any,
  createdTask: any,
  user: any,
) => {
  const response: any = await request(app.getHttpServer())
    .post('/graphql')
    .set('Cookie', cookies)
    .set('Accept', 'application/json')
    .send({
      operationName: null,
      query: MUTATIONS.TASK_SHARE,
      variables: {
        taskId: createdTask._id,
        userId: user._id,
      },
    })
    .expect(200);
  return response;
};

export const deleteTask = async (app: any, cookies: any, createdTask: any) => {
  const response: any = await request(app.getHttpServer())
    .post('/graphql')
    .set('Cookie', cookies)
    .set('Accept', 'application/json')
    .send({
      operationName: null,
      query: MUTATIONS.TASK_DELETE,
      variables: {
        _id: createdTask._id,
      },
    })
    .expect(200);
  return response;
};

export const updateTask = async (app: any, cookies: any, createdTask: any) => {
  const response: any = await request(app.getHttpServer())
    .post('/graphql')
    .set('Cookie', cookies)
    .set('Accept', 'application/json')
    .send({
      operationName: null,
      query: MUTATIONS.TASK_UPDATE,
      variables: {
        task: {
          _id: createdTask._id,
          title: 'new title',
          description: 'new description',
          completed: true,
        },
      },
    })
    .expect(200);
  return response;
};
