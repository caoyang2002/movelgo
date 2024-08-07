import express, { Request, Response } from 'express'
import { getAllFilesAndFolders } from './controllers/getAllFileAndFolder'
import { generateHash } from './utils'
import fs from 'fs'
import path from 'path'
import { convertProjectInfoToTree } from './controllers/projectInfoToJson'
import axios from 'axios'
import { useState } from 'react'

const router = express.Router()
// 指定用户文件夹的存储目录
const usersBaseDir = path.join(__dirname, './users')

let FOLDERNAME = ''
/**
 * 中间件，它会在所有匹配的路由处理函数之前执行
 */
router.use(
  async (req: Request & { folderName?: string }, res: Response, next) => {
    console.log('[操作] 进入中间件')
    let folderName = req.cookies['userFolder'] // 从cookie中获取folderName
    FOLDERNAME = folderName

    if (!folderName) {
      // 如果cookie中没有folderName，则生成新的folderName
      folderName = generateHash()
      res.cookie('userFolder', folderName, {
        maxAge: 34560000000,
        httpOnly: false,
      }) // 设置cookie
    }

    const folderPath = path.join(usersBaseDir, folderName)

    if (!fs.existsSync(folderPath)) {
      console.log('[操作] 用户主文件夹不存在，创建：', folderPath)
      fs.mkdirSync(folderPath) // 创建文件夹
      // 创建 Readme.md
      fs.writeFileSync(
        path.join(folderPath, 'README.md'),
        'This is your personal folder. You can store your files here.'
      )
    }

    // 将folderName附加到请求对象中，以便后续路由处理函数使用
    ;(req as any).folderName = folderName
    next()
  }
)

/**
 * 获取用户的项目信息, 返回一个 json 对象
 */
router.get(
  '/user-project-json',
  (req: Request & { folderName?: string }, res: Response) => {
    try {
      // const filesWithDot = getAllFilesAndFolders(req.folderName) // 返回：['../553dc65fec23f58f97c0f37d36f27fc0/Readme.md', ...]
      // const files = filesWithDot.map((path) => path.replace(/^\.\.\//, ''))
      // console.log('[检查] 文件列表:', files)
      convertProjectInfoToTree(req.folderName)
        .then((fileTree) => {
          console.log('[检查] 文件树:', fileTree)
          const jsonProjectInfo = JSON.stringify(fileTree, null, 2)
          res.json(jsonProjectInfo)
          // console.log(jsonResult)
        })
        .catch((error) => {
          console.error('转换文件树时发生错误:', error)
          res.json({
            code: 403,
            message: 'error:' + error.toString,
            folderName: req.folderName,
          })
        })
    } catch (error) {
      res.status(404).json({
        code: 404,
        message: 'error:' + error.toString,
        folderName: req.folderName,
      })
    }
  }
)
/**
 * 获取用户 cookie 中的 folderName
 */
router.post(
  '/user-file',
  (req: Request & { folderName?: string }, res: Response) => {
    console.log(
      '[获取] 用户获取 cookie 中携带的 folderName 是：',
      req.folderName
    )
    res.json({ message: 'User folder set', folderName: req.folderName })
  }
)

/**
 * 获取用户的所有文件
 */
router.get(
  '/fetch-files',
  (req: Request & { folderName?: string }, res: Response) => {
    console.log('[获取] 用户获取 folderName', req.folderName)

    try {
      const files = getAllFilesAndFolders(req.folderName)
      console.log('[获取] 文件列表：', files)
      res.json({ files: files })
    } catch (error) {
      console.error('Error fetching files:', error)
      res.status(500).json({ message: 'Error fetching files' })
    }
  }
)

/**
 * 创建文件
 */
router.post(
  '/create-file',
  (
    req: Request & { folderName?: string; fileName?: string },
    res: Response
  ) => {
    console.log('[获取] 获取用户的主文件夹 folderName：', req.folderName)
    console.log('请求体内容：', req.body)
    const filePath = req.body.filePath
    console.log('[检查] 文件创建路径：', filePath)

    // 初始化文件夹路径
    let currentFolderPath = path.join(usersBaseDir, req.folderName)
    console.log('[检查] 主文件夹绝对路径：', currentFolderPath)

    const endsWithSlash = filePath.endsWith('/')
    console.log('[检查] 文件路径是否以斜杠结尾：', endsWithSlash)
    const containsSlash = filePath.includes('/')
    console.log('[检查] 文件路径是否包含斜杠：', containsSlash)
    // 创建单个文件
    if (!containsSlash) {
      try {
        // 需要创建的文件路径
        console.log('[操作] 创建文件：', filePath)
        const folderPath = path.join(usersBaseDir, req.folderName)
        const fileFullPath = path.join(folderPath, filePath)
        console.log('[检查] 创建的文件路径：', fileFullPath)
        if (!fs.existsSync(fileFullPath)) {
          fs.writeFileSync(fileFullPath, '') // 创建空文件
          res.json({
            message: 'File created',
            filePath: req.folderName.toString() + '/' + filePath.toString(),
          })
        } else {
          res.json({
            message: 'File already exists',
            filePath: req.folderName.toString() + '/' + filePath.toString(),
          })
        }
      } catch (error) {
        res
          .status(500)
          .json({ message: 'Error creating file', error: error.message })
      }
      return
    }
    // 创建单个文件夹
    if (endsWithSlash) {
      console.log('[操作] 创建单个文件夹：', filePath)
      const folderPath = path.join(usersBaseDir, req.folderName)
      // 分割字符串
      const folderParts = filePath.split('/')
      console.log('[获取] 文件夹名称：', folderParts[0])
      const fileFullPath = path.join(folderPath, folderParts[0])
      console.log('[检查] 创建的文件夹绝对路径：', fileFullPath)

      try {
        if (!fs.existsSync(fileFullPath)) {
          fs.mkdirSync(fileFullPath)
        }
        res.json({
          message: 'File created',
          filePath: req.folderName.toString() + '/' + folderParts[0].toString(),
        })
      } catch (error) {
        res
          .status(500)
          .json({ message: 'Error creating file', error: error.message })
      }
      return
    }

    // 创建多个文件夹，最后一个作为文件
    if (containsSlash && !endsWithSlash) {
      // 分割字符串
      const folderParts = filePath.split('/')
      console.log('[获取] 文件夹和文件：', folderParts)
      // 递归创建文件夹
      try {
        let filePath = ''
        folderParts.forEach((folderPart, index) => {
          filePath = path.join(filePath, folderPart)
          console.log('[操作] 创建文件夹: ', filePath, 'index: ', index)

          const fileFullPath = path.join(currentFolderPath, filePath)

          console.log('[检查] 创建的文件(夹)绝对路径：', fileFullPath)
          // 如果是最后一个元素，创建文件
          if (index === folderParts.length - 1) {
            console.log('[操作] 创建文件：', filePath)

            fs.writeFileSync(fileFullPath, '')
            return
          }
          if (!fs.existsSync(fileFullPath)) {
            console.log('[操作] 创建文件夹：', filePath)
            fs.mkdirSync(fileFullPath)
          }
        })

        res.json({
          message: 'File created',
          filePath: req.folderName.toString() + '/' + filePath.toString(),
        })
      } catch (error) {
        res
          .status(500)
          .json({ message: 'Error creating file', error: error.message })
      }
    }
  },
  /**
   * 保存代码
   */

  router.post(
    '/save-code',
    (
      req: Request & { fileContent?: string; filePath?: string },
      res: Response
    ) => {
      let folderName = req.cookies['userFolder'] // 从cookie中获取folderName
      console.log(
        '[获取](/save-code) 用户获取 cookie 中携带的 folderName 是：',
        FOLDERNAME
      )
      console.log('请求体内容：', req.body)

      // const folderName = req.cookies.folderName
      const filePath = req.body.filePath
      const fileContent = req.body.fileContent // 假设请求体中包含内容的字段名为 content

      if (!folderName || !filePath || !fileContent) {
        return res.status(400).json({ message: '缺少必要的参数' })
      }
      const childrenFilePath = filePath.replace(/^\s*ROOT\//, '')
      console.log('childrenFilePath: ', childrenFilePath)

      // 构建完整的文件路径
      const userFolderPath = path.join(
        __dirname,
        '../users-file/users',
        folderName
      )
      const fullFilePath = path.join(userFolderPath, childrenFilePath)
      console.log('fullFilePath', fullFilePath)

      try {
        // 确保文件夹存在
        if (!fs.existsSync(userFolderPath)) {
          fs.mkdirSync(userFolderPath, { recursive: true })
        }

        // 写入文件
        fs.writeFileSync(fullFilePath, fileContent)

        res.json({
          code: 200,
          message: 'success',
          folderName: folderName,
        })
      } catch (error) {
        console.error('保存文件失败：', error)
        res.status(500).json({ message: '服务器内部错误' })
      }
    }
  ),

  router.post(
    '/move/test',
    async (
      req: Request & { folderName?: string; fileContent?: string },
      res: Response
    ) => {
      // 定义请求体中的数据
      const moveCode = req.body.fileContent
      console.log('[获取] 请求体内容：', moveCode)
      try {
        // 使用 axios 发送 POST 请求到另一个服务器
        const response = await axios.post(
          'http://127.0.0.1:3020/move_test',
          moveCode
        )
        console.log('服务器响应:', response.data)

        // 将响应返回给客户端
        res.json({
          code: 200,
          message: '成功',
          data: response.data,
        })
      } catch (error) {
        console.error('请求失败:', error)

        // 将错误信息返回给客户端
        res.json({
          code: 403,
          message: 'error: ' + error.toString(),
          folderName: req.folderName,
        })
      }
    }
  )
)

export default router
