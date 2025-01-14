import type { DefaultOptions } from "@apollo/client";
import {
  ApolloClient,
  ApolloLink,
  from,
  HttpLink,
  InMemoryCache,
  Observable,
} from "@apollo/client/core";
import { onError } from "@apollo/client/link/error";
import { provideApolloClient, useMutation } from "@vue/apollo-composable";
import { REFREASH_TOKEN_API } from "./service/authApis";

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userId");
  setTimeout(() => {
    window.location.href = "http://localhost:5173/login";
  }, 1000);
};

const httpLink = new HttpLink({ uri: "http://localhost:4000/graphql" });

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const token = localStorage.getItem("accessToken");
  operation.setContext({
    headers: {
      authorization: token ? `${token}` : "",
      "x-user-id": localStorage.getItem("userId"),
    },
  });
  return forward(operation);
});

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors?.[0].extensions?.code === "INVALID_TOKEN") {
    if (!localStorage.getItem("refreshToken")) {
      logout();
      return;
    }
    return new Observable((observer) => {
      const { mutate: newTokenMutation } = useMutation(REFREASH_TOKEN_API);

      newTokenMutation({
        refreshToken: localStorage.getItem("refreshToken") ?? "",
      })
        .then(({ data }: any) => {
          const newToken = data?.refreshToken?.accessToken;
          localStorage.setItem("accessToken", newToken);

          // Update the operation context with the new token
          operation.setContext(({ headers = {} }) => ({
            headers: {
              ...headers,
              authorization: `Bearer ${newToken}`,
              "x-user-id": localStorage.getItem("userId"),
            },
          }));

          // Retry the failed request
          const subscriber = forward(operation).subscribe({
            next: (value) => observer.next(value),
            error: (err) => observer.error(err),
            complete: () => observer.complete(),
          });

          return () => {
            subscriber.unsubscribe();
          };
        })
        .catch((err) => {
          console.error("Token refresh failed:", err);
          logout();
          observer.error(err);
        });
    });
  }
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([errorLink, authMiddleware, httpLink]),
});

provideApolloClient(client);
export default client;
