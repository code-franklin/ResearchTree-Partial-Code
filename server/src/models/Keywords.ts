import mongoose, { Document, Schema } from "mongoose";

interface IKeyword extends Document {
  keyword: string;
}

const KeywordSchema: Schema = new Schema<IKeyword>(
  {
    keyword: { type: String, required: true },
  },
  { collection: "Keywords" }
);

export default mongoose.model<IKeyword>("Keyword", KeywordSchema);
