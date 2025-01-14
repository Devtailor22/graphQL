const userDefs = `
type Users {
    name: String
    id: ID
    email: String
    password: String
    createdAt: String
    lastLoggedInAt: String
}

type UserWithoutPassword {
    name: String
    id: ID
    email: String
    createdAt: String
    lastLoggedInAt: String
}

type signInResponse {
accessToken: String
refreshToken: String
data: UserWithoutPassword
}

type newTokenResponse {
accessToken: String
}

type Query {
getUsers: [Users]
getUser(id: ID!): Users
}

type Mutation {
signIn(email: String!, password: String!): signInResponse
addUser(name: String!, email: String!, password: String!): Users
updateUser(name: String, email: String, password: String): Users
refreshToken(refreshToken: String!): newTokenResponse
}
`;

export default userDefs;
