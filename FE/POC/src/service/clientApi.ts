import gql from "graphql-tag";

export const GET_CLIENTS_API = gql`
  query GetClients($page: Int!, $offset: Int!, $sort: SORT!, $search: String) {
    getClients(page: $page, offset: $offset, sort: $sort, search: $search) {
      pagination {
        totalCount
        page
        offset
      }
      clients {
        createdAt
        id
        name
      }
    }
  }
`;

export const GET_ALL_CLIENTS_API = gql`
  query GetAllClients {
    getAllClients {
      createdAt
      id
      name
    }
  }
`;

export const ADD_CLIENT_API = gql`
  mutation AddClient($name: String!, $userId: String!) {
    addClient(name: $name, userId: $userId) {
      id
    }
  }
`;

export const GET_CLIENT_API = gql`
  query GetSingleClient($getSingleClientId: ID!) {
    getSingleClient(id: $getSingleClientId) {
      name
    }
  }
`;

export const UPADTE_CLIENT_API = gql`
  mutation UpdateClient($updateClientId: ID!, $name: String!) {
    updateClient(id: $updateClientId, name: $name) {
      id
    }
  }
`;

export const DELETE_CLIENT_API = gql`
  mutation DeleteClient($deleteClientId: ID!) {
    deleteClient(id: $deleteClientId) {
      id
    }
  }
`;

// export const ADD_PROJECT_API = gql`
//   mutation AddProject(
//     $title: String!
//     $clientId: String!
//     $userId: String!
//     $description: String
//     $status: Status
//     $tags: [String]
//     $priority: Priority
//   ) {
//     addProject(
//       title: $title
//       clientId: $clientId
//       userId: $userId
//       description: $description
//       status: $status
//       tags: $tags
//       priority: $priority
//     ) {
//       id
//     }
//   }
// `;
