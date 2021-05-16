export const MUTATIONS = {
  LOGIN: `
    mutation($credentials: LoginInput!) {
      login(credentials: $credentials) {
        userId
        authorization
        profile {
          _id
          firstName
          lastName
          role
          username
          createdAt
          updatedAt
        }
      }
    }
  `,
  LOGOUT: `mutation{logout}`,
  USER_CREATE: `
  mutation ($user: CreateUserInput!) {
    user_create(
      user: $user
    ) {
      _id
      firstName
      lastName
      username
      role
      createdAt
      updatedAt
    }
  }
  `,
  USER_UPDATE: `
    mutation ($user: UpdateUserInput!) {
      user_update(user: $user)
    }
  `,
  USER_DELETE: `
  mutation($_id: String!){user_delete(_id: $_id)}
  `,
};
