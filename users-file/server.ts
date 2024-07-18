// server.ts

import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = 3001;
const usersDir = path.join(__dirname, './users'); // 指定用户文件夹的存储目录

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 路由处理
app.get('/user-file', (req: Request, res: Response) => {
  console.log("[用户请求] 用户获取文件名")  
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Middleware to generate hash and create folder if not exists
app.use(cookieParser());
app.use((req: Request & { folderName?: string }, res: Response, next) => {
  let folderName = req.cookies['userFolder']; // 从 cookie 中获取 folderName
  console.log("[用户请求] 从 cookie 中获取 folderName", folderName)

  if (!folderName) {
    // 如果 cookie 中没有 folderName，则生成新的 folderName
    console.log("[cookie 中没有 folderName] 生成新的 folderName")
    folderName = generateHash();
    res.cookie('userFolder', folderName, { maxAge: 34560000000, httpOnly: true }); // 设置 cookie，最大保存 400天
  }

  const folderPath = path.join(usersDir, folderName);

  if (!fs.existsSync(folderPath)) {
    console.log("[创建文件夹] 文件夹不存在，创建文件夹")
    fs.mkdirSync(folderPath); // 创建文件夹
    
  }

  // 将 folderName 附加到请求对象中，以便后续路由处理函数使用
  req.folderName = folderName;
  next();
});

// Generate hash function
function generateHash() {
  console.log("[生成 hash] 开始生成 hash")
  const current_time = new Date().getTime().toString();
  const random = Math.random().toString();
  return crypto.createHash('md5').update(current_time + random).digest('hex');
}

// Example route to handle user activity
app.post('/user-file', (req: Request & { folderName?: string }, res: Response) => {
  console.log("[获取 fileName] 用户获取 folderName", req.folderName)
  // const { userId } = req.body;
  // Use req.folderName to access the folder name created
  // res.send({ message: 'User activity updated', folderName: req.folderName });
  res.json({ message: 'User activity updated', folderName: req.folderName });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
//--------------------------------------------------
// //
// import express, { Request, Response } from 'express';
// import fs from 'fs';
// import path from 'path';
// import crypto from 'crypto';
// import cookieParser from 'cookie-parser';

// const app = express();
// const PORT = 3001;
// const usersDir = path.join(__dirname, './users'); // 指定用户文件夹的存储目录

// // Middleware to parse cookies
// app.use(cookieParser());

// // Middleware to generate hash and create folder if not exists
// app.use((req: Request & { folderName?: string }, res: Response, next) => {
//   let folderName = req.cookies['userFolder']; // 从 cookie 中获取 folderName
//   console.log("从 cookie 中获取 folderName", folderName)

//   if (!folderName) {
//     // 如果 cookie 中没有 folderName，则生成新的 folderName
//     folderName = generateHash();
//     res.cookie('userFolder', folderName, { maxAge: 34560000000, httpOnly: true }); // 设置 cookie，最大保存 400 天
   
//   }

//   const folderPath = path.join(usersDir, folderName);

//   if (!fs.existsSync(folderPath)) {
//     fs.mkdirSync(folderPath); // 创建文件夹
//   }

//   // 将 folderName 附加到请求对象中，以便后续路由处理函数使用
//   req.folderName = folderName;
//   next();
// });

// // Generate hash function
// function generateHash() {
//   const current_time = new Date().getTime().toString();
//   const random = Math.random().toString();
//   return crypto.createHash('md5').update(current_time + random).digest('hex');
// }

// // Example route to handle user activity
// app.post('/user-activity', (req: Request & { folderName?: string }, res: Response) => {
//   // const { userId } = req.body;
//   // Use req.folderName to access the folder name created
//   res.json({ message: 'User activity updated', folderName: req.folderName });
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
