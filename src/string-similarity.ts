import { JaroSimilarity, jaroSimilarity } from "./algorithms/jaro-similarity";
import { JaroWinkler, jaroWinkler } from "./algorithms/jaro-winkler";
import { StringSimilarityResults } from "./string-similarity-result";

type SimilarityAlgorithmsNames = "jaro-winkler" | "jaro-similarity" | "dice-coefficient";

export interface SimilarityAlgorithm {
  compare: (target: string, compare: string) => number
  compareOneToMany: (target: string, compare: string[]) => StringSimilarityResults
  compareMany: (target: string[], compare: string[]) => StringSimilarityResults
}

class StringSimilarity {
  static algorithm(name: SimilarityAlgorithmsNames): SimilarityAlgorithm {
    switch (name) {
      case "jaro-similarity":
        return new JaroSimilarity();
      case "jaro-winkler":
        return new JaroWinkler();
      default:
        throw new Error("Unknown algorithm");
    }
  }
}

export default StringSimilarity.algorithm;

