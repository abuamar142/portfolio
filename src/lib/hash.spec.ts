import { describe, expect, it } from 'vitest'
import { HASH_ALGORITHMS, hashFile, hashText, toHex } from '@/lib/hash'

/**
 * Pinned against the published NIST vectors, because a hash tool that is
 * subtly wrong is worse than no tool: the digest looks plausible and gets
 * pasted into a checksum file.
 */

describe('hashText', () => {
  it('matches the empty-string vectors', async () => {
    expect((await hashText('', 'SHA-1')).hex).toBe('da39a3ee5e6b4b0d3255bfef95601890afd80709')
    expect((await hashText('', 'SHA-256')).hex).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    )
  })

  it('matches the "abc" vectors', async () => {
    expect((await hashText('abc', 'SHA-1')).hex).toBe('a9993e364706816aba3e25717850c26c9cd0d89d')
    expect((await hashText('abc', 'SHA-256')).hex).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    )
    expect((await hashText('abc', 'SHA-384')).hex).toBe(
      'cb00753f45a35e8bb5a03d699ac65007272c32ab0eded1631a8b605a43ff5bed8086072ba1e7cc2358baeca134c825a7',
    )
    expect((await hashText('abc', 'SHA-512')).hex).toBe(
      'ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f',
    )
  })

  it('hashes UTF-8 bytes, not UTF-16 code units', async () => {
    // "é" is two bytes in UTF-8, so this is not the same digest as "e".
    const accented = await hashText('café')
    const plain = await hashText('cafe')
    expect(accented.hex).not.toBe(plain.hex)
    expect(accented.bytes).toBe(5)
  })

  it('reports the byte length it actually hashed', async () => {
    expect((await hashText('abc')).bytes).toBe(3)
    expect((await hashText('😀')).bytes).toBe(4)
    expect((await hashText('')).bytes).toBe(0)
  })

  it('defaults to SHA-256 and every listed algorithm produces a digest', async () => {
    const result = await hashText('abc')
    expect(result.algorithm).toBe('SHA-256')
    for (const algorithm of HASH_ALGORITHMS) {
      const hex = (await hashText('abc', algorithm)).hex
      expect(hex).toMatch(/^[0-9a-f]+$/)
    }
  })
})

describe('hashFile', () => {
  it('hashes a blob byte-for-byte', async () => {
    const blob = new Blob([new Uint8Array([0x61, 0x62, 0x63])])
    const result = await hashFile(blob)
    expect(result.hex).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')
    expect(result.bytes).toBe(3)
  })

  it('hashes binary bytes that are not valid text', async () => {
    const blob = new Blob([new Uint8Array([0x00, 0xff, 0xfe])])
    expect((await hashFile(blob, 'SHA-1')).hex).toMatch(/^[0-9a-f]{40}$/)
  })
})

describe('toHex', () => {
  it('pads single-digit bytes', () => {
    expect(toHex(new Uint8Array([0, 1, 15, 16, 255]).buffer)).toBe('00010f10ff')
  })
})
