const Compare = {
  BIGGER: 1,
  LESSER_OR_EQUAL: -1
}

type Match = {
  value: string;
  match: number;
}

type SimilaritySingleResult = {
  [key: string]: Match;
}

type SimilarityMultipleResults = {
  [key: string]: Match[];
}

interface StringSimilarityResult {
  add: (s1: string, s2: string, similarity: number) => void
  bestMatch: () => SimilaritySingleResult | Match | null;
  bestMatches: (length?: number) => SimilarityMultipleResults | Match[] | null;
}

export class StringSimilarityResults implements StringSimilarityResult {
  private similarities = new Map<string, Match[]>();

  add(s1: string, s2: string, similarity: number) {
    if (!this.similarities.has(s1)) {
      this.similarities.set(s1, []);
    }

    const stringSimilarity = this.similarities.get(s1);

    if (stringSimilarity !== undefined) {
      stringSimilarity.push({
        value: s2,
        match: similarity
      });
      this.similarities.set(s1, stringSimilarity);
    }
  }

  bestMatch() {
    const similarity: SimilaritySingleResult = {};
    for (const key of this.similarities.keys()) {
      const matches = this.similarities.get(key);

      if (matches === undefined) {
        throw new Error("Key not found");
      }

      let currentBestResult = matches[0];
      matches.forEach((match) => {
        if (match.match > currentBestResult.match) {
          currentBestResult = match;
        }
      });

      similarity[key] = currentBestResult;
    }

    return similarity;
  }

  bestMatches(length?: number): SimilarityMultipleResults {
    const similarity: SimilarityMultipleResults = {};
    for (const key of this.similarities.keys()) {
      const matches = this.similarities.get(key);

      if (matches === undefined) {
        throw new Error("Key not found");
      }

      matches.sort((curr, next) => {
        if (curr.match > next.match) {
          return Compare.LESSER_OR_EQUAL;
        }

        return Compare.BIGGER;
      });

      similarity[key] = matches.slice(0, length ?? matches.length);
    }

    return similarity;
  }
}
