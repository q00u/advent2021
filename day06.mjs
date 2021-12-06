import { autoparse } from "./lib/autoparse.mjs";

const input = `3,5,3,5,1,3,1,1,5,5,1,1,1,2,2,2,3,1,1,5,1,1,5,5,3,2,2,5,4,4,1,5,1,4,4,5,2,4,1,1,5,3,1,1,4,1,1,1,1,4,1,1,1,1,2,1,1,4,1,1,1,2,3,5,5,1,1,3,1,4,1,3,4,5,1,4,5,1,1,4,1,3,1,5,1,2,1,1,2,1,4,1,1,1,4,4,3,1,1,1,1,1,4,1,4,5,2,1,4,5,4,1,1,1,2,2,1,4,4,1,1,4,1,1,1,2,3,4,2,4,1,1,5,4,2,1,5,1,1,5,1,2,1,1,1,5,5,2,1,4,3,1,2,2,4,1,2,1,1,5,1,3,2,4,3,1,4,3,1,2,1,1,1,1,1,4,3,3,1,3,1,1,5,1,1,1,1,3,3,1,3,5,1,5,5,2,1,2,1,4,2,3,4,1,4,2,4,2,5,3,4,3,5,1,2,1,1,4,1,3,5,1,4,1,2,4,3,1,5,1,1,2,2,4,2,3,1,1,1,5,2,1,4,1,1,1,4,1,3,3,2,4,1,4,2,5,1,5,2,1,4,1,3,1,2,5,5,4,1,2,3,3,2,2,1,3,3,1,4,4,1,1,4,1,1,5,1,2,4,2,1,4,1,1,4,3,5,1,2,1`;

const test = `3,4,3,1,2`;


const parsed = autoparse(input);
// const parsed = autoparse(test);


// Part 1:
function puzzle1() {
    let fish = [...parsed];
    // console.log(fish);
    for (let day = 0; day < 80; day++) {
        for (let i = 0; i < fish.length; i++) {
            fish[i]--;
        }
        // console.log(fish);
        for (let i = 0; i < fish.length; i++) {
            if (fish[i] === -1) {
                fish[i] = 6;
                fish.push(8);
            }
        }
        // console.log(day, fish);
    }
    return fish.length;
}

const part1 = puzzle1();
console.log('Part 1:', part1);

// Part 2:
function puzzle2() {
    let fish = [0,0,0,0,0,0,0,0,0];
    for (let i = 0; i < parsed.length; i++) {
        fish[parsed[i]]++;
    }
    // console.log(fish);
    for (let day = 0; day < 256; day++) {
        let newFish = [0,0,0,0,0,0,0,0,0];
        for (let i = 1; i < fish.length; i++) {
            newFish[i-1] = fish[i];
        }
        newFish[6] += fish[0];
        newFish[8] += fish[0];
        fish = newFish;
    }
    const sum = fish.reduce((a, b) => a + b);
    return sum;
}

const part2 = puzzle2();
console.log('Part 2:', part2);
