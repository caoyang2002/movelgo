#!/bin/bash
#
# 检查是否安装了 aptos
aptos_version=$(aptos --version)
if [ $? -ne 0 ]; then
  echo "Aptos is not installed."
  echo "Starting to install the Aptos ..."
  echo "//TODO"
else
  echo "Aptos has been installed: $aptos_version"
fi
# 检查是否安装了 move
move_version=$(aptos move --version)
if [ $? -ne 0 ]; then
  echo "Move is not installed."
  echo "Starting to install the Move ..."
  echo "//TODO"
else
  echo "Move has been installed: $move_version"
fi
# 检查是否安装了 nodejs
nodejs_version=$(node --version)
if [ $? -ne 0 ]; then
  echo "Nodejs is not installed."
  echo "Starting to install the Nodejs ..."
  echo "//TODO"
else
  echo "Nodejs has been installed: $nodejs_version"
fi

# 检测并使用已安装的包管理器安装 package.json 中的依赖
install_node_packages() {
  local pm_list=(pnpm npm yarn bun)
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
    exit 1
  else
    echo "Using $package_manager to install packages.json"
  fi

  # 检查是否是 bun，因为 bun 的安装命令稍有不同
  if [ "$package_manager" = "bun" ]; then
    "$package_manager" install
  else
    # 开始安装
    echo "Starting to install the package.json ..."
    echo "//TODO"
    # "$package_manager" install --package-lock-only
  fi

  echo "Packages installed successfully."
}

# 执行安装
install_node_packages
if [ $? -ne 0 ]; then
  echo "Node.js has been detected as installed, but the package manager is unavailable. Please check for errors and install the package manager manually."
fi

# -----------------

echo $(pwd)

if [ -e "Move" ]; then
  echo "Move folder exists"
else
  mkdir -p Move
  cd Move
  echo $(pwd)
  aptos move init --name movelgo
  aptos init --network testnet
fi

exit_status=$?

if [ $? -ne 0 ]; then
  echo "Error occurred"
  # 可以在这里执行相应的错误处理逻辑
fi
