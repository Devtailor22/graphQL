import projectModal from "../modal/projectModal";
import { context, isAuth } from "../utils";

type addPayload = {
  title: string;
  clientId: string;
  userId: string;
  status: "NEW" | "STATUS";
  tags: string[];
  priority: "LOW" | "MID" | "HIGH";
  dueDate: NativeDate;
};

type updatePayload = {
  id: string;
  title?: string;
  clientId?: string;
  status?: "NEW" | "STATUS";
  tags?: string[];
  priority?: "LOW" | "MID" | "HIGH";
  dueDate: NativeDate;
};

type SORT_ENUM = "ASC" | "DESC";

const projectResolvers = {
  Query: {
    getProjects: isAuth(
      async (
        _: undefined,
        {
          page,
          offset,
          search,
          sort,
          complated = false,
          tagSearch,
        }: {
          page: number;
          offset: number;
          search: string;
          sort: SORT_ENUM;
          complated: boolean;
          tagSearch: string;
        },
        context: context
      ) => {
        try {
          const datas = await projectModal
            .find({
              userId: context.userId,
              ...(search ? { title: new RegExp(search, "i") } : {}),
              ...(tagSearch
                ? { tags: { $in: new RegExp(tagSearch, "i") } }
                : {}),
              ...(complated ? { status: "CLOSED" } : { status: "INPROGRESS" }),
            })
            .populate("clientId")
            .limit(offset)
            .skip((page - 1) * offset)
            .sort({ createdAt: sort === "ASC" ? 1 : -1 });
          const totalCount = await projectModal.countDocuments({
            userId: context.userId,
            ...(search ? { title: new RegExp(search, "i") } : {}),
            ...(tagSearch ? { tags: { $in: new RegExp(tagSearch, "i") } } : {}),
            ...(complated ? { status: "CLOSED" } : { status: "INPROGRESS" }),
          });
          return {
            projects: datas,
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
    getSingleProject: isAuth(async (_: undefined, { id }: { id: string }) => {
      try {
        const data = await projectModal
          .findOne({ _id: id })
          .populate("clientId");
        return data;
      } catch (error) {
        throw error;
      }
    }),
  },
  Mutation: {
    addProject: isAuth(async (_: undefined, payload: addPayload) => {
      try {
        if (!payload.title) throw "provide the title please";
        if (!payload.userId) throw "provide the userId please";
        if (!payload.clientId) throw "provide the clientId please";
        if (!payload.dueDate) throw "provide the dueDate please";
        const projectInstance = new projectModal({
          ...payload,
        });
        const data = await projectInstance.save();
        return data;
      } catch (error) {
        throw error;
      }
    }),
    updateProject: isAuth(
      async (_: undefined, { id, ...rest }: updatePayload) => {
        try {
          let dueDateUpdated;
          if (rest.dueDate) {
            const singleProjectData = await projectModal.findOne({ _id: id });
            dueDateUpdated = singleProjectData?.dueDate === rest.dueDate;
          }

          if (!id) throw "provide the id please";
          if (!Object.keys(rest).length) throw "nothing to update";
          const data = await projectModal.findOneAndUpdate(
            { _id: id },
            { ...rest, ...(rest.dueDate ? { isNotified: dueDateUpdated } : {}) }
          );
          return data;
        } catch (error) {
          throw error;
        }
      }
    ),

    deleteProject: isAuth(async (_: undefined, { id }: { id: string }) => {
      try {
        if (!id) throw "provide the id please";
        const data = await projectModal.findOneAndDelete({ _id: id });
        return data;
      } catch (error) {
        throw error;
      }
    }),
  },
};

export default projectResolvers;
