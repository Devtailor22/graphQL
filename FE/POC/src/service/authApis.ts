import gql from "graphql-tag";

export const SIGN_IN_API = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      accessToken
      refreshToken
      data {
        id
        email
        name
      }
    }
  }
`;

export const SIGN_UP_API = gql`
  mutation AddUser($name: String!, $email: String!, $password: String!) {
    addUser(name: $name, email: $email, password: $password) {
      email
    }
  }
`;

export const REFREASH_TOKEN_API = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      accessToken
    }
  }
`;
