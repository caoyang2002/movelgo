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
  echo "$ip_address"
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
# aptos move
# move_version=$(aptos move --version 2>/dev/null)

# if [ $? -ne 0 ]; then
#   printf "${red}[ERROR] Move is not installed.${reset}\n"
# else
#   printf "${green}[PASS] Move has been installed: %s${reset}\n" $move_version
# fi

# echo $move_version

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
nohup yarn start >log/editor.log 2>&1 &
if [ $? -ne 0 ]; then
  printf "%b[ERROR] UI 启动失败%b\n" "$red_background" "$reset" >&2
  exit 1
else
  OS=$(uname -s)
  # 读取 REACT_APP_PORT 环境变量，如果没有设置则默认为 3000
  port=${REACT_APP_PORT:-3010}

  printf "${green}[PASS] UI start on: %s://%s:%s${reset}\n" "http" "$ip" "$port" >&2
fi
cd $CURRENT_DIR

# ------------------------------------------------- rpc
echo "[START] RPC"
cd rpc/server
nohup cargo run >../../log/rpc.log 2>&1 &
if [ $? -ne 0 ]; then
  printf "%b[ERROR] RPC faild%b\n" "$red" "$reset" >&2
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
  printf "%b[ERROR] FileSystem faild%b\n" "$red" "$reset" >&2
  exit 1
else
  port=${REACT_APP_FILE_SERVER_PORT:-3010}
  printf "${green}[PASS] File system start on: %s://%s:%s${reset}\n" "http" "$ip" "$port" >&2

fi
cd $CURRENT_DIR
echo ">>> Movelgo Started <<<"
