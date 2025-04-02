# # ① Python の公式 slim イメージをベースにする
# FROM python:3.9-slim

# # ② 必要なパッケージをインストールする（wget, gnupg, unzip など）
# RUN apt-get update && apt-get install -y \
#     wget \
#     gnupg \
#     unzip \
#     && rm -rf /var/lib/apt/lists/*

# # ③ Google Chrome のインストール
# RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
#     && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
#     && apt-get update \
#     && apt-get install -y google-chrome-stable \
#     && rm -rf /var/lib/apt/lists/*

# # ④ ChromeDriver のインストール
# # Manually specify the ChromeDriver version that supports Chrome 134
# ENV CHROME_DRIVER_VERSION=134.0.7065.71
# RUN wget -O /tmp/chromedriver.zip https://chromedriver.storage.googleapis.com/${CHROME_DRIVER_VERSION}/chromedriver_linux64.zip && \
#     unzip /tmp/chromedriver.zip -d /usr/local/bin/ && \
#     rm /tmp/chromedriver.zip && \
#     chmod +x /usr/local/bin/chromedriver

# # ⑤ 環境変数に ChromeDriver のパスを設定する
# ENV CHROMEDRIVER_PATH=/usr/local/bin/chromedriver

# # ⑥ 作業ディレクトリを設定し、アプリケーションのファイルをコピーする
# WORKDIR /app
# COPY requirements.txt .
# RUN pip install --upgrade pip && pip install -r requirements.txt
# COPY . .

# # ⑦ 必要なポート（ここでは 5000 番）を公開する
# EXPOSE 5000

# # ⑧ コンテナ起動時のコマンドを指定する（例：Flask アプリの起動）
# CMD ["python", "app.py"]
#-------------------------------------------------------------------------------------
# ① Python の公式 slim イメージをベースにする
FROM python:3.9-slim

# ② 必要なパッケージをインストールする（wget, gnupg, unzip など）
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# ③ Google Chrome のインストール
# 公式リポジトリの公開鍵を追加し、リポジトリを登録して Chrome をインストールします

RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

# ④ ChromeDriver のインストール
# インストール済みの Chrome バージョンに合わせる場合は、最新の ChromeDriver をダウンロードする例です。
# RUN CHROMEDRIVER_VERSION=$(wget -qO- https://chromedriver.storage.googleapis.com/LATEST_RELEASE) && \
#     wget -O /tmp/chromedriver.zip https://chromedriver.storage.googleapis.com/${CHROMEDRIVER_VERSION}/chromedriver_linux64.zip && \
#     unzip /tmp/chromedriver.zip -d /usr/local/bin/ && \
#     rm /tmp/chromedriver.zip && \
#     chmod +x /usr/local/bin/chromedriver

RUN CHROMEDRIVER_VERSION=$(wget -qO- https://chromedriver.storage.googleapis.com/LATEST_RELEASE_134) && \
    wget -O /tmp/chromedriver.zip https://chromedriver.storage.googleapis.com/${CHROMEDRIVER_VERSION}/chromedriver_linux64.zip && \
    unzip /tmp/chromedriver.zip -d /usr/local/bin/ && \
    rm /tmp/chromedriver.zip && \
    chmod +x /usr/local/bin/chromedriver


    

# ⑤ 環境変数に ChromeDriver のパスを設定する
ENV CHROMEDRIVER_PATH=/usr/local/bin/chromedriver

# ⑥ 作業ディレクトリを設定し、アプリケーションのファイルをコピーする
WORKDIR /app
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt
COPY . .

# ⑦ 必要なポート（ここでは 5000 番）を公開する
EXPOSE 5000

# ⑧ コンテナ起動時のコマンドを指定する（例：Flask アプリの起動）
CMD ["python", "app.py"]
#-------------------------------------------------------------------
# # Use the official Python 3.9 slim image as the base image
# FROM python:3.9-slim

# # Install required system packages: wget, gnupg, unzip, curl, jq, ca-certificates
# RUN apt-get update && apt-get install -y \
#     wget \
#     gnupg \
#     unzip \
#     curl \
#     jq \
#     ca-certificates \
#     && rm -rf /var/lib/apt/lists/*

# # --------------------------------------------------------------------
# # Pin a known working version of Chrome-for-Testing (and ChromeDriver)
# # We choose version 115.0.5790.102 because its assets are available.
# # These assets are hosted at the Google Edge download endpoint.
# # --------------------------------------------------------------------

# # Set an environment variable for the Chrome-for-Testing version
# ENV CFTEST_VERSION=115.0.5790.102

# # Download Chrome-for-Testing for Linux
# RUN wget -O /tmp/chrome-linux.zip "https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/${CFTEST_VERSION}/linux64/chrome-linux.zip" && \
#     unzip /tmp/chrome-linux.zip -d /opt && \
#     rm /tmp/chrome-linux.zip

# # Add the downloaded Chrome binary to the PATH.
# # (The extracted folder is assumed to be /opt/chrome-linux)
# ENV PATH="/opt/chrome-linux:${PATH}"

# # Download the matching ChromeDriver for Chrome-for-Testing version 115
# RUN wget -O /tmp/chromedriver.zip "https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/${CFTEST_VERSION}/linux64/chromedriver-linux64.zip" && \
#     unzip /tmp/chromedriver.zip -d /usr/local/bin/ && \
#     rm /tmp/chromedriver.zip && \
#     chmod +x /usr/local/bin/chromedriver

# # Set environment variable for ChromeDriver path so your Selenium code can find it
# ENV CHROMEDRIVER_PATH=/usr/local/bin/chromedriver

# # --------------------------------------------------------------------
# # Set up the Python environment and copy your application files
# # --------------------------------------------------------------------
# WORKDIR /app
# COPY requirements.txt .
# RUN pip install --upgrade pip && pip install -r requirements.txt
# COPY . .

# # Expose port 5000 (used by your Flask application)
# EXPOSE 5000

# # Command to run your Flask application
# CMD ["python", "app.py"]
