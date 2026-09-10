/**
 * Site-owned identity.
 *
 * The CMS `personalInfo` payload currently comes back empty, so this file — not
 * the API — is the single source of truth for name, contact details, and
 * profile links. Values below are taken from the CV in `public/cv.pdf`.
 */
export const profile = {
  name: 'M. Abu Amar Al Badawi',
  shortName: 'Abu Amar',
  initials: 'AA',
  role: 'Mobile & Full Stack Developer',
  email: 'abuamar.albadawi@gmail.com',
  phone: '+62 815 2047 1914',
  phoneHref: 'tel:+6281520471914',
  whatsapp: 'https://wa.me/6281520471914',
  location: 'Bantul, Yogyakarta, Indonesia',
  timeZone: 'Asia/Jakarta',
  timeZoneLabel: 'WIB (UTC+7)',
  resume: '/cv.pdf',
  social: {
    github: 'https://github.com/abuamar142',
    githubHandle: '@abuamar142',
    linkedin: 'https://linkedin.com/in/abu-amar',
    linkedinHandle: 'in/abu-amar',
    instagram: 'https://instagram.com/abuuamar_',
    instagramHandle: '@abuuamar_',
  },
} as const
