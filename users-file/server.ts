import express from 'express'
import router from './routers'
import cors from 'cors'
import path from 'path'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import os from 'os'

// 加载 .env 文件
dotenv.config({ path: path.resolve(process.cwd(), '../.env') })

const app = express()
const PORT = process.env.REACT_APP_FILE_SERVER_POR || 3010 // 使用环境变量中的 PORT，如果没有则默认为 3010
console.log(PORT)

// 使用cookieParser中间件
app.use(cookieParser())
app.use(express.json())

// 设置允许跨域请求的选项
const corsOptions = {
  origin: 'http://localhost:3000', // 允许的请求来源
  credentials: true, // 允许携带认证信息（如cookies）
}

// 解析请求体
app.use(express.json())

// 应用cors中间件
app.use(cors(corsOptions))

// 设置静态文件目录
app.use(express.static(path.join(process.cwd(), 'public')))

// 使用路由
app.use(router)

app.listen(PORT, () => {
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
  console.log(`Server is running on http://${ipAddress}:${PORT}`)
})
