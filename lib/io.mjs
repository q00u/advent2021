import assert from 'assert';
import fs from 'fs';
import path from 'path';

export function D(...args) {
	// Log debug output to stderr so that stdout only contains the program result
	console.error(...args);
}

export function getRawInput() {
	const inputFilename = path.resolve(
		process.cwd(),
		path.basename(process.argv[1], '.js').replace(/\D+$/, '') + '.txt');
	let input = fs.readFileSync(inputFilename, 'utf-8');
	if (/\n$/.test(input)) {
		input = input.replace(/\n$/, '');
	}
	return input;
}

export function stringifyReplacer(key, value) {
	return typeof value === 'bigint' ? `BigInt(${value.toString()})` :
		value instanceof Set ? ['Set(', ...value, ')'] :
		value instanceof Map ? ['Map(', ...value.entries(), ')'] :
		value;
}

export function runTests(f, tests) {
	assert.ok(tests.length % 2 === 0, 'Tests must be an interleaved array of inputs and outputs');
	for (let i = 0; i < tests.length; i += 2) {
		D(`[runTests] Running test on input ${JSON.stringify(tests[i], stringifyReplacer)}`);
		const input = tests[i];
		const expected = tests[i+1];
		const actual = f(input);
		assert.deepStrictEqual(actual, expected);
		D(`[runTests] OK`);
	}
}
