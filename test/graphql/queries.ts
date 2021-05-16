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
};
