import path from 'path'
import dotenv from 'dotenv'
import os from 'os'

import fs from 'fs'

// 指定你的 .env 文件位置
const envPath = '../.env'

// 确保 .env 文件存在
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
} else {
  console.error('.env file not found')
}

export const HOST_IP = () => {
  try {
    dotenv.config({ path: path.resolve(process.cwd(), '../.env') })
  } catch (error) {
    console.error('[ERROR] Error loading .env file', error)
    return 'localhost' // 或者您可以选择抛出错误或处理它
  }
  const interfaces = os.networkInterfaces()
  const addresses = []
  for (const dev in interfaces) {
    for (const details of interfaces[dev]) {
      if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
        addresses.push(details.address)
      }
    }
  }
  const ipAddress = addresses.length > 0 ? addresses[0] : 'localhost'
  console.log('[INFO](port.tsx) HOST IP: ', ipAddress)
  return ipAddress
}

export const FILE_SERVER_PORT = () => {
  const port = process.env.REACT_APP_FILE_SERVER_PORT || 3010 // 使用环境变量中的 PORT，如果没有则默认为 3010
  console.log('[INFO] file server port: ', port)
  return port
}

export const REACT_APP_PORT = () => {
  const port = process.env.REACT_APP_PORT || 3000 // 使用环境变量中的 PORT，如果没有则默认为 3010
  console.log('[INFO] react app port: ', port)
  return port
}

export const RPC_PORT = () => {
  const port = process.env.REACT_APP_RPC_PORT || 3000 // 使用环境变量中的 PORT，如果没有则默认为 3010
  console.log('[INFO] rpc port: ', port)
  return port
}
export const CORS_HOST_IP = () => {
  console.log('[INFO] cors host ip: ', process.env.REACT_APP_CORS_IP)
  const cors = process.env.REACT_APP_CORS_IP
    ? process.env.REACT_APP_CORS_IP.split(',')
    : ['http://0.0.0.0:3000', 'http://0.0.0.0:3010']
  console.log('[INFO](user-files.tsx) cors: ', cors)
  return cors
}
