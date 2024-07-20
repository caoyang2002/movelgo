// import {
//   UniqueNumberGenerator,
//   checkPathType,
//   PathNodeType,
//   getFileName,
//   getFileInfo,
// } from '../utils'

// /**
//  * 状态
//  * @property {number} code - 状态码
//  * @property {string} message - 状态信息
//  * @property {ChildNode[]} data - 子节点数组
//  */
// interface StateNode {
//   code: number
//   message: string
//   folderName: folderNameNode[]
// }

// /**M
//  * 主节点
//  * @property {number} id - 节点 ID
//  * @property {string} folderName - 文件夹名称
//  * @property {string} createdAt - 创建时间
//  * @property {PathNode[]} data - 子节点数组
//  */
// interface folderNameNode {
//   id: number
//   folderName: string
//   createdAt: string
//   data: PathInfoNode[]
// }

// /**
//  * 文件数据
//  * @property {string} language - 文件语言
//  * @property {string} value - 文件内容
//  */
// interface fileData {
//   content?: string
//   extension?: string
//   fileSize: number
//   createAt: string | Date
//   lastModifiedTime: string | Date
// }

// /**
//  * 子节点
//  * @property {number} id - 节点 ID
//  * @property {string} name - 文件名称
//  * @property {FileNodeType} fileType - 文件类型
//  * @property {string} location - 节点位置
//  * @property {boolean} isLeaf - 是否为叶子节点
//  * @property {fileData} data - 文件数据
//  */
// interface PathInfoNode {
//   id: number
//   fileName: string
//   fileType: PathNodeType
//   location: string
//   isLeaf: boolean
//   data?: fileData
//   children?: PathInfoNode[]
// }

// /**
//  * 生成唯一 ID
//  */
// function generateId(): number {
//   // 使用示例
//   const generator = UniqueNumberGenerator.getInstance()
//   const uniqueNumber = generator.generate()
//   console.log(`[获取] 生成唯一数字: ${uniqueNumber}`)
//   return uniqueNumber
// }

// /**
//  * 将文件路径转换为树状 JSON 结构
//  * @param filePaths 文件路径数组
//  */
// async function convertPathToTree(filePaths: string[]): Promise<StateNode> {
//   console.log('[检查] 文件路径数组:', filePaths)
//   // 状态节点
//   const state: StateNode = {
//     code: 200,
//     message: 'success',
//     folderName: [],
//   }
//   // 用户主文件夹
//   const folder: folderNameNode = {
//     id: generateId(),
//     folderName: getFileName(filePaths[0]),
//     createdAt: (await getFileInfo(filePaths[0])).createAt.toLocaleString(),
//     data: [],
//   }
//   //
//   state.folderName.push(folder)
//   // 遍历文件路径数组，生成树状结构
//   filePaths.forEach(async (filePath) => {
//     //
//     console.log('[获取] 文件路径:', filePath)
//     // 检查路径类型
//     const pathType = await checkPathType(filePath)
//     console.log('[获取] 路径类型:', pathType)
//     if (pathType === PathNodeType.Error) {
//       console.log('[获取] 路径类型错误')
//       throw new Error('路径类型错误')
//     }
//     // 获取文件名
//     const fileName = getFileName(filePath)
//     console.log('[获取] 文件名:', fileName)
//     // 文件
//     if (pathType === PathNodeType.File) {
//       console.log('[检查] 获取到文件')
//       // const filePath = '/Users/caoyang/Desktop/在线书籍推荐.md'
//       const fileInfo = await getFileInfo(filePath)
//       const content = fileInfo.content
//       const extension = fileInfo.extension
//       const fileSize = fileInfo.fileSize
//       const createAt = fileInfo.createAt
//       const lastModifiedTime = fileInfo.lastModifiedTime

//       // 路径信息节点
//       const pathInfo: PathInfoNode = {
//         id: generateId(),
//         fileName: fileName,
//         fileType: pathType,
//         location: filePath,
//         isLeaf: true,
//         data: {
//           content: content,
//           extension: extension,
//           fileSize: fileSize,
//           createAt: createAt.toLocaleString(),
//           lastModifiedTime: lastModifiedTime.toLocaleString(),
//         },
//       }
//       folder.data.push(pathInfo)
//     }
//     // 文件夹
//     if (pathType === PathNodeType.Folder) {
//       console.log('[检查] 获取到文件夹')
//       // 路径信息节点
//       const pathInfo: PathInfoNode = {
//         id: generateId(),
//         fileName: fileName,
//         fileType: pathType,
//         location: filePath,
//         isLeaf: false,
//       }
//       folder.data.push(pathInfo)
//     }
//   })

//   return state
// }

// // 示例文件路径数组
// const filePaths = [
//   '553dc65fec23f58f97c0f37d36f27fc0/Readme copy 3.md',
//   '553dc65fec23f58f97c0f37d36f27fc0/Readme.md',
//   '553dc65fec23f58f97c0f37d36f27fc0/te/Readme copy 2.md',
//   '553dc65fec23f58f97c0f37d36f27fc0/te/Readme copy 3.md',
//   '553dc65fec23f58f97c0f37d36f27fc0/te/Readme copy 4.md',
//   '553dc65fec23f58f97c0f37d36f27fc0/te copy/Readme copy 2.md',
//   '553dc65fec23f58f97c0f37d36f27fc0/te copy/te/Readme copy 2.md',
//   '553dc65fec23f58f97c0f37d36f27fc0/te copy/te/te/Readme copy 2.md',
//   '553dc65fec23f58f97c0f37d36f27fc0/te copy/te/te/Readme copy.md',
// ]

// // 转换并生成 JSON 字符串
// // 正确地处理 Promise
// convertPathToTree(filePaths)
//   .then((fileTree) => {
//     console.log('[检查] 文件树:', fileTree)
//     // 确保 fileTree 是解析完成的对象
//     const jsonResult = JSON.stringify(fileTree, null, 2)

//     console.log('------------------------------------------------------------')
//     console.log(jsonResult)
//     console.log('------------------------------------------------------------')
//   })
//   .catch((error) => {
//     console.error('转换文件树时发生错误:', error)
//   })
// // const fileTree = convertPathToTree(filePaths).then()
// // console.log('[检查] 文件树:', fileTree)

// // const jsonResult = JSON.stringify(fileTree, null, 2) // 使用 2 作为缩进以美化输出

// // console.log('------------------------------------------------------------')
// // console.log(jsonResult)
// // console.log('------------------------------------------------------------')

///---------------------------------------gml

import {
  UniqueNumberGenerator,
  checkPathType,
  PathNodeType,
  getFileName,
  getFileInfo,
} from '../utils'

/**
 * 状态
 * @property {number} code - 状态码
 * @property {string} message - 状态信息
 * @property {ChildNode[]} data - 子节点数组
 */
interface StateNode {
  code: number
  message: string
  folderName: folderNameNode[]
}

/**M
 * 主节点
 * @property {number} id - 节点 ID
 * @property {string} folderName - 文件夹名称
 * @property {string} createdAt - 创建时间
 * @property {PathNode[]} data - 子节点数组
 */
interface folderNameNode {
  id: number
  folderName: string
  createdAt: string
  data: PathInfoNode[]
}

/**
 * 文件数据
 * @property {string} language - 文件语言
 * @property {string} value - 文件内容
 */
interface fileData {
  content?: string
  extension?: string
  fileSize: number
  createAt: string | Date
  lastModifiedTime: string | Date
}

/**
 * 子节点
 * @property {number} id - 节点 ID
 * @property {string} name - 文件名称
 * @property {FileNodeType} fileType - 文件类型
 * @property {string} location - 节点位置
 * @property {boolean} isLeaf - 是否为叶子节点
 * @property {fileData} data - 文件数据
 */
interface PathInfoNode {
  id: number
  fileName: string
  fileType: PathNodeType
  location: string
  isLeaf: boolean
  data?: fileData
  children?: PathInfoNode[]
}

/**
 * 生成唯一 ID
 */
function generateId(): number {
  const generator = UniqueNumberGenerator.getInstance()
  const uniqueNumber = generator.generate()
  console.log(`[获取] 生成唯一数字: ${uniqueNumber}`)
  return uniqueNumber
}

/**
 * 将文件路径转换为树状 JSON 结构
 * @param filePaths 文件路径数组
 */
async function convertPathToTree(filePaths: string[]): Promise<StateNode> {
  console.log('[检查] 文件路径数组:', filePaths)
  // 状态节点
  const state: StateNode = {
    code: 200,
    message: 'success',
    folderName: [],
  }

  // 用户主文件夹
  const folder: folderNameNode = {
    id: generateId(),
    folderName: 'Root', // 根文件夹名称
    createdAt: new Date().toISOString(),
    data: [],
  }

  state.folderName.push(folder)

  // 使用 Promise.all 处理所有文件路径的异步操作
  const pathInfoNodes = await Promise.all(
    filePaths.map(async (filePath) => {
      console.log('[获取] 文件路径:', filePath)
      const pathType = await checkPathType(filePath)
      console.log('[获取] 路径类型:', pathType)

      if (pathType === PathNodeType.Error) {
        console.log('[获取] 路径类型错误')
        throw new Error('路径类型错误')
      }

      const fileName = getFileName(filePath)
      console.log('[获取] 文件名:', fileName)

      let pathInfo: PathInfoNode

      if (pathType === PathNodeType.File) {
        const fileInfo = await getFileInfo(filePath)
        const content = fileInfo.content
        const extension = fileInfo.extension
        const fileSize = fileInfo.fileSize
        const createAt = fileInfo.createAt
        const lastModifiedTime = fileInfo.lastModifiedTime

        pathInfo = {
          id: generateId(),
          fileName: fileName,
          fileType: pathType,
          location: filePath,
          isLeaf: true,
          data: {
            content: content,
            extension: extension,
            fileSize: fileSize,
            createAt: createAt.toISOString(),
            lastModifiedTime: lastModifiedTime.toISOString(),
          },
        }
      } else if (pathType === PathNodeType.Folder) {
        pathInfo = {
          id: generateId(),
          fileName: fileName,
          fileType: pathType,
          location: filePath,
          isLeaf: false,
        }
      }

      return pathInfo
    })
  )

  // 将转换结果添加到文件夹数据中
  folder.data.push(...pathInfoNodes)

  return state
}

// 示例文件路径数组
const filePaths = [
  '553dc65fec23f58f97c0f37d36f27fc0/Readme copy 3.md',
  '553dc65fec23f58f97c0f37d36f27fc0/Readme.md',
  '553dc65fec23f58f97c0f37d36f27fc0/te/Readme copy 2.md',
  '553dc65fec23f58f97c0f37d36f27fc0/te/Readme copy 3.md',
  '553dc65fec23f58f97c0f37d36f27fc0/te/Readme copy 4.md',
  '553dc65fec23f58f97c0f37d36f27fc0/te copy/Readme copy 2.md',
  '553dc65fec23f58f97c0f37d36f27fc0/te copy/te/Readme copy 2.md',
  '553dc65fec23f58f97c0f37d36f27fc0/te copy/te/te/Readme copy 2.md',
  '553dc65fec23f58f97c0f37d36f27fc0/te copy/te/te/Readme copy.md',
]

// 转换并生成 JSON 字符串
convertPathToTree(filePaths)
  .then((fileTree) => {
    console.log('[检查] 文件树:', fileTree)
    const jsonResult = JSON.stringify(fileTree, null, 2)
    console.log('--------------------------------------')
    console.log(jsonResult)
    console.log('--------------------------------------')
  })
  .catch((error) => {
    console.error('转换文件树时发生错误:', error)
  })
