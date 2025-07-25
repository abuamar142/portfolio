export interface PersonalInfo {
  name: string
  title: string
  email: string
  phone: string
  location: string
  linkedin?: string
  github?: string
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
  category: 'frontend' | 'backend' | 'database' | 'tools' | 'other'
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

export interface Portfolio {
  personalInfo: PersonalInfo
  about: string
  experiences: Experience[]
  projects: Project[]
  skills: Skill[]
  education: Education[]
}
