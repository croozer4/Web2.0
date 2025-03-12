import mongoose, { Document } from "mongoose";

interface IWynalazek extends Document {
  nazwa: string;
  rok: number;
  twórca_id: mongoose.Schema.Types.ObjectId;
  czy_używany: boolean;
  zastosowania: string[];
  historia: {
    pierwsze_publiczne_demonstracje: number;
    wprowadzenie_na_rynek: number;
  };
}

const WynalazekSchema = new mongoose.Schema<IWynalazek>({
  nazwa: { type: String, required: true },
  rok: { type: Number, required: true },
  twórca_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tworca",
    required: true 
  },
  czy_używany: { type: Boolean, required: true },
  zastosowania: { type: [String], required: true },
  historia: {
    pierwsze_publiczne_demonstracje: { type: Number, required: true },
    wprowadzenie_na_rynek: { type: Number, required: true }
  }
}, { collection: "wynalazki" });

export default mongoose.model<IWynalazek>("Wynalazek", WynalazekSchema);