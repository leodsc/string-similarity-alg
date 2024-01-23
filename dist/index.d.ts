type Match = {
    value: string;
    match: number;
};
type SimilaritySingleResult = {
    [key: string]: Match;
};
type SimilarityMultipleResults = {
    [key: string]: Match[];
};
interface StringSimilarityResult {
    add: (s1: string, s2: string, similarity: number) => void;
    bestMatch: () => SimilaritySingleResult | Match | null;
    bestMatches: (length?: number) => SimilarityMultipleResults | Match[] | null;
}
declare class StringSimilarityResults implements StringSimilarityResult {
    private similarities;
    add(s1: string, s2: string, similarity: number): void;
    bestMatch(): SimilaritySingleResult;
    bestMatches(length?: number): SimilarityMultipleResults;
}

type SimilarityAlgorithmsNames = "jaro-winkler" | "jaro-similarity" | "dice-coefficient";
interface SimilarityAlgorithm {
    compare: (target: string, compare: string) => number;
    compareOneToMany: (target: string, compare: string[]) => StringSimilarityResults;
    compareMany: (target: string[], compare: string[]) => StringSimilarityResults;
}
declare class StringSimilarity {
    static algorithm(name: SimilarityAlgorithmsNames): SimilarityAlgorithm;
}
declare const _default: typeof StringSimilarity.algorithm;

declare class JaroSimilarity implements SimilarityAlgorithm {
    private maximumCharacterDistance;
    private createMatches;
    private matches;
    private mapToArrayKeepOrder;
    private transpositions;
    private totalMatchingCharacters;
    compare: (target: string, compareTo: string) => number;
    compareMany(target: string[], compare: string[]): StringSimilarityResults;
    compareOneToMany(target: string, compare: string[]): StringSimilarityResults;
}
declare const jaroSimilarity: JaroSimilarity;

declare class JaroWinkler implements SimilarityAlgorithm {
    scalingFactor: number;
    compare: (target: string, compare: string) => number;
    compareOneToMany: (target: string, compare: string[]) => StringSimilarityResults;
    compareMany: (target: string[], compare: string[]) => StringSimilarityResults;
}
declare const jaroWinkler: JaroWinkler;

/**
 * Implements Levenshtein
 *
 * Notice that this is a **distance** algorithm, the result values will be absolute instead of relative
 * to the target as other algorithms
 *
 * Works very well for small inputs
 */
declare class Levenshtein implements SimilarityAlgorithm {
    private tail;
    private head;
    compare(target: string, compare: string): number;
    compareOneToMany: (target: string, compare: string[]) => StringSimilarityResults;
    compareMany: (target: string[], compare: string[]) => StringSimilarityResults;
}
declare const levenshtein: Levenshtein;

declare class SorensenDice implements SimilarityAlgorithm {
    private createBigram;
    private tokenize;
    private intersection;
    compare: (target: string, compare: string) => number;
    compareOneToMany: (target: string, compare: string[]) => StringSimilarityResults;
    compareMany: (target: string[], compare: string[]) => StringSimilarityResults;
}
declare const sorensenDice: SorensenDice;

export { _default as default, jaroSimilarity, jaroWinkler, levenshtein, sorensenDice };
