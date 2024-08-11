#!/bin/bash
# color
red_background="\033[41m" # 红色背景
red="\033[31m"            # 红色
green="\033[32m"          # 绿色
yellow="\033[33m"         # 黄色
blue="\033[34m"           # 蓝色
reset="\033[0m"           # 重置颜色

# 加载 .env 文件中的环境变量
if [ -f .env ]; then
  # 使用 'export' 来设置环境变量
  export $(cat .env | grep -v '^#' | xargs)

fi

# 定义一个函数来获取 IP 地址
get_ip_address() {
  local ip_address
  case "$(uname -s)" in
  Darwin)
    ip_address=$(ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1' | head -n 1)
    ;;
  Linux)
    ip_address=$(hostname -I | awk '{print$1}')
    ;;
  *)
    ip_address="localhost"
    ;;
  esac
  echo $ip_address
}

# 调用函数并获取 IP 地址
ip=$(get_ip_address)

# ---------------------------------------- check
# Initialize array of package managers to check
PACKAGE_MANAGERS=("yarn" "pnpm" "npm")

# Variable to store detected package manager
package_manager=""
package_manager_version=""

# Check for supported package managers

# Loop through each package manager
for pkg_mgr in "${PACKAGE_MANAGERS[@]}"; do
  if command -v "$pkg_mgr" &>/dev/null; then
    package_manager="$pkg_mgr"
    package_manager_version="$($pkg_mgr --version)"
    break
  fi
done

# Check if a package manager was found
if [ -n "$package_manager" ]; then
  printf "${green}[PASS] Package manager has been installed: %s %s ${reset}\n" $package_manager $package_manager_version
else
  printf "${red}[ERROR] No supported package manager or tool found.${reset}\n"
fi

# aptos
aptos_version=$(aptos --version 2>/dev/null)
if [ $? -ne 0 ]; then
  printf "${red}[ERROR] Aptos is not installed.${reset}\n"
else
  printf "${green}[PASS] Aptos has been installed: $aptos_version ${reset}\n"
fi
# nodejs
nodejs_version=$(node --version 2>/dev/null)
if [ $? -ne 0 ]; then
  printf "${red}[ERROR] Nodejs is not installed.${reset}\n"
else
  printf "${green}[PASS] Nodejs has been installed: node $nodejs_version ${reset}\n"

fi

# ---------------------------------------------------------- test move

CURRENT_DIR=$(pwd)
echo ">>> Start Movelgo <<<"
echo "[CHECK] Move"
cd rpc/move
aptos move test --skip-fetch-latest-git-deps >../../log/move.log 2>&1 &
if [ $? -ne 0 ]; then
  printf "%b[ERROR] Move faild%b\n" "$red" "$reset" >&2
  exit 1
else
  printf '%b[PASS] Move useable%b\n' "$green" "$reset" >&2
fi

cd $CURRENT_DIR

# ============================================================ 启动
# ------------------------------------------------------------ ui
echo "[START] UI"
#!/bin/bash

# 检查 package.json 文件是否存在
if [ ! -f "package.json" ]; then
  printf "${red}[ERROR] Error: package.json not found.${reset}\n"
  exit 1
fi

# 检查项目使用的包管理器，并启动项目
if command -v pnpm >/dev/null 2>&1; then
  # 如果系统中安装了 pnpm，使用 pnpm 启动
  printf "${blue}[START] UI with pnpm${reset}\n"
  nohup pnpm start >log/editor.log 2>&1 &
elif command -v yarn >/dev/null 2>&1; then
  # 如果系统中安装了 yarn，使用 yarn 启动
  printf "${blue}[START] UI with yarn${reset}\n"
  nohup yarn start >log/editor.log 2>&1 &
elif command -v npm >/dev/null 2>&1; then
  # 如果系统中安装了 npm，使用 npm 启动
  printf "${blue}[START] UI with npm${reset}\n"
  nohup npm start >log/editor.log 2>&1 &
else
  printf "${red}[ERROR]Error: No package manager found.${reset}\n"
  exit 1
fi

printf "${green}[SUCCESS] UI started successfully.${reset}\n"

OS=$(uname -s)
# 读取 REACT_APP_PORT 环境变量，如果没有设置则默认为 3000
port=${REACT_APP_PORT:-3010}
printf "${green}[PASS] UI start on: %s://%s:%s${reset}\n" "http" "$ip" "$port" >&2

cd $CURRENT_DIR

# ------------------------------------------------- rpc
echo "[START] RPC"
cd rpc/server
nohup cargo run >../../log/rpc.log 2>&1 &
if [ $? -ne 0 ]; then
  printf "%b[ERROR] RPC running faild%b\n" "$red" "$reset" >&2
  exit 1
else
  port=${REACT_APP_RPC_PORT:-3020}
  printf "${green}[PASS] RPC start on: %s://%s:%s${reset}\n" "http" "$ip" "$port" >&2
fi
cd $CURRENT_DIR

# ----------------------------------------- file system
echo "[START] File System"
cd users-file
nohup ts-node server.ts >../log/file-server.log 2>&1 &
if [ $? -ne 0 ]; then
  printf "%b[ERROR] FileSystem running faild%b\n" "$red" "$reset" >&2
  exit 1
else
  port=${REACT_APP_FILE_SERVER_PORT:-3010}
  printf "${green}[PASS] File system start on: %s://%s:%s${reset}\n" "http" "$ip" "$port" >&2

fi
cd $CURRENT_DIR
echo ">>> Movelgo Started <<<"
