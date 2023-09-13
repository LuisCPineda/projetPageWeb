import mongoose from "mongoose";

const Schema = mongoose.Schema;

const voitureSchema = new Schema({
  titre: { type: String, required: true },
  marque: { type: String, required: true },
  modele: { type: String, required: true },
  annee: { type: Number, required: true },
  prix: { type: Number, required: true },
  photos_voiture: [{ type: String, required: true }],
  kilometrage: { type: Number, required: true },
  transmission: { type: String, required: false },
  type_carrosserie: { type: String, required: false },
  type_carburant: { type: String, required: false },
  couleur_exterieur: { type: String, required: false },
  couleur_interieur: { type: String, required: false },
  moteur: { type: String, required: false },
  numero_vin: { type: String, required: false },
  description: { type: String, required: false },
  vendeur: { type: Number, required: true },
});

const Voiture = mongoose.model("Voiture", voitureSchema);

export default Voiture;
