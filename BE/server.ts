import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import clientDefs from "./typesDefs/client";
import userDefs from "./typesDefs/user";
import projectDefs from "./typesDefs/project";
import connectDB from "./db.config";
import clientResolvers from "./resolvers/client";
import userResolvers from "./resolvers/user";
import projectResolvers from "./resolvers/project";
import { cornJobForNotifyTheDueDateOfProject } from "./utils";

const resolvers = {
  Query: {
    ...clientResolvers.Query,
    ...userResolvers.Query,
    ...projectResolvers.Query,
  },
  Mutation: {
    ...clientResolvers.Mutation,
    ...userResolvers.Mutation,
    ...projectResolvers.Mutation,
  },
  // Add other resolver types (Subscription, etc.) as needed
};
const server = new ApolloServer({
  typeDefs: [clientDefs, userDefs, projectDefs],
  resolvers,
});

connectDB
  .then(async () => {
    const { url } = await startStandaloneServer(server, {
      listen: { port: 4000 },
      context: async ({ req }: any) => {
        const token = (await req?.headers?.["authorization"]) ?? "";
        const userId = (await req.headers?.["x-user-id"]) ?? "";
        return {
          token,
          userId,
        };
      },
    });
    cornJobForNotifyTheDueDateOfProject();
    console.log(`server running on ${url}`);
  })
  .catch((error: any) => console.log("error", error));
