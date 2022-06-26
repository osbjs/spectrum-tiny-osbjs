export const bufferToUInt8 = (buffer: Buffer, start: number, end: number) => {
	const numbers = []
	for (let i = start; i < end; i += 1) {
		numbers.push(buffer.readUInt8(i))
	}
	return numbers
}
