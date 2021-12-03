import { product, zip } from './arrays.mjs';

export function gcd(...N) {
	return N.reduce(gcd2);

	function gcd2(a, b) {
		if (a == 0) return b;
		return gcd(b % a, a);
	}
}

export function lcm(...N) {
	return N.reduce(lcm2);

	function lcm2(a, b) {
		return (a / gcd(a, b)) * b;
	}
}

// Negative-safe modulo operator
export function modulo(x, m) {
	while (x < 0) x += m;
	return x % m;
}

export function largestPowerOf2Below(n) {
	if (typeof n === 'bigint') {
		let x = 1n;
		while (x*2n <= n) {
			x *= 2n;
		}
		return x;
	} else {
		let x = 1;
		while (x*2 <= n) {
			x *= 2;
		}
		return x;
	}
}

export function bigIntLargestPowerOf2Below(n) {
	D('bigIntLargestPowerOf2Below is deprecated');
	return largestPowerOf2Below(n);
}

// x^p % r
export function powerRemainder(x, p, r) {
	let big = false;
	if (typeof x === 'bigint' || typeof p === 'bigint' || typeof r === 'bigint') {
		x = BigInt(x);
		p = BigInt(p);
		r = BigInt(r);
		big = true;
	}

	if (p == 0) {
		return (big ? 1n : 1);
	}

	const powersOfX = new Map();
	for (let i = (big ? 1n : 1), n = x;
		i <= p;
		i *= (big ? 2n : 2), n = (n * n) % r
	) {
		powersOfX.set(i, n);
	}

	let n = (big ? 1n : 1);
	while (p > 0) {
		const powerOf2 = largestPowerOf2Below(p);
		const powerOfX = powersOfX.get(powerOf2);
		n = n * powerOfX % r;
		p -= powerOf2;
	}

	return n % r;
}

export function bigIntPowerRemainder(x, p, r) {
	D('bigIntPowerRemainder is deprecated');
	return powerRemainder(x, p, r);
}

// Modular multiplicative inverse
// https://en.wikipedia.org/wiki/Modular_multiplicative_inverse
// x where `ax % m == 1`
export function modMulInverse(a, m) {
	if (typeof a === 'bigint' || typeof m === 'bigint') {
		a = BigInt(a);
		m = BigInt(m);

		let b = a % m;
		for (let i = 1n; i < m; ++i) {
			if ((b * i) % m == 1n) {
				return i;
			}
		}
		return 1n;
	} else {
		let b = a % m;
		for (let i = 1; i < m; ++i) {
			if ((b * i) % m == 1) {
				return i;
			}
		}
		return 1;
	}
}

export function bigIntModMulInverse(a, m) {
	D('bigIntModMulInverse is deprecated');
	return modMulInverse(a, m);
}

// Chinese remainder theorem
// https://en.wikipedia.org/wiki/Chinese_remainder_theorem
// x where `x % Ni == Ai` for all i
export function chineseRemainder(A, N) {
	const big = typeof(A[0]) === 'bigint';

	const nProduct = product(N);
	const s = zip(A, N).reduce((acc, [a, n]) => {
		const p = nProduct / n;
		return acc + (a * p * modMulInverse(p, n));
	}, big ? 0n : 0);
	return s % nProduct;
}

export function bigIntChineseRemainder(A, N) {
	D('bigIntChineseRemainder is deprecated');
	return chineseRemainder(a, m);
}
