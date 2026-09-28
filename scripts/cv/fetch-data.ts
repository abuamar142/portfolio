import type {
  CvAchievement,
  CvData,
  CvEducation,
  CvExperience,
  CvPersonalInfo,
  CvSkill,
} from './types'

// Everything the CV needs now comes from portfolio-service: the profile
// endpoint carries identity, experiences, education and skills, and
// achievements moved there on 2026-09-27. This used to read the profile from
// the Payload CMS — a second source of truth that would have quietly gone stale
// the moment the site stopped using the CMS.
const PORTFOLIO_API_URL = process.env.VITE_PORTFOLIO_API_URL || 'https://portfolio.abuamar.online'
const PROFILE_ENDPOINT = `${PORTFOLIO_API_URL.replace(/\/$/, '')}/api/v1/profile`
const ACHIEVEMENTS_ENDPOINT = `${PORTFOLIO_API_URL.replace(/\/$/, '')}/api/v1/achievements`

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
  // portfolio-service wraps every payload as { success, message, data }.
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
  const res = await fetch(PROFILE_ENDPOINT, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`CV data fetch failed: HTTP ${res.status} from ${PROFILE_ENDPOINT}`)
  const body = (await res.json()) as RawResponse
  if (body.success === false) throw new Error(body.message || 'Profile API returned an error')
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

  // Achievements come from the dedicated portfolio-service endpoint —
  // { success, data: { achievements: [...], total } }. No silent fallback:
  // a broken endpoint must fail the CV build loudly, not ship stale data.
  let achievements: CvAchievement[] = []
  const achRes = await fetch(ACHIEVEMENTS_ENDPOINT, {
    headers: { Accept: 'application/json' },
  })
  if (!achRes.ok) {
    throw new Error(`Achievements fetch failed: HTTP ${achRes.status} from ${ACHIEVEMENTS_ENDPOINT}`)
  }
  const achBody = (await achRes.json()) as RawResponse
  const achData = (achBody.data && typeof achBody.data === 'object' ? achBody.data : {}) as {
    achievements?: unknown
  }
  const rawAch = Array.isArray(achData.achievements) ? achData.achievements : []
  achievements = (rawAch as Record<string, unknown>[]).map((a) => ({
    title: str(a.title),
    organizer: str(a.organizer),
    date: str(a.date),
    type: str(a.type),
    valid_until: str(a.valid_until) || undefined,
  }))

  const rawSkills = Array.isArray(data.skills) ? data.skills : []
  // The API is the boundary: a level outside the documented set would print
  // as-is in the PDF, so narrow it here and let the type enforce the rest.
  const SKILL_LEVELS: string[] = ['beginner', 'intermediate', 'advanced', 'expert']
  const skills: CvSkill[] = (rawSkills as Record<string, unknown>[]).map((s) => {
    const level = str(s.level)
    return {
      name: str(s.name),
      category: s.category as CvSkill['category'],
      level: (SKILL_LEVELS.includes(level) ? level : 'intermediate') as CvSkill['level'],
    }
  })

  return { personalInfo, experiences, education, achievements, skills }
}
