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
      title: 'Mobile Londri',
      description:
        'Aplikasi mobile manajemen laundry berbasis Flutter dan Supabase. Mendukung fitur pesanan, pelanggan, laporan keuangan, dan autentikasi pengguna.',
      technologies: ['Flutter', 'Supabase', 'Dart', 'PostgreSQL'],
      githubUrl: 'https://github.com/abuamar142/mobile-londri',
    },
    {
      id: '2',
      title: 'Coffee Plant Disease Detection App',
      description:
        'Aplikasi mobile untuk deteksi penyakit tumbuhan kopi menggunakan image classification dan machine learning. Dikembangkan sebagai proyek akhir Bangkit Academy dengan kolaborasi tim multidisiplin.',
      technologies: ['Kotlin', 'Jetpack Compose', 'TensorFlow', 'Android', 'Machine Learning'],
      githubUrl: 'https://github.com/abuamar142/coffeeClassifier',
    },
    {
      id: '3',
      title: 'JNE Landing Page',
      description:
        'Landing page modern dan responsif untuk JNE Express - perusahaan ekspedisi pengiriman barang terpercaya di Indonesia.',
      technologies: ['Vue.js', 'Tailwind CSS', 'TypeScript', 'SEO Optimization', 'Vercel'],
      liveUrl: 'https://www.jne.abuamar.site',
      githubUrl: 'https://github.com/abuamar142/jne-landing-page',
    },
    {
      id: '4',
      title: 'Pondok Pesantren Asy-Syaikhoni',
      description:
        "Website landing page modern dan elegan untuk Pondok Pesantren Tahfidzul Qur'an Asy-Syaikhoni di Nganjuk, Jawa Timur. Dibangun dengan desain islami menggunakan Vue.js 3 dan Tailwind CSS v4.",
      technologies: ['Vue.js', 'TypeScript', 'Tailwind CSS', 'Vite', 'SEO Optimization', 'Vercel'],
      liveUrl: 'https://www.asyaikhoni.abuamar.site',
      githubUrl: 'https://github.com/abuamar142/asyaikhoni',
    },
    {
      id: '5',
      title: 'Cashier App',
      description:
        'Aplikasi kasir (Point of Sale) berbasis Flutter untuk manajemen penjualan, pembelian, inventori, dan laporan keuangan. Dilengkapi dengan fitur draft penjualan, manajemen produk, supplier, dan sistem autentikasi pengguna.',
      technologies: ['Flutter', 'Dart', 'GetX', 'REST API', 'Database Management'],
      githubUrl: 'https://github.com/abuamar142/cashier_app',
    },
    {
      id: '6',
      title: 'My SADARI - Breast Self-Examination App',
      description:
        'Aplikasi Flutter untuk edukasi dan pengingat pemeriksaan payudara sendiri (SADARI). Dilengkapi dengan fitur notifikasi terjadwal, kuesioner penilaian, tutorial step-by-step, dan sistem autentikasi. Membantu meningkatkan awareness kesehatan wanita untuk deteksi dini kanker payudara.',
      technologies: ['Flutter', 'Dart', 'Firebase', 'Local Notifications', 'Authentication'],
      githubUrl: 'https://github.com/abuamar142/my_sadari',
    },
    {
      id: '7',
      title: 'Inget - Note Taking App',
      description:
        'Aplikasi pencatatan modern berbasis Flutter dengan state management Riverpod. Fitur offline storage, Material Design yang clean, dan interface yang intuitif untuk produktivitas maksimal dalam mencatat dan mengorganisir informasi.',
      technologies: [
        'Flutter',
        'Riverpod',
        'Material Design',
        'Offline Storage',
        'State Management',
      ],
      githubUrl: 'https://github.com/abuamar142/inget',
    },
    {
      id: '8',
      title: 'Agenda - Google Calendar Manager',
      description:
        'Aplikasi Flutter manajemen agenda terintegrasi dengan Google Calendar. Menggunakan Supabase OAuth untuk autentikasi, GetX untuk state management, dan clean architecture. Memungkinkan sinkronisasi seamless dengan Google Calendar untuk pengelolaan jadwal yang efektif.',
      technologies: ['Flutter', 'Google Calendar API', 'Supabase', 'GetX', 'Clean Architecture'],
      githubUrl: 'https://github.com/abuamar142/agenda',
    },
    {
      id: '9',
      title: 'N8N Local Automation Setup',
      description:
        'Setup Docker-based N8N workflow automation dengan konfigurasi Ngrok untuk tunneling lokal. Menyediakan environment automation lengkap untuk development dan testing workflow dengan akses eksternal yang aman.',
      technologies: ['Docker', 'N8N', 'Ngrok', 'Workflow Automation', 'Shell Scripts'],
      githubUrl: 'https://github.com/abuamar142/n8n-local',
    },
    {
      id: '10',
      title: 'MonkeyType CLI',
      description:
        'Aplikasi command-line interface berbasis Python untuk latihan typing speed test. Dioptimalkan khusus untuk Windows dengan interface yang user-friendly dan tracking progress untuk meningkatkan kecepatan dan akurasi mengetik.',
      technologies: ['Python', 'CLI', 'Windows Optimization', 'Performance Tracking'],
      githubUrl: 'https://github.com/abuamar142/monkeytype-cli',
    },
    {
      id: '11',
      title: 'Liat Menu - Restaurant Platform',
      description:
        'Platform web modern untuk discovery warung dan restoran menggunakan Next.js dan Supabase. Fitur pencarian, filter kategori, review sistem, autentikasi pengguna, dashboard admin, dan responsive design. Dilengkapi dengan dark/light mode dan real-time data.',
      technologies: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS', 'shadcn/ui'],
      liveUrl: 'https://liat-menu.abuamar.site',
      githubUrl: 'https://github.com/abuamar142/liat-menu',
    },
  ],
  skills: [
    // Mobile Development
    { id: '1', name: 'Flutter', category: 'mobile', level: 'expert' },
    { id: '2', name: 'Dart', category: 'mobile', level: 'expert' },
    { id: '3', name: 'Kotlin', category: 'mobile', level: 'advanced' },
    { id: '4', name: 'Android', category: 'mobile', level: 'advanced' },

    // Web Development
    { id: '5', name: 'React', category: 'web', level: 'advanced' },
    { id: '6', name: 'Vue.js', category: 'web', level: 'advanced' },
    { id: '7', name: 'JavaScript', category: 'web', level: 'advanced' },
    { id: '8', name: 'TypeScript', category: 'web', level: 'advanced' },
    { id: '9', name: 'HTML5', category: 'web', level: 'expert' },
    { id: '10', name: 'CSS3', category: 'web', level: 'expert' },
    { id: '11', name: 'Tailwind CSS', category: 'web', level: 'expert' },
    { id: '12', name: 'Bootstrap', category: 'web', level: 'advanced' },
    { id: '13', name: 'API Integration (REST)', category: 'web', level: 'expert' },

    // Backend
    { id: '14', name: 'Supabase', category: 'backend', level: 'expert' },
    { id: '15', name: 'Database Schema Design', category: 'backend', level: 'expert' },

    // Tools & DevOps
    { id: '16', name: 'Git & GitHub', category: 'tools', level: 'expert' },
    { id: '17', name: 'GitHub Actions (CI/CD)', category: 'tools', level: 'advanced' },
    { id: '18', name: 'Vercel', category: 'tools', level: 'advanced' },
    { id: '19', name: 'Linux', category: 'tools', level: 'expert' },
    { id: '20', name: 'Google Sheets / Excel', category: 'tools', level: 'expert' },
    { id: '21', name: 'OOP & Design Patterns', category: 'tools', level: 'advanced' },
    { id: '22', name: 'C4 Model Documentation', category: 'tools', level: 'advanced' },
    { id: '23', name: 'API Contract (Postman/Swagger)', category: 'tools', level: 'advanced' },
    { id: '24', name: 'Machine Learning', category: 'tools', level: 'intermediate' },
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
