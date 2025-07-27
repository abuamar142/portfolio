import { supabase } from '@/lib/supabase'
import type { Portfolio } from '@/types/portfolio'

interface SupabasePortfolioResponse {
  id: string
  name: string
  description: string
  data: Portfolio
  created_at: string
  updated_at: string
}

class PortfolioService {
  private static instance: PortfolioService
  private cache: Portfolio | null = null
  private cacheTimestamp: number = 0
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds
  private readonly PROJECT_ID =
    import.meta.env.VITE_PORTFOLIO_PROJECT_ID || '46f6c178-166d-46fc-b5b1-ab2cb274b73d'

  public static getInstance(): PortfolioService {
    if (!PortfolioService.instance) {
      PortfolioService.instance = new PortfolioService()
    }
    return PortfolioService.instance
  }

  private isCacheValid(): boolean {
    const now = Date.now()
    return this.cache !== null && now - this.cacheTimestamp < this.CACHE_DURATION
  }

  private async fetchFromSupabase(): Promise<Portfolio> {
    try {
      console.log('Fetching portfolio data from Supabase...')

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', this.PROJECT_ID)
        .single()

      if (error) {
        throw new Error(`Supabase error: ${error.message}`)
      }

      if (!data) {
        throw new Error('No portfolio data found')
      }

      const portfolioData = data as SupabasePortfolioResponse

      // Update cache
      this.cache = portfolioData.data
      this.cacheTimestamp = Date.now()

      console.log('Portfolio data fetched and cached successfully')
      return portfolioData.data
    } catch (error) {
      console.error('Error fetching portfolio data:', error)

      // Return fallback data if available
      if (this.cache) {
        console.log('Using cached data as fallback')
        return this.cache
      }

      // If no cache available, return default/empty portfolio
      throw error
    }
  }

  public async getPortfolioData(): Promise<Portfolio> {
    // Return cached data if valid
    if (this.isCacheValid()) {
      console.log('Using cached portfolio data')
      return this.cache!
    }

    // Fetch fresh data from Supabase
    return await this.fetchFromSupabase()
  }

  public clearCache(): void {
    this.cache = null
    this.cacheTimestamp = 0
    console.log('Portfolio cache cleared')
  }

  public async refreshData(): Promise<Portfolio> {
    this.clearCache()
    return await this.fetchFromSupabase()
  }
}

export const portfolioService = PortfolioService.getInstance()
