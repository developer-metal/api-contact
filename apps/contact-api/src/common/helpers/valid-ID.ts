import mongoose from "mongoose";

const validId = (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
            return false;
      }
        return true;
  };
export default validId;