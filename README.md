# spectrum-tiny-osbjs
Create spectrum helpers for tiny-osbjs.

## Install
```bash
npm i @osbjs/spectrum-tiny-osbjs @osbjs/tiny-osbjs
```

## Usage
Create a schema file by calling `createSpectrumSchema` in a seperate file and exec it.
```js
// createSchema.js
#!/usr/bin/env node
import { createSpectrumSchema } from '@osbjs/spectrum-tiny-osbjs'

createSpectrumSchema('path/to/audio/file')
// and then call `node createSchema` 1 time.
```

Spectrum schema contains info on start time, end time, amount of frame-per-second and spectrum "frames", each frame contains 64 numbers between 0 and 1 that can be used to scale the spectrum bar. Example of how to create a simple spectrum effect:
```js
import { loadSpectrumSchema } from '@osbjs/spectrum-tiny-osbjs'

const { startTime, endTime, fps, spectrumFrames } = loadSpectrumSchema(schemaPath)

const timestep = 1000 / fps
const width = 20
const maxHeight = 50
const margin = 3
const barCount = 20

let x = -107

for (let i = 0; i < barCount; i++) {
	const frames = spectrumFrames.map((frame) => frame[i])

	createSprite('sb/pixel.png', Layer.Background, Origin.Centre, [x, 240], () => {
		fade(startTime, 1)
		color(startTime, [255,255,255])

		for (let j = 0; j < frames.length; j++) {
			scaleVec(
				[startTime + timestep * j, startTime + timestep * (j + 1)],
				[width, frames[j] * maxHeight],
				[width, frames[j + 1] * maxHeight]
			)
		}
	})

	x += width + margin
}
```

## API documentation
### createSpectrumSchema
```ts
async function createSpectrumSchema(
	audioFilePath: string,
	outFilePath: string = 'spectrum.json',
	startTime: number = 0,
	endTime: number = -1,
	fps: number = 24,
	barCount: number = 64
)
```
Create a json file that store the audio data needed to create the spectrum effect.

### loadSpectrumSchema
```ts
function loadSpectrumSchema(schemaPath: string): SpectrumSchema
type SpectrumSchema = {
	startTime: number
	endTime: number
	fps: number
	spectrumFrames: SpectrumFrame[]
}
type SpectrumFrame = number[]
```
Load schema from json file.

### extractFrames
```ts
function extractFrames(spectrumFrames: SpectrumFrame[], startTime: number, endTime: number, fps: number): SpectrumFrame[]
```
Extract frames from a specific time period.
