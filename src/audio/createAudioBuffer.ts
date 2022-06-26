import { spawn } from 'child_process'
import pathToFfmpeg from 'ffmpeg-static'

export const createAudioBuffer = (filename: string) =>
	new Promise<{ audioBuffer: Buffer; sampleRate: number }>((resolve, _) => {
		let sampleRate: number
		const sampleRateRegExp = /(\d+) Hz/m
		const audioBuffers: Buffer[] = []
		const ffmpegAudioReader = spawn(pathToFfmpeg, ['-i', filename, '-f', 'u8', '-ac', '1', '-'])

		ffmpegAudioReader.stderr.on('data', function (data) {
			const match = data.toString().match(sampleRateRegExp)
			if (!sampleRate && match) {
				sampleRate = match[1]
			}
		})
		ffmpegAudioReader.stdout.on('data', function (chunkBuffer) {
			audioBuffers.push(chunkBuffer)
		})
		ffmpegAudioReader.stdout.on('end', function () {
			const audioBuffer = Buffer.concat(audioBuffers)
			resolve({ audioBuffer, sampleRate })
		})
	})
