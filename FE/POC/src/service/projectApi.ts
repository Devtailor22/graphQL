import gql from "graphql-tag";

export const GET_PROJECTS_API = gql`
  query GetProjects(
    $page: Int!
    $offset: Int!
    $sort: SORT!
    $search: String
    $complated: Boolean
    $tagSearch: String
  ) {
    getProjects(
      page: $page
      offset: $offset
      sort: $sort
      search: $search
      complated: $complated
      tagSearch: $tagSearch
    ) {
      pagination {
        totalCount
        page
        offset
      }
      projects {
        title
        description
        createdAt
        updatedAt
        id
        userId
        clientId {
          name
          id
        }
        status
        tags
        priority
        isDeleted
        dueDate
      }
    }
  }
`;

export const ADD_PROJECT_API = gql`
  mutation AddProject(
    $title: String!
    $clientId: String!
    $userId: String!
    $description: String
    $status: Status
    $tags: [String]
    $priority: Priority
    $dueDate: String!
  ) {
    addProject(
      title: $title
      clientId: $clientId
      userId: $userId
      description: $description
      status: $status
      tags: $tags
      priority: $priority
      dueDate: $dueDate
    ) {
      id
    }
  }
`;

export const UPDATE_PROJECT_API = gql`
  mutation UpdateProject(
    $updateProjectId: ID!
    $title: String
    $description: String
    $clientId: String
    $status: Status
    $tags: [String]
    $priority: Priority
    $dueDate: String
  ) {
    updateProject(
      id: $updateProjectId
      title: $title
      description: $description
      clientId: $clientId
      status: $status
      tags: $tags
      priority: $priority
      dueDate: $dueDate
    ) {
      id
    }
  }
`;

export const GET_PROJECT_API = gql`
  query GetSingleProject($getSingleProjectId: ID!) {
    getSingleProject(id: $getSingleProjectId) {
      title
      description
      clientId {
        name
        id
      }
      status
      tags
      priority
      dueDate
    }
  }
`;

export const DELETE_PROJECT_API = gql`
  mutation Mutation($deleteProjectId: ID!) {
    deleteProject(id: $deleteProjectId) {
      id
    }
  }
`;
