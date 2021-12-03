import { D } from './io.mjs';

export function autoparse(input) {
	if (/\n\n/.test(input)) {
		return parseMultiBlocks(input);
	} else if (/\n/.test(input)) {
		return parseMulti(input);
	} else {
		return parseSingle(input);
	}

	function parseMultiBlocks(input) {
		const blocks = input.split('\n\n').map(block => block.split('\n'));
		// Double newline-separated => newline-separated basic numbers
		if (blocks.every(block => block.every(line => /^[-+]?\d+$/.test(line) && String(parseInt(line, 10)) === line.replace(/^\+/,'')))) {
			D(`[autoparse] Double newline-separated => newline-separated basic numbers`);
			return blocks.map(block => block.map(line => parseInt(line, 10)));
		}

		// Double newline-separated => newline-separated big numbers, zero-prefixed numbers
		if (blocks.every(block => block.every(line => /^[-+]?\d+$/.test(line)))) {
			D(`[autoparse] Double newline-separated => newline-separated big numbers, zero-prefixed numbers`);
			return blocks;
		}

		// Double newline-separated => newline-separated basic letters
		if (blocks.every(block => block.every(line => /^[A-Za-z]+$/.test(line)))) {
			D(`[autoparse] Double newline-separated => newline-separated basic letters`);
			return blocks;
		}

		// Double newline-separated => newline-separated basic letter/numbers
		if (blocks.every(block => block.every(line => /^[A-Za-z]+\d+$/.test(line)))) {
			D(`[autoparse] Double newline-separated => newline-separated basic letter/numbers`);
			return blocks.map(block => block.map(line => {
				const [_, a, b] = /([A-Za-z]+)(\d+)/.exec(line);
				return [a, parseInt(b, 10)];
			}));
		}

		// Double newline-separated => newline-separated => comma-separated numbers
		if (blocks.every(block => block.every(line => /^[-+]?\d+(?:\s*,\s*[-+]?\d+)+$/.test(line)))) {
			D(`[autoparse] Double newline-separated => newline-separated => comma-separated numbers`);
			return blocks.map(block => block.map(line => line.split(/\s*,\s*/g).map(x => parseInt(x, 10))));
		}

		// Double newline-separated => newline-separated => comma-separated letters
		if (blocks.every(block => block.every(line => /^[A-Za-z]+(?:\s*,\s*[A-Za-z]+)+$/.test(line)))) {
			D(`[autoparse] Double newline-separated => newline-separated => comma-separated letters`);
			return blocks.map(block => block.map(line => line.split(/\s*,\s*/g)));
		}

		// Double newline-separated => newline-separated => comma-separated letter/numbers
		if (blocks.every(block => block.every(line => /^[A-Za-z]+\d+(?:\s*,\s*[A-Za-z]+\d+)+$/.test(line)))) {
			D(`[autoparse] Double newline-separated => newline-separated => comma-separated letter/numbers`);
			return blocks.map(block => block.map(line => line.split(/\s*,\s*/g).map(x => {
				const [_, a, b] = /([A-Za-z]+)(\d+)/.exec(x);
				return [a, parseInt(b, 10)];
			})));
		}

		// Double newline-separated => newline-separated => whitespace-separated numbers
		if (blocks.every(block => block.every(line => /^\s*[-+]?\d+(?:[^\S\n]+[-+]?\d+)+\s*$/.test(line)))) {
			D(`[autoparse] Double newline-separated => newline-separated => whitespace-separated numbers`);
			return blocks.map(block => block.map(line => line.trim().split(/\s+/g).map(x => parseInt(x, 10))));
		}

		// Double newline-separated => newline-separated => whitespace-separated letters
		if (blocks.every(block => block.every(line => /^\s*[A-Za-z]+(?:[^\S\n]+[A-Za-z]+)+\s*$/.test(line)))) {
			D(`[autoparse] Double newline-separated => newline-separated => whitespace-separated letters`);
			return blocks.map(block => block.map(line => line.trim().split(/\s+/g)));
		}

		// Double newline-separated => newline-separated => whitespace-separated letter/numbers
		if (blocks.every(block => block.every(line => /^[A-Za-z]+\d+(?:[^\S\n]+[A-Za-z]+\d+)+$/.test(line)))) {
			D(`[autoparse] Double newline-separated => newline-separated => whitespace-separated letter/numbers`);
			return blocks.map(block => block.map(line => line.split(/\s+/g).map(x => {
				const [_, a, b] = /([A-Za-z]+)(\d+)/.exec(x);
				return [a, parseInt(b, 10)];
			})));
		}

		D(`[autoparse] Double newline-separated => newline-separated strings`);
		return blocks;
	}

	function parseMulti(input) {
		const lines = input.split('\n');

		// Newline-separated basic numbers
		if (lines.every(line => /^[-+]?\d+$/.test(line) && String(parseInt(line, 10)) === line.replace(/^\+/,''))) {
			D(`[autoparse] Newline-separated basic numbers`);
			return lines.map(line => parseInt(line, 10));
		}

		// Newline-separated big numbers, zero-prefixed numbers
		if (lines.every(line => /^[-+]?\d+$/.test(line))) {
			D(`[autoparse] Newline-separated big numbers, zero-prefixed numbers`);
			return lines;
		}

		// Newline-separated basic letters
		if (lines.every(line => /^[A-Za-z]+$/.test(line))) {
			D(`[autoparse] Newline-separated basic letters`);
			return lines;
		}

		// Newline-separated basic letter/numbers
		if (lines.every(line => /^[A-Za-z]+\d+$/.test(line))) {
			D(`[autoparse] Newline-separated basic letter/numbers`);
			return lines.map(line => {
				const [_, a, b] = /([A-Za-z]+)(\d+)/.exec(line);
				return [a, parseInt(b, 10)];
			});
		}

		// Newline-separated => comma-separated numbers
		if (lines.every(line => /^[-+]?\d+(?:\s*,\s*[-+]?\d+)+$/.test(line))) {
			D(`[autoparse] Newline-separated => comma-separated numbers`);
			return lines.map(line => line.split(/\s*,\s*/g).map(x => parseInt(x, 10)));
		}

		// Newline-separated => comma-separated letters
		if (lines.every(line => /^[A-Za-z]+(?:\s*,\s*[A-Za-z]+)+$/.test(line))) {
			D(`[autoparse] Newline-separated => comma-separated letters`);
			return lines.map(line => line.split(/\s*,\s*/g));
		}

		// Newline-separated => comma-separated letter/numbers
		if (lines.every(line => /^[A-Za-z]+\d+(?:\s*,\s*[A-Za-z]+\d+)+$/.test(line))) {
			D(`[autoparse] Newline-separated => comma-separated letter/numbers`);
			return lines.map(line => line.split(/\s*,\s*/g).map(x => {
				const [_, a, b] = /([A-Za-z]+)(\d+)/.exec(x);
				return [a, parseInt(b, 10)];
			}));
		}

		// Newline-separated => whitespace-separated numbers
		if (lines.every(line => /^\s*[-+]?\d+(?:[^\S\n]+[-+]?\d+)+\s*$/.test(line))) {
			D(`[autoparse] Newline-separated => whitespace-separated numbers`);
			return lines.map(line => line.trim().split(/\s+/g).map(x => parseInt(x, 10)));
		}

		// Newline-separated => whitespace-separated letters
		if (lines.every(line => /^\s*[A-Za-z]+(?:[^\S\n]+[A-Za-z]+)+\s*$/.test(line))) {
			D(`[autoparse] Newline-separated => whitespace-separated letters`);
			return lines.map(line => line.trim().split(/\s+/g));
		}

		// Newline-separated => whitespace-separated letter/numbers
		if (lines.every(line => /^[A-Za-z]+\d+(?:[^\S\n]+[A-Za-z]+\d+)+$/.test(line))) {
			D(`[autoparse] Newline-separated => whitespace-separated letter/numbers`);
			return lines.map(line => line.split(/\s+/g).map(x => {
				const [_, a, b] = /([A-Za-z]+)(\d+)/.exec(x);
				return [a, parseInt(b, 10)];
			}));
		}

		// Newline-separated => arrow-separated
		if (lines.every(line => / ((-+|=+)>|<(-+|=+)>?) /.test(line))) {
			D(`[autoparse] Newline-separated => arrow-separated`);
			let pairs = lines.map(line => line.split(/ <?(?:-+|=+)>? (.+)/));

			const numA = pairs.every(pair => /^[-+]?\d+$/.test(pair[0]));
			const numB = pairs.every(pair => /^[-+]?\d+$/.test(pair[1]));

			const commaSepA = pairs.some(pair => /\s*,\s*/.test(pair[0]));
			const commaSepB = pairs.some(pair => /\s*,\s*/.test(pair[1]));

			pairs = pairs.map(([a, b]) => {
				if (numA) {
					a = parseInt(a, 10);
				} else if (commaSepA) {
					a = a.split(/\s*,\s*/);
					if (a.every(n => /^[-+]?\d+$/.test(n))) {
						a = a.map(n => parseInt(n, 10));
					} 
				}

				if (numB) {
					a = parseInt(b, 10);
				} else if (commaSepB) {
					b = b.split(/\s*,\s*/);
					if (b.every(n => /^[-+]?\d+$/.test(n))) {
						b = b.map(n => parseInt(n, 10));
					}
				}

				return [a, b];
			});
			return pairs;
		}

		// Grids
		if (lines.every(line => line.length === lines[0].length) && /\./.test(input)) {
			D(`[autoparse] Grids`);
			return lines.map(line => line.split(''));
		}

		// Instructions
		if (lines.every(line => /^[A-Za-z]+( ([A-Za-z]+|[-+]?\d+)(,? ([A-Za-z]+|[-+]?\d+))*)?$/.test(line))) {
			D(`[autoparse] Instructions`);
			return lines.map(line => {
				let [opcode, args] = line.split(/ (.+)/);
				args = args.split(/,? /g).map(args => {
					if (/[-+]?\d+/.test(args)) return parseInt(args, 10);
					return args;
				});
				return { opcode, args };
			});
		}

		D(`[autoparse] Newline-separated strings`);
		return lines;
	}

	function parseSingle(input) {
		// Basic numbers
		if (/^[-+]?\d+$/.test(input) && String(parseInt(input, 10)) === input.replace(/^\+/,'')) {
			D(`[autoparse] Basic numbers`);
			return parseInt(input, 10);
		}

		// Big numbers, zero-prefixed numbers
		if (/^[-+]?\d+$/.test(input)) {
			D(`[autoparse] Big or zero-prefixed numbers`);
			return input;
		}

		// Basic letters
		if (/^[A-Za-z]+$/.test(input)) {
			D(`[autoparse] Basic letters`);
			return input;
		}

		// Basic letter/numbers
		if (/^[A-Za-z]+\d+$/.test(input)) {
			D(`[autoparse] Basic letter/numbers`);
			const [_, a, b] = /([A-Za-z]+)(\d+)/.exec(input);
			return [a, parseInt(b, 10)];
		}

		// Comma-separated numbers
		if (/^[-+]?\d+(?:\s*,\s*[-+]?\d+)+$/.test(input)) {
			D(`[autoparse] Comma-separated numbers`);
			return input.split(/\s*,\s*/g).map(x => parseInt(x, 10));
		}

		// Comma-separated letters
		if (/^[A-Za-z]+(?:\s*,\s*[A-Za-z]+)+$/.test(input)) {
			D(`[autoparse] Comma-separated letters`);
			return input.split(/\s*,\s*/g);
		}

		// Comma-separated letter/numbers
		if (/^[A-Za-z]+\d+(?:\s*,\s*[A-Za-z]+\d+)+$/.test(input)) {
			D(`[autoparse] Comma-separated letter/numbers`);
			return input.split(/\s*,\s*/g).map(x => {
				const [_, a, b] = /([A-Za-z]+)(\d+)/.exec(x);
				return [a, parseInt(b, 10)];
			});
		}

		// Whitespace-separated numbers
		if (/^\s*[-+]?\d+(?:[^\S\n]+[-+]?\d+)+\s*$/.test(input)) {
			D(`[autoparse] Whitespace-separated numbers`);
			return input.trim().split(/\s+/g).map(x => parseInt(x, 10));
		}

		// Whitespace-separated letters
		if (/^\s*[A-Za-z]+(?:[^\S\n]+[A-Za-z]+)+\s*$/.test(input)) {
			D(`[autoparse] Whitespace-separated letters`);
			return input.trim().split(/\s+/g);
		}

		// Whitespace-separated letter/numbers
		if (/^[A-Za-z]+\d+(?:[^\S\n]+[A-Za-z]+\d+)+$/.test(input)) {
			D(`[autoparse] Whitespace-separated letter/numbers`);
			return input.split(/\s+/g).map(x => {
				const [_, a, b] = /([A-Za-z]+)(\d+)/.exec(x);
				return [a, parseInt(b, 10)];
			});
		}

		D(`[autoparse] Single line strings`);
		return input;
	}

	throw new Error('could not parse input');
}
