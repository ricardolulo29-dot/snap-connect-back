export class User {
  constructor({ id, email, username, firstName, lastName, image, password, createdAt }) {
    this.id = id
    this.email = email
    this.username = username
    this.firstName = firstName
    this.lastName = lastName
    this.image = image
    this.password = password
    this.createdAt = createdAt
  }

  toJSON() {
    const { password: _password, ...userWithoutPassword } = this
    return userWithoutPassword
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`
  }

  static fromDatabase(dbUser) {
    return new User({
      id: dbUser.id,
      email: dbUser.email,
      username: dbUser.username,
      firstName: dbUser.first_name,
      lastName: dbUser.last_name,
      image: dbUser.image,
      password: dbUser.password,
      createdAt: dbUser.created_at,
    })
  }
}
