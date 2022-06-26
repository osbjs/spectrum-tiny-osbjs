import { readFileSync } from 'fs'
import { SpectrumFrame } from 'types/SpectrumFrame'

export function loadSpectrumFrames(filename: string): SpectrumFrame[] {
	return JSON.parse(readFileSync(filename, 'utf8'))
}
