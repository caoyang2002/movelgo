import * as fs from 'fs'
import * as path from 'path'

// 指定用户主文件夹目录 FolderName
const usersBaseDir = path.join(__dirname, '../users')
/**
 *递归获取文件夹中的所有文件和子文件夹
 @param folderPath 用户主文件夹路径
 @returns 文件和文件夹的相对路径数组 [553dc65fec23f58f97c0f37d36f27fc0/README.md, ...]
 */
export function getAllFilesAndFolders(folderName: string): string[] {
  const folderFullPath = path.join(usersBaseDir, folderName)
  // console.log('[检查] 文件夹完整路径: ', folderFullPath)
  let files: string[] = []

  const items = fs.readdirSync(folderFullPath, { withFileTypes: true })
  // console.log('文件项: ', items)
  for (const item of items) {
    const itemPath = path.join(folderName, item.name)
    if (item.isDirectory()) {
      const subFiles = getAllFilesAndFolders(itemPath)
      files = files.concat(subFiles)
    } else {
      files.push(path.relative(usersBaseDir, itemPath))
    }
  }
  // const fileMap = files.map((file) => file.replace(/\\/g, '/')) // 替换反斜杠为斜杠
  // console.log('[检查] fileMap is ', fileMap)
  // console.log('--------------------------------------------------')
  return files.map((file) => file.replace(/\.\.\/controllers\//g, '')) // 替换反斜杠为斜杠
}

console.log(getAllFilesAndFolders('553dc65fec23f58f97c0f37d36f27fc0'))
