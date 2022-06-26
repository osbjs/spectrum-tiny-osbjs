import { SpectrumFrame } from 'types/SpectrumFrame'
import { msToS } from './msToS'

/**
 * Extract frames from a specific time period.
 *
 * @param spectrumFrames Spectrum frames to be extracted from.
 * @param startTime Time to start the extract process.
 * @param endTime Time to end the extract process.
 * @param fps Frame per second.
 */
export function extractFrom(spectrumFrames: SpectrumFrame[], startTime: number, endTime: number, fps: number): SpectrumFrame[] {
	const startIndex = Math.trunc(msToS(startTime) * fps),
		endIndex = endTime == -1 ? spectrumFrames.length : Math.trunc(msToS(endTime) * fps)

	return spectrumFrames.slice(startIndex, endIndex)
}
