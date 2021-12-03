import { PriorityQueue } from './datastructures.mjs';
import { memo } from './perf.mjs';

export function astar({ start, goal, key, neighbors, cost, heuristic, progress, progressFrequency }) {
	if (!key) key = x => x;
	if (!cost) cost = () => 1;
	if (!heuristic) heuristic = () => 0;

	const parents = new Map();

	const gScores = new Map();
	gScores.set(key(start), 0);
	
	// const fScores = new Map();
	// fScores.set(key(start), heuristic(start, goal));

	const keyGoal = key(goal);

	const openSet = new PriorityQueue();
	openSet.push(start, heuristic(start, goal));

	let iteration = 0;

	while (openSet.length) {
		const current = openSet.pop();
		const keyCurrent = key(current);

		if (keyCurrent === keyGoal) {
			return getPath(parents, current);
		}

		const gScoreCurrent = gScores.get(keyCurrent);

		for (let neighbor of neighbors(current)) {
			const keyNeighbor = key(neighbor);

			const gScore = gScoreCurrent + cost(current, neighbor);
			if (!gScores.has(keyNeighbor) ||
				gScores.get(keyNeighbor) > gScore
			) {
				const hScore = heuristic(neighbor, goal);
				parents.set(keyNeighbor, current);
				gScores.set(keyNeighbor, gScore);
				// fScores.set(keyNeighbor, gScore + hScore);
				openSet.push(neighbor, gScore + hScore);
			}
		}

		++iteration;

		if (progress && (!progressFrequency || iteration % progressFrequency === 0)) {
			progress({
				i: iteration,
				visited: gScores.size,
				open: openSet.length,
				currentGScore: gScoreCurrent,
				currentHScore: heuristic(current, goal),
				currentNode: current
			});
		}
	}

	return false;

	function getPath(parents, current) {
		const path = [current];
		let totalCost = 0;
		while (parents.has(key(current))) {
			const parent = parents.get(key(current));
			totalCost += cost(parent, current);
			path.unshift(parent);
			current = parent;
		}
		return { path, cost: totalCost };
	}
}

export const orthodiagonalOffsets = memo(function orthodiagonalOffsets(dimensions) {
	const result = [];
	for (let i = 0; i < 3**dimensions; ++i) {
		const offsets = Array(dimensions).fill().map((_, d) => (i / 3**d | 0) % 3 - 1);
		if (offsets.every(o => o === 0)) continue;
		result.push(offsets);
	}
	return result;
});

export function cell2d({ grid, rule, neighbors, finished }) {
	const width = grid[0].length;
	const height = grid.length;
	const neighborOffsets = orthodiagonalOffsets(2);

	neighbors = neighbors || (
		(grid, x, y) => neighborOffsets.map(o => [x+o[0], y+o[1]])
			.filter(([x, y]) => x >= 0 && y >= 0 && x < width && y < height)
			.map(([x, y]) => grid[y][x])
	);

	finished = finished || (
		({ changed }) => !changed
	);

	for (;;) {
		const last = grid;
		let changed = false;
		grid = grid.map((line, y) => line.map((current, x) => {
			const updated = rule(current, neighbors(grid, x, y), x, y);
			if (updated !== current) {
				changed = true;
			}
			return updated;
		}));
		if (finished({ last, grid, changed })) {
			return grid;
		}
	}
}

export function cell3d({ grid, rule, neighbors, finished }) {
	const width = grid[0][0].length;
	const height = grid[0].length;
	const depth = grid.length;
	const neighborOffsets = orthodiagonalOffsets(3);

	neighbors = neighbors || (
		(grid, x, y, z) => neighborOffsets.map(o => [x+o[0], y+o[1], z+o[2]])
			.filter(([x, y, z]) => x >= 0 && y >= 0 && z >= 0 && x < width && y < height && z < depth)
			.map(([x, y, z]) => grid[z][y][x])
	);

	finished = finished || (
		({ changed }) => !changed
	);

	for (;;) {
		const last = grid;
		let changed = false;
		grid = grid.map((plane, z) => plane.map((line, y) => line.map((current, x) => {
			const updated = rule(current, neighbors(grid, x, y, z), x, y, z);
			if (updated !== current) {
				changed = true;
			}
			return updated;
		})));
		if (finished({ last, grid, changed })) {
			return grid;
		}
	}
}
