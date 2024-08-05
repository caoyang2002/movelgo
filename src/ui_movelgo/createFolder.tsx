// import React, { useState } from 'react'
// import axios from 'axios'

// interface PostData {
//   content: string
// }

// interface ResponseData {
//   message: string
//   folderName: string
// }

// const CreateFolder: React.FC = () => {
//   const [inputValue, setInputValue] = useState<string>('')
//   const [responseText, setResponseText] = useState<string>('')
//   const [cookieValue, setCookieValue] = useState<string | null>(null)

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setInputValue(e.target.value)
//   }

//   const getCookie = (name: string): string | null => {
//     const cookies = document.cookie.split(';')
//     for (let i = 0; i < cookies.length; i++) {
//       const cookie = cookies[i].trim()
//       if (cookie.startsWith(name + '=')) {
//         return cookie.split('=')[1]
//       }
//     }
//     return null
//   }

//   const createFolder = async () => {
//     try {
//       const postData: PostData = { content: inputValue }
//       const response = await axios.post<ResponseData>(
//         'http://localhost:3001/user-file',
//         postData
//       )
//       setResponseText(
//         `Message: ${response.data.message}, Folder Name: ${response.data.folderName}`
//       )
//       const folderNameCookie = getCookie('userFolder')
//       if (folderNameCookie) {
//         setCookieValue(folderNameCookie)
//       }
//     } catch (error) {
//       console.error('Error posting data:', error)
//       setResponseText('Error: ' + (error as Error).message)
//     }
//   }

//   const fetchUserData = async () => {
//     try {
//       const userFolderCookie = cookieValue
//       if (userFolderCookie) {
//         const response = await axios.get(`http://localhost:3001`)
//         setResponseText(response.data)
//       } else {
//         setResponseText('No userFolder cookie found.')
//       }
//     } catch (error) {
//       console.error('Error fetching user data:', error)
//       setResponseText('Error: ' + (error as Error).message)
//     }
//   }

//   return (
//     <div>
//       <input
//         type="text"
//         value={inputValue}
//         onChange={handleInputChange}
//         placeholder="Enter some text"
//         className="bg-black"
//       />
//       <button onClick={createFolder} className="bg-black">
//         Submit
//       </button>
//       <button onClick={fetchUserData} className="bg-black">
//         Fetch User Data
//       </button>
//       {responseText && <p>Response: {responseText}</p>}
//     </div>
//   )
// }

// export default CreateFolder

//
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FILE_PORT } from 'src/components/port'
interface ResponseData {
  message: string
  folderName: string
}

const CreateFolder: React.FC = () => {
  const [responseText, setResponseText] = useState<string>('')
  const [cookieValue, setCookieValue] = useState<string | null>(null)

  useEffect(() => {
    const loadCookies = () => {
      const cookies: { [key: string]: string | undefined } = document.cookie
        .split('; ')
        .reduce((acc: { [key: string]: string | undefined }, cookie) => {
          const parts = cookie.split('=')
          const key = parts[0].trim()
          if (key) {
            acc[key] = decodeURIComponent(parts[1])
          }
          return acc
        }, {})

      setCookieValue(cookies['userFolder'] || null) // 确保 cookie 存在
      console.log('cookieValue: ', cookies['userFolder'] || null)
    }
    loadCookies()
  }, [])

  const createFolder = async () => {
    try {
      const postData = { content: 'some content' }
      const response = await axios.post<ResponseData>(
        `http://localhost:${FILE_PORT}/user-file`
        // postData,
        // {
        //   withCredentials: true, // 确保请求携带 cookie
        // }
      )
      console.log('response is ', response)
      setResponseText(
        `Message: ${response.data.message}, Folder Name: ${response.data.folderName}`
      )

      // 获取响应头中的 Set-Cookie 值
      const setCookies = response.headers['set-cookie']
      if (setCookies) {
        console.log('Set-Cookie is', response.headers['set-cookie'])
        const userFolderCookie = setCookies.find((cookie) =>
          cookie.startsWith('userFolder=')
        )
        if (userFolderCookie) {
          document.cookie = userFolderCookie // 设置 cookie
          console.log('userFolderCookie is ', userFolderCookie)

          setCookieValue(userFolderCookie) // 更新状态
        }
      }
    } catch (error) {
      console.error('Error posting data:', error)
      setResponseText('Error: ' + (error as Error).message)
    }
  }

  const fetchUserData = async () => {
    console.log('cookieValue is', cookieValue)
    if (cookieValue) {
      try {
        const response = await axios.get<ResponseData>(
          `http://localhost:${FILE_PORT}/user-file`,
          {
            withCredentials: true, // 确保请求携带 cookie
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
  }

  return (
    <div>
      <input
        type="text"
        value={responseText}
        onChange={(e) => setResponseText(e.target.value)}
        placeholder="Enter some text"
        className="bg-black"
      />
      <button onClick={createFolder} className="bg-black">
        Submit
      </button>
      <button
        onClick={fetchUserData}
        disabled={!cookieValue}
        className="bg-black"
      >
        Fetch User Data
      </button>
      {cookieValue && <p>Cookie: {cookieValue}</p>}
      {responseText && <p>Response: {responseText}</p>}
    </div>
  )
}

export default CreateFolder
