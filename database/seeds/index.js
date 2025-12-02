import { seedUsers } from './users.seed.js'
import { pool } from '../pool.js'

const runSeeds = async () => {
  try {
    await seedUsers()
    console.log('✅ All seeds applied!')
  } catch (err) {
    console.error('❌ Seeding failed:', err)
  } finally {
    await pool.end()
  }
}

runSeeds()
