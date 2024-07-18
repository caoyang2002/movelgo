import React, { useState } from 'react'
import axios from 'axios'

interface FileData {
  // folderName: string
  filePath: string
}

const CreateFile: React.FC = () => {
  const [filePath, setFilePath] = useState<FileData>({
    // folderName: '',
    filePath: '',
  })
  //处理输入框的变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilePath({
      filePath: value,
    })
  }
  // 处理创建文件
  const createFile = async () => {
    console.log('开始创建文件')
    try {
      const response = await axios.post(
        'http://localhost:3001/create-file',
        filePath,
        {
          withCredentials: true,
        }
      )
      console.log('创建成功：', response.data)
      // setResponseText(`File created: ${response.data.filePath}`)
    } catch (error) {
      console.log('创建失败：', error)
      // setResponseText('Error creating file: ' + (error as Error).message)
    }
  }
  return (
    <>
      <input
        type="text"
        name="fileName"
        value={filePath.filePath}
        onChange={handleChange}
        placeholder="Enter file name"
      />
      <button onClick={createFile}>创建文件</button>
    </>
  )
}

export default CreateFile
