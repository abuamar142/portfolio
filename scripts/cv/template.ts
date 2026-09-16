import type { CvData } from './types'

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function fmtDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  if (!m) return iso
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ]
  return `${months[Number(m[2]) - 1]} ${m[1]}`
}

function contactLine(items: string[]): string {
  return items
    .filter(Boolean)
    .map((item) => `<span>${esc(item)}</span>`)
    .join('<span class="sep"> · </span>')
}

/**
 * ATS-friendly single-column CV. English only (the file employers download).
 * Plain CSS, no external assets — must render identically in headless print.
 */
export function renderCvHtml(data: CvData): string {
  const pi = data.personalInfo
  const contacts = [
    pi.email,
    pi.phone,
    pi.location,
    pi.github?.replace(/^https?:\/\//, '') ?? '',
    pi.linkedin?.replace(/^https?:\/\//, '') ?? '',
    pi.website?.replace(/^https?:\/\//, '') ?? '',
  ]

  const experience = data.experiences
    .map(
      (e) => `
      <section class="job">
        <div class="job-head">
          <div><strong>${esc(e.position)}</strong> — ${esc(e.company)}</div>
          <div class="date">${esc(e.duration)}</div>
        </div>
        <ul>
          ${e.description.map((d) => `<li>${esc(d)}</li>`).join('')}
        </ul>
        ${e.technologies?.length ? `<p class="tech">${esc(e.technologies.join(', '))}</p>` : ''}
      </section>`,
    )
    .join('')

  const education = data.education
    .map(
      (e) => `
      <section class="edu">
        <div class="job-head">
          <div><strong>${esc(e.institution)}</strong></div>
          <div class="date">${esc(e.duration)}</div>
        </div>
        <p>${esc([e.degree, e.field].filter(Boolean).join(' — '))}${e.gpa ? ` · GPA ${esc(e.gpa)}` : ''}</p>
      </section>`,
    )
    .join('')

  const certificates = data.achievements.filter((a) => a.type === 'certificate')
  const certs = certificates
    .map((a) => {
      // Organizer often embeds a collaboration suffix ("Dicoding | Bangkit ..."):
      // keep the card to one line by splitting it off.
      const [orgHead, ...orgRest] = a.organizer.split('|').map((s) => s.trim())
      const orgTail = orgRest.join(' | ')
      return `
      <section class="cert">
        <div class="job-head">
          <div><strong>${esc(a.title)}</strong> — ${esc(orgHead)}${orgTail ? ` <span class="org-tail">| ${esc(orgTail)}</span>` : ''}</div>
          <div class="date">${esc(fmtDate(a.date))}${a.valid_until ? ` – ${esc(fmtDate(a.valid_until))}` : ''}</div>
        </div>
      </section>`
    })
    .join('')


  const skillGroups: { key: string; label: string }[] = [
    { key: 'mobile', label: 'Mobile' },
    { key: 'web', label: 'Web' },
    { key: 'backend', label: 'Backend' },
    { key: 'tools', label: 'Tools' },
  ]
  const skills = skillGroups
    .map((g) => {
      const names = data.skills.filter((s) => s.category === g.key).map((s) => s.name)
      if (!names.length) return ''
      return `<p class="skill-row"><strong>${g.label}:</strong> ${esc(names.join(', '))}</p>`
    })
    .join('')

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${esc(pi.fullname)} — CV</title>
<style>
  @page { size: A4; margin: 16mm 15mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Georgia, 'Times New Roman', serif; font-size: 11pt; line-height: 1.45; color: #111; }
  header { text-align: center; border-bottom: 2px solid #111; padding-bottom: 10px; margin-bottom: 14px; }
  h1 { font-size: 22pt; letter-spacing: 0.5px; }
  .title { font-size: 12pt; color: #333; margin-top: 2px; }
  .contacts { font-size: 9pt; color: #333; margin-top: 6px; }
  .sep { color: #888; }
  h2 { font-size: 12pt; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px solid #999; margin: 16px 0 8px; padding-bottom: 3px; }
  .summary { font-size: 10.5pt; }
  .job, .edu, .cert { margin-bottom: 9px; }
  ul { margin: 4px 0 0 18px; font-size: 10.5pt; }
  li { margin-bottom: 2px; }
  .org-tail { color: #555; font-size: 9.5pt; }
  .tech { font-size: 9.5pt; color: #444; margin-top: 3px; }
  .edu p, .skill-row { font-size: 10.5pt; margin-top: 2px; }
</style>
</head>
<body>
  <header>
    <h1>${esc(pi.fullname)}</h1>
    <p class="title">${esc(pi.title)}</p>
    <p class="contacts">${contactLine(contacts)}</p>
  </header>
  ${pi.bio_en ? `<h2>Summary</h2><p class="summary">${esc(pi.bio_en)}</p>` : ''}
  <h2>Experience</h2>${experience}
  <h2>Education</h2>${education}
  ${certs ? `<h2>Certifications</h2>${certs}` : ''}
  ${skills ? `<h2>Skills</h2>${skills}` : ''}
</body>
</html>`
}
