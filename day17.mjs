// eslint-disable-next-line no-unused-vars
const input = 'target area: x=169..206, y=-108..-68';

// eslint-disable-next-line no-unused-vars
const test = 'target area: x=20..30, y=-10..-5';

const line = input.split('target area: ')[1];
// const line = test.split('target area: ')[1];
// console.log(line);

const [xpart, ypart] = line.split(', ');
// console.log(xpart, ypart);
const [xlow, xhigh] = xpart.split('x=')[1].split('..').map((x) => parseInt(x, 10));
const [ylow, yhigh] = ypart.split('y=')[1].split('..').map((x) => parseInt(x, 10));
console.log('x', xlow, xhigh);
console.log('y', ylow, yhigh);

const possibleY = [];

// Part 1:
function puzzle1() {
    // let x = 0;
    // let y = 0;
    // let vx = 6;
    // let vy = 9;
    // let maxy = Number.MIN_SAFE_INTEGER;
    // while (!pastTarget(y)) {
    //     [x, y, vx, vy] = nextStep(x, y, vx, vy);
    //     console.log(x, y, vx, vy);
    //     maxy = Math.max(maxy, y);
    //     if (hitTarget(x, y)) {
    //         return maxy;
    //     }
    // }
    // return -1;
    let ystart = 1;
    let besty = Number.MIN_SAFE_INTEGER;
    let step = 0;
    let misscount = 0;
    while (true) {
        step = 0;
        let y = 0;
        let vy = ystart;
        // console.log('yvelocity', ystart);
        ystart++;
        let maxy = Number.MIN_SAFE_INTEGER;
        while (y >= ylow) {
            step++;
            y += vy;
            vy -= 1;
            maxy = Math.max(maxy, y);
            if (y >= ylow && y <= yhigh) {
                besty = Math.max(besty, maxy);
                console.log('step', step, 'y', y, 'vy', vy, 'maxy', maxy, 'besty', besty, 'ystart', ystart);
                possibleY.push(ystart);
                misscount = 0;
                break;
            }
        }
        if (y < ylow) misscount++; // console.log('MISS!'); // return ystart;
        if (misscount > 100) return ystart;
    }
}

const maxy = puzzle1();
console.log('max y:', maxy);

// Part 2:
function nextStep(curx, cury, vx, vy) {
    const newx = curx + vx;
    const nextx = vx + (vx > 0 ? -1 : (vx < 0 ? 1 : 0));
    const newy = cury + vy;
    const nexty = vy - 1;
    return [newx, newy, nextx, nexty];
}

function hitTarget(curx, cury) {
    return (curx >= xlow && curx <= xhigh && cury >= ylow && cury <= yhigh);
}

function pastTarget(cury) {
    return (cury < ylow);
}

function tryPossible(x, y) {
    // let step = 0;
    let curx = 0;
    let cury = 0;
    let vx = x;
    let vy = y;
    while (!pastTarget(cury)) {
        [curx, cury, vx, vy] = nextStep(curx, cury, vx, vy);
        // step++;
        if (hitTarget(curx, cury)) {
            return true;
        }
    }
    return false;
}

const everyTrajectory = new Set();

function findMinX() {
    let sum = 0;
    let x = 1;
    while (sum < xlow) {
        sum += x;
        x++;
    }
    return x - 1;
}

function puzzle2() {
    const minx = findMinX();
    for (let y = ylow; y <= maxy; y++) {
        for (let x = minx; x <= xhigh; x++) {
            if (tryPossible(x, y)) {
                everyTrajectory.add(`${x},${y}`);
            }
        }
    }
    // console.log('everyTrajectory', everyTrajectory);
    return everyTrajectory.size;
}

const part2 = puzzle2();
console.log('Part 2:', part2);
