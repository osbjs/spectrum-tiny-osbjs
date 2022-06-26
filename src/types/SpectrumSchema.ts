import { SpectrumFrame } from './SpectrumFrame'

export type SpectrumSchema = {
	startTime: number
	endTime: number
	fps: number
	spectrumFrames: SpectrumFrame[]
}
