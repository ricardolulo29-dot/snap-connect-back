import { pool } from '../pool.js'

export const seedUsers = async () => {
  console.log('Seeding users...')
  const users = [
    {
      first_name: 'Carlos',
      last_name: 'Carmona',
      username: 'ccarmona',
      email: 'ccarmona@example.com',
      password: '12345',
    },
    {
      first_name: 'Laura',
      last_name: 'García',
      username: 'lgarcia',
      email: 'lgarcia@example.com',
      password: '12345',
    },
    {
      first_name: 'Juan',
      last_name: 'Casas',
      username: 'jcasas',
      email: 'jcasas@example.com',
      password: '12345',
    },
  ]

  for (const user of users) {
    await pool.query(
      'INSERT INTO users (first_name, last_name, username, email, password) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (email) DO NOTHING',
      [user.first_name, user.last_name, user.username, user.email, user.password]
    )
  }

  console.log('Users seeded!')
}
