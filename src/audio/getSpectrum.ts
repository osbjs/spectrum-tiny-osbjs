import { brutForceFFTSignalLength } from './brutForceFFTSignalLength'
import { createSpectrumAnalyzer } from './createSpectrumAnalyzer'

export const getSpectrum = (PCMData: number[]) => {
	const signalLength = brutForceFFTSignalLength(PCMData.length)
	const signalStartIndex = Math.trunc(PCMData.length / 2 - signalLength / 2)
	const signal = PCMData.slice(signalStartIndex, signalStartIndex + signalLength)

	const spectrumAnalyzer = createSpectrumAnalyzer(signalLength)
	const spectrum = spectrumAnalyzer(signal)
	for (let i = 0; i < spectrum.length; i++) {
		// attenuates low freqs and boosts highs
		spectrum[i] *= -1 * Math.log((signalLength / 2 - i) * (0.5 / signalLength / 2)) * signalLength
	}
	return spectrum
}
