import express, { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'

const app = express()
const PORT = 3000

app.use(express.json()) // for parsing application/json

const usersDir = path.join(__dirname, '../users')

// Create user folder
app.post('/create-folder', (req: Request, res: Response) => {
  const folderName = `user_${Math.random().toString(36).substr(2, 9)}`
  const folderPath = path.join(usersDir, folderName)

  fs.mkdir(folderPath, (err) => {
    if (err) {
      return res.status(500).send('Error creating folder')
    }
    res.send({ folderName })
  })
})

// Delete user folder
app.delete('/delete-folder/:folderName', (req: Request, res: Response) => {
  const { folderName } = req.params
  const folderPath = path.join(usersDir, folderName)

  fs.rmdir(folderPath, (err) => {
    if (err) {
      return res.status(500).send('Error deleting folder')
    }
    res.send({ message: 'Folder deleted' })
  })
})

let activeUsers: {
  [userId: string]: { lastActive: number; folderName: string }
} = {}

setInterval(() => {
  const now = Date.now()

  Object.keys(activeUsers).forEach((userId) => {
    const { lastActive, folderName } = activeUsers[userId]
    if (now - lastActive > 5 * 60 * 1000) {
      // 5 minutes
      const folderPath = path.join(usersDir, folderName)
      fs.rmdir(folderPath, (err) => {
        if (err) {
          console.error('Error deleting folder:', err)
        }
      })

      delete activeUsers[userId]
      console.log(`User ${userId} disconnected, folder deleted`)
    }
  })
}, 60 * 1000) // check every minute

app.post('/user-activity', (req: Request, res: Response) => {
  const { userId } = req.body
  if (activeUsers[userId]) {
    activeUsers[userId].lastActive = Date.now()
  } else {
    activeUsers[userId] = { lastActive: Date.now(), folderName: 'default' }
  }
  res.send({ message: 'User activity updated' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
