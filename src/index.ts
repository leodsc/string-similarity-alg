import { jaroSimilarity } from "./algorithms/jaro-similarity";
import { jaroWinkler } from "./algorithms/jaro-winkler";
import { levenshtein } from "./algorithms/levenshtein";
import { sorensenDice } from "./algorithms/sorensen-dice";
import stringSimilarity from "./string-similarity";

export {
  jaroSimilarity,
  jaroWinkler,
  sorensenDice,
  levenshtein
};

export default stringSimilarity;
