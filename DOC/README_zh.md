<a name="top"></a>
[![简体中文](https://img.shields.io/badge/简体中文-ff1100)](./README_zh.md)

[![English](https://img.shields.io/badge/Englist-00bb99)](../README.md)

# 前言

## :computer: 关于项目

:wrench: Movelgo 使用 [Molecule IDE UI](https://github.com/DTStack/molecule) 构建。

这是一个 Move 语言 IDE，目标是打造 Move 版的 Remix 在线开发环境。

本项目使用 React 构建，Move 代码使用后端编译。

![image](https://img.shields.io/badge/Licence-MIT-81ff44)
![language](https://img.shields.io/badge/Language-TS_Rust-239120)

## :crystal_ball: 介绍：

1. 用户在 `http//:localhost:3000/` 编写代码
2. 用户点击编译按钮，代码通过 `http//:localhost:3010/` 发送到后端文件服务器保存代码
3. 文件服务器发送到后端 `http//:localhost:3020` 编译代码，并返回编译结果给前端
4. 前端在 OUTPUT 窗口显示编译结果

## :rocket: 目标

1. 实现一个在线的 Move 开发环境

# :scroll: 项目架构

- [`./src`](./src/) 编辑器
- [`./rpc`](./rpc/) Move 编译服务
- [`./users-file`](./users-file/) 文件服务

# :running: 启动项目

## :rainbow: 前置准备

- [安装 `Aptos CLI`](https://aptos.dev/en/build/cli)

  - MAC

    ```bash
    brew install aptos  # mac
    ```

  - Linux

    ```bash
    curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3
    # or
    ```

  - Windows

    ```bash
    iwr "https://aptos.dev/scripts/install_cli.py" -useb | Select-Object -ExpandProperty Content | python3
    ```

2. [安装 `Rust`](https://www.rust-lang.org/tools/install)

- Mac / Linux

  ```bash
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
  ```

- windows

  https://forge.rust-lang.org/infra/other-installation-methods.html

3. [安装 `Nodejs`](https://nodejs.org/zh-cn/download/package-manager)
   > [!TIP]
   >
   > [推荐使用 `nvm`](https://github.com/nvm-sh/nvm)
   >
   > ```bash
   > curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
   > # or
   > wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
   > ```

## 安装依赖

> [!TIP] 提示
> 推荐使用
>
> `yarn` 或 `pnpm` 安装依赖
>
> ```bash
> npm install -g yarn
> # or
> npm install -g pnpm
> ```

```bash
yarn
# or
pnpm install
# or
npm install
```

## :car: 自动运行（后台运行）

1. [`./init.sh`](./init.sh) 初始化项目（检查配置以及下载依赖）

2. [`./run.sh`](./run.sh) 运行项目（启动编辑器、编译服务、文件服务）

3. [`./stop.sh`](./stop.sh)停止项目（根据端口停止项目）

## :muscle: 手工启动（前台运行）

```bash
yarn start
# 新终端
cd rpc/server
cargo run
# 新终端
cd users-file
ts-node server.ts
```

# :evergreen_tree: 测试

## 检查安装状态

```bash
cd rpc/move
aptos move init --name user
aptos init --network testnet
aptos move test
```

## :file_folder: rpc (rust)

In terminal

```bash
 curl -X POST -d 'module 0x12::test{
  use std::debug::print;
  use std::string::utf8;
  #[test]
  fun test_server(){
    print(&utf8(b"server is running"));
  }
}' http://127.0.0.1:3020/move_test
```

## :file_folder: user_file

```bash
ts-node ./users-file/server.ts
```

浏览器访问（默认）：http://localhost:3010

## :file_folder: react

`yarn start`

浏览器访问（默认）：http://localhost:3000

## :tada: 完成

# :airplane: 未来

## 正在开发

- [ ] 优化 UI
- [ ] 链上交互

## 计划开发

- [ ] 优化客户端的编译体验
- [ ] Debug
- [ ] Move 代码高亮
- [ ] Move 代码补全
- [ ] 优化文件服务

# :star: 贡献

欢迎提交 issue 和 PR

# :link: 链接

- [Molecule](https://github.com/DTStack/molecule)
- [Aptos](https://aptos.dev/)
- [Rust](https://www.rust-lang.org/)
- [Nodejs](https://nodejs.org/zh-cn/)

# :recycle: 资源

[molecule example](https://dtstack.github.io/molecule/zh-CN/docs/guides/extend-builtin-ui)

[molevule doc](https://dtstack.github.io/molecule/zh-CN/docs/introduction)

[icon](https://microsoft.github.io/vscode-codicons/dist/codicon.html)

[remix](https://remix.ethereum.org/#lang=zh)

[markdown emoji](https://gist.github.com/rxaviers/7360908)
