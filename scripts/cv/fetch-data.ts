import type {
  CvAchievement,
  CvData,
  CvEducation,
  CvExperience,
  CvPersonalInfo,
  CvSkill,
} from './types'

const BACKEND_URL = process.env.VITE_BACKEND_URL || 'https://backend.abuamar.online'
const ENDPOINT = `${BACKEND_URL.replace(/\/$/, '')}/api/v1/personal/data`

interface RawResponse {
  success: boolean
  message?: string
  data?: unknown
}

function str(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function strArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : []
}

function getData(body: RawResponse): Record<string, unknown> {
  const root = body.data as Record<string, unknown> | undefined
  // Backend returns { success, data: {...} }; tolerate a wrapped variant.
  const inner = root?.data as Record<string, unknown> | undefined
  const data = inner && typeof inner.personalInfo !== 'undefined' ? inner : root
  if (!data || typeof data !== 'object') throw new Error('CV data response has no data object')
  return data
}

/**
 * Fetch + validate the CMS payload into the CV contract. Throws on any
 * unexpected shape — a CV built from half-parsed data is worse than no CV.
 */
export async function fetchCvData(): Promise<CvData> {
  const res = await fetch(ENDPOINT, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`CV data fetch failed: HTTP ${res.status} from ${ENDPOINT}`)
  const body = (await res.json()) as RawResponse
  if (body.success === false) throw new Error(body.message || 'CV data API returned an error')
  const data = getData(body)

  const pi = data.personalInfo as Record<string, unknown> | undefined
  if (!pi || typeof pi.fullname !== 'string' || typeof pi.email !== 'string') {
    throw new Error('CV data is missing personalInfo.fullname/email')
  }
  const personalInfo: CvPersonalInfo = {
    fullname: pi.fullname,
    title: str(pi.title),
    email: pi.email,
    phone: str(pi.phone),
    location: str(pi.location),
    github: str(pi.github) || undefined,
    linkedin: str(pi.linkedin) || undefined,
    website: str(pi.website) || undefined,
    bio_en: str(pi.bio_en) || undefined,
  }

  const rawExp = Array.isArray(data.experiences) ? data.experiences : []
  const experiences: CvExperience[] = (rawExp as Record<string, unknown>[]).map((e) => ({
    company: str(e.company),
    position: str(e.position),
    duration: str(e.duration),
    description: strArray(e.description),
    technologies: strArray(e.technologies),
  }))

  const rawEdu = Array.isArray(data.education) ? data.education : []
  const education: CvEducation[] = (rawEdu as Record<string, unknown>[]).map((e) => ({
    institution: str(e.institution),
    degree: str(e.degree),
    field: str(e.field),
    duration: str(e.duration),
    gpa: str(e.gpa) || undefined,
  }))

  const rawAch = Array.isArray(data.achievements) ? data.achievements : []
  const achievements: CvAchievement[] = (rawAch as Record<string, unknown>[]).map((a) => ({
    title: str(a.title),
    organizer: str(a.organizer),
    date: str(a.date),
    type: str(a.type),
    valid_until: str(a.valid_until) || undefined,
  }))

  const rawSkills = Array.isArray(data.skills) ? data.skills : []
  const skills: CvSkill[] = (rawSkills as Record<string, unknown>[]).map((s) => ({
    name: str(s.name),
    category: s.category as CvSkill['category'],
    level: str(s.level),
  }))

  return { personalInfo, experiences, education, achievements, skills }
}
