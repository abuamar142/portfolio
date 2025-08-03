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

console.log('🔍 Testing MongoDB Atlas connection...\n')

console.log('📋 Current Configuration:')
console.log(`MONGODB_URI: ${MONGODB_URI ? MONGODB_URI.substring(0, 50) + '...' : 'MISSING'}`)
console.log(`DATABASE: ${DATABASE}\n`)

if (!MONGODB_URI) {
  console.log('❌ Missing VITE_MONGODB_URI in .env.local')
  console.log('💡 Please add your MongoDB connection string to .env.local')
  console.log('📖 Format: VITE_MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/...')
  process.exit(1)
}

// Check if password is replaced
if (MONGODB_URI.includes('<password>') || MONGODB_URI.includes('<db_password>')) {
  console.log('❌ Please replace <password> with your actual database password')
  console.log('💡 Get your password from MongoDB Atlas > Database Access > Users')
  process.exit(1)
}

const client = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function testConnection() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...')

    // Connect the client to the server
    await client.connect()

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 })

    console.log('✅ Connected successfully!')

    // Test database access
    const db = client.db(DATABASE)
    const collections = await db.listCollections().toArray()

    console.log(`📊 Database '${DATABASE}' is accessible`)
    console.log(`📁 Collections found: ${collections.length}`)

    if (collections.length > 0) {
      console.log('   Existing collections:')
      collections.forEach((col) => console.log(`   • ${col.name}`))
    } else {
      console.log('   No collections yet (will be created during migration)')
    }

    console.log('\n🎉 MongoDB Atlas connection is working correctly!')
    console.log('🚀 You can now run: npm run migrate-direct')
  } catch (error) {
    console.log('❌ Connection failed!')

    if (error.message.includes('authentication failed')) {
      console.log('\n💡 Solution:')
      console.log('1. Check if username and password are correct')
      console.log('2. Make sure you replaced <password> with actual password')
      console.log('3. Check Database Access in MongoDB Atlas')
    } else if (error.message.includes('network')) {
      console.log('\n💡 Solution:')
      console.log('1. Check your internet connection')
      console.log('2. Check Network Access (IP Whitelist) in MongoDB Atlas')
      console.log('3. Add 0.0.0.0/0 to allow access from anywhere (for testing)')
    } else {
      console.log(`\n📝 Error: ${error.message}`)
    }
  } finally {
    await client.close()
  }
}

testConnection()
