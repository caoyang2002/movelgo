import * as fs from 'fs'
import * as path from 'path'

// 定义一个类型，用于描述文件或文件夹的基本信息
interface FileInfo {
  name: string
  path: string
  isFile: boolean
}

// 递归检查文件夹中的文件和子文件夹
function checkDirectory(directoryPath: string): FileInfo[] {
  const filesAndFolders: FileInfo[] = []

  function checkDir(dirPath: string): void {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true })
    entries.forEach((entry) => {
      const entryPath = path.join(dirPath, entry.name)
      if (entry.isDirectory()) {
        filesAndFolders.push({
          name: entry.name,
          path: entryPath,
          isFile: false,
        })
        checkDir(entryPath) // 递归检查子文件夹
      } else {
        filesAndFolders.push({
          name: entry.name,
          path: entryPath,
          isFile: true,
        })
      }
    })
  }

  checkDir(directoryPath)
  return filesAndFolders
}

// 使用示例
const directoryPath =
  '/Users/caoyang/Desktop/IDE/movelgo/users-file/users/553dc65fec23f58f97c0f37d36f27fc0' // 替换为你的文件夹路径
const filesAndFolders = checkDirectory(directoryPath)

console.log('[INFO] Files and folders in the directory:')
filesAndFolders.forEach((item) => {
  console.log(
    `[INFO] Name: ${item.name}, Path: ${item.path}, Is File: ${item.isFile}`
  )
})
