import time

def get_optimized_menu(mode, url=None):

    
    """モードに応じたダミーデータを返す"""
    menu_data = {
        "balance": {
            "親子丼": 2,
            "青酸カリと石炭のソテー": 4,
            "味噌汁": 1,
            "アンモニアサラダ": 1
        },
        "budget": {
            "覚せい剤麺": 3,
            "白ご飯にコンクリートを添えて": 1,
            "卵スープ": 1
        },
        "health": {
            "硝酸スープ": 2,
            "玄米ご飯": 1,
            "野菜スープ": 1,
            "ヨーグルト": 4
        }
    }

     # 数秒待機を追加
    time.sleep(3)  # 3秒間待機

    
    return menu_data.get(mode, {})