from flask import Flask, request, jsonify, render_template
from optimization import get_optimized_menu
import os
from urllib.parse import urlparse
import re

# app = Flask(__name__, static_folder='../frontend/static', 
#             template_folder='../frontend/templates')
app = Flask(__name__, static_folder='static', 
              template_folder='templates')


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
    menu_id = data.get('menu_id')
    
    if not mode:
        print("mode not selected...")
        return jsonify({"message": "Mode not specified"}), 400
    
    if not menu_id or not is_safe_url(menu_id):
        return jsonify({
            "message": "指定されたURLは安全でない可能性があるため、最適化できません。 有効なHTTP/HTTPS URLを指定してください"
        }), 400
    
    try:
        print("optimization start command on app.py..")
        optimized_menu = get_optimized_menu(mode, menu_id)
        print("optimized menu:", optimized_menu)
        return jsonify(optimized_menu)
    except Exception as e:
        # Return the exception message in the "message" field for better debugging.
        return jsonify({"message": str(e)}), 500

# @app.route('/api/optimize', methods=['POST'])
# def optimize():
#     data = request.get_json()
#     mode = data.get('mode')
#     url = data.get('url')
    
#     if not mode:
#         print("mode not seleced...")
#         return jsonify({"error": "Mode not specified"}), 400
    
#     # URLのセキュリティチェック
#     if not url or not is_safe_url(url):
#         return jsonify({
#             "error": "指定されたURLは安全でない可能性があるため、最適化できません",
#             "details": "有効なHTTP/HTTPS URLを指定してください"
#         }), 400
    
#     try:
#         print("optimization start command on app py..")
#         optimized_menu = get_optimized_menu(mode, url)  # urlパラメータを追加　ここ結構時間かかるから、最適化している間に見せるページも必要

#         print("optimized menu:",optimized_menu)
#         return jsonify(optimized_menu)
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
    


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
    #app.run(debug=True)