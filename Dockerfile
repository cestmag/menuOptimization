# ① Python の公式 slim イメージをベースにする
FROM python:3.9-slim

# ② 必要なシステムパッケージをインストールする（ここでは最低限のパッケージのみ）
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# ③ 作業ディレクトリを設定し、アプリケーションのファイルをコピーする
WORKDIR /app
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt
COPY . .

# ④ 必要なポート（ここでは 5000 番）を公開する
EXPOSE 5000

# ⑤ コンテナ起動時のコマンドを指定する（gunicornでFlaskアプリを起動）
CMD ["python", "app.py"]
#本番環境
#CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app"] 
#
#docker build -t my_flask_app .
#docker run -p 5000:5000 my_flask_app
#
