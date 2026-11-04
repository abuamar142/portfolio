import { describe, expect, it } from 'vitest'
import { formatJson } from '@/lib/jsonTool'

/**
 * The formatter re-emits raw tokens instead of round-tripping through
 * `JSON.parse`/`JSON.stringify`, so the cases worth pinning are the ones where
 * the obvious implementation is lossy or lies about the input: numbers wider
 * than a double, key order, escape text, and the position of the first
 * structural error.
 */

function output(text: string, opts?: Parameters<typeof formatJson>[1]): string {
  const result = formatJson(text, opts)
  if (!result.ok) throw new Error(`expected valid JSON, got: ${result.error.message}`)
  return result.output
}

function errorOf(text: string): { message: string; line: number; column: number } {
  const result = formatJson(text)
  if (result.ok) throw new Error(`expected a parse error, got: ${result.output}`)
  return result.error
}

describe('formatJson', () => {
  it('indents with two spaces by default', () => {
    expect(output('{"a":1,"b":[2,3]}')).toBe(
      ['{', '  "a": 1,', '  "b": [', '    2,', '    3', '  ]', '}'].join('\n'),
    )
  })

  it('honours an explicit indent width and a tab', () => {
    expect(output('{"a":{"b":1}}', { indent: 4 })).toBe(
      ['{', '    "a": {', '        "b": 1', '    }', '}'].join('\n'),
    )
    expect(output('{"a":1}', { indent: 'tab' })).toBe(['{', '\t"a": 1', '}'].join('\n'))
  })

  it('clamps a nonsense indent width instead of looping on it', () => {
    expect(output('{"a":1}', { indent: 0 })).toBe(['{', ' "a": 1', '}'].join('\n'))
    expect(output('{"a":1}', { indent: 99 })).toBe(['{', `${' '.repeat(8)}"a": 1`, '}'].join('\n'))
  })

  it('minifies without touching token text', () => {
    expect(output('{\n  "a": 1,\n  "b": [ 2 ]\n}\n', { minify: true })).toBe('{"a":1,"b":[2]}')
  })

  it('keeps integers wider than a double exactly', () => {
    // 2^53 + 1 and a 20-digit id: `JSON.parse` rounds both.
    const text = '{"a":9007199254740993,"b":12345678901234567890,"c":1e400}'
    expect(output(text, { minify: true })).toBe(text)
  })

  it('preserves -0, exponent spelling and float text', () => {
    const text = '{"a":-0,"b":1.0,"c":1E+3,"d":0.1e-2}'
    expect(output(text, { minify: true })).toBe(text)
  })

  it('preserves key order and duplicate keys', () => {
    expect(output('{"z":1,"a":2,"z":3}', { minify: true })).toBe('{"z":1,"a":2,"z":3}')
  })

  it('preserves the source text of string escapes', () => {
    const text = '{"a":"caf\\u00e9 \\/ \\n","b":"😀","c":"\\"quoted\\""}'
    expect(output(text, { minify: true })).toBe(text)
  })

  it('keeps empty containers tight', () => {
    expect(output('{"a":{},"b":[],"c":[{}]}')).toBe(
      ['{', '  "a": {},', '  "b": [],', '  "c": [', '    {}', '  ]', '}'].join('\n'),
    )
  })

  it('accepts any top-level value, not just objects', () => {
    expect(output('42', { minify: true })).toBe('42')
    expect(output('"x"', { minify: true })).toBe('"x"')
    expect(output(' [1] ', { minify: true })).toBe('[1]')
  })

  it('strips a leading BOM from a pasted document', () => {
    expect(output('\ufeff{"a":1}', { minify: true })).toBe('{"a":1}')
  })

  it('reports bytes and nesting depth', () => {
    const result = formatJson('{"a":{"b":[1]}}')
    if (!result.ok) throw new Error(result.error.message)
    expect(result.stats.depth).toBe(3)
    expect(result.stats.inBytes).toBe(15)
    expect(result.stats.outBytes).toBeGreaterThan(result.stats.inBytes)
  })

  describe('errors', () => {
    it('rejects empty input', () => {
      expect(errorOf('   ').message).toMatch(/end of input/i)
    })

    it('names a trailing comma instead of "expected a name"', () => {
      const error = errorOf('{\n  "a": 1,\n}')
      expect(error.message).toBe('Trailing comma before "}"')
      expect(error.line).toBe(3)
      expect(error.column).toBe(1)
    })

    it('rejects comments', () => {
      expect(errorOf('{"a": 1 // nope\n}').message).toMatch(/Expected "," or "}"/)
    })

    it('rejects single-quoted strings and unquoted keys', () => {
      expect(errorOf("{'a': 1}").message).toMatch(/double-quoted property name/)
      expect(errorOf('{a: 1}').message).toMatch(/double-quoted property name/)
      expect(errorOf('["x", \'y\']').message).toMatch(/expected a value/)
    })

    it('rejects numbers JSON does not allow', () => {
      expect(errorOf('[01]').message).toBe('Expected "," or "]" but found "1"')
      expect(errorOf('[+1]').message).toMatch(/expected a value/)
      expect(errorOf('[.5]').message).toMatch(/expected a value/)
      expect(errorOf('[NaN]').message).toMatch(/Unexpected character "N": expected a value/)
      expect(errorOf('[1.]').message).toBe('Expected "," or "]" but found "."')
    })

    it('rejects a bare unicode escape and control characters in strings', () => {
      expect(errorOf('["\\u12g4"]').message).toMatch(/four hex digits/)
      expect(errorOf('["a\tb"]').message).toMatch(/Unescaped control character/)
    })

    it('reports the position of the first error, not the last', () => {
      const error = errorOf('{"a": 1,\n "b" 2,\n "c": 3}')
      expect(error.message).toBe('Expected ":" after the property name, found "2"')
      expect(error.line).toBe(2)
      expect(error.column).toBe(6)
    })

    it('points at the opening quote of an unterminated string', () => {
      const error = errorOf('{"a": "oops\n}')
      // The newline is the first thing that cannot appear in a JSON string, and
      // it is reported where it is — not after the scanner gives up.
      expect(error.message).toMatch(/Unescaped control character U\+000A/)
      expect(error.line).toBe(1)
      expect(error.column).toBe(12)
      // No newline at all: the string simply runs out.
      expect(errorOf('{"a": "oops').message).toMatch(/Unterminated string: missing closing quote/)
    })

    it('rejects nesting deep enough to blow the stack', () => {
      const deep = '['.repeat(1200) + ']'.repeat(1200)
      expect(errorOf(deep).message).toMatch(/Nesting too deep/)
    })

    it('stays linear on a large document', () => {
      const rows = Array.from({ length: 20000 }, (_, i) => `{"id":${i},"name":"row-${i}"}`)
      const text = `[${rows.join(',')}]`
      const started = performance.now()
      const result = formatJson(text, { minify: true })
      const elapsed = performance.now() - started
      expect(result.ok).toBe(true)
      expect(elapsed).toBeLessThan(2000)
    })
  })
})
