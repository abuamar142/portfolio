export interface PersonalInfo {
  fullname: string
  nickname: string
  title: string
  email: string
  phone: string
  location: string
  github?: string
  linkedin?: string
  instagram?: string
  whatsApp?: string
  website?: string
}

export interface Experience {
  id: string
  company: string
  position: string
  duration: string
  description: string[]
  technologies?: string[]
}

export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  imageUrl?: string
}

export interface Skill {
  id: string
  name: string
  category: 'mobile' | 'web' | 'backend' | 'tools'
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  duration: string
  gpa?: string
}

export interface Achievement {
  id: string
  title: string
  organizer: string
  date: string
  type: 'certificate' | 'certification' | 'webinar' | 'seminar'
  drive_file_id: string
  certificate_number?: string
  participant_as?: string
  description?: string
  valid_until?: string
}

export interface Portfolio {
  personalInfo: PersonalInfo
  about: string
  experiences: Experience[]
  projects: Project[]
  skills: Skill[]
  education: Education[]
  achievements: Achievement[]
}
