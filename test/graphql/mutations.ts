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
  TASK_CREATE: `
    mutation($task: CreateTaskInput!) {
      task_create(task: $task) {
        _id
        title
        description
        owner(populate: true) {
          _id
        }
      }
    }
  `,
  TASK_UPDATE: `
    mutation ($task: UpdateTaskInput!) {
      task_update(task: $task)
    }  
  `,
  TASK_MARK_AS_COMPLETED: `
    mutation($task: UpdateTaskInput!) {
      task_update(task: $task)
    }  
  `,
  TASK_DELETE: `
    mutation($_id: String!){task_delete(_id: $_id)}
  `,
  TASK_SHARE: `
    mutation ($taskId: String!, $userId: String!) {
      task_share(taskId: $taskId, userId: $userId)
    }
  `,
  TASK_UNLINK: `
    mutation ($taskId: String!, $userId: String!) {
      task_unlink(taskId: $taskId, userId: $userId)
    }
  `,
  COMMENT_CREATE: `
  mutation ($comment: CreateCommentInput!) {
    comment_create(
      comment: $comment
    ) {
      _id
      user(populate: true) {_id, firstName}
      task(populate: true) {
        _id
        title
        description
        owner(populate:true) {_id, firstName}
        sharedWith(populate:true) {_id, firstName}
        completed
        createdAt
        updatedAt
      }
      content
      createdAt
      updatedAt
    }
  }  
  `,
  COMMENT_UPDATE: `
    mutation ($comment: UpdateCommentInput!) {
      comment_update(comment: $comment)
    }
  `,
  COMMENT_DELETE: `
    mutation($_id: String!){comment_delete(_id: $_id )}
  `,
};
