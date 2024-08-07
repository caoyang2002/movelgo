// 获取文件夹名称
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FILE_PORT, HOST_IP } from 'src/components/port'
interface ResponseData {
  message: string
  folderName: string
}

const FetchFloderNameByCookie: React.FC = () => {
  const [responseText, setResponseText] = useState<string>('')
  const [cookieValue, setCookieValue] = useState<string | null>(null)

  // useEffect(() => {
  //   const loadCookies = () => {
  //     console.log('cookie is', document.cookie)
  //     const cookies = document.cookie
  //       .split(';')
  //       .reduce((acc: { [key: string]: string | undefined }, cookie) => {
  //         const parts = cookie.split('=')
  //         const key = parts[0].trim()
  //         const value = decodeURIComponent(parts[1])
  //         acc[key] = value
  //         return acc
  //       }, {})
  //     setCookieValue(cookies['folderNamee'] || null)
  //     console.log('userFolder cookie value:', cookies['folderName'])
  //   }
  //   loadCookies()
  // }, [])

  const getCookieByName = (name: string): string | null => {
    const cookies = document.cookie.split(';')
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=').map((c) => c.trim())
      if (cookieName === name) {
        console.log('[INFO] cookie name')
        return decodeURIComponent(cookieValue)
      }
    }
    return null
  }

  // 在useEffect中使用这个函数
  useEffect(() => {
    const loadCookies = () => {
      const folderName = getCookieByName('userFolder')
      console.log('[INFO] folderName cookie value:', folderName)
      setCookieValue(folderName)
    }
    loadCookies()
  }, [])

  const fetchUserData = async () => {
    console.log('[INFO] cookie is', document.cookie.split(';'))
    try {
      const response = await axios.post<ResponseData>(
        `http://${HOST_IP}:${FILE_PORT}/user-file`,
        {
          withCredentials: true,
          credentials: 'include', // 确保请求携带cookie
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
        className="mb-1 mt-1 ml-2 px-4 pt-1 pb-1 py-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-700 active:bg-blue-800"
        onClick={fetchUserData}
      >
        test: 通过 cookie 获取文件夹名称
      </button>
      {cookieValue && <p>Cookie: userFolder={cookieValue}</p>}
      {responseText && <p>Response: {responseText.replace('Message: ', '')}</p>}
    </div>
  )
}

export default FetchFloderNameByCookie
