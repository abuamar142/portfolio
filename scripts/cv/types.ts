/**
 * CV data contract.
 *
 * The generator reads the same profile the site does (`/api/v1/profile` from
 * portfolio-service), so these are derived from the site types rather than
 * re-declared: two parallel copies silently drift whenever the API shape
 * changes, and the CV is only noticed as broken when someone opens the PDF.
 *
 * `Pick` keeps the CV's narrower needs explicit — it renders a subset of the
 * fields and must not start depending on ones it does not print.
 */
import type { PersonalInfo, Experience, Education, Skill } from '../../src/types/portfolio'

/** Fields the ATS layout prints from the personal-info block. */
export type CvPersonalInfo = Pick<
  PersonalInfo,
  'fullname' | 'title' | 'email' | 'phone' | 'location' | 'github' | 'linkedin' | 'website' | 'bio_en'
>

export type CvExperience = Pick<
  Experience,
  'company' | 'position' | 'duration' | 'description' | 'technologies'
>

export type CvEducation = Pick<Education, 'institution' | 'degree' | 'field' | 'duration' | 'gpa'>

/**
 * The CV prints achievements without their media/id bookkeeping, so this one
 * stays a local shape — it is the API row minus the fields the PDF ignores.
 */
export interface CvAchievement {
  title: string
  organizer: string
  date: string
  type: string
  valid_until?: string
}

export type CvSkill = Pick<Skill, 'name' | 'category' | 'level'>

export interface CvData {
  personalInfo: CvPersonalInfo
  experiences: CvExperience[]
  education: CvEducation[]
  achievements: CvAchievement[]
  skills: CvSkill[]
}
