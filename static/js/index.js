import storeData from './store.js';

document.addEventListener('DOMContentLoaded', function() {
    const visitUrlButton = document.getElementById('visitUrlButton');
    const menuSelect = document.getElementById('menuSelect');
    const submitButton = document.getElementById('submitButton');
    // ※もし手入力用のテキストボックス（menuUrl）が存在する場合
    const menuUrlInput = document.getElementById('menuUrl');

    // storeDataからセレクトボックスのオプションを生成
    storeData.forEach(store => {
        const option = document.createElement('option');
        // valueには店舗識別子（store.url）を設定
        option.value = store.url;
        // 実際にアクセスするURLは data-realurl 属性に格納
        option.dataset.realurl = store.real_url;
        option.textContent = `${store.name} (${store.hours})`;
        menuSelect.appendChild(option);
    });

    // 「メニューサイトを開く」ボタン：選択された option の data-realurl を利用して新規タブで開く
    visitUrlButton.addEventListener('click', function() {
        const selectedIndex = menuSelect.selectedIndex;
        if (selectedIndex >= 0) {
            const selectedOption = menuSelect.options[selectedIndex];
            const realUrl = selectedOption.dataset.realurl;
            if (realUrl) {
                window.open(realUrl, '_blank');
            } else {
                alert('食堂を選択しなさい😡');
            }
        } else {
            alert('メニューを選択してください');
        }
    });

    // 「メニュー最適化開始」ボタン：選択されたモードと店舗識別子をクエリパラメータに設定し、loadingページへ遷移
    submitButton.addEventListener('click', function() {
        const selectedMode = document.querySelector('input[name="optimizeMode"]:checked')?.value;
        const selectedStoreId = menuSelect.value; // これはstore.urlの値
        if (!selectedMode) {
            alert('モードを選択してください');
            return;
        }
        if (!selectedStoreId) {
            alert('メニューを選択してください');
            return;
        }
        const params = new URLSearchParams({ mode: selectedMode, url: selectedStoreId });
        window.location.href = `/loading?${params.toString()}`;
    });

    // ラジオボタンのあるラベル（.radio-item）をクリックした際に対応するinputをチェック状態にする
    document.querySelectorAll('.radio-item').forEach(item => {
        item.addEventListener('click', function() {
            const radioInput = this.querySelector('input[type="radio"]');
            if (radioInput) {
                radioInput.checked = true;
            }
        });
    });

    // ※もし手入力用テキストボックス（menuUrl）がある場合の処理（不要なら削除）
    if (menuUrlInput) {
        visitUrlButton.addEventListener('click', function() {
            let url = menuUrlInput.value.trim();
            if (!url) {
                alert('URLを入力してください');
                return;
            }
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }
            window.open(url, '_blank');
        });
    }
});
