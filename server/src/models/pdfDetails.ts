import mongoose, { Document, Schema } from "mongoose";

interface IPdfDetails extends Document {
  pdf: string;
  title: string;
  authors: string;
  dateUploaded: string;
  datePublished: string;
}

const PdfDetailsSchema: Schema = new Schema<IPdfDetails>(
  {
    pdf: { type: String, required: true },
    title: { type: String, required: true },
    authors: { type: String, required: true },
    dateUploaded: { type: String, required: true },
    datePublished: { type: String, required: true },
  },
  { collection: "PdfDetails" }
);

export default mongoose.model<IPdfDetails>("PdfDetails", PdfDetailsSchema);
