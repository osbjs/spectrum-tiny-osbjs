import { readFileSync } from 'fs'
import { SpectrumSchema } from 'types/SpectrumSchema'

/**
 * Load schema from json file.
 *
 * @param schemaPath Path to schema file.
 */
export function loadSpectrumSchema(schemaPath: string): SpectrumSchema {
	return JSON.parse(readFileSync(schemaPath, 'utf8'))
}
