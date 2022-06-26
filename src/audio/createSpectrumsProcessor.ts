import { getSpectrum } from './getSpectrum'

export const createSpectrumsProcessor = (busesCount: number) => {
	let prevAudioDataNormalized: number[] = []
	let prevPeaks: number[] = []
	let prevSpectrums: number[] = []
	const skipFrameIndex = 2

	return (frameIndex: number, parseAudioData: () => number[]) => {
		const isFrameSkiped = frameIndex && frameIndex % skipFrameIndex === 0
		const audioDataNomrmalized = isFrameSkiped ? prevAudioDataNormalized : normalizeAudioData(parseAudioData())
		prevAudioDataNormalized = audioDataNomrmalized

		const spectrum = getSpectrum(audioDataNomrmalized)
		const skipIndex = Math.trunc(spectrum.length / busesCount)
		const spectrumReduced = spectrum.filter(skipEvery(skipIndex))
		const peaks = getPeaks(spectrumReduced, prevPeaks)
		const correctedSpectrum = correctPeaks(spectrumReduced, peaks)
		const smoothSpectrum = smoothValues(correctedSpectrum, prevSpectrums)
		prevSpectrums = smoothSpectrum
		prevPeaks = peaks

		return smoothSpectrum
	}
}

const skipEvery =
	<T>(skipIndex: number) =>
	(_: T, index: number) =>
		index % skipIndex === 0

const getPeaks = (spectrums: number[], prevPeaks?: number[]) => {
	if (!prevPeaks) {
		return spectrums
	}
	const resultPeaks: number[] = []
	for (let i = 0; i < spectrums.length; i++) {
		const currValue = spectrums[i]
		const currPrevPeak = prevPeaks[i] || 0
		resultPeaks.push(currValue > currPrevPeak ? currValue : currPrevPeak)
	}
	return resultPeaks
}

const correctPeaks = (spectrums: number[], peaks: number[]) => {
	const resultSpectrum: number[] = []
	for (let i = 0; i < spectrums.length; i++) {
		const value = spectrums[i]
		const peakValue = peaks[i] || 0
		if (value < 3) {
			resultSpectrum.push(value / 3)
		} else {
			resultSpectrum.push(value / peakValue)
		}
	}
	return resultSpectrum
}

const smoothValues = (spectrums: number[], prevSpectrums?: number[]) => {
	if (!prevSpectrums) return spectrums

	const resultSpectrum: number[] = []
	for (let i = 0; i < spectrums.length; i++) {
		const currValue = spectrums[i]
		const currPrevValue = prevSpectrums[i] || 0
		const avgValue = (currValue + currPrevValue) / 2
		resultSpectrum.push(avgValue)
	}

	return resultSpectrum
}

const normalizeAudioData = (PCMData: number[]) => PCMData.map((num) => (num - 128) / 128)
