import { GraphQLError } from "graphql";
import clinetModal from "../modal/clientModal";
import { context, isAuth } from "../utils";

type SORT_ENUM = "ASC" | "DESC";

const clientResolvers = {
  Query: {
    getClients: isAuth(
      async (
        _: undefined,
        {
          page,
          offset,
          search,
          sort,
        }: { page: number; offset: number; search: string; sort: SORT_ENUM },
        context: context
      ) => {
        try {
          const datas = await clinetModal
            .find({
              userId: context.userId,
              ...(search ? { name: new RegExp(search, "i") } : {}),
            })
            .limit(offset)
            .skip((page - 1) * offset)
            .sort({ createdAt: sort === "ASC" ? 1 : -1 });
          const totalCount = await clinetModal.countDocuments({
            userId: context.userId,
            ...(search ? { name: new RegExp(search, "i") } : {}),
          });

          return {
            clients: datas,
            pagination: {
              totalCount,
              page: page,
              offset: offset,
            },
          };
        } catch (error) {
          throw error;
        }
      }
    ),
    getAllClients: isAuth(async (_: undefined, {}, context: context) => {
      try {
        const datas = await clinetModal.find({
          userId: context.userId,
        });
        return datas;
      } catch (error) {
        throw error;
      }
    }),
    getSingleClient: isAuth(async (_: undefined, { id }: { id: string }) => {
      try {
        const data = await clinetModal.findOne({ _id: id });
        return data;
      } catch (error) {
        throw error;
      }
    }),
  },
  Mutation: {
    addClient: isAuth(
      async (
        _: undefined,
        { name, userId }: { name: string; userId: string }
      ) => {
        try {
          if (!name || !userId) throw "provide the name please";
          const clientInstance = new clinetModal({
            name,
            userId,
          });
          const data = await clientInstance.save();
          return data;
        } catch (error) {
          throw new GraphQLError("error in creating the client");
        }
      }
    ),
    updateClient: isAuth(
      async (_: undefined, { id, name }: { id: string; name: string }) => {
        try {
          if (!id) throw "provide the id please";
          const data = await clinetModal.findOneAndUpdate(
            { _id: id },
            { name }
          );
          return data;
        } catch (error) {
          throw error;
        }
      }
    ),

    deleteClient: isAuth(async (_: undefined, { id }: { id: string }) => {
      try {
        if (!id) throw "provide the id please";
        const data = await clinetModal.findOneAndDelete({ _id: id });
        return data;
      } catch (error) {
        throw error;
      }
    }),
  },
};

export default clientResolvers;
