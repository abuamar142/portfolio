/**
 * JSON formatting that never round-trips through JavaScript values.
 *
 * `JSON.parse` + `JSON.stringify` is the obvious implementation and the wrong
 * one for a formatter: numbers beyond 2^53 are silently rounded
 * (`9007199254740993` -> `9007199254740992`), `-0` becomes `0`, and the text
 * of a string escape is normalised. A formatter must be lossless, so this
 * scanner validates and re-emits the *raw tokens* — numbers and string
 * literals keep their exact source text, key order is preserved, and the only
 * thing that changes is the whitespace between tokens.
 *
 * It also validates, because the same pass already knows where it is: the
 * first structural error is reported with the byte index and the 1-based
 * line/column a user can act on. Error messages stay in English on purpose —
 * they mirror what a JSON parser reports, and a developer reading
 * `Expected "," or "}"` does not want it translated.
 */

export type IndentUnit = number | 'tab'

export interface JsonError {
  /** Technical, English, mirroring a JSON parser. */
  message: string
  /** Byte offset into the *trimmed* source. */
  index: number
  /** 1-based. */
  line: number
  /** 1-based, counted in UTF-16 code units. */
  column: number
}

export interface FormatStats {
  /** UTF-8 byte length of the accepted input (BOM excluded). */
  inBytes: number
  /** UTF-8 byte length of the emitted document. */
  outBytes: number
  /** Deepest nesting the document reached. */
  depth: number
}

export type FormatResult =
  | { ok: true; output: string; stats: FormatStats }
  | { ok: false; error: JsonError }

export interface FormatOptions {
  /** Spaces per level, or a literal tab. Clamped to 1..8. Default 2. */
  indent?: IndentUnit
  /** Emit the smallest legal document instead of an indented one. */
  minify?: boolean
}

/** Inputs that nest deeper than this are rejected rather than recursed into. */
const MAX_DEPTH = 1000

const WHITESPACE = ' \t\n\r'

const ESCAPES = '"\\/bfnrtu'

function isWhitespace(ch: string): boolean {
  return WHITESPACE.includes(ch)
}

const NUMBER_RE = /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/y

function isHex(ch: string | undefined): boolean {
  return ch !== undefined && /[0-9a-fA-F]/.test(ch)
}

function isDigit(ch: string | undefined): boolean {
  return ch !== undefined && ch >= '0' && ch <= '9'
}

/** 1-based line/column for an index into `text`. */
export function locate(text: string, index: number): { line: number; column: number } {
  let line = 1
  let lineStart = 0
  for (let i = 0; i < index && i < text.length; i++) {
    if (text[i] === '\n') {
      line++
      lineStart = i + 1
    }
  }
  return { line, column: index - lineStart + 1 }
}

function byteLength(text: string): number {
  return new TextEncoder().encode(text).length
}

class ParseFailure extends Error {
  constructor(
    message: string,
    readonly index: number,
  ) {
    super(message)
  }
}

/**
 * Validating scanner + emitter. Every `parse*` method pushes the canonical
 * text for the token(s) it consumed, so a successful pass leaves `out` holding
 * the formatted document.
 */
class Formatter {
  private i = 0
  private readonly out: string[] = []
  private depth = 0
  private maxDepth = 0
  private readonly unit: string
  private readonly pretty: boolean

  constructor(
    private readonly src: string,
    opts: FormatOptions,
  ) {
    const indent = opts.indent ?? 2
    this.unit = indent === 'tab' ? '\t' : ' '.repeat(Math.min(8, Math.max(1, Math.floor(indent))))
    this.pretty = !opts.minify
  }

  format(): FormatStats {
    this.skipWhitespace()
    if (this.i >= this.src.length) this.fail('Unexpected end of input: no JSON value')
    this.parseValue()
    this.skipWhitespace()
    if (this.i < this.src.length) {
      this.fail(`Unexpected data after the JSON value: ${this.describe(this.i)}`)
    }
    const output = this.out.join('')
    return { inBytes: byteLength(this.src), outBytes: byteLength(output), depth: this.maxDepth }
  }

  get result(): string {
    return this.out.join('')
  }

  private fail(message: string, index = this.i): never {
    throw new ParseFailure(message, Math.min(index, this.src.length))
  }

  private describe(index: number): string {
    const ch = this.src[index]
    if (ch === undefined) return 'end of input'
    const code = ch.codePointAt(0) ?? 0
    if (code < 0x20) return `control character U+${code.toString(16).toUpperCase().padStart(4, '0')}`
    return `"${ch}"`
  }

  private skipWhitespace(): void {
    while (this.i < this.src.length && isWhitespace(this.src[this.i]!)) this.i++
  }

  private push(value: string): void {
    this.out.push(value)
  }

  /** Line break + indentation for `this.depth`; empty when minifying. */
  private breakTo(depth: number): void {
    if (!this.pretty) return
    this.push(`\n${this.unit.repeat(depth)}`)
  }

  private parseValue(): void {
    const ch = this.src[this.i]
    switch (ch) {
      case '{':
        this.parseObject()
        return
      case '[':
        this.parseArray()
        return
      case '"':
        this.parseString()
        return
      case 't':
        this.parseLiteral('true')
        return
      case 'f':
        this.parseLiteral('false')
        return
      case 'n':
        this.parseLiteral('null')
        return
      default:
        if (ch === '-' || isDigit(ch)) {
          this.parseNumber()
          return
        }
        if (ch === undefined) this.fail('Unexpected end of input: expected a value')
        this.fail(`Unexpected character ${this.describe(this.i)}: expected a value`)
    }
  }

  private parseLiteral(word: string): void {
    if (!this.src.startsWith(word, this.i)) {
      this.fail(`Expected "${word}" but found ${this.describe(this.i)}`)
    }
    this.push(word)
    this.i += word.length
  }

  private parseNumber(): void {
    NUMBER_RE.lastIndex = this.i
    const match = NUMBER_RE.exec(this.src)
    if (!match) this.fail(`Invalid number: ${this.describe(this.i)}`)
    this.push(match![0])
    this.i += match![0].length
  }

  private parseString(): void {
    const start = this.i
    this.i++ // opening quote
    for (;;) {
      const ch = this.src[this.i]
      if (ch === undefined) this.fail('Unterminated string: missing closing quote', start)
      if (ch === '"') {
        this.i++
        break
      }
      if (ch === '\\') {
        const esc = this.src[this.i + 1]
        if (esc === undefined) this.fail('Unterminated escape sequence at end of input')
        if (!ESCAPES.includes(esc)) this.fail(`Invalid escape sequence "\\${esc}"`)
        if (esc === 'u') {
          for (let k = 2; k < 6; k++) {
            if (!isHex(this.src[this.i + k])) {
              this.fail('Invalid \\u escape: expected four hex digits', this.i)
            }
          }
          this.i += 6
          continue
        }
        this.i += 2
        continue
      }
      const code = ch.charCodeAt(0)
      if (code < 0x20) {
        this.fail(`Unescaped control character U+${code.toString(16).toUpperCase().padStart(4, '0')} in string`)
      }
      this.i++
    }
    // Raw source text: escapes inside the literal are preserved verbatim.
    this.push(this.src.slice(start, this.i))
  }

  private enter(): void {
    this.depth++
    if (this.depth > this.maxDepth) this.maxDepth = this.depth
    if (this.depth > MAX_DEPTH) this.fail(`Nesting too deep: more than ${MAX_DEPTH} levels`)
  }

  private parseObject(): void {
    this.i++ // {
    this.skipWhitespace()
    if (this.src[this.i] === '}') {
      this.i++
      this.push('{}')
      return
    }
    this.push('{')
    this.enter()
    for (;;) {
      this.skipWhitespace()
      this.breakTo(this.depth)
      if (this.src[this.i] !== '"') {
        this.fail(`Expected a double-quoted property name, found ${this.describe(this.i)}`)
      }
      this.parseString()
      this.skipWhitespace()
      if (this.src[this.i] !== ':') {
        this.fail(`Expected ":" after the property name, found ${this.describe(this.i)}`)
      }
      this.i++
      this.push(this.pretty ? ': ' : ':')
      this.skipWhitespace()
      if (this.i >= this.src.length) this.fail('Unexpected end of input: expected a value')
      this.parseValue()
      this.skipWhitespace()

      const next = this.src[this.i]
      if (next === ',') {
        this.i++
        this.push(',')
        this.skipWhitespace()
        // A comma followed by '}' is the classic trailing comma: catch it here
        // so the message names the real problem instead of "expected a name".
        if (this.src[this.i] === '}') this.fail('Trailing comma before "}"')
        continue
      }
      if (next === '}') {
        this.i++
        this.depth--
        this.breakTo(this.depth)
        this.push('}')
        return
      }
      this.fail(`Expected "," or "}" but found ${this.describe(this.i)}`)
    }
  }

  private parseArray(): void {
    this.i++ // [
    this.skipWhitespace()
    if (this.src[this.i] === ']') {
      this.i++
      this.push('[]')
      return
    }
    this.push('[')
    this.enter()
    for (;;) {
      this.skipWhitespace()
      this.breakTo(this.depth)
      this.parseValue()
      this.skipWhitespace()

      const next = this.src[this.i]
      if (next === ',') {
        this.i++
        this.push(',')
        this.skipWhitespace()
        if (this.src[this.i] === ']') this.fail('Trailing comma before "]"')
        continue
      }
      if (next === ']') {
        this.i++
        this.depth--
        this.breakTo(this.depth)
        this.push(']')
        return
      }
      this.fail(`Expected "," or "]" but found ${this.describe(this.i)}`)
    }
  }
}

/**
 * Validate and reformat `text`.
 *
 * Never throws for bad input: a malformed document comes back as
 * `{ ok: false, error }` with the position of the first failure.
 */
export function formatJson(text: string, opts: FormatOptions = {}): FormatResult {
  // A leading BOM is an editor/paste artifact, not JSON content.
  const src = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text
  const formatter = new Formatter(src, opts)
  try {
    const stats = formatter.format()
    return { ok: true, output: formatter.result, stats }
  } catch (error) {
    if (error instanceof ParseFailure) {
      const { line, column } = locate(src, error.index)
      return { ok: false, error: { message: error.message, index: error.index, line, column } }
    }
    throw error
  }
}
