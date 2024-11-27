#!/bin/bash

# 自动下载Releases下的最新版本并更新服务

# 创建临时目录
mkdir -p ${HOME}/tmp

# 检查是否存在git配置的代理
proxy=$(git config --get http.proxy)
cliName=opencad
# 下载最新版本到 ${HOME}/tmp
REPO="Cangjier/open-cad-cli"
API_URL="https://api.github.com/repos/$REPO/releases/latest"
response=$(curl -s $API_URL)
tag=$(echo "$response" | grep '"tag_name":' | cut -d '"' -f 4)
download_url="https://github.com/${REPO}/releases/download/${tag}/${cliName}"
download_path="${HOME}/tmp/${cliName}"
if [ -n "$proxy" ]; then
    echo "Using proxy: $proxy"
    wget -e "https_proxy=$proxy" --no-cache -O "$download_path" "$download_url"
else
    wget --no-cache -O "$download_path" "$download_url"
fi

# 检查是否有opencad进程在运行
if pgrep -f ${cliName} > /dev/null; then
    echo "Found running ${cliName} processes. Killing them..."
    for pid in $(pgrep -f ${cliName}); do
        sudo kill -9 "$pid"
        echo "Killed process with PID: $pid"
    done
else
    echo "No running ${cliName} processes found."
fi

# 创建目录 ${HOME}/OPEN_CAD/bin
echo "Creating ${HOME}/OPEN_CAD/bin"
mkdir -p ${HOME}/OPEN_CAD
mkdir -p ${HOME}/OPEN_CAD/bin
# 移动下载的文件到 ${HOME}/OPEN_CAD/bin
echo "Moving downloaded opencad to ${HOME}/OPEN_CAD/bin"
sudo mv "$download_path" ${HOME}/OPEN_CAD/bin

# 添加可执行权限
sudo chmod +x ${HOME}/OPEN_CAD/bin/${cliName}

# 在.bashrc中添加环境变量，如果不存在则添加
if ! grep -q 'export PATH=$PATH:${HOME}/OPEN_CAD/bin' ~/.bashrc; then
    echo 'export PATH=$PATH:${HOME}/OPEN_CAD/bin' >>~/.bashrc
    echo "Added ${HOME}/OPEN_CAD/bin to PATH in .bashrc"
fi

source ~/.bashrc
# 退出
exit
