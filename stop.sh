#!/bin/bash
# color
red_background="\033[41m" # 红色背景
red="\033[31m"            # 红色
green="\033[32m"          # 绿色
yellow="\033[33m"         # 黄色
blue="\033[34m"           # 蓝色
reset="\033[0m"           # 重置颜色

echo -e "[STOP] Node 服务...\033[0m"
# 使用 lsof 和 grep 获取使用 Node.js 运行的进程的 PID
pid=$(lsof -i -n -P | grep node | grep -v grep | awk '{print $2}')

# 检查是否找到了 PID
if [ -z "$pid" ]; then
  printf '%b[ERROR] 没有找到使用 Node.js 运行的进程。%b\n' "$red_background" "$reset" >&2
else
  echo -e "[SUCCESS] 找到使用 Node.js 运行的进程，PID：$pid \033[32m" >&2

  # 尝试使用 SIGTERM 信号终止进程
  kill $pid >/dev/null 2>&1
  if [ $? -eq 0 ]; then
    printf '%b[SUCCESS] 进程已通过 SIGTERM 信号终止。%b\n' "$green" "$reset" >&2
  else
    printf '%b[WRANING] SIGTERM 信号失败，尝试使用 SIGKILL 信号。%b\n' "$yellow" "$reset" >&2
    # 使用 SIGKILL 信号强制终止进程
    kill -9 "$pid" >/dev/null 2>&1
    if [ $? -eq 0 ]; then
      printf '%b[SUCCESS] 进程已通过 SIGKILL 信号强制终止。%b\n' "$pid" "$green" "$reset" >&2
    else
      printf '%b[ERROR] 无法终止进程。%b\n' "$red_background" "$reset" >&2
    fi
  fi
fi

# 停止 RPC 服务
echo -e "[STOP] RPC 服务... \033[0m"

# 尝试杀死 RPC 服务进程
# 查找占用端口3020的进程
pid=$(lsof -i :3020 | grep LISTEN | awk '{print $2}')

# 检查是否找到了进程ID
if [ -z "$pid" ]; then
  printf "%b[SUCCESS] 没有找到占用端口 3020 的进程。\n%b" "$green" "$reset" >&2

else
  printf "%b[INFO] 找到占用端口3020的进程，PID：$pid \n%b" "$blue" "$reset" >&2

  # 尝试使用SIGTERM信号终止进程
  kill $pid
  if [ $? -eq 0 ]; then
    printf "%b[SUCCESS] 进程已通过SIGTERM信号终止。\n%b" "$green" "$reset" >&2

  else
    printf "%b[ERROR] SIGTERM信号失败，尝试使用SIGKILL信号。\n%b" "$red" "$reset" >&2
    # 使用SIGKILL信号强制终止进程
    kill -9 $pid
    if [ $? -eq 0 ]; then

      printf '%b[SUCCESS] 进程已通过 SIGKILL 信号强制终止。%b\n' "$green" "$reset" >&2
    else
      printf "%b[ERROR] 无法终止进程。\n%b" "$red_background" "$reset" >&2
    fi
  fi
fi

# 停止FileSystem服务

# 使用 echo 打印停止服务信息
echo "[STOP] FileSystem 服务..."

# 尝试停止 FileSystem 服务并捕获返回状态码
pkill -f "ts-node server.ts" >/dev/null 2>&1

if [ $? -eq 0 ]; then
  # 如果 pkill 失败，输出错误信息
  printf '%b[ERROR] FileSystem 服务停止失败%b\n' "$red_background" "$reset" >&2
else
  # 如果 pkill 成功，输出成功信息
  printf '%b[SUCCESS] FileSystem 服务已停止！%b\n' "$green" "$reset" >&2
fi
printf '%b[SUCCESS] 所有服务已停止！%b\n' "\033[32m" "\033[0m" >&2
