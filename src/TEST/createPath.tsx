// Success
import React, { useState } from 'react'
import axios from 'axios'
import { HOST_IP, FILE_PORT } from 'src/components/port'

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
        `http://${HOST_IP}:${FILE_PORT}/create-file`,
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
      <p></p>
      <input
        // className="block w-full py-2 px-3 leading-tight text-gray-700 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        className="bg-gray-700 pt-1 pb-1 p-2 border border-gray-500 rounded-lg focus:text-white focus:bg-gray-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        type="text"
        name="fileName"
        value={filePath.filePath}
        onChange={handleChange}
        placeholder="Enter file name"
      />
      <button
        // className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        className="ml-2 px-4 pt-1 pb-1 py-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-700 active:bg-blue-800"
        onClick={createFile}
      >
        t:创建文件
      </button>
    </>
  )
}

export default CreateFile
