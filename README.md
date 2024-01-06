<h1 align="center">String Similarity Algorithms</h1>

### Usage
This package can be used when need to check how similar two words are. You can choose among some implemented algorithms that suits your best use case.

[Below](###Algorithms) you will find all the implemented algorithms and when to use each. You can import a specific algorithm or use the strinSimilarity function.

It is very useful when you need different parameters for the same algorithm, such as `jaroWinkler`.
```js
import stringSimilarity, { sorensenDice } from "string-similarity-alg";

const jaroWinklerResult = stringSimilarity("jaro-winkler").compare("game of thrones", "lord of the rings");
const sorensenDiceResult = sorensenDice.compare("game of thrones", "lord of the rings");
```

### Installation

You can install this package using populars package managers:

#### npm
```
npm install string-similarity-alg
```

#### yarn
```
yarn add string-similarity-alg
```

#### pnpm
```
pnpm add string-similarity-alg
```

### Algorithms
| Algorithm       | Since | Best use case                                                                          | Example                                   |
|-----------------|-------|----------------------------------------------------------------------------------------|-------------------------------------------|
| Levenshtein     | 1.0.0 | Small strings / similar words                                                          | farmville / faremviel                     |
| Soresen-Dice    | 1.0.0 | Fuzzy matching, very mispelled words or poorly written                                 | user-home-page.component.ts / usrhompcomp |
| Jaro-Winkler    | 1.0.0 | Same as Jaro similarity, gives more weight to strings that have the same first letters |     -                                     |
| Jaro Similarity | 1.0.0 | General purpose, use this if you don't think any of the others are valid               |     -                                     |

### Contributing
Anyone is welcome contribute to this project, implementing new algorithms or fixing something.
