import userModal from "../modal/userModal";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { isAuth } from "../utils";

type addUser = {
  name: string;
  email: string;
  password: string;
};

type updateUser = {
  id: string;
  name?: string;
  email?: string;
  password?: string;
};

const gethahsedPassword = async (password: string) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
};

const compareHashPassword = async (password: string, hashPassword: string) => {
  try {
    const res = await bcrypt.compare(password, hashPassword);
    return res;
  } catch (error) {
    throw error;
  }
};

const userResolvers = {
  Query: {
    getUsers: isAuth(async () => {
      try {
        const datas = await userModal.find({});
        return datas;
      } catch (error) {
        throw error;
      }
    }),
    getUser: isAuth(async (_: undefined, { id }: { id: string }) => {
      try {
        const data = await userModal.findOne({ _id: id });
        return data;
      } catch (error) {
        throw error;
      }
    }),
  },
  Mutation: {
    signIn: async (
      _: undefined,
      { email, password }: { email: string; password: string }
    ) => {
      if (!email || !password) throw "provide the details please";
      try {
        const data = await userModal.findOne({ email });
        if (!data) {
          throw "invalid username or password";
        }
        const { email: userEmail, name, id, createdAt, lastLoggedInAt } = data;
        const responsePayload = {
          email: userEmail,
          name,
          id,
          createdAt,
          lastLoggedInAt,
        };

        const ispasswordMatched = await compareHashPassword(
          password,
          data.password
        );
        if (ispasswordMatched) {
          if (
            !process.env.ACCESS_HIDDEN_KEY ||
            !process.env.REFREASH_HIDDEN_KEY
          ) {
            throw new Error("Missing secret keys in environment variables");
          }
          const accessToken = jwt.sign(
            { ...responsePayload },
            process.env.ACCESS_HIDDEN_KEY,
            { expiresIn: 1000 * 60 * 5 }
          );
          const refreshToken = jwt.sign(
            { ...responsePayload },
            process.env.REFREASH_HIDDEN_KEY,
            { expiresIn: 1000 * 60 * 10 }
          );

          return {
            accessToken,
            refreshToken,
            data: { ...responsePayload },
          };
        } else {
          throw "invalid username or password";
        }
      } catch (error) {
        throw "invalid username or password";
      }
    },
    addUser: async (_: undefined, { name, email, password }: addUser) => {
      try {
        if (!name || !email || !password) throw "provide the details please";
        const hashedPassword = await gethahsedPassword(password);
        const clientInstance = new userModal({
          name,
          email,
          password: hashedPassword,
        });

        const data = await clientInstance.save();
        return data;
      } catch (error) {
        throw error;
      }
    },
    updateUser: isAuth(async (_: undefined, { id, ...rest }: updateUser) => {
      try {
        if (!id) throw "provide the id please";
        if (!Object.keys(rest).length) throw "nothing to update";
        const payload = structuredClone(rest);
        if (payload.password) {
          const password = await gethahsedPassword(payload.password);
          payload.password = password;
        }
        const data = await userModal.findOneAndUpdate(
          { _id: id },
          { ...payload }
        );
        return data;
      } catch (error) {
        throw error;
      }
    }),
    refreshToken: async (
      _: undefined,
      { refreshToken }: { refreshToken: string }
    ) => {
      try {
        if (!refreshToken) throw "need refresh token";
        const data = jwt.verify(
          refreshToken,
          process.env.REFREASH_HIDDEN_KEY ?? ""
        );
        if (data && Object.keys(data).length && typeof data === "object") {
          const {
            email: userEmail,
            name,
            id,
            createdAt,
            lastLoggedInAt,
          } = data;
          const responsePayload = {
            email: userEmail,
            name,
            id,
            createdAt,
            lastLoggedInAt,
          };
          const token = jwt.sign(
            { ...responsePayload },
            process.env.ACCESS_HIDDEN_KEY ?? "",
            {
              expiresIn: 1000 * 60 * 5,
            }
          );
          return { accessToken: token };
        } else {
          throw "invaild Token";
        }
      } catch (error) {
        throw error;
      }
    },
  },
};

export default userResolvers;
