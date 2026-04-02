#!/bin/bash
# 每日备份脚本

# 获取当前日期
DATE=$(date +%Y%m%d)

# 切换到 OpenClaw 工作区目录
cd ~/.openclaw/workspace || { echo "错误：无法切换到工作区目录 ~/.openclaw/workspace"; exit 1; }

# 添加指定文件到 Git 暂存区
git add SOUL.md MEMORY.md AGENTS.md || { echo "错误：无法将文件添加到 Git 暂存区"; exit 1; }

# 检查是否有文件更改，如果没有则不进行 commit 和 push
if git diff --cached --exit-code; then
  echo "没有需要提交的更改。"
else
  # 提交更改
  git commit -m "每日备份: $DATE" || { echo "错误：无法提交更改"; exit 1; }
  
  # 推送到 GitHub
  # 重要的隐私提示：请确保你的 Git 远程 'origin' 已正确配置并认证。
  # 推荐使用 SSH key 或 Personal Access Token (PAT) 进行认证，
  # 避免在脚本中直接包含用户名和密码。
  git push origin main || { echo "错误：无法推送到 GitHub 远程仓库 'origin main'"; exit 1; }
  echo "每日备份 ($DATE) 已完成。"
fi