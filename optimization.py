import time
import re
import random
import pulp
import openpyxl
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

def scrape_menu_data(target_url):

    print("scraping start..")
    """
    Selenium を用いて指定の target_url からメニューの URL 一覧を取得し、
    各料理ページから料理名、価格、各栄養素、画像URL をスクレイピングする。
    結果は辞書のリストとして返す。
    """
    # ChromeDriver のパスは環境に合わせて変更してください
    # 環境変数から ChromeDriver のパスを取得
     # 環境変数から ChromeDriver のパスを取得
    chromedriver_path = os.environ.get('CHROMEDRIVER_PATH', '/usr/local/bin/chromedriver')
    service = Service(chromedriver_path)
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # PaaS 環境では headless モードが推奨される
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    
    driver = webdriver.Chrome(service=service, options=chrome_options)
    data_list = []

    print("chrome success..")
    
    try:
        # 指定されたURLからスクレイピング開始
        driver.get(target_url)
        time.sleep(2)
        wait = WebDriverWait(driver, 10)
        
        # 各種ボタンをクリックしてメニューの一覧表示を展開
        element_ids = ["on_b", "on_c", "on_d", "on_bunrui1"]
        for element_id in element_ids:
            try:
                element = wait.until(EC.element_to_be_clickable((By.ID, element_id)))
                element.click()
                print(f"Clicked {element_id}")
                time.sleep(1)
            except Exception as e:
                print(f"Could not click {element_id}: {e}")
        
        wait.until(EC.presence_of_element_located((By.CLASS_NAME, "catMenu")))
        links = driver.find_elements(By.CSS_SELECTOR, ".catMenu a")
        urls = [link.get_attribute("href") for link in links]
        print(f"取得したURL数: {len(urls)} 件")
        
        # 各料理の詳細ページから情報を取得
        for url in urls:
            driver.get(url)
            time.sleep(2)
            try:
                title_element = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#main h1")))
                recipe_name = title_element.text.strip().split("\n")[0]
                
                # 価格などの情報（class="price" の要素）
                elements = wait.until(EC.presence_of_all_elements_located((By.CLASS_NAME, "price")))
                # 画像は最初の img タグから取得
                image_elements = driver.find_elements(By.CSS_SELECTOR, "#main img")
                image_url = image_elements[0].get_attribute("src") if image_elements else "なし"
                
                # 各種数値情報（数字のみ抽出）
                values = [re.sub(r"[^\d.]", "", elem.text) for elem in elements]
                
                # 必要な栄養素情報が12項目以上ある場合のみ採用
                if len(values) >= 12:
                    data_dict = {
                        "料理名": recipe_name,
                        "価格": values[0],
                        "エネルギー": values[1],
                        "タンパク質": values[2],
                        "脂質": values[3],
                        "炭水化物": values[4],
                        "食塩相当量": values[5],
                        "カルシウム": values[6],
                        "野菜量": values[7],
                        "鉄": values[8],
                        "ビタミンA": values[9],
                        "ビタミンB1": values[10],
                        "ビタミンB2": values[11],
                        "ビタミンC": values[12],
                        "画像URL": image_url
                    }
                    data_list.append(data_dict)
                    print(f"取得成功: {data_dict}")
                else:
                    print(f"データ不足のためスキップ: {url}")
            except Exception as e:
                print(f"エラー発生: {url}, {e}")
        
        print("\n=== 取得データ一覧 ===")
        for item in data_list:
            print(item)
    
    finally:
        driver.quit()
    
    return data_list

def run_optimization(data_list, mode):
    """
    スクレイピングで取得したメニュー情報と、Excel の基準値（data_std.xlsx）に基づく栄養素最適化問題を解く。
    各料理の数量と画像URL、合計価格を結果として連想配列で返す。
    """
    # CSV の場合と同様のフォーマットで、料理名・価格・栄養素情報を整形する
    nutrient_names = ["エネルギー", "タンパク質", "脂質", "炭水化物", "食塩相当量",
                      "カルシウム", "野菜量", "鉄", "ビタミンA", "ビタミンB1", "ビタミンB2", "ビタミンC"]
    
    menus = []
    prices = {}
    nutrients = {}
    images = {}  # 料理ごとの画像URLを保持
    
    for item in data_list:
        menu = item["料理名"]
        price = item["価格"]
        try:
            price_val = int(price) if price else 0
        except:
            price_val = 0
        
        nutrient_values = []
        for n in nutrient_names:
            try:
                val = float(item[n]) if item[n] else 0.0
            except:
                val = 0.0
            nutrient_values.append(val)
        
        menus.append(menu)
        prices[menu] = price_val
        nutrients[menu] = nutrient_values
        images[menu] = item.get("画像URL", "なし")
    
    # Excelファイル（data_std.xlsx）から基準摂取量(required)と最大摂取量(max)を取得する
    std_excel_file = "data_std.xlsx"
    required_nutrients = []
    max_nutrients = []
    
    wb = openpyxl.load_workbook(std_excel_file, data_only=True)
    sheet = wb.active
    for row in sheet.iter_rows(min_row=2, max_row=sheet.max_row, min_col=2, max_col=3, values_only=True):
        required_nutrients.append(float(row[0]) if row[0] is not None else 0.0)
        max_nutrients.append(float(row[1]) if row[1] is not None else float("inf"))
    wb.close()
    
    # モードに応じた必要栄養素の調整
    modified_required_nutrients = required_nutrients[:]
    if mode == 'normal':
        modified_required_nutrients = [val * random.uniform(0.75, 1.25) for val in required_nutrients]
    elif mode == 'tanpaku':
        modified_required_nutrients[1] *= random.uniform(1.5, 2.0)
    elif mode == 'karori':
        modified_required_nutrients[0] *= random.uniform(1.5, 2.0)
    else:
        raise ValueError(f"未知のモード: {mode}")
    
    # 最適化問題（総価格の最小化）を PuLP で解く（今回は1回の試行とする）
    trial = 1
    problem = pulp.LpProblem(f"Menu_Optimization_Trial_{trial}", pulp.LpMinimize)
    x = pulp.LpVariable.dicts("x", menus, lowBound=0, cat='Integer')
    problem += pulp.lpSum([prices[m] * x[m] for m in menus])
    for i, nutrient in enumerate(nutrient_names):
        problem += pulp.lpSum([nutrients[m][i] * x[m] for m in menus]) >= modified_required_nutrients[i], f"{nutrient}_min_constraint_{trial}"
    
    problem.solve(pulp.PULP_CBC_CMD(msg=False))
    
    result = {}
    for m in menus:
        qty = int(pulp.value(x[m]))
        if qty >= 1:
            result[m] = {"数量": qty, "画像URL": images[m]}
    result["合計価格"] = pulp.value(problem.objective)
    return result

def get_optimized_menu(mode, url):
    """
    Flask の API から呼ばれる関数。
    引数として受け取ったスクレイピング先の URL とモードを用い、スクレイピングおよび最適化を実施し、
    結果を連想配列で返す。（各料理の数量と画像URL、合計価格）
    """
    # 指定された URL からメニュー情報をスクレイピング
    print("scraping is about to start...")
    data_list = scrape_menu_data(url)
    if not data_list:
        print("scraping failed:( ")
        raise ValueError("スクレイピングに失敗しました。データが取得できませんでした。")
    
    optimized_result = run_optimization(data_list, mode)
    return optimized_result
