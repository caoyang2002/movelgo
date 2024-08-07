import { UniqueNumberGenerator } from '../utils'
import * as fs from 'fs'
import * as path from 'path'

// 定义 StateNode 接口，用于表示状态节点
interface StateNode {
  code: number
  message: string
  data: PathInfoNode // 根节点
}

// 定义 Content 接口，用于表示文件内容
interface Content {
  language: string
  value: string
}

// 定义 PathInfoNode 接口，用于表示路径信息节点
interface PathInfoNode {
  id: number
  name: string
  location: string
  fileType: string
  isLeaf: boolean
  data: Content | string
  children?: PathInfoNode[]
}

// 指定用户文件夹目录 FolderName
const usersBaseDir = path.join(__dirname, '../users')

/**
 * 生成唯一 ID 的函数
 */
function generateId(): number {
  const generator = UniqueNumberGenerator.getInstance()
  const uniqueNumber = generator.generate()
  console.log(`[HANDLE] unique number: ${uniqueNumber}`)
  return uniqueNumber
}

/**
 *
 * @param userMainPath 传入用户主文件夹
 * @returns
 */
function buildJsonInfo(
  nodes: PathInfoNode[],
  folderName: string
): PathInfoNode[] {
  const folderFullName = path.join(usersBaseDir, folderName)
  // const filesAndFolders: PathInfoNode[] = []

  function checkDir(dirPath: string, parentChildren): void {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true })
    entries.forEach((entry) => {
      const entryPath = path.join(dirPath, entry.name)
      const location = path
        .relative(usersBaseDir, entryPath)
        .split('/') // 以 '/' 分割路径
        .filter((part) => part !== '') // 过滤掉空字符串
        .map((part, index, arr) => (index === 0 ? 'ROOT' : part)) // 将数组的第一个元素替换为 'root'
        .join('/') // 重新组合数组元素为一个字符串

      console.log(`[INFO] location : ${location}`)
      const newNode = {
        id: generateId(),
        name: entry.name,
        location: location,
        fileType: entry.isDirectory() ? 'Folder' : 'File',
        isLeaf: !entry.isDirectory(),
        data: entry.isDirectory()
          ? ''
          : {
              language: path.extname(entryPath).slice(1) || 'unknown',
              value: fs.readFileSync(entryPath, 'utf-8'),
            },
        children: [],
      }

      if (entry.isDirectory()) {
        parentChildren.push(newNode)
        console.log(`[INFO] Folder name: ${entry.name}`)
        checkDir(entryPath, newNode.children) // 递归检查子文件夹，并将子节点的 children 数组传递给子节点
      } else {
        parentChildren.push(newNode)
      }
    })
  }

  checkDir(folderFullName, nodes)
  return nodes
}

async function buildFileTreeJson(nodes: PathInfoNode[], folderName: string) {
  // console.log(`[获取] 文件夹路径: ${folderName}`)
  // 构建绝对路径
  const folderFullPath = path.join(usersBaseDir, folderName)
  // console.log(`[获取] 文件夹绝对路径: ${folderFullPath}`)
  // 使用示例
  // const directoryPath = '553dc65fec23f58f97c0f37d36f27fc0' // 替换为你的文件夹路径
  const filesAndFolders = buildJsonInfo(nodes, folderName)
  nodes = filesAndFolders
  return filesAndFolders
}

/**
 * 将文件夹路径转换为树状 JSON 结构
 * @param folderName 用户主文件夹路径
 */
export async function convertProjectInfoToTree(
  folderName: string
): Promise<StateNode> {
  // const folderName = folderPaths[0].split('/')[0]
  const rootNode: PathInfoNode = {
    id: 0,
    name: 'Movelgo',
    location: folderName,
    fileType: 'RootFolder',
    isLeaf: false,
    data: '',
    children: [],
  }

  const state: StateNode = {
    code: 200,
    message: 'success',
    data: rootNode,
  }

  try {
    await Promise.all(await buildFileTreeJson(rootNode.children, folderName))
  } catch (error) {
    console.error('[ERROR] 构建文件树时发生错误:', error)
    state.code = 500
    state.message = 'Error processing file paths'
  }

  return state
}

// 转换并生成 JSON 字符串
// convertProjectInfoToTree('553dc65fec23f58f97c0f37d36f27fc0')
//   .then((fileTree) => {
//     console.log('[检查] 文件树:', fileTree)
//     const jsonResult = JSON.stringify(fileTree, null, 2)
//     console.log(jsonResult)
//   })
//   .catch((error) => {
//     console.error('转换文件树时发生错误:', error)
//   })
