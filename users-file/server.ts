// import express, { Request, Response } from 'express';
// import fs from 'fs';
// import path from 'path';
// import crypto from 'crypto';
// import cookieParser from 'cookie-parser';
// import cors from 'cors';

// const app = express();
// const PORT = 3001;
// const usersDir = path.join(__dirname, './users'); // 指定用户文件夹的存储目录

// // 设置允许跨域请求的选项
// const corsOptions = {
//   origin: 'http://localhost:3000', // 允许的请求来源
//   credentials: true // 允许携带认证信息（如cookies）
// };

// // 应用cors中间件
// app.use(cors(corsOptions));

// // 设置静态文件目录
// app.use(express.static(path.join(__dirname, 'public')));

// // 使用cookieParser中间件
// app.use(cookieParser());

// // Middleware to generate hash and create folder if not exists
// app.use(async (req: Request & { folderName?: string }, res: Response, next) => {
//   let folderName = req.cookies['userFolder']; // 从cookie中获取folderName

//   if (!folderName) {
//     // 如果cookie中没有folderName，则生成新的folderName
//     folderName = generateHash();
//     res.cookie('userFolder', folderName, { maxAge: 34560000000, httpOnly: false }); // 设置cookie，最大保存400天
//   }

//   const folderPath = path.join(usersDir, folderName);

//   if (!fs.existsSync(folderPath)) {
//     fs.mkdirSync(folderPath); // 创建文件夹
//   }

//   // 将folderName附加到请求对象中，以便后续路由处理函数使用
//   (req as any).folderName = folderName;
//   next();
// });

// // Generate hash function
// function generateHash() {
//   const current_time = new Date().getTime().toString();
//   const random = Math.random().toString();
//   return crypto.createHash('md5').update(current_time + random).digest('hex');
// }

// // Example route to handle user activity
// app.post('/user-file', (req: Request & { folderName?: string }, res: Response) => {
//   console.log("[获取fileName] 用户获取folderName", req.folderName);
//   res.json({ message: 'User folder set', folderName: req.folderName });
// });

// // 递归获取文件夹中的所有文件和子文件夹
// async function getAllFilesAndFolders(folderPath: string): Promise<string[]> {
//   let files: string[] = [];

//   const items = fs.readdirSync(folderPath, { withFileTypes: true });
//   for (const item of items) {
//     const itemPath = path.join(folderPath, item.name);
//     if (item.isDirectory()) {
//       const subFiles = await getAllFilesAndFolders(itemPath);
//       files = files.concat(subFiles);
//     } else {
//       files.push(itemPath);
//     }
//   }
// console.log("files", files);
//   return files;
// }

// // 获取用户的所有文件
// app.get('/fetch-files', async (req: Request & { folderName?: string }, res: Response) => {
//   console.log("[获取文件名] 用户获取 folderName", req.folderName);

//   const folderPath = path.join(usersDir, req.folderName);
//   console.log("文件夹路径：", folderPath)

//   try {
//     const files = await getAllFilesAndFolders(folderPath);
//     console.log("文件列表：", files);
//     res.json({ message: 'Files fetched', files: files });
//   } catch (error) {
//     console.error("Error fetching files:", error);
//     res.status(500).json({ message: 'Error fetching files' });
//   }
// });

// // 创建文件
// app.post('/create-file', (req: Request, res: Response) => {
//   console.log("创建文件", req.body);
//   const folderPath = path.join(usersDir, req.body.folderName);
//   const filePath = path.join(folderPath, req.body.fileName);

//   try {
//     if (!fs.existsSync(folderPath)) {
//       fs.mkdirSync(folderPath); // 创建文件夹
//     }

//     fs.writeFileSync(filePath, ''); // 创建空文件
//     res.json({ message: 'File created', filePath: filePath });
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating file', error: error.message });
//   }
// });

// // 启动服务器
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });


// -------------------------------------------------------------


import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const PORT = 3001;

// 指定用户文件夹的存储目录
const usersBaseDir = path.join(__dirname, './users');
const usersUrlBase = '/users'; // URL 中的基础路径

// 设置允许跨域请求的选项
const corsOptions = {
  origin: 'http://localhost:3000', // 允许的请求来源
  credentials: true // 允许携带认证信息（如cookies）
};
// 解析请求体
app.use(express.json());

// 应用cors中间件
app.use(cors(corsOptions));

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 使用cookieParser中间件
app.use(cookieParser());

// Middleware to generate hash and create folder if not exists
app.use(async (req: Request & { folderName?: string }, res: Response, next) => {
  let folderName = req.cookies['userFolder']; // 从cookie中获取folderName

  if (!folderName) {
    // 如果cookie中没有folderName，则生成新的folderName
    folderName = generateHash();
    res.cookie('userFolder', folderName, { maxAge: 34560000000, httpOnly: false }); // 设置cookie
  }

  const folderPath = path.join(usersBaseDir, folderName);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath); // 创建文件夹
  }

  // 将folderName附加到请求对象中，以便后续路由处理函数使用
  (req as any).folderName = folderName;
  next();
});

// Generate hash function
function generateHash() {
  const current_time = new Date().getTime().toString();
  const random = Math.random().toString();
  return crypto.createHash('md5').update(current_time + random).digest('hex');
}

// Example route to handle user activity
app.post('/user-file', (req: Request & { folderName?: string }, res: Response) => {
  console.log("[获取fileName] 用户获取 cookie 中携带的 folderName 是：", req.folderName);
  res.json({ message: 'User folder set', folderName: req.folderName });
});



// 递归获取文件夹中的所有文件和子文件夹
function getAllFilesAndFolders(folderPath: string): string[] {
  let files: string[] = [];

  const items = fs.readdirSync(folderPath, { withFileTypes: true });
  for (const item of items) {
    const itemPath = path.join(folderPath, item.name);
    if (item.isDirectory()) {
      const subFiles = getAllFilesAndFolders(itemPath);
      files = files.concat(subFiles);
    } else {
      files.push(path.relative(usersBaseDir, itemPath));
    }
  }

  return files.map(file => file.replace(/\\/g, '/')); // 替换反斜杠为斜杠
}

// 获取用户的所有文件
app.get('/fetch-files', (req: Request & { folderName?: string }, res: Response) => {
  console.log("[获取文件名] 用户获取 folderName", req.folderName);

  const folderPath = path.join(usersBaseDir, req.folderName);
  console.log("文件夹路径：", folderPath)

  try {
    const files = getAllFilesAndFolders(folderPath);
    console.log("文件列表：", files);
    res.json({ files: files });
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ message: 'Error fetching files' });
  }
});

// app.post('/create-file', (req, res) => {
//   console.log(req.body);
//   res.send('完成');
// })

// // 创建文件
app.post('/create-file', (req: Request & { folderName?: string,fileName?:string }, res: Response) => {
  console.log("[获取文件名] 用户获取 folderName：", req.folderName);
//  console.log("请求内容：",req)
   // 从请求体中获取 folderName 和 fileName
   console.log("请求体内容：", req.body);
  //  const { folderName, filePath } = req.body;
  //  console.log("请求体内容：", folderName, filePath);

  const { filePath} = req.body;
  console.log("文件创建路径：", req.body.filePath);
  const folderPath = path.join(usersBaseDir, req.folderName);
  const fileFullPath = path.join(folderPath, filePath);

  try {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath); // 创建文件夹
    }

    fs.writeFileSync(fileFullPath, ''); // 创建空文件
    res.json({ message: 'File created', filePath: req.folderName.toString() + "/"+filePath.toString() });
  } catch (error) {
    res.status(500).json({ message: 'Error creating file', error: error.message });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
