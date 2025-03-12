import Ajv from "ajv";
import addFormats from "ajv-formats";
import * as wynalazekSchema from "../schemas/wynalazekSchema.json";

const ajv = new Ajv({ 
  allErrors: true,
  coerceTypes: true
});
addFormats(ajv);

ajv.addKeyword({
  keyword: "errorMessage",
  modifying: false,
  validate: (errorMessage: string, data: any) => {
    return true;
  }
});

export const validateWynalazek = ajv.compile(wynalazekSchema);