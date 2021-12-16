// eslint-disable-next-line no-unused-vars
const input = `xx-end
EG-xx
iy-FP
iy-qc
AB-end
yi-KG
KG-xx
start-LS
qe-FP
qc-AB
yi-start
AB-iy
FP-start
iy-LS
yi-LS
xx-AB
end-KG
iy-KG
qc-KG
FP-xx
LS-qc
FP-yi`;

// eslint-disable-next-line no-unused-vars
const test = `start-A
start-b
A-c
A-b
b-d
A-end
b-end`;

// const test = `dc-end
// HN-start
// start-kj
// dc-start
// dc-HN
// LN-dc
// HN-end
// kj-sa
// kj-HN
// kj-dc`;

// const test = `fs-end
// he-DX
// fs-he
// start-DX
// pj-DX
// end-zg
// zg-sl
// zg-pj
// pj-he
// RW-he
// fs-DX
// pj-RW
// zg-RW
// start-pj
// he-WI
// zg-he
// pj-fs
// start-RW`;


const parsed = input.split('\n');
// const parsed = test.split('\n');

// const parsed = lines.map((line) => line.split('').map(Number));


// const parsed = autoparse(input);
// const parsed = autoparse(test);

// console.log(parsed);

function bigCave(caveId) {
    return caveId === caveId.toUpperCase();
}

const adjacencyList = {};

function addEdge(from, to) {
    if (!adjacencyList[from]) {
        adjacencyList[from] = [];
        // console.log('New cave: ', from, 'Big? ', bigCave(from));
    }
    adjacencyList[from].push(to);
}

parsed.forEach((line) => {
    const [from, to] = line.split('-');
    addEdge(from, to);
    addEdge(to, from);
});

// console.log(adjacencyList);

const fullPaths = [];

// Part 1:
function findPaths(localPath, visited) {
    const currentCave = localPath[localPath.length - 1];
    // console.log('Current cave: ', currentCave);
    if (currentCave === 'end') {
        fullPaths.push(localPath);
        return;
    }
    const paths = adjacencyList[currentCave];
    // console.log('Exits: ', paths);
    if (!paths) {
        return;
    }
    paths.forEach((path) => {
        // console.log('Checking exit:', path);
        if (bigCave(path) || visited.indexOf(path) === -1) {
            findPaths(localPath.concat(path), visited.concat(path));
        }
    });
}

function puzzle1() {
    findPaths(['start'], ['start']);
    // console.log(fullPaths);
    return fullPaths.length;
}

const part1 = puzzle1();
console.log('Part 1:', part1);


// Part 2:
fullPaths.length = 0;

function smallCaves(visited) {
    let max = 0;
    visited.forEach((visitedCave) => {
        if (visitedCave !== 'start' && !bigCave(visitedCave)) {
            const count = visited.filter((c) => c === visitedCave).length;
            if (count > 1) {
                max++;
            }
        }
    });
    return max;
}

function findMorePaths(localPath, visited) {
    const currentCave = localPath[localPath.length - 1];
    // console.log('Current cave: ', currentCave);
    if (currentCave === 'end') {
        fullPaths.push(localPath);
        return;
    }
    const paths = adjacencyList[currentCave];
    // console.log('Exits: ', paths);
    if (!paths) {
        return;
    }
    paths.forEach((path) => {
        // console.log('Visited: ', visited);
        // console.log('Checking exit:', path);
        // console.log('Smallcaves: ', smallCaves(visited));
        if (path !== 'start' && (bigCave(path) || visited.indexOf(path) === -1 || smallCaves(visited.concat(path)) <= 2)) {
            findMorePaths(localPath.concat(path), visited.concat(path));
        }
    });
}

function puzzle2() {
    findMorePaths(['start'], ['start']);
    // console.log(fullPaths);
    return fullPaths.length;
}

const part2 = puzzle2();
console.log('Part 2:', part2);
