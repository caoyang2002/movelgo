#!/bin/bash

red_background="\033[41m" # 红色背景
red="\033[31m"            # 红色
green="\033[32m"          # 绿色
yellow="\033[33m"         # 黄色
blue="\033[34m"           # 蓝色
reset="\033[0m"           # 重置颜色

echo "[CHECK] OS"
# 使用 uname -s 命令获取系统名称
OS=$(uname -s)
# 检查系统是否为 Darwin（macOS）或 Linux
if [[ "$OS" == "Darwin" ]]; then
  printf '%b[STATUS]  macOS%b\n' "$yellow" "$reset" >&1
elif [[ "$OS" == "Linux" ]]; then
  printf "${yellow}[STATUS] Linux${reset}\n"
fi

# 定义端口数组
ports=(3000 3010 3020)

# 遍历端口数组
for port in "${ports[@]}"; do
  echo -e "${blue}[CHECK] port $port: ${reset}"
  # lsof -i :$port
  # pid=$(lsof -i :$port | awk ' {print $2}')

  command=$(lsof -i :$port | awk 'NR==2 {print $1}')
  pid=$(lsof -i :$port | awk 'NR==2 {print $2}')
  echo -e "${green}[CMD] $command${reset}"
  echo -e "${green}[PID] $pid${reset}"
  if [[ $OS == "Darwin" ]]; then
    app_name=$(ps -ax | grep $pid | awk 'NR==2 {print $4 " " $5}')

    echo -e "${green}[APP] app name: $app_name ${reset}"
  elif [[ $OS == "Linux" ]]; then
    app_name=$(ps -ax | grep $pid | awk 'NR==2 {print $5 " " $6}')
    echo -e "${green}[APP] app name: $app_name ${reset}"
    # app_name=$(pwdx $pid)
  fi

  echo "--------------------------"
done

echo "端口检查完成。"

# lsof -i :3000 | awk '{print $2}'
# lsof -p 59063 -Fn | awk 'NR==2{print}' | sed "s/n\//\//"
