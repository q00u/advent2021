// eslint-disable-next-line no-unused-vars
const input = `5421451741
3877321568
7583273864
3451717778
2651615156
6377167526
5182852831
4766856676
3437187583
3633371586`;

// eslint-disable-next-line no-unused-vars
const test = `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`;


const lines = input.split('\n');
// const lines = test.split('\n');

const parsed = lines.map((line) => line.split('').map(Number));

function flashPoint(x, y, flashed) {
    if (!flashed[x][y]) {
        // Now flash points around x, y
        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                if (i !== x || j !== y) {
                    if (parsed[i] && parsed[i][j]) {
                        parsed[i][j]++;
                        if (parsed[i][j] === 10) flashPoint(i, j, flashed);
                    }
                }
            }
        }
        // eslint-disable-next-line no-param-reassign
        flashed[x][y] = true;
    }
}


function puzzle() {
    let count = 0;
    let step = 0;
    // console.log('Before any steps:');
    // parsed.forEach((row) => console.log(row.join('')));
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const flashed = Array.from({ length: 10 }, () => Array(10).fill(false));
        step++;
        // Increment all elements of the array
        for (let i = 0; i < parsed.length; i++) {
            for (let j = 0; j < parsed[i].length; j++) {
                parsed[i][j]++;
            }
        }
        // console.log('Before flashes:');
        // console.log(parsed.join('\n'));
        // Check array for elements >= 10
        for (let i = 0; i < parsed.length; i++) {
            for (let j = 0; j < parsed[i].length; j++) if (parsed[i][j] >= 10) flashPoint(i, j, flashed);
        }
        // Check and reset all 9+ points
        for (let i = 0; i < parsed.length; i++) {
            for (let j = 0; j < parsed[i].length; j++) {
                if (parsed[i][j] > 9) {
                    parsed[i][j] = 0;
                    count++;
                }
            }
        }
        // console.log('Step: ', step, 'Count: ', count);
        // console.log(parsed.join('\n'));
        // console.log(`\nAfter step ${step}:`);
        // parsed.forEach((row) => console.log(row.join('')));
        // Part 1:
        if (step === 100) {
            console.log('Part 1: ', count);
        }
        // Part 2:
        // If all elements of parsed are zero
        if (parsed.every((row) => row.every((el) => el === 0))) {
            console.log('Part 2: ', step);
            return;
        }
    }
}

puzzle();
