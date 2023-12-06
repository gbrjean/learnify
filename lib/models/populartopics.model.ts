import mongoose, { Schema } from "mongoose";

const popularTopicsSchema = new Schema({
  topic: { type: String, required: true },
  count: { type: Number, default: 0 },
});



const PopularTopics = mongoose.models.PopularTopics || mongoose.model('PopularTopics', popularTopicsSchema);

export default PopularTopics;