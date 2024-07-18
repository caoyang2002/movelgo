// import React, { useState } from 'react'
// import axios from 'axios'

// interface PostData {
//   content: string
// }

// interface ResponseData {
//   message: string
//   folderName: string
// }

// const PostRequestComponent: React.FC = () => {
//   const [inputValue, setInputValue] = useState<string>('')
//   const [responseText, setResponseText] = useState<string>('')

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setInputValue(e.target.value)
//   }

//   const handleSubmit = async () => {
//     try {
//       const postData: PostData = { content: inputValue }
//       const response = await axios.post<ResponseData>('http://localhost:3001')
//       console.log('获取到的响应数据：', response.data)

//       setResponseText(
//         `\nMessage: ${response.data.message}, Folder Name: ${response.data.folderName}`
//       )

//       // 获取并输出服务器响应的 cookie
//       const setCookieHeader = response.headers['userFolder']
//       if (setCookieHeader) {
//         console.log('Cookies set by server:', setCookieHeader)
//         setResponseText(`${responseText}\nCookies: ${setCookieHeader}`)
//       }
//     } catch (error) {
//       console.error('Error posting data:', error)
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
//       <button onClick={handleSubmit}>创建文件夹</button>
//       {responseText && <p>Response: {responseText}</p>}
//     </div>
//   )
// }

// export default PostRequestComponent

// -------------------------
//
import React, { useState, useEffect } from 'react'
import axios from 'axios'

interface ResponseData {
  message: string
  folderName: string
}

const CookieViewerComponent: React.FC = () => {
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
    console.log('cookie is', document.cookie)
    try {
      const response = await axios.get<ResponseData>(
        'http://localhost:3001/user-file',
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
      <button onClick={fetchUserData}>获取文件夹名称</button>
      {cookieValue && <p>Cookie: userFolder={cookieValue}</p>}
      {responseText && <p>Response: {responseText}</p>}
    </div>
  )
}

export default CookieViewerComponent
