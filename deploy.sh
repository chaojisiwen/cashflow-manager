#!/bin/bash
# 部署脚本 - 使用 Vercel CLI 部署

echo "正在部署到 Vercel..."

# 检查是否安装了 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "正在安装 Vercel CLI..."
    npm install -g vercel
fi

# 部署
echo "开始部署..."
vercel --prod --yes

echo "部署完成！"
