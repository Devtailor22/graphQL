import mongoose, { Document } from "mongoose";
import projectModal from "./projectModal";

interface Client extends Document {
    name: string;
    email: string;
    // other client fields...
  }

const clinetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Types.ObjectId, 
        ref: "users",
        required: true,
    },
    createdAt: { type: Date, default: Date.now()},
})

clinetSchema.post<Client>('findOneAndDelete', async function(clinet:Client) {
    try {
      await projectModal.deleteMany({ clientId: clinet._id });
      console.log("deleted all the releted projects");
      
    } catch (error) {
        console.error(error);
    }
  });

const clinetModal = mongoose.model('clients', clinetSchema);

export default clinetModal