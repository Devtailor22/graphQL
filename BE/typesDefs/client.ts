const clientDefs = `
type Clients {
    createdAt: String!
    name: String!
    id: ID!
    userId: ID!
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
  type getClients {
  clients : [Clients]
  pagination: Pagination
  }


type Query {
  getClients( page: Int!, offset: Int!, sort: SORT!, search: String ): getClients
  getAllClients: [Clients]
  getSingleClient(id: ID!): Clients
}
type Mutation {
addClient(name: String!, userId: String!): Clients
updateClient(id: ID!, name: String!): Clients
deleteClient(id: ID!): Clients
}
`;

export default clientDefs;
