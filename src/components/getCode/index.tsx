import React, { useEffect, useState } from 'react'
import molecule from '@dtinsight/molecule'

// 定义一个异步函数来获取文件内容
async function getFileContent() {
  const getGroupEditors = () => {
    const editor = molecule.editor.getGroupById(1)?.editorInstance
    return editor || null
  }

  const editor = getGroupEditors()
  if (editor) {
    const value = editor.getValue()
    console.log(value)
    return value // 返回文件内容
  } else {
    console.error('未能获取编辑器实例')
    return null // 如果没有获取到编辑器实例，则返回 null
  }
}

// 定义一个自定义 Hook 来在组件中使用 getFileContent 函数
function useFileContent() {
  const [content, setContent] = useState<string | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      const content = await getFileContent()
      setContent(content)
    }

    fetchContent()
  }, [])

  return content
}

// UI 组件，使用 useFileContent Hook
const GetFileContent: React.FC = () => {
  const content = useFileContent() // 获取文件内容

  return (
    <>
      {content && <pre>{content}</pre>}
      <button
        className="ml-2 px-4 pt-1 pb-1 py-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-700 active:bg-blue-800"
        onClick={() => getFileContent()}
      >
        刷新
      </button>
    </>
  )
}

export { getFileContent, useFileContent } // 导出函数和自定义 Hook
export default GetFileContent // 导出 UI 组件
