#!/bin/bash

# 定义端口数组
ports=(3010 3020 3000)

# 遍历端口数组
for port in "${ports[@]}"; do
  echo "检查端口 $port 的使用情况："
  lsof -i :$port
  echo "--------------------------"
done

echo "端口检查完成。"
