import React, { useEffect, useState } from 'react'
import api from '../api/index'
import { getFileContent } from '../components/getCode' // 假设 getFileContent 是一个异步函数

export default function CompileCode() {
  const [content, setContent] = useState(null) // 用于存储文件内容

  const move_test = async () => {
    try {
      // 等待 getFileContent 函数完成，并获取其结果
      const data = await getFileContent()
      console.log('code', data) // 这里应该能打印出文件内容
      //通过 api 发送给 3010
      const response = await api.code_test(data)
      console.log('编译结果：', response.data)

      // 你可以在这里添加更多的处理逻辑
      setContent(data)
    } catch (error) {
      console.error('获取文件内容失败:', error)
    }
  }

  useEffect(() => {
    // 如果你希望在组件加载时就获取文件内容，可以在这里调用 move_test
    move_test()
  }, [])

  return (
    <>
      <button
        className="mt-1 mb-1 ml-2 px-4 pt-1 pb-1 py-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-700 active:bg-blue-800"
        onClick={move_test}
      >
        test: 编译
      </button>
      <p>{content}</p>
    </>
  )
}
