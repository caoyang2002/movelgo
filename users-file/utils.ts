import * as crypto from 'crypto'
import * as fs from 'fs'
import * as path from 'path'

const usersBaseDir = path.join(__dirname, './users')
/**
 * 生成 md5 哈希
 * @returns md5 hash, example: 553dc65fec23f58f97c0f37d36f27fc0
 */
export function generateHash() {
  const current_time = new Date().getTime().toString()
  const random = Math.random().toString()
  return crypto
    .createHash('md5')
    .update(current_time + random)
    .digest('hex')
}

/**
 * 生成唯一数字
 */
export class UniqueNumberGenerator {
  private static instance: UniqueNumberGenerator
  private counter: number

  private constructor() {
    this.counter = 0
  }

  static getInstance(): UniqueNumberGenerator {
    if (!UniqueNumberGenerator.instance) {
      UniqueNumberGenerator.instance = new UniqueNumberGenerator()
    }
    return UniqueNumberGenerator.instance
  }

  generate(): number {
    const uniqueNumber = this.counter++
    return uniqueNumber
  }
}

/**
 * 检查路径的文件类型（File or Folder）
 * @param path 用户主目录的相对路径, 例如: 553dc65fec23f58f97c0f37d36f27fc0/Readme.md
 * @returns utils.FileNodeType
 */
export const checkPathType = async (thePath: string) => {
  const fullpath = path.join(usersBaseDir, thePath)
  console.log('[CHECK] check start:', thePath)
  try {
    const stats = await fs.promises.stat(fullpath)
    if (stats.isFile()) {
      console.log('[CHECK] type: file')
      return 'File'
    } else if (stats.isDirectory()) {
      console.log('[CHECK] type: folder')
      return 'Folder'
    }
  } catch (err) {
    console.error('[ERROR] type: error', err)
    return 'Error'
  }
}

/**
 * 获取文件名
 * @param path 建议为用户主目录路径的相对文件路径, 例如：553dc65fec23f58f97c0f37d36f27fc0/Readme.md
 * @returns FileName
 */
export const getFileName = (path: string) => {
  const parts = path.split('/')
  console.log('[HANDLE] fetch file name: ', parts)
  const fileName = parts.pop()
  return fileName
}
/**
 * 获取首个文件夹名
 * @param path 建议为用户主目录路径的相对文件路径, 例如：553dc65fec23f58f97c0f37d36f27fc0/Readme.md
 * @returns FolderName
 */
export const getFolderName = (path: string) => {
  const parts = path.split('/')
  console.log('[HANDLE] fetch folder name: ', parts)
  const folderName = parts[0]
  return folderName
}

/**
 * 获取文件信息
 * @param filePath 用户主目录的相对路径
 * @returns 文件后缀、内容、创建时间、最后修改时间、大小
 */
export async function getFileInfo(filePath) {
  console.log('[INFO] File path', filePath)
  const fullPath = path.join(usersBaseDir, filePath)
  try {
    // 获取文件元数据
    const stats = await fs.promises.stat(fullPath)
    // 文件扩展名
    const fileExtension = path.extname(fullPath)
    // 最后修改时间
    const lastModifiedTime = stats.mtime
    // 创建时间
    const createAt = stats.birthtime
    // 文件大小
    const fileSize = stats.size
    // 文件内容
    const fileContent = await fs.promises.readFile(fullPath, 'utf-8')

    // 返回文件信息
    return {
      stats: stats,
      extension: fileExtension,
      lastModifiedTime: lastModifiedTime,
      createAt: createAt,
      fileSize: fileSize,
      content: fileContent,
    }
  } catch (error) {
    // 处理错误
    console.error('[ERROR] Error:', error)
    throw error
  }
}
