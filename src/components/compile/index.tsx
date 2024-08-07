import React from 'react'
import axios from 'axios'

import { FILE_PORT, HOST_IP } from '../../components/port'
async function compile() {
  const data = {
    content: '这是文件内容', // 文件内容
  }

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  try {
    const response = await axios.post(
      `http://${HOST_IP}:${FILE_PORT}/save-code`,
      data,
      config
    )
    console.log('服务器响应:', response.data)
  } catch (error) {
    console.error('请求失败:', error)
  }
}

const CompileButton: React.FC = () => {
  const handleCompile = async () => {
    await compile()
  }

  return (
    <>
      <button
        className="ml-2 px-4 pt-1 pb-1 py-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-700 active:bg-blue-800"
        onClick={handleCompile}
      >
        MOVE
      </button>
    </>
  )
}

export default CompileButton
