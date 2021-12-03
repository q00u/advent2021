export function memo(f) {
	const memos = new Map();
	return (...args) => {
		const key = JSON.stringify(args);
		if (memos.has(key)) {
			return memos.get(key);
		}
		const result = f(...args);
		memos.set(key, result);
		return result;
	}
}
