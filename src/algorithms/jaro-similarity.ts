import { SimilarityAlgorithm } from "../string-similarity";
import { StringSimilarityResults } from "../string-similarity-result";

const compareWordsLength = (s1: string, s2: string) => {
  if (s1.length >= s2.length) {
    return {
      smallerWord: s2,
      biggerWord: s1
    }
  }

  return {
    smallerWord: s1,
    biggerWord: s2
  }
}

const isWithinMaxDistance = (char: string, index: number, word: string, maxDistance: number) => {
  const start = Math.max(index - maxDistance, 0);
  const finish = Math.min(index + maxDistance + 1, word.length);
  const charactersWithinDistance = word.slice(start, finish);
  return charactersWithinDistance.includes(char);
}

const extractPossibleTransposition = (s: string, matchedCharacters: string[]) => {
  let currentMatchedChar = 0;
  const charPositions: Record<string, string> = {};

  for (const char of s) {
    if (char === matchedCharacters[currentMatchedChar]) {
      charPositions[currentMatchedChar] = char;
      currentMatchedChar++;
    }
  }

  return charPositions;
}

const getTranspositions = (target: string, compare: string, matchedCharacters: string[]) => {
  let mismatchedCharacters = 0;
  const matchOrder = {
    target: extractPossibleTransposition(target, matchedCharacters),
    compare: extractPossibleTransposition(compare, matchedCharacters)
  }

  for (const key of Object.keys(matchOrder.target)) {
    if (matchOrder.target[key] !== matchOrder.compare[key]) {
      mismatchedCharacters++;
    }
  }

  return Math.floor(mismatchedCharacters / 2);
}

const getMatchingCharacters = (target: string, compareTo: string) => {
  let matchingChars = 0;
  const characters = [];
  const { smallerWord, biggerWord } = compareWordsLength(target, compareTo);
  const maxMatchingCharacterDistance = Math.floor((Math.max(target.length, compareTo.length) / 2) - 1);

  for (const [index, char] of Object.entries(biggerWord)) {
    if (isWithinMaxDistance(char, Number(index), smallerWord, maxMatchingCharacterDistance)) {
      matchingChars++;
      characters.push(char);
    }
  }

  return {
    matches: matchingChars,
    possibleTransposition: characters
  };
}

export class JaroSimilarity implements SimilarityAlgorithm {
  compare = (target: string, compareTo: string) => {
    const characters = getMatchingCharacters(target, compareTo);
    if (characters.matches === 0) {
      return 0.0;
    }

    const targetMatchingCharsProportion = characters.matches / target.length;
    const compareToMatchingCharsProportion = characters.matches / compareTo.length;
    const transpositions = getTranspositions(target, compareTo, characters.possibleTransposition);
    const transpositionsProportion = (characters.matches - transpositions) / characters.matches;

    const formulae = targetMatchingCharsProportion + compareToMatchingCharsProportion + transpositionsProportion;
    return (1 / 3) * formulae;
  }

  compareMany(target: string[], compare: string[]) {
    const ssr = new StringSimilarityResults();
    for (const c of compare) {
      for (const t of target) {
        const result = this.compare(t, c);
        ssr.add(t, c, result);
      }
    }

    return ssr;
  };

  compareOneToMany(target: string, compare: string[]) {
    const ssr = new StringSimilarityResults();
    for (const word of compare) {
      const result = this.compare(target, word);
      ssr.add(target, word, result);
    }

    return ssr;
  }
}

export const jaroSimilarity = new JaroSimilarity();
