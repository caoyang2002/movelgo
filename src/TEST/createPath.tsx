// import React, { useState } from 'react'
// import axios from 'axios'

// interface FileData {
//   folderName: string
//   fileName: string
// }

// const CreateAndFetchFiles: React.FC = () => {
//   const [fileData, setFileData] = useState<FileData>({
//     folderName: '',
//     fileName: '',
//   })
//   const [files, setFiles] = useState<string[]>([])
//   const [responseText, setResponseText] = useState<string>('')

//   // 处理输入变化
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setFileData({
//       ...fileData,
//       [name]: value,
//     })
//   }

//   // 创建文件
//   const createFile = async () => {
//     try {
//       const response = await axios.post('/create-file', fileData, {
//         withCredentials: true,
//       })
//       setResponseText(`File created: ${response.data.filePath}`)
//     } catch (error) {
//       setResponseText('Error creating file: ' + (error as Error).message)
//     }
//   }

//   // 获取文件夹内文件列表
//   const fetchFiles = async () => {
//     try {
//       const response = await axios.get('/fetch-files', {
//         withCredentials: true,
//       })
//       setFiles(response.data.files)
//       setResponseText(`Files fetched: ${response.data.files.join(', ')}`)
//     } catch (error) {
//       setResponseText('Error fetching files: ' + (error as Error).message)
//     }
//   }

//   return (
//     <div>
//       <input
//         type="text"
//         name="folderName"
//         value={fileData.folderName}
//         onChange={handleChange}
//         placeholder="Enter folder name"
//       />
//       <input
//         type="text"
//         name="fileName"
//         value={fileData.fileName}
//         onChange={handleChange}
//         placeholder="Enter file name"
//       />
//       <button onClick={createFile}>创建文件</button>
//       <button onClick={fetchFiles}>获取文件列表</button>
//       {responseText && <p>Response: {responseText}</p>}
//       {files.length > 0 && (
//         <div>
//           <p>Files in folder:</p>
//           <ul>
//             {files.map((file, index) => (
//               <li key={index}>{file}</li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   )
// }

// export default CreateAndFetchFiles

// ---------------------

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