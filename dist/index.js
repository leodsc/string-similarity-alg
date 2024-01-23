"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default,
  jaroSimilarity: () => jaroSimilarity,
  jaroWinkler: () => jaroWinkler,
  levenshtein: () => levenshtein,
  sorensenDice: () => sorensenDice
});
module.exports = __toCommonJS(src_exports);

// src/string-similarity-result.ts
var Compare = {
  BIGGER: 1,
  LESSER_OR_EQUAL: -1
};
var StringSimilarityResults = class {
  similarities = /* @__PURE__ */ new Map();
  add(s1, s2, similarity) {
    if (!this.similarities.has(s1)) {
      this.similarities.set(s1, []);
    }
    const stringSimilarity = this.similarities.get(s1);
    if (stringSimilarity !== void 0) {
      stringSimilarity.push({
        value: s2,
        match: similarity
      });
      this.similarities.set(s1, stringSimilarity);
    }
  }
  bestMatch() {
    const similarity = {};
    for (const key of this.similarities.keys()) {
      const matches = this.similarities.get(key);
      if (matches === void 0) {
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
  bestMatches(length) {
    const similarity = {};
    for (const key of this.similarities.keys()) {
      const matches = this.similarities.get(key);
      if (matches === void 0) {
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
};

// src/algorithms/jaro-similarity.ts
var JaroSimilarity = class {
  maximumCharacterDistance = (target, compare) => Math.floor(Math.max(target.length, compare.length) / 2) - 1;
  createMatches = () => {
    return {
      target: /* @__PURE__ */ new Map(),
      compare: /* @__PURE__ */ new Map()
    };
  };
  matches = this.createMatches();
  mapToArrayKeepOrder = (map) => {
    const array = Array(map.size);
    for (const [key, value] of map.entries()) {
      array[key] = value;
    }
    return array.filter((v) => v);
  };
  transpositions = () => {
    let transpositions = 0;
    const matchesCompare = this.mapToArrayKeepOrder(this.matches.compare);
    const matchesTarget = this.mapToArrayKeepOrder(this.matches.target);
    for (const [key, value] of matchesCompare.entries()) {
      if (value !== matchesTarget[key]) {
        transpositions++;
      }
    }
    return transpositions / 2;
  };
  totalMatchingCharacters = (target, compare) => {
    let totalMatching = 0;
    const maximumCharacterDistance = this.maximumCharacterDistance(target, compare);
    for (let i = 0; i < target.length; i++) {
      const start = Math.max(i - maximumCharacterDistance, 0);
      const end = Math.min(i + maximumCharacterDistance + 1, compare.length);
      for (let j = start; j <= end; j++) {
        if (compare[j] === target[i] && !this.matches.compare.has(j) && !this.matches.target.has(i)) {
          totalMatching++;
          this.matches.target.set(i, target[i]);
          this.matches.compare.set(j, compare[j]);
        }
      }
    }
    return totalMatching;
  };
  compare = (target, compareTo) => {
    this.matches = this.createMatches();
    const totalMatching = this.totalMatchingCharacters(target, compareTo);
    const matchingTargetProportion = totalMatching / target.length;
    const matchingCompareProportion = totalMatching / compareTo.length;
    const transitionProportion = (totalMatching - this.transpositions()) / totalMatching;
    return 1 / 3 * (matchingTargetProportion + matchingCompareProportion + transitionProportion);
  };
  compareMany(target, compare) {
    const ssr = new StringSimilarityResults();
    for (const c of compare) {
      for (const t of target) {
        const result = this.compare(t, c);
        ssr.add(t, c, result);
      }
    }
    return ssr;
  }
  compareOneToMany(target, compare) {
    const ssr = new StringSimilarityResults();
    for (const word of compare) {
      const result = this.compare(target, word);
      ssr.add(target, word, result);
    }
    return ssr;
  }
};
var jaroSimilarity = new JaroSimilarity();

// src/algorithms/jaro-winkler.ts
var sameStartingCharacters = (target, compare) => {
  let total = 0;
  for (const [index, char] of Object.entries(target)) {
    if (char === compare[Number(index)]) {
      total++;
    }
    if (total === 4) {
      return total;
    }
  }
  return total;
};
var JaroWinkler = class {
  scalingFactor = 0.1;
  compare = (target, compare) => {
    const js = new JaroSimilarity();
    const jSim = js.compare(target, compare);
    const lp = sameStartingCharacters(target, compare) * this.scalingFactor;
    return jSim + lp * (1 - jSim);
  };
  compareOneToMany = (target, compare) => {
    const ssr = new StringSimilarityResults();
    for (const word of compare) {
      const result = this.compare(target, word);
      ssr.add(target, word, result);
    }
    return ssr;
  };
  compareMany = (target, compare) => {
    const ssr = new StringSimilarityResults();
    for (const c of compare) {
      for (const t of target) {
        const result = this.compare(t, c);
        ssr.add(t, c, result);
      }
    }
    return ssr;
  };
};
var jaroWinkler = new JaroWinkler();

// src/algorithms/levenshtein.ts
var Levenshtein = class {
  tail(value) {
    return value.slice(1, value.length);
  }
  head(value) {
    return value[0];
  }
  compare(target, compare) {
    if (target.length === 0) {
      return compare.length;
    }
    if (compare.length === 0) {
      return target.length;
    }
    if (this.head(target) === this.head(compare)) {
      return this.compare(this.tail(target), this.tail(compare));
    }
    const a = 1 + Math.min(
      this.compare(this.tail(target), compare),
      this.compare(target, this.tail(compare)),
      this.compare(this.tail(target), this.tail(compare))
    );
    return a;
  }
  compareOneToMany = (target, compare) => {
    const ssr = new StringSimilarityResults();
    for (const c of compare) {
      const result = this.compare(target, c);
      ssr.add(target, c, result);
    }
    return ssr;
  };
  compareMany;
};
var levenshtein = new Levenshtein();

// src/algorithms/sorensen-dice.ts
var SorensenDice = class {
  createBigram = (value) => {
    let acc = "";
    let lastChar = "";
    for (const s of value) {
      if (lastChar.trim().length !== 0 && s.trim().length !== 0) {
        acc += lastChar + s;
      }
      lastChar = s;
    }
    return acc.match(/..?/g) ?? [""];
  };
  tokenize = (value) => {
    const bigram = this.createBigram(value);
    const map = /* @__PURE__ */ new Map();
    for (const token of bigram) {
      const totalTokensInBigram = map.get(token);
      if (totalTokensInBigram === void 0) {
        map.set(token, 1);
      } else {
        map.set(token, totalTokensInBigram + 1);
      }
    }
    return {
      map,
      bigram
    };
  };
  intersection(tokens1, tokens2) {
    let totalIntersections = 0;
    for (const key of tokens1.keys()) {
      if (tokens2.has(key)) {
        const minTokens = Math.min(tokens2.get(key), tokens1.get(key));
        totalIntersections += minTokens;
      }
    }
    return totalIntersections;
  }
  compare = (target, compare) => {
    const targetToken = this.tokenize(target.toLowerCase());
    const compareToken = this.tokenize(compare.toLowerCase());
    const totalIntersections = this.intersection(targetToken.map, compareToken.map);
    return 2 * totalIntersections / (targetToken.bigram.length + compareToken.bigram.length);
  };
  compareOneToMany = (target, compare) => {
    const ssr = new StringSimilarityResults();
    for (const c of compare) {
      const result = this.compare(target, c);
      ssr.add(target, c, result);
    }
    return ssr;
  };
  compareMany = (target, compare) => {
    const ssr = new StringSimilarityResults();
    for (const t of target) {
      for (const c of compare) {
        const result = this.compare(t, c);
        ssr.add(t, c, result);
      }
    }
    return ssr;
  };
};
var sorensenDice = new SorensenDice();

// src/string-similarity.ts
var StringSimilarity = class {
  static algorithm(name) {
    switch (name) {
      case "jaro-similarity":
        return new JaroSimilarity();
      case "jaro-winkler":
        return new JaroWinkler();
      default:
        throw new Error("Unknown algorithm");
    }
  }
};
var string_similarity_default = StringSimilarity.algorithm;

// src/index.ts
var src_default = string_similarity_default;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  jaroSimilarity,
  jaroWinkler,
  levenshtein,
  sorensenDice
});
