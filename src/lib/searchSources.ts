import type { SearchItem } from './search'

/**
 * Searchable surfaces that need no network: the landing-page sections and every
 * page the router serves.
 *
 * These are the answers to "where is the thing I am looking for" rather than
 * "what content matches this word", so they are built from the same route
 * table and section list the navigation uses. Typing "base64" should find the
 * tool, not only a blog post that mentions it.
 *
 * Titles are English on purpose: route names and tool names are not localized
 * in this app (`/json`, `/jwt`, `/qr` are the same words in both locales), and
 * a search index that translated them would stop matching what the user typed.
 * The localized aliases below cover the Indonesian spellings.
 */

interface StaticSurface {
  to: string
  title: string
  subtitle: string
  /** Extra words that should find this surface. */
  aliases: string[]
}

/** Landing sections, in the order the spine lists them. */
const SECTIONS: StaticSurface[] = [
  { to: '/#about', title: 'About', subtitle: 'Tentang', aliases: ['tentang', 'bio', 'profil', 'profile'] },
  {
    to: '/#experiences',
    title: 'Experience',
    subtitle: 'Pengalaman',
    aliases: ['pengalaman', 'kerja', 'work', 'career', 'karier'],
  },
  {
    to: '/#projects',
    title: 'Projects',
    subtitle: 'Proyek',
    aliases: ['proyek', 'portofolio', 'portfolio', 'karya'],
  },
  {
    to: '/#skills',
    title: 'Skills',
    subtitle: 'Keahlian',
    aliases: ['keahlian', 'skill', 'stack', 'teknologi'],
  },
  {
    to: '/#education',
    title: 'Education',
    subtitle: 'Pendidikan',
    aliases: ['pendidikan', 'kuliah', 'kampus', 'sekolah'],
  },
  {
    to: '/#achievements',
    title: 'Achievements',
    subtitle: 'Pencapaian',
    aliases: ['pencapaian', 'sertifikat', 'penghargaan', 'certificate', 'award'],
  },
  {
    to: '/#contact',
    title: 'Contact',
    subtitle: 'Kontak',
    aliases: ['kontak', 'email', 'hubungi', 'hire', 'kerja sama'],
  },
]

/** Every page the router serves, tools included. */
const PAGES: StaticSurface[] = [
  { to: '/explore', title: 'Explore', subtitle: 'Jelajahi', aliases: ['jelajahi', 'katalog', 'index', 'daftar'] },
  { to: '/blogs', title: 'Blog', subtitle: 'Catatan', aliases: ['catatan', 'tulisan', 'artikel', 'posts'] },
  { to: '/quotes', title: 'Quotes', subtitle: 'Kutipan', aliases: ['kutipan', 'kata mutiara', 'quote'] },
  { to: '/snippets', title: 'Snippets', subtitle: 'Cuplikan', aliases: ['cuplikan', 'kode', 'code', 'vault'] },
  { to: '/links', title: 'Link Archive', subtitle: 'Arsip Tautan', aliases: ['arsip', 'tautan', 'bookmark', 'referensi'] },
  { to: '/feedback', title: 'Feedback', subtitle: 'Masukan', aliases: ['masukan', 'saran', 'kritik', 'pesan'] },
  {
    to: '/qr',
    title: 'QR Maker',
    subtitle: 'QR code generator',
    aliases: ['qr', 'qrcode', 'barcode', 'scan', 'qr code'],
  },
  {
    to: '/remove-bg',
    title: 'Background Remover',
    subtitle: 'Hapus latar foto',
    aliases: ['hapus latar', 'background', 'bg', 'removebg', 'foto'],
  },
  {
    to: '/json',
    title: 'JSON Formatter',
    subtitle: 'Format & validasi JSON',
    aliases: ['json', 'format', 'beautify', 'minify', 'validator', 'prettify'],
  },
  {
    to: '/base64',
    title: 'Base64',
    subtitle: 'Encode / decode Base64',
    aliases: ['base64', 'encode', 'decode', 'b64', 'base64url'],
  },
  {
    to: '/hash',
    title: 'Hash',
    subtitle: 'SHA-1 / 256 / 384 / 512',
    aliases: ['hash', 'sha', 'sha256', 'checksum', 'digest', 'md5'],
  },
  {
    to: '/uuid',
    title: 'UUID',
    subtitle: 'Generator UUID v4',
    aliases: ['uuid', 'guid', 'uuidv4', 'id generator'],
  },
  {
    to: '/timestamp',
    title: 'Timestamp',
    subtitle: 'Unix ↔ tanggal',
    aliases: ['timestamp', 'unix', 'epoch', 'tanggal', 'date', 'waktu', 'time'],
  },
  {
    to: '/jwt',
    title: 'JWT Decoder',
    subtitle: 'Baca header & payload',
    aliases: ['jwt', 'token', 'bearer', 'decode token', 'jose'],
  },
]

function toItem(surface: StaticSurface, index: number, kind: SearchItem['kind']): SearchItem {
  return {
    id: `static-${kind}-${index}`,
    kind,
    title: surface.title,
    subtitle: surface.subtitle,
    to: surface.to,
    // Aliases live in the body so a typed synonym ranks without the title
    // having to contain it.
    body: surface.aliases.join(' '),
    tags: surface.aliases,
  }
}

/** Sections first, then pages — the order the palette groups them in. */
export function staticItems(): SearchItem[] {
  return [
    ...SECTIONS.map((surface, i) => toItem(surface, i, 'section')),
    ...PAGES.map((surface, i) => toItem(surface, i, 'page')),
  ]
}
