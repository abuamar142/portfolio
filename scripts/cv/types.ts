/**
 * CV data contract — mirrors the CMS `/api/v1/personal/data` payload.
 * The generator fetches this shape, never hand-written values.
 */
export interface CvPersonalInfo {
  fullname: string
  title: string
  email: string
  phone: string
  location: string
  github?: string
  linkedin?: string
  website?: string
  bio_en?: string
}

export interface CvExperience {
  company: string
  position: string
  duration: string
  description: string[]
  technologies?: string[]
}

export interface CvEducation {
  institution: string
  degree: string
  field: string
  duration: string
  gpa?: string
}

export interface CvAchievement {
  title: string
  organizer: string
  date: string
  type: string
  valid_until?: string
}

export interface CvSkill {
  name: string
  category: 'mobile' | 'web' | 'backend' | 'tools'
  level: string
}

export interface CvData {
  personalInfo: CvPersonalInfo
  experiences: CvExperience[]
  education: CvEducation[]
  achievements: CvAchievement[]
  skills: CvSkill[]
}
