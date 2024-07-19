import crypto from 'crypto'

// Generate hash function
export function generateHash() {
  const current_time = new Date().getTime().toString()
  const random = Math.random().toString()
  return crypto
    .createHash('md5')
    .update(current_time + random)
    .digest('hex')
}
