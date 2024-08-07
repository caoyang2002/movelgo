// 获取文件夹名称
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FILE_PORT, HOST_IP } from '../components/port'

interface ResponseData {
  message: string
  folderName: string
}

const FetchFloderNameByCookie: React.FC = () => {
  const [responseText, setResponseText] = useState<string>('')
  const [cookieValue, setCookieValue] = useState<string | null>(null)

  useEffect(() => {
    const loadCookies = () => {
      console.log('cookie is', document.cookie)
      const cookies = document.cookie
        .split(';')
        .reduce((acc: { [key: string]: string | undefined }, cookie) => {
          const parts = cookie.split('=')
          const key = parts[0].trim()
          const value = decodeURIComponent(parts[1])
          acc[key] = value
          return acc
        }, {})
      setCookieValue(cookies['userFolder'] || null)
      console.log('userFolder cookie value:', cookies['userFolder'])
    }
    loadCookies()
  }, [])

  const fetchUserData = async () => {
    console.log('cookie is', document.cookie.split(';'))
    try {
      const response = await axios.get<ResponseData>(
        `http://${HOST_IP}:${FILE_PORT}/user-file`,
        {
          withCredentials: true,
        }
      )
      setResponseText(
        `Message: ${response.data.message}, Folder Name: ${response.data.folderName}`
      )
    } catch (error) {
      console.error('Error fetching user data:', error)
      setResponseText('Error: ' + (error as Error).message)
    }
  }

  return (
    <div>
      <button
        className="mt-1 mb-1 ml-2 px-4 pt-1 pb-1 py-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-700 active:bg-blue-800"
        onClick={fetchUserData}
      >
        tset: 获取文件夹
      </button>
      {cookieValue && <p>Cookie: userFolder={cookieValue}</p>}
      {responseText && <p>Response: {responseText.replace('Message: ', '')}</p>}
    </div>
  )
}

export default FetchFloderNameByCookie
