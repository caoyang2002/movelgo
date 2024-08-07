import React, { useEffect, useState } from 'react'

const UserFolderName = () => {
  const [folderName, setFolderName] = useState('')

  useEffect(() => {
    const getCookie = (name: any) => {
      const cookies = document.cookie.split(';')
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim()
        if (cookie.startsWith(name + '=')) {
          return cookie.substring(name.length + 1, cookie.length)
        }
      }
      return ''
    }

    const name = 'userFolder'
    const value = getCookie(name)
    setFolderName(value)
  }, []) // 空依赖数组意味着这个effect只在组件挂载时运行一次

  return folderName
}

export default UserFolderName
