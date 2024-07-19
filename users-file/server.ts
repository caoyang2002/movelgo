import express from 'express'
import router from './routers'
import cors from 'cors'
import path from 'path'
import cookieParser from 'cookie-parser'

const app = express()
const PORT = 3001
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
app.use(express.static(path.join(__dirname, 'public')))

// 使用路由
app.use(router)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
