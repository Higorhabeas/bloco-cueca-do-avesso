import type { SchemaTypeDefinition } from "sanity";

import configuracoesGerais from "./configuracoesGerais";
import evento from "./evento";
import foto from "./foto";
import historiaDoBloco from "./historiaDoBloco";
import membroBateria from "./membroBateria";
import patrocinador from "./patrocinador";
import recado from "./recado";
import video from "./video";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    evento,
    recado,
    foto,
    video,
    membroBateria,
    patrocinador,
    historiaDoBloco,
    configuracoesGerais,
  ],
};
