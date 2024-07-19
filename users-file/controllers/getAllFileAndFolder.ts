import * as fs from 'fs'
import * as path from 'path'

// 指定用户主文件夹目录 FolderName
const usersBaseDir = path.join(__dirname, '../users')
/**
 *递归获取文件夹中的所有文件和子文件夹
 @param folderPath 用户主文件夹路径
 @returns 文件和文件夹的相对路径数组
 */
export function getAllFilesAndFolders(folderName: string): string[] {
  const folderFullPath = path.join(usersBaseDir, folderName)
  console.log('[检查] folderFullPath is ', folderFullPath)
  let files: string[] = []

  const items = fs.readdirSync(folderFullPath, { withFileTypes: true })
  console.log('items is: ', items)
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
  return files.map((file) => file.replace(/\\/g, '/')) // 替换反斜杠为斜杠
}
// 输出：
//
// '553dc65fec23f58f97c0f37d36f27fc0/Readme copy 3.md',
// '553dc65fec23f58f97c0f37d36f27fc0/Readme.md',
// '553dc65fec23f58f97c0f37d36f27fc0/te/Readme copy 2.md',
// '553dc65fec23f58f97c0f37d36f27fc0/te/Readme copy 3.md',
// '553dc65fec23f58f97c0f37d36f27fc0/te/Readme copy 4.md',
// '553dc65fec23f58f97c0f37d36f27fc0/te copy/Readme copy 2.md',
// '553dc65fec23f58f97c0f37d36f27fc0/te copy/te/Readme copy 2.md',
// '553dc65fec23f58f97c0f37d36f27fc0/te copy/te/te/Readme copy 2.md',
// '553dc65fec23f58f97c0f37d36f27fc0/te copy/te/te/Readme copy.md'

// console.log(getAllFilesAndFolders('553dc65fec23f58f97c0f37d36f27fc0'))
