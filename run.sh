#!/bin/bash
#color
# color
red_background="\033[41m" # 红色背景
red="\033[31m"            # 红色
green="\033[32m"          # 绿色
yellow="\033[33m"         # 黄色
blue="\033[34m"           # 蓝色
reset="\033[0m"           # 重置颜色

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
  echo "Package manager has been installed: $package_manager $package_manager_version"
else
  echo "No supported package manager or tool found."
fi

# aptos
aptos_version=$(aptos --version)
if [ $? -ne 0 ]; then
  echo "Aptos is not installed."
else
  echo "Aptos has been installed: $aptos_version"
fi
# aptos move
move_version=$(aptos move --version)

if [ $? -ne 0 ]; then
  echo "Move is not installed."
else
  echo "Move has been installed: $move_version"
fi

nodejs_version=$(node --version)
# echo $move_version

if [ $? -ne 0 ]; then
  echo "Nodejs is not installed."
else
  echo "Nodejs has been installed: node $nodejs_version"

fi

# ---------------------------------------- run

CURRENT_DIR=$(pwd)

echo "[检查] Move"
cd rpc/move
aptos move test --skip-fetch-latest-git-deps >../../log/movelog 2>&1 &
if [ $? -eq 0 ]; then
  printf '%b[SUCCESS] Move 检查通过%b\n' "$green" "$reset" >&2
else
  printf "%b[ERROR] Move 检查失败%b\n" "$red_background" "$reset" >&2
fi
cd $CURRENT_DIR

echo "[启动] UI"
nohup yarn start >log/editor.log 2>&1 &
if [ $? -ne 0 ]; then
  printf "%b[ERROR] UI 启动失败%b\n" "$red_background" "$reset" >&2
else
  printf '%b[SUCCESS] UI 启动成功%b\n' "$green" "$reset" >&2
fi
cd $CURRENT_DIR

echo "[启动] RPC"
cd rpc/server
nohup cargo run >../../log/rpc.log 2>&1 &
if [ $? -ne 0 ]; then
  printf "%b[ERROR] RPC 启动失败%b\n" "$red_background" "$reset" >&2
else
  printf '%b[SUCCESS] RPC 启动成功%b\n' "$green" "$reset" >&2
fi
cd $CURRENT_DIR

echo "[启动] FileSystem"
cd users-file
nohup ts-node server.ts >../log/file-server.log 2>&1 &
if [ $? -ne 0 ]; then
  printf "%b[ERROR] FileSystem 启动失败%b\n" "$red_background" "$reset" >&2
else
  printf '%b[SUCCESS] FileSystem 启动成功%b\n' "$green" "$reset" >&2
fi
cd $CURRENT_DIR
