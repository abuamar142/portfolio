import type { Portfolio } from '@/types/portfolio'

// Untuk development/testing, kita akan menggunakan fallback ke data lokal
// Karena MongoDB driver tidak bisa jalan di browser
// Nanti bisa diganti dengan REST API endpoint atau Data API MongoDB

async function fetchFromMongoDB(): Promise<Portfolio | null> {
  try {
    // TODO: Implementasi fetch dari MongoDB via REST API
    // Untuk sekarang return null agar fallback ke data lokal
    return null
  } catch (error) {
    console.error('Error fetching from MongoDB:', error)
    return null
  }
}

export async function fetchPortfolioData(): Promise<Portfolio> {
  try {
    // Coba ambil dari MongoDB
    const mongoData = await fetchFromMongoDB()
    if (mongoData) {
      return mongoData
    }

    // Fallback ke data lokal
    console.log('Using fallback data (local file)')
    const { portfolioData } = await import('@/data/portfolio')
    return portfolioData
  } catch (error) {
    console.error('Error fetching portfolio data:', error)
    // Ultimate fallback
    const { portfolioData } = await import('@/data/portfolio')
    return portfolioData
  }
}
