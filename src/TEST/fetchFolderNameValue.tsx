// useFolderName.js
import { useState, useEffect } from 'react'
import axios from 'axios'

interface ResponseData {
  message: string
  folderName: string
}

const useFolderName = () => {
  const [folderName, setFolderName] = useState('')

  useEffect(() => {
    const fetchFolderName = async () => {
      try {
        const response = await axios.post<ResponseData>(
          'http://localhost:3001/user-file',
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
