export function zip(...arrays) {
	const result = [];
	const size = Math.max(...arrays.map(a => a.length));
	for (let i = 0; i < size; ++i) {
		result.push(arrays.map(a => a[i]));
	}
	return result;
}

export function sum(arr) {
	if (!arr.length) return 0;
	return arr.reduce((a, b) => a + b);
}

export function product(arr) {
	if (!arr.length) return 1;
	return arr.reduce((a, b) => a * b);
}

export function flatten(arr) {
	if (!Array.isArray(arr)) return arr;
	return [].concat(...arr.map(flatten));
}

export function selectBy(arr, lookup, compare) {
	let result = arr[0];
	let best = lookup(result);

	for (let item of arr.slice(1)) {
		let n = lookup(item);
		if (compare(n, best)) {
			result = item;
			best = n;
		}
	}

	return result;
}

export function minBy(arr, lookup) {
	return selectBy(arr, lookup, (a, b) => a < b);
}

export function maxBy(arr, lookup) {
	return selectBy(arr, lookup, (a, b) => a > b);
}

export function arrayUnion(...arrays) {
	return arrays.reduce((result, arr) => {
		for (let item of arr) {
			if (!result.includes(item)) {
				result.push(item);
			}
		}
		return result;
	}, []);
}

export function arrayIntersection(arr1, ...arrays) {
	const result = [];
	for (let item of arr1) {
		if (arrays.every(arr => arr.includes(item))) {
			result.push(item);
		}
	}
	return result;
}

export function arrayDifference(a, b) {
	const result = [];
	for (let item of a) {
		if (!b.includes(item)) {
			result.push(item);
		}
	}
	return result;
}

export function *permutations(arr) {
	if (arr.length === 1) yield arr;
	for (let k = 0; k < arr.length; ++k) {
		for (let p of permutations([
			...arr.slice(0, k),
			...arr.slice(k+1)
		])) {
			yield [arr[k], ...p];
		}
	}
}

export function indexOfAll(arr, item) {
	const result = [];
	for (let i = 0; i < arr.length; ++i) {
		if (item == arr[i]) {
			result.push(i);
		}
	}
	return result;
}

export function range(start, end) {
	if (end < start) return [];
	return Array.from({ length: end-start }).map((_, i) => i + start);
}
