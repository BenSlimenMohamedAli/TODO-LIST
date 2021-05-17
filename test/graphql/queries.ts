export const QUERIES = {
  USER: `
  query($_id: String!) {
    user(_id: $_id) {
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
  USER_LIST: `
  query($filters: UserFilters!, $pagination: paginationInput!) {
    user_list(filters: $filters, pagination: $pagination) {
      list {
        _id
        firstName
        lastName
        role
        username
        createdAt
        updatedAt
      }
      pagination {
        page
        total
        totalPages
      }
    }
  }  
  `,
  TASK: `
  query ($_id: String!){
    task(_id: $_id) {
      _id
      title
      description
      owner(populate: true) {
        _id
        firstName
        lastName
        role
        username
        createdAt
        updatedAt
      }
      sharedWith(populate: true) {
        _id
        firstName
        lastName
        role
        username
        createdAt
        updatedAt
      }
      completed
      createdAt
      updatedAt
    }
  }  
  `,
  TASK_LIST: `
  query($filters: TaskFilters!, $pagination: paginationInput!) {
    task_list(filters: $filters, pagination: $pagination) {
      list {
        _id
        title
        description
        owner(populate: true) {
          _id
          firstName
          lastName
          role
          username
          createdAt
          updatedAt
        }
        sharedWith(populate: true) {
          _id
          firstName
          lastName
          role
          username
          createdAt
          updatedAt
        }
        completed
        createdAt
        updatedAt
      }
      pagination {
        page
        size
        total
        totalPages
      }
    }
  }
  `,
  COMMENT: `
  query ($_id: String!) {
    comment(_id: $_id) {
      _id
      content
      createdAt
      updatedAt
      user(populate: true) {
        _id
        firstName
        lastName
        username
        createdAt
        updatedAt
      }
    }
  }  
  `,
  COMMENT_LIST: `
  query($taskId: String!) {
    comment_list(taskId: $taskId) {
      _id
      content
      createdAt
      updatedAt
      user(populate: true) {
        _id
        firstName
        lastName
        username
        createdAt
        updatedAt
      }
    }
  }  
  `,
};
