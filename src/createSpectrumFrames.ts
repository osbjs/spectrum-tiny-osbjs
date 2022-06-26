import { createAudioBuffer } from 'audio/createAudioBuffer'
import { createSpectrumsProcessor } from 'audio/createSpectrumsProcessor'
import { writeFile } from 'fs/promises'
import { SpectrumFrame } from 'types/SpectrumFrame'
import { bufferToUInt8 } from 'utils/bufferToUInt8'
import { msToS } from 'utils/msToS'

export async function createSpectrumFrames(
	audioFilePath: string,
	outFilePath: string,
	startTime: number = 0,
	endTime: number = -1,
	fps: number = 30
) {
	const audioReader = await createAudioBuffer(audioFilePath)
	const audioBuffer = audioReader.audioBuffer
	const sampleRate = audioReader.sampleRate
	if (!sampleRate) {
		throw new Error("`ffmpeg` didn't show audio sample rate.")
	}

	const audioDuration = audioBuffer.length / sampleRate
	const framesCount = Math.trunc(audioDuration * fps)
	const audioDataStep = Math.trunc(audioBuffer.length / framesCount)

	const startIndex = Math.trunc(msToS(startTime) * fps),
		endIndex = endTime == -1 ? framesCount : Math.trunc(msToS(endTime) * fps)

	const processSpectrum = createSpectrumsProcessor(64)

	const spectrumFrames: SpectrumFrame[] = []

	for (let i = startIndex; i < endIndex; i++) {
		const audioDataParser = () => bufferToUInt8(audioBuffer, i * audioDataStep, i * audioDataStep + audioDataStep)
		const spectrumData = processSpectrum(i, audioDataParser)

		spectrumFrames.push(spectrumData)
	}

	writeFile(outFilePath, JSON.stringify(spectrumFrames))
}
