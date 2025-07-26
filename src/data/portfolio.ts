import type { Portfolio } from '@/types/portfolio'

export const portfolioData: Portfolio = {
  personalInfo: {
    fullname: 'M. Abu Amar Al Badawi',
    nickname: 'Abu Amar',
    title: 'Software Engineer',
    email: 'abuamar.albadawi@gmail.com',
    phone: '+62 815 2047 1914',
    location: 'Bantul, Indonesia',
    github: 'https://github.com/abuamar142',
    linkedin: 'https://www.linkedin.com/in/abu-amar/',
    instagram: 'https://www.instagram.com/abuuamar_/',
    whatsApp: 'https://wa.me/6281520471914',
    website: 'https://abuamar.site',
  },
  about: `Mahasiswa Informatika semester 8 di Universitas Jenderal Achmad Yani Yogyakarta dengan minat kuat di bidang Mobile Development. Memiliki pengalaman magang hampir satu tahun sebagai Full-Stack Software Engineer di software house Refactory, serta menjadi peserta program Bangkit 2024 (Google x Kampus Merdeka) dengan learning path Mobile Development.

  Terbiasa mengembangkan aplikasi menggunakan Flutter, Supabase, dan React, serta memahami alur pengembangan perangkat lunak dari perencanaan (C4 Model, API Contract) hingga deployment (GitHub Actions). Aktif dalam organisasi kampus dan nasional seperti HMIF dan PERMIKOMNAS, serta memiliki pengalaman manajerial di bidang keuangan dan kepanitiaan.`,
  experiences: [
    {
      id: '1',
      company: 'Refactory',
      position: 'Full Stack Software Engineer (Magang)',
      duration: '07/2024 - 05/2025',
      description: [
        'Mengikuti program untuk pengembangan proyek full-stack, mulai dari perencanaan hingga deployment',
        'Menyusun dokumentasi teknis seperti C4 Model, database schema, dan API contract untuk kebutuhan project',
        'Mengembangkan aplikasi mobile (Flutter), web (React), dan backend (Supabase dan Raiden) sesuai standar industri',
        'Mengimplementasikan CI/CD pipeline menggunakan GitHub Actions untuk otomatisasi proses build dan deploy',
        'Mengimplementasikan praktik software engineering mulai dari penggunaan OOP, algoritma, dan design pattern',
        'Bekerja sama membuat proyek dengan tim menggunakan tools seperti GitHub dan workboard',
      ],
      technologies: ['Flutter', 'React', 'Supabase', 'GitHub Actions', 'Linux', 'OOP'],
    },
    {
      id: '2',
      company: 'Bangkit Academy led by Google, GoTo, & Traveloka',
      position: 'Mobile Development Cohort',
      duration: '02/2024 - 07/2024',
      description: [
        'Mengikuti program pelatihan intensif selama 6 bulan dengan fokus pada Mobile Development (Android) menggunakan Kotlin dan Jetpack Compose',
        'Mendalami konsep software engineering, UI/UX design, dan cloud computing sebagai bagian dari kurikulum interdisipliner',
        'Mengembangkan proyek akhir berupa aplikasi deteksi penyakit tumbuhan kopi melalui image classification menggunakan teknologi AI',
        'Berkolaborasi dalam tim multidisiplin (Mobile, Cloud, ML) untuk merancang dan membangun solusi nyata berbasis teknologi',
        'Lulus sertifikasi internal Bangkit dan mendapatkan pengakuan langsung dari Google & Kampus Merdeka',
      ],
      technologies: ['Kotlin', 'Jetpack Compose', 'Android', 'Machine Learning', 'Cloud Computing'],
    },
    {
      id: '3',
      company: 'PERMIKOMNAS Wilayah 8 – Yogyakarta',
      position: 'Bendahara Wilayah',
      duration: '2023 - 2024',
      description: [
        'Menangani pengelolaan keuangan organisasi di tingkat wilayah secara transparan dan bertanggung jawab',
        'Menjadi penanggung jawab atas pelaksanaan program kerja Divisi BPD selama menjabat sebagai bendahara',
        'Membuat laporan keuangan kegiatan dan memastikan efisiensi penggunaan dana pada berbagai program wilayah',
        'Mengelola proyek produksi lanyard, ID card, dan jaket PERMIKOMNAS dari tahap perencanaan hingga distribusi',
      ],
      technologies: ['Google Sheets', 'Financial Management', 'Project Management'],
    },
  ],
  projects: [
    {
      id: '1',
      title: 'Coffee Plant Disease Detection App',
      description:
        'Aplikasi mobile untuk deteksi penyakit tumbuhan kopi menggunakan image classification dan machine learning. Dikembangkan sebagai proyek akhir Bangkit Academy dengan kolaborasi tim multidisiplin.',
      technologies: ['Kotlin', 'Jetpack Compose', 'TensorFlow', 'Android', 'Machine Learning'],
      githubUrl: 'https://github.com/abuamar142',
    },
    {
      id: '2',
      title: 'Full-Stack Mobile & Web Application',
      description:
        'Pengembangan aplikasi full-stack dengan mobile app menggunakan Flutter dan web app menggunakan React, terintegrasi dengan backend Supabase dan CI/CD pipeline.',
      technologies: ['Flutter', 'React', 'Supabase', 'GitHub Actions', 'Dart', 'JavaScript'],
      githubUrl: 'https://github.com/abuamar142',
    },
    {
      id: '3',
      title: 'Organization Management System',
      description:
        'Sistem manajemen organisasi untuk mengelola keuangan, anggota, dan kegiatan organisasi. Menggunakan Google Sheets sebagai database dan sistem pelaporan.',
      technologies: ['Google Sheets', 'Apps Script', 'Financial Management'],
      githubUrl: 'https://github.com/abuamar142',
    },
  ],
  skills: [
    // Mobile Development
    { id: '1', name: 'Flutter', category: 'frontend', level: 'expert' },
    { id: '2', name: 'Dart', category: 'frontend', level: 'expert' },
    { id: '3', name: 'Kotlin', category: 'frontend', level: 'advanced' },
    { id: '4', name: 'Android', category: 'frontend', level: 'advanced' },
    { id: '5', name: 'Jetpack Compose', category: 'frontend', level: 'advanced' },

    // Web Development
    { id: '6', name: 'React', category: 'frontend', level: 'advanced' },
    { id: '7', name: 'JavaScript', category: 'frontend', level: 'advanced' },
    { id: '8', name: 'HTML5', category: 'frontend', level: 'expert' },
    { id: '9', name: 'CSS3', category: 'frontend', level: 'expert' },

    // Backend & Database
    { id: '10', name: 'Supabase', category: 'backend', level: 'expert' },
    { id: '11', name: 'API Integration (REST)', category: 'backend', level: 'expert' },
    { id: '12', name: 'Database Schema Design', category: 'database', level: 'expert' },

    // Tools & DevOps
    { id: '13', name: 'Git & GitHub', category: 'tools', level: 'expert' },
    { id: '14', name: 'GitHub Actions (CI/CD)', category: 'tools', level: 'advanced' },
    { id: '15', name: 'Linux', category: 'tools', level: 'expert' },
    { id: '16', name: 'Google Sheets / Excel', category: 'tools', level: 'expert' },

    // Software Engineering
    { id: '17', name: 'OOP & Design Patterns', category: 'other', level: 'advanced' },
    { id: '18', name: 'C4 Model Documentation', category: 'other', level: 'advanced' },
    { id: '19', name: 'API Contract (Postman/Swagger)', category: 'other', level: 'advanced' },
    { id: '20', name: 'Machine Learning', category: 'other', level: 'intermediate' },
  ],
  education: [
    {
      id: '1',
      institution: 'Universitas Jenderal Achmad Yani Yogyakarta',
      degree: 'Sarjana (S1)',
      field: 'Informatika',
      duration: '2021 - Saat ini',
      gpa: 'Semester 8',
    },
    {
      id: '2',
      institution: 'Pondok Pesantren Al-Munawwir Krapyak',
      degree: 'Pendidikan Agama',
      field: 'Komplek Madrasah Huffadh 2',
      duration: '2021 - Saat ini',
    },
    {
      id: '3',
      institution: 'MAN 2 Kabupaten Kediri',
      degree: 'SMA',
      field: 'Kelas PDCI (Peserta Didik Cerdas Istimewa)',
      duration: '2017 - 2019',
      gpa: 'Lulus 2 tahun',
    },
  ],
}
