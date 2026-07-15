import { describe, it, expect } from 'vitest'
import { calculateReadtime } from './readtime.js'

describe('calculateReadtime', () => {
	it('returns 1 minute for a 200 word body (200 wpm)', () => {
		const body = new Array(200).fill('word').join(' ')
		expect(calculateReadtime(body)).toBe(1)
	})

	it('returns 2 minutes for a 400 word body', () => {
		const body = new Array(400).fill('word').join(' ')
		expect(calculateReadtime(body)).toBe(2)
	})

	it('rounds to the nearest minute', () => {
		// 300 words / 200 wpm = 1.5 minutes, rounds up to 2
		const body = new Array(300).fill('word').join(' ')
		expect(calculateReadtime(body)).toBe(2)
	})

	it('collapses repeated whitespace before counting words', () => {
		const body = new Array(200).fill('word').join('   \n\t ')
		expect(calculateReadtime(body)).toBe(1)
	})
})
