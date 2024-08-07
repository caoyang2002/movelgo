#!/bin/bash

red_background="\033[41m" # 红色背景
red="\033[31m"            # 红色
green="\033[32m"          # 绿色
yellow="\033[33m"         # 黄色
blue="\033[34m"           # 蓝色
reset="\033[0m"           # 重置颜色

# 使用 uname -s 命令获取系统名称
OS=$(uname -s)

# 检查系统是否为 Darwin（macOS）或 Linux
if [[ "$OS" == "Darwin" ]]; then
  printf '%b[STATUS] 系统是 macOS%b\n' "$green" "$reset" >&1
elif [[ "$OS" == "Linux" ]]; then
  # 在 Linux 上，进一步检查是否为 Ubuntu
  if [[ -f /etc/os-release ]]; then
    # 读取 os-release 文件来判断 Ubuntu
    . /etc/os-release
    if [[ "$NAME" == "Ubuntu" ]]; then
      printf '%b[STATUS] 系统是 Ubuntu%b\n' "$green" "$reset" >&1
    else
      printf '%b[STATUS] 系统是其他 Linux 发行版%b\n' "$green" "$reset" >&1
    fi
  else
    printf '%b[STATUS] 系统是其他 Linux 发行版，但不是 Ubuntu%b\n' "$green" "$reset" >&1

  fi
else
  printf '%b[WARNING] 未知操作系统%b\n' "$yellow" "$reset" >&1
fi

# 检查 MAC 是否安装了 brew
if [[ "$OS" == "Darwin" ]]; then
  echo '[CHECK] brew'
  brew_version=$(brew --version 2>/dev/null) # 将错误重定向到 /dev/null
  if [ $? -ne 0 ]; then
    printf "%b[STATUS] Brew is not installed%b\n" "$green" "$reset" >&2
    echo '[INSTALL] Starting to install the Brew ...'
    # 使用 curl 下载并执行 Homebrew 安装脚本
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    if [ $? -eq 0 ]; then
      printf "%b[SUCESS] Homebrew installed successfully%b\n" "$green" "$reset" >&1
    else
      printf "%b[ERROR] Failed to install Homebrew%b\n" "$red" "$reset" >&2
    fi
  else
    printf "${green}[STATUS] Brew is already installed. Version: %s${reset}\n" "$brew_version"
  fi
fi

# 检查 Ubuntu 是否安装了 apt

# 检查是否安装了 aptos
echo '[CHECK] APTOS'
aptos_version=$(aptos --version 2>/dev/null)
if [ $? -ne 0 ]; then
  printf "%b[STATUS] Aptos is not installed.%b\n" "$blue" "$reset" >&1
  echo "[INSTALL] Starting to install the Aptos ..."
  # 安装 aptos
  if [[ "$OS" == "Darwin" ]]; then
    brew update
    brew install aptos
    if [ $? -ne 0]; then
      print "%b[ERROR] install faild%d\n" "$red" "$reset" >&2
    fi
    print "%b[SUCCESS] install success%d\n" "$green" "$reset" >&1
  fi

  if [[ "$OS" == "Linux" ]]; then
    curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3
    if [ $? -ne 0]; then
      wget -qO- "https://aptos.dev/scripts/install_cli.py" | python3
      if [ $? -ne 0]; then
        print "%b[ERROR] install faild%d\n" "$red" "$reset" >&2
      fi
      print "%b[SUCCESS] install success%d\n" "$green" "$reset" >&1
    fi
    print "%b[SUCCESS] install success%b\n" "$green" "$reset" >&1
  fi
else
  printf "${green}[STATUS] Aptos is already installed. Version: %s${reset}\n" "$aptos_version"
fi

# # 检查是否安装了 move
# move_version=$(aptos move --version 2>/dev/null)
# if [ $? -ne 0 ]; then
#   echo "Move is not installed."
#   echo "Starting to install the Move ..."
# else
#   echo "Move has been installed: $move_version"
# fi

# 检查是否安装了 nodejs
nodejs_version=$(node --version 2>/dev/null)
if [ $? -ne 0 ]; then
  echo "Nodejs is not installed."
  echo "Starting to install the Nodejs ..."
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
  if [ $? -ne 0]; then
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
    if [ $? -ne 0]; then
      wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
      if [ $? -ne 0]; then
        print "%b[ERROR] install faild%d\n" "$red" "$reset" >&2
      fi
      print "%b[SUCCESS] install success%b\n" "$green" "$reset" >&1
    fi
    print "%b[SUCCESS] install success%b\n" "$green" "$reset" >&1
  fi
else
  printf "${green}[STATUS] Nodejs is already installed. Version: %s${reset}\n" "$nodejs_version"
fi

# 检测并使用已安装的包管理器安装 package.json 中的依赖
install_node_packages() {
  local pm_list=(yarn pnpm bun npm)
  local package_manager

  # 检测哪个包管理器已安装
  for pm in "${pm_list[@]}"; do
    if command -v "$pm" >/dev/null 2>&1; then
      package_manager="$pm"
      break
    fi
  done

  if [ -z "$package_manager" ]; then
    echo "No package manager installed."
    npm install -g yarn
  else
    echo "Using $package_manager to install packages.json"
  fi

  # 检查是否是 bun，因为 bun 的安装命令稍有不同
  if [ "$package_manager" = "bun" ]; then
    "$package_manager" install
  else
    # 开始安装
    echo "Starting to install the package.json ..."
    ###############################################################
    # "$package_manager" install --package-lock-only
    ###############################################################
  fi
  printf "${green}[STATUS] Packages installed successfully. %s${reset}\n"
}

# 执行安装
install_node_packages
if [ $? -ne 0 ]; then
  echo "Node.js has been detected as installed, but the package manager is unavailable. Please check for errors and install the package manager manually."
fi

# -----------------

# 保存最初的工作目录
initial_dir="$(pwd)"
echo "Current directory is: $initial_dir"

# 检查 Move 文件夹是否存在，不存在则创建并进入
if [ ! -d "Move" ]; then
  mkdir -p Move
fi
cd Move || exit # 如果 cd 失败，则退出脚本

# 打印 Move 目录的路径
Move_dir="$(pwd)"
printf "Move directory is: %s\n" "$Move_dir"

aptos move init --name movelgo
aptos init --network testnet

exit_status=$?

if [ $? -ne 0 ]; then
  echo "Error occurred"
  # 可以在这里执行相应的错误处理逻辑
fi

# 删除最初的工作目录中的 Move 文件夹（如果需要的话）
rm -rf "$initial_dir/Move" # 注意：这里使用最初的目录路径来指定删除位置
# 返回最初的工作目录
cd "$initial_dir"
