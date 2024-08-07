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

# 检查 Linux 是否安装了 pip3
if [[ "$OS" == "Linux" ]]; then
  # 检查 pip3 是否已安装
  if command -v pip3 >/dev/null 2>&1; then
    printf "${green}[CHECK] pip3 is already installed.${reset}"
  else
    printf "${red}[STATUS] pip3 is not installed. Trying to install it.${reset}\n"

    # 检测 Linux 发行版并安装 pip3
    if [ -f /etc/os-release ]; then
      . /etc/os-release

      case "$ID" in
      ubuntu | debian)
        sudo apt-get update && sudo apt-get install -y python3-pip
        ;;
      centos)
        sudo yum install -y python3-pip
        ;;
      fedora | rhel)
        sudo dnf install -y python3-pip
        ;;
      *)
        printf "${red}[ERROR] This script does not support your Linux distribution: %s${reset}" "$ID"
        exit 1
        ;;
      esac
    else
      printf "${red}[ERROR] Unable to determine your Linux distribution. Please install pip3 manually.${reset}"
      exit 1
    fi

    # 检查 pip3 是否成功安装
    if command -v pip3 >/dev/null 2>&1; then
      printf "${green}[SUCCESS] pip3 installed successfully.${reset}"
    else
      printf "${red}[ERROR] Failed to install pip3. Please check the installation manually.${reset}"
      exit 1
    fi
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
        exit 1
      fi
    else
      printf "${green}[STATUS] Brew is already installed. Version: %s${reset}\n" "$brew_version"
    fi
  fi
fi
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
      exit 1
    fi
    print "%b[SUCCESS] install success%d\n" "$green" "$reset" >&1
  fi

  if [[ "$OS" == "Linux" ]]; then
    sudo apt install python3-packaging
    curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3
    if [ $? -ne 0]; then
      wget -qO- "https://aptos.dev/scripts/install_cli.py" | python3
      if [ $? -ne 0]; then
        print "%b[ERROR] install faild%d\n" "$red" "$reset" >&2
        exit 1
      fi
      print "%b[SUCCESS] install success%d\n" "$green" "$reset" >&1
    fi
    print "%b[SUCCESS] install success%b\n" "$green" "$reset" >&1
  fi
else
  printf "${green}[STATUS] Aptos is already installed. Version: %s${reset}\n" "$aptos_version"
fi

# 定义 Aptos CLI 安装路径
echo "$USER"
APTOS_CLI_INSTALL_PATH="/home/$USER/.local/bin"

# 输出安装完成信息
echo "The Aptos CLI (3.5.1) is installed now. Great!"

# 检查 Aptos CLI 是否已经在 PATH 中
if ! echo "$PATH" | grep -Eq "(^|:)$APTOS_CLI_INSTALL_PATH($|:)"; then
  # 将 Aptos CLI 的 bin 目录添加到 PATH
  echo "Adding the Aptos CLI's bin directory to your PATH environment variable."

  # 检测当前使用的 shell 并设置配置文件
  if [ -f "$HOME/.bashrc" ]; then
    SHELL_CONFIG_FILE="$HOME/.bashrc"
  elif [ -f "$HOME/.zshrc" ]; then
    SHELL_CONFIG_FILE="$HOME/.zshrc"
  else
    echo "Error: Unable to detect the shell configuration file."
    exit 1
  fi

  # 添加 Aptos CLI 到 PATH
  echo "export PATH=\"$APTOS_CLI_INSTALL_PATH:\$PATH\"" >>"$SHELL_CONFIG_FILE"

  # 提示用户重新加载配置文件或重启终端
  echo "Please restart your terminal or run the following command to source the changes:"
  echo "source \"$SHELL_CONFIG_FILE\""
else
  echo "The Aptos CLI's bin directory is already in your PATH."
fi

# 提供直接调用 Aptos CLI 的完整路径
echo "Alternatively, you can call the Aptos CLI explicitly with:"
echo "$APTOS_CLI_INSTALL_PATH/aptos"

# 测试 Aptos CLI 是否安装成功
echo "Testing that everything is set up by executing:"
if aptos info >/dev/null 2>&1; then
  echo "Aptos CLI is set up correctly and is accessible."
else
  echo "Error: Aptos CLI is not accessible. Please check your PATH and try again."
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
