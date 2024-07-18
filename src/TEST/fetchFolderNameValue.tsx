import { useState, useEffect } from 'react'
import axios from 'axios'

interface ResponseData {
  message: string
  folderName: string
}

const useFolderName = () => {
  const [folderName, setFolderName] = useState('')

  // Function to get a specific cookie by name
  const getCookieByName = (name: string) => {
    const cookies = document.cookie.split(';')
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=').map((c) => c.trim())
      if (cookieName === name) {
        return decodeURIComponent(cookieValue)
      }
    }
    return null
  }

  useEffect(() => {
    // Get the folderName cookie value
    const folderNameCookie = getCookieByName('folderName')
    console.log('folderName cookie value:', folderNameCookie)

    const fetchFolderName = async () => {
      try {
        const response = await axios.post<ResponseData>(
          'http://localhost:3001/user-file',
          {},
          {
            withCredentials: true,
          }
        )
        setFolderName(response.data.folderName)
      } catch (error) {
        console.error('Error fetching folder name:', error)
        setFolderName('Error: ' + (error as Error).message)
      }
    }

    fetchFolderName()
  }, [])

  return folderName
}

export default useFolderName
