export function generateUUID(): string {
	let uuid = '';
	for (let i = 0; i < 36; i++) {
		if (i === 8 || i === 13 || i === 18 || i === 23) {
			uuid += '-';
		} else if (i === 14) {
			uuid += '4';
		} else {
			const random = (Math.random() * 16) | 0;
			uuid += i === 19 ? ((random & 0x3) | 0x8).toString(16) : random.toString(16);
		}
	}
	return uuid;
}
