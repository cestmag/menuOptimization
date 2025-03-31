from flask import Flask, request, jsonify, render_template
from optimization import get_optimized_menu
import os
from urllib.parse import urlparse
import re

app = Flask(__name__, static_folder='../frontend/static', 
            template_folder='../frontend/templates')


def is_safe_url(url):
    """セキュリティチェックを行う関数"""
    try:
        parsed = urlparse(url)
        
        # 許可するスキーム (http, httpsのみ)
        if parsed.scheme not in ('http', 'https'):
            return False
            
        # ドメインチェック (必要に応じて許可ドメインを制限)
        # 例: 特定ドメインのみ許可する場合
        # allowed_domains = ['example.com', 'safe-domain.com']
        # if parsed.netloc not in allowed_domains:
        #     return False
            
        # 一般的な危険なパターンチェック
        if re.search(r'(javascript:|data:|vbscript:|<\s*script)', url, re.IGNORECASE):
            return False
            
        return True
    except:
        return False

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/result')
def result():
    return render_template('result.html')

@app.route('/loading')
def loading():
    mode = request.args.get('mode')
    return render_template('loading.html', mode=mode)

@app.route('/api/optimize', methods=['POST'])
def optimize():
    data = request.get_json()
    mode = data.get('mode')
    url = data.get('url')
    
    if not mode:
        return jsonify({"error": "Mode not specified"}), 400
    
    # URLのセキュリティチェック
    if not url or not is_safe_url(url):
        return jsonify({
            "error": "指定されたURLは安全でない可能性があるため、最適化できません",
            "details": "有効なHTTP/HTTPS URLを指定してください"
        }), 400
    
    try:
        optimized_menu = get_optimized_menu(mode, url)  # urlパラメータを追加　ここ結構時間かかるから、最適化している間に見せるページも必要

        print("optimized menu:",optimized_menu)
        return jsonify(optimized_menu)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    


if __name__ == '__main__':
    app.run(debug=True)