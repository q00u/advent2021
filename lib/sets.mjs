export function setUnion(...sets) {
	return sets.reduce((result, set) => {
		for (let item of set) {
			result.add(item);
		}
		return result;
	}, new Set());
}

export function setIntersection(set1, ...sets) {
	const result = new Set();
	for (let item of set1) {
		if (sets.every(s => s.has(item))) {
			result.add(item);
		}
	}
	return result;
}

export function setDifference(a, b) {
	const result = new Set();
	for (let item of a) {
		if (!b.has(item)) {
			result.add(item);
		}
	}
	return result;
}
