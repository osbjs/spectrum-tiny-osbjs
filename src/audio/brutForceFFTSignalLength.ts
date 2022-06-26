export const brutForceFFTSignalLength = (PCMDataLength: number) => {
	let exponent = 1
	while (true) {
		const pow = Math.pow(2, exponent)
		if (pow * 2 > PCMDataLength) {
			return Math.pow(2, exponent - 1) * 2
		}
		exponent++
	}
}

