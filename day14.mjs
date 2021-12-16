// eslint-disable-next-line no-unused-vars
const input = `OOBFPNOPBHKCCVHOBCSO

NS -> H
NN -> P
FF -> O
HF -> C
KN -> V
PO -> B
PS -> B
FB -> N
ON -> F
OK -> F
OO -> K
KS -> F
FN -> F
KC -> H
NC -> N
NB -> C
KH -> S
SV -> B
BC -> S
KB -> B
SC -> S
KP -> H
FS -> K
NK -> K
OC -> H
NH -> C
PH -> F
OS -> V
BB -> C
CC -> F
CF -> H
CP -> V
VB -> N
VC -> F
PK -> V
NV -> N
FO -> S
CK -> O
BH -> K
PN -> B
PP -> S
NF -> B
SF -> K
VF -> H
HS -> F
NP -> F
SH -> V
SK -> K
PC -> V
BO -> H
HN -> P
BK -> O
BP -> S
OP -> N
SP -> N
KK -> C
HB -> H
OF -> C
VH -> C
HO -> N
FK -> V
NO -> H
KF -> S
KO -> V
PF -> K
HV -> C
SO -> F
SS -> F
VN -> K
HH -> B
OB -> S
CH -> B
FH -> B
CO -> V
HK -> F
VK -> K
CN -> V
SB -> K
PV -> O
PB -> F
VV -> P
CS -> N
CB -> C
BS -> F
HC -> B
SN -> P
VP -> P
OV -> P
BV -> P
FC -> N
KV -> S
CV -> F
BN -> S
BF -> C
OH -> F
VO -> B
FP -> S
FV -> V
VS -> N
HP -> B`;

// eslint-disable-next-line no-unused-vars
const test = `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`;


const [template, ...lines] = input.split('\n');
// const [template, ...lines] = test.split('\n');
lines.shift();

const rules = {};

lines.forEach((line) => {
    const [pair, insertion] = line.split(' -> ');
    rules[pair] = insertion;
});

console.log('template', template, 'rules', rules);

function commonElementCount(string) {
    const array = string.split('');
    const counts = {};
    array.forEach((element) => {
        if (counts[element]) {
            counts[element] += 1;
        } else {
            counts[element] = 1;
        }
    });
    // Find most common elements
    let max = 0;
    let min = Number.MAX_SAFE_INTEGER;
    Object.keys(counts).forEach((element) => {
        if (counts[element] > max) {
            max = counts[element];
        }
        if (counts[element] < min) {
            min = counts[element];
        }
    });
    return [max, min];
}

function tick(polymer) {
    const poly = polymer.split('');
    for (let i = 0; i < poly.length - 1; i += 1) {
        const pair = poly[i] + poly[i + 1];
        if (rules[pair]) {
            poly.splice(i + 1, 0, rules[pair]);
            i++;
        }
    }
    return poly.join('');
}

// Part 1:
function puzzle1() {
    let polymer = template;
    for (let i = 0; i < 10; i++) {
        polymer = tick(polymer);
        // console.log(polymer);
    }
    const [max, min] = commonElementCount(polymer);
    console.log('max', max, 'min', min);
    return max - min;
}

const part1 = puzzle1();
console.log('Part 1:', part1);

// Part 2:
// let pairs = {};

// function addPair(pair, count = 1) {
//     if (pairs[pair]) {
//         pairs[pair] += count;
//     } else {
//         pairs[pair] = count;
//     }
// }

// const elementCounts = {};

// function addElement(element, count = 1) {
//     if (elementCounts[element]) {
//         elementCounts[element] += count;
//     } else {
//         elementCounts[element] = count;
//     }
// }

function addToObject(object, key, value = 1) {
    const newObject = { ...object };
    if (newObject[key]) {
        newObject[key] += value;
    } else {
        newObject[key] = value;
    }
    return newObject;
}

function removePair(object, key, value) {
    const newObject = { ...object };
    if (newObject[key]) {
        newObject[key] -= value;
    }
    return newObject;
}

function getPairsElements(polymer) {
    let pairs = {};
    let elements = {};
    const poly = polymer.split('');
    for (let i = 0; i < poly.length - 1; i += 1) {
        const pair = poly[i] + poly[i + 1];
        pairs = addToObject(pairs, pair);
        elements = addToObject(elements, poly[i]);
    }
    elements = addToObject(elements, poly[poly.length - 1]);
    return [pairs, elements];
}

function puzzle2() {
    // First get pairs/elements from Template
    // let pairs = {};
    // let elementCounts = {};
    // const templateArray = template.split('');
    // for (let i = 0; i < templateArray.length - 1; i += 1) {
    //     const pair = templateArray[i] + templateArray[i + 1];
    //     pairs = addToObject(pairs, pair);
    //     elementCounts = addToObject(elementCounts, templateArray[i]);
    //     // addPair(pair);
    //     // addElement(templateArray[i]);
    // }
    // // addElement(templateArray[templateArray.length - 1]); // Add last element
    // elementCounts = addToObject(elementCounts, templateArray[templateArray.length - 1]); // Add last element
    let [pairs, elementCounts] = getPairsElements(template);
    // // TESTING
    // let polymer = template;
    // console.log('Pre-first-step:', pairs, elementCounts, polymer);
    // // TESTING:
    // console.log('Actual polymer:', polymer, ':', getPairsElements(polymer));
    // Now process 40 ticks
    for (let i = 0; i < 40; i++) {
        // // TESTING:
        // polymer = tick(polymer);
        // const [acPairs, acElements] = getPairsElements(polymer);
        // Copy objects
        let newPairs = { ...pairs };
        let newElementCounts = { ...elementCounts };
        const allRules = Object.keys(rules);
        allRules.forEach((rule) => {
            // console.log(rule);
            const allPairsOfThisRule = pairs[rule];
            if (allPairsOfThisRule) {
                // console.log('Found', allPairsOfThisRule, 'of', rule);
                const leftPair = rule.substring(0, 1) + rules[rule];
                const rightPair = rules[rule] + rule.substring(1, 2);
                // Remove old pair
                // console.log('Removing', rule, 'x', allPairsOfThisRule);
                newPairs = removePair(newPairs, rule, allPairsOfThisRule);
                // Add new pairs
                // console.log('Adding', leftPair, 'and', rightPair, 'x', allPairsOfThisRule);
                newPairs = addToObject(newPairs, leftPair, allPairsOfThisRule);
                newPairs = addToObject(newPairs, rightPair, allPairsOfThisRule);
                // Update element counts
                // console.log('Adding element', rules[rule], 'x', allPairsOfThisRule);
                newElementCounts = addToObject(newElementCounts, rules[rule], allPairsOfThisRule);
            }
        });
        // Save objects
        pairs = newPairs;
        elementCounts = newElementCounts;
        // console.log('Step', i, ':', pairs, elementCounts);
        // // TESTING:
        // console.log('Actual polymer:', polymer, ':', acPairs, acElements);
    }
    // Find most and least common elements
    let max = 0;
    let min = Number.MAX_SAFE_INTEGER;
    Object.keys(elementCounts).forEach((element) => {
        if (elementCounts[element] > max) {
            max = elementCounts[element];
        }
        if (elementCounts[element] < min) {
            min = elementCounts[element];
        }
    });
    console.log('max', max, 'min', min);

    // for (let i = 10; i < 40; i++) {
    //     polymer = tick(polymer);
    //     // console.log(polymer);
    //     console.log('Step:', i);
    // }
    // const [max, min] = commonElementCount(polymer);
    // console.log('max', max, 'min', min);
    return max - min;
}

const part2 = puzzle2();
console.log('Part 2:', part2);
