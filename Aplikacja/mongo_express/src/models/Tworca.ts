import mongoose from "mongoose";

const TworcaSchema = new mongoose.Schema({
  imie: String,
  nazwisko: String,
  zdjecie: String,
  biografia: String,
  narodowosc: String,
  dataUrodzenia: Date,
  dataSmierci: Date,
  wiek: Number,
  czy_zyje: Boolean,
  nagrody: {
    nobel: Boolean,
    inne: [String]
  }
}, { collection: "tworcy" });

const Tworca = mongoose.model("Tworca", TworcaSchema);
export default Tworca;
