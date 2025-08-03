import { portfolioData } from '../src/data/portfolio'
import { insertDocument, closeConnection } from './mongodb'

async function migrate() {
  try {
    console.log('🚀 Starting migration to MongoDB Atlas...')

    // Insert personal info
    console.log('📝 Inserting personal info...')
    await insertDocument('personalInfo', {
      ...portfolioData.personalInfo,
      about: portfolioData.about,
      created_at: new Date(),
      updated_at: new Date(),
    })

    // Insert experiences
    console.log('💼 Inserting experiences...')
    for (let i = 0; i < portfolioData.experiences.length; i++) {
      await insertDocument('experiences', {
        ...portfolioData.experiences[i],
        order_index: i,
        created_at: new Date(),
      })
    }

    // Insert projects
    console.log('🔧 Inserting projects...')
    for (let i = 0; i < portfolioData.projects.length; i++) {
      await insertDocument('projects', {
        ...portfolioData.projects[i],
        order_index: i,
        created_at: new Date(),
      })
    }

    // Insert skills
    console.log('🛠️ Inserting skills...')
    for (let i = 0; i < portfolioData.skills.length; i++) {
      await insertDocument('skills', {
        ...portfolioData.skills[i],
        order_index: i,
        created_at: new Date(),
      })
    }

    // Insert education
    console.log('🎓 Inserting education...')
    for (let i = 0; i < portfolioData.education.length; i++) {
      await insertDocument('education', {
        ...portfolioData.education[i],
        order_index: i,
        created_at: new Date(),
      })
    }

    // Insert achievements
    console.log('🏆 Inserting achievements...')
    for (let i = 0; i < portfolioData.achievements.length; i++) {
      await insertDocument('achievements', {
        ...portfolioData.achievements[i],
        order_index: i,
        created_at: new Date(),
      })
    }

    console.log('🎉 Migration completed successfully!')
    console.log('📊 Data migrated:')
    console.log(`   • 1 personal info`)
    console.log(`   • ${portfolioData.experiences.length} experiences`)
    console.log(`   • ${portfolioData.projects.length} projects`)
    console.log(`   • ${portfolioData.skills.length} skills`)
    console.log(`   • ${portfolioData.education.length} education records`)
    console.log(`   • ${portfolioData.achievements.length} achievements`)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await closeConnection()
  }
}

// Run migration
migrate()
