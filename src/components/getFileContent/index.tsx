// Success
import React, { useEffect } from 'react'
import molecule from '@dtinsight/molecule'

const GetFileContent: React.FC = () => {
  // 定义 handleEvents 异步函数
  async function handleEvents() {
    const getGroupEditors = () => {
      const editor = molecule.editor.getGroupById(1)?.editorInstance
      return editor || null
    }

    // 使用 getGroupEditors 获取编辑器实例
    const editor = getGroupEditors()
    if (editor) {
      const value = editor.getValue()
      console.log(value)
    } else {
      console.error('未能获取编辑器实例')
    }
  }

  // 使用 useEffect 钩子在组件挂载时调用 handleEvents
  useEffect(() => {
    handleEvents()
  }, [])

  return (
    <>
      <button
        className="ml-2 px-4 pt-1 pb-1 py-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-700 active:bg-blue-800"
        onClick={() => handleEvents()}
      >
        CODEEEE
      </button>
    </>
  )
}

export default GetFileContent
