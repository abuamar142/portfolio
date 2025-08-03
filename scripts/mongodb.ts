import { MongoClient, ServerApiVersion } from 'mongodb'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '../.env.local') })

const MONGODB_URI = process.env.VITE_MONGODB_URI
const DATABASE = process.env.VITE_MONGODB_DATABASE || 'portfolio'

if (!MONGODB_URI) {
  throw new Error('Missing VITE_MONGODB_URI in .env.local')
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

export async function connectToDatabase() {
  try {
    await client.connect()
    return client.db(DATABASE)
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    throw error
  }
}

export async function insertDocument(collection: string, document: any) {
  try {
    const db = await connectToDatabase()
    const result = await db.collection(collection).insertOne(document)
    console.log(`✅ Inserted document into ${collection}:`, result.insertedId)
    return result
  } catch (error) {
    console.error(`❌ Error inserting into ${collection}:`, error)
    throw error
  }
}

export async function closeConnection() {
  await client.close()
}
