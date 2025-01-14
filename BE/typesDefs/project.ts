const projectDefs = `
type Client {
    createdAt: String!
    name: String!
    id: ID!
    userId: ID!
}

type Projects {
    title: String!
    description: String!
    createdAt: String!
    updatedAt: String!
    id: ID!
    userId: ID!
    clientId: Client
    status: Status
    tags: [String]
    priority: Priority
    isDeleted: Boolean
    dueDate: String

}
  enum Status {
    INPROGRESS
    CLOSED
  }
  enum Priority {
    LOW
    MID
    HIGH
  }

  type Pagination {
  totalCount: Int
  page: Int
  offset: Int
  }

  enum SORT {
  ASC
  DESC
  }

  type getProjects {
  projects : [Projects]
  pagination: Pagination
  }

  type Query {
    getProjects( page: Int!, offset: Int!, sort: SORT!, search: String, complated: Boolean, tagSearch: String ): getProjects
    getSingleProject(id: ID!): Projects
  }
  type Mutation {
  addProject(title: String!, description:String clientId: String!, userId: String!, status: Status, tags:[String], priority: Priority, dueDate: String! ): Projects
  updateProject(id: ID!, title: String, description:String, clientId: String, status: Status, tags:[String], priority: Priority, isDeleted: Boolean, dueDate: String): Projects
  deleteProject(id: ID!): Projects
  }
`;

export default projectDefs;
