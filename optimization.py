def get_optimized_menu(mode, menu_id=None):
    """
    CSVデータとExcelの基準値からメニュー最適化を行い、
    各商品の数量と画像URLを含む連想配列を返す関数。

    Parameters:
        mode (str): '普通', 'タンパク質', 'カロリー' のいずれか。
        url (str): セキュリティチェック用（現状は未使用）。

    Returns:
        dict: キーが料理名、値が {"quantity": 数量, "image_url": 画像URL} の辞書。
    """
    import csv
    import pulp
    import openpyxl
    import random
    import time

    # ★ ファイルパスの設定（適宜パスを変更してください）
    menu_csv_file = "menu_csv/" + menu_id + ".csv" #data_test_menu.csv" #filetitleにファイル名が入っている   # プログラム1で作成されたCSVファイル
    std_excel_file = "data_std.xlsx"       # Excel形式の基準値ファイル

    # ★ CSVからデータを読み込み
    menus = []         # 料理名リスト
    prices = {}        # 料理ごとの価格
    nutrients = {}     # 料理ごとの栄養素データ（数値リスト）
    image_urls = {}    # 料理ごとの画像URL

    with open(menu_csv_file, "r", encoding="utf-8-sig") as f:
        reader = csv.reader(f)
        data = list(reader)

    # ヘッダーの想定: ["料理名", "価格", "エネルギー", "タンパク質", ... , "ビタミンC", "画像URL"]
    # 栄養素は「料理名」と「価格」、および「画像URL」を除いた部分とする
    header = data[0]
    nutrient_names = header[2:-1]  # 最後の列(画像URL)は除外

    for row in data[1:]:
        if not row:
            continue
        menu_name = row[0]
        price = int(row[1])
        # 栄養素はヘッダーに沿って、2列目から最後の前までを変換
        nutrient_values = [float(v) if v else 0.0 for v in row[2:-1]]
        image_url = row[-1]

        menus.append(menu_name)
        prices[menu_name] = price
        nutrients[menu_name] = nutrient_values
        image_urls[menu_name] = image_url

    # ★ Excelから必要栄養素の基準値を読み込み
    required_nutrients = []
    max_nutrients = []  # （ここでは上限は利用しません）

    wb = openpyxl.load_workbook(std_excel_file, data_only=True)
    sheet = wb.active
    # 2行目以降のB列（必要量）とC列（最大摂取量）を読み込み
    for row in sheet.iter_rows(min_row=2, max_row=sheet.max_row, min_col=2, max_col=3, values_only=True):
        req = float(row[0]) if row[0] is not None else 0.0
        max_val = float(row[1]) if row[1] is not None else float("inf")
        required_nutrients.append(req)
        max_nutrients.append(max_val)
    wb.close()

    # ★ modeに応じて必要栄養素を調整
    modified_required_nutrients = required_nutrients[:]  # ディープコピー
    if mode == 'normal':
        # 全栄養素を 0.75〜1.25 倍でランダム調整
        modified_required_nutrients = [val * random.uniform(0.75, 1.25) for val in required_nutrients]
    elif mode == 'tanpaku':
        # タンパク質（リスト中、2番目＝インデックス1）を強化
        modified_required_nutrients[1] *= random.uniform(1.5, 2.0)
    elif mode == 'karori':
        # エネルギー（リスト中、最初＝インデックス0）を強化
        modified_required_nutrients[0] *= random.uniform(1.5, 2.0)
    else:
        raise ValueError(f"未知のモード: {mode}")

    # ★ 最適化問題の定義
    problem = pulp.LpProblem("Menu_Optimization", pulp.LpMinimize)
    # 料理ごとの選択数（重複選択可、整数変数）
    x = pulp.LpVariable.dicts("x", menus, lowBound=0, cat='Integer')

    # 目的関数：全体の価格を最小化
    problem += pulp.lpSum([prices[m] * x[m] for m in menus])

    # 各栄養素について、必要量以上となるよう制約を追加
    for i, nutrient_name in enumerate(nutrient_names):
        problem += pulp.lpSum([nutrients[m][i] * x[m] for m in menus]) >= modified_required_nutrients[i], f"{nutrient_name}_min_constraint"

    # 最適化の実行（内部の出力は非表示）
    problem.solve(pulp.PULP_CBC_CMD(msg=False))

    # ★ 結果の集計：選択された料理のみを返す（数量が1以上のもの）
    optimized_menu = {}
    for m in menus:
        quantity = int(pulp.value(x[m]))
        if quantity >= 1:
            optimized_menu[m] = {
                "quantity": quantity,
                "image_url": image_urls[m]
            }

    # （処理中の疑似待機：必要に応じて）
    # time.sleep(3)
    
    return optimized_menu

# 以下、関数の動作確認用（単体テスト）：
if __name__ == '__main__':
    # 例：モード 'カロリー' で実行
    result = get_optimized_menu("カロリー", url="http://example.com")
    print("最適化結果:")
    for menu, info in result.items():
        print(f"{menu}: {info['quantity']}個, 画像URL: {info['image_url']}")
