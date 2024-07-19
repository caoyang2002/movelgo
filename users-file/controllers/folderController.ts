import fs from 'fs'
import path from 'path'

// 指定用户文件夹的存储目录
const usersBaseDir = path.join(__dirname, '../users')
// 递归获取文件夹中的所有文件和子文件夹
export function getAllFilesAndFolders(folderPath: string): string[] {
  let files: string[] = []

  const items = fs.readdirSync(folderPath, { withFileTypes: true })
  for (const item of items) {
    const itemPath = path.join(folderPath, item.name)
    if (item.isDirectory()) {
      const subFiles = getAllFilesAndFolders(itemPath)
      files = files.concat(subFiles)
    } else {
      files.push(path.relative(usersBaseDir, itemPath))
    }
  }

  return files.map((file) => file.replace(/\\/g, '/')) // 替换反斜杠为斜杠
}
