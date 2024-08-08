import path from 'path'
import dotenv from 'dotenv'
import os from 'os'

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
  console.log('[INFO] ip address: ', ipAddress)
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
