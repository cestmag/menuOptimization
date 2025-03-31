import storeData from './store.js';

// export async function handleSubmit_legacy() {
//     const selectedMode = document.querySelector(
//         'input[name="optimizeMode"]:checked'
//     )?.value;

//     if (!selectedMode) {
//         alert('モードを選択してください');
//         return;
//     }

//     document.body.classList.add('loading');
    
//     try {
//         const response = await fetch('/api/optimize', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ mode: selectedMode})//ここにurlも追加したい。
//         });
        
//         const data = await response.json();
//         localStorage.setItem('optimizedMenu', JSON.stringify(data));
//         window.location.href = '/result?mode=' + selectedMode;
//     } catch (error) {
//         console.error('Error:', error);
//         document.body.classList.remove('loading');
//         alert('最適化に失敗しました');
//     }
// }

document.addEventListener('DOMContentLoaded', function() {
    const visitUrlButton = document.getElementById('visitUrlButton');
    const menuSelect = document.getElementById('menuSelect');
    const submitButton = document.getElementById('submitButton');

    // メニューサイトを開く
    visitUrlButton.addEventListener('click', function() {
        const selectedUrl = menuSelect.value;
        if (selectedUrl) {
            window.open(selectedUrl, '_blank');
        }
    });

    submitButton.addEventListener('click', async function() {
        const selectedMode = document.querySelector('input[name="optimizeMode"]:checked')?.value;
        const selectedUrl = menuSelect.value;
    
        if (!selectedMode) {
            alert('モードを選択してください');
            return;
        }
    
        if (!selectedUrl) {
            alert('メニューを選択してください');
            return;
        }

         // 必要なパラメータをローカルストレージまたはクエリパラメータに保存する
    // ここでは簡単のためクエリパラメータにする例です
        const params = new URLSearchParams({ mode: selectedMode, url: selectedUrl });
    
    // すぐに loading ページへ遷移する
        window.location.href = `/loading?${params.toString()}`;
    
        // ローカルストレージをクリア
        // localStorage.removeItem('optimizedMenu');
        
        // try {
        //     const response = await fetch('/api/optimize', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({ 
        //             mode: selectedMode,
        //             url: selectedUrl
        //         })
        //     });
            
        //     if (!response.ok) {
        //         const errorData = await response.json();
        //         throw new Error(errorData.message || '最適化に失敗しました');
        //     }
            
        //     const data = await response.json();
        //     localStorage.setItem('optimizedMenu', JSON.stringify(data));
    
        //     // fetch 成功後に待機ページへ遷移
        //     window.location.href = `/loading?mode=${selectedMode}`;
    
        // } catch (error) {
        //     console.error('Error:', error);
        //     localStorage.setItem('optimizationError', error.message || '最適化に失敗しました');
        // }
    });
    

    // submitButton.addEventListener('click', async function() {
    //     const selectedMode = document.querySelector(
    //         'input[name="optimizeMode"]:checked'
    //     )?.value;
    //     const selectedUrl = menuSelect.value;
    
    //     if (!selectedMode) {
    //         alert('モードを選択してください');
    //         return;
    //     }
    
    //     if (!selectedUrl) {
    //         alert('メニューを選択してください');
    //         return;
    //     }
    
    //     // ローカルストレージをクリア
    //     localStorage.removeItem('optimizedMenu');
        
    //     // 待機ページに遷移
    //     window.location.href = `/loading?mode=${selectedMode}`;
        
    //     // バックグラウンドで最適化を開始
        
    //     try {
    //         const response = await fetch('/api/optimize', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ 
    //                 mode: selectedMode,
    //                 url: selectedUrl
    //             })
    //         });
            
    //         if (!response.ok) {
    //             console.error('why')
    //             const errorData = await response.json();
    //             throw new Error(errorData.message || '最適化に失敗しました');
    //         }
            
    //         const data = await response.json();
    //         localStorage.setItem('optimizedMenu', JSON.stringify(data));
            
    //     } catch (error) {
          
    //         // エラー処理（後述）
    //         console.error('error happened')
    //         console.error('Error:', error);
    //         console.error('エラー詳細:', error.message, error.stack);
    //         localStorage.setItem('optimizationError', error.message || '最適化に失敗しました');
    //     }
    // });

    // 最適化開始
    // submitButton.addEventListener('click', async function() {
    //     const selectedMode = document.querySelector(
    //         'input[name="optimizeMode"]:checked'
    //     )?.value;
    //     const selectedUrl = menuSelect.value;

    //     if (!selectedMode) {
    //         alert('モードを選択してください');
    //         return;
    //     }

    //     if (!selectedUrl) {
    //         alert('メニューを選択してください');
    //         return;
    //     }

    //     document.body.classList.add('loading');
        
    //     try {
    //         const response = await fetch('/api/optimize', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ 
    //                 mode: selectedMode,
    //                 url: selectedUrl
    //             })
    //         });
            
    //         if (!response.ok) {
    //             const errorData = await response.json();
    //             throw new Error(errorData.message || '最適化に失敗しました');
    //         }
            
    //         const data = await response.json();
    //         localStorage.setItem('optimizedMenu', JSON.stringify(data));
    //         window.location.href = '/result?mode=' + selectedMode;
    //     } catch (error) {
    //         console.error('Error:', error);
    //         document.body.classList.remove('loading');
    //         alert(error.message || '最適化に失敗しました');
    //     }
    // });
});

// export async function handleSubmit_legacy2() {
//     const selectedMode = document.querySelector(
//         'input[name="optimizeMode"]:checked'
//     )?.value;
//     const menuUrlInput = document.getElementById('menuUrl');
//     const url = menuUrlInput.value.trim();

//     if (!selectedMode) {
//         alert('モードを選択してください');
//         return;
//     }

//     // 基本的なURLバリデーション
//     if (!url || url === '#') {
//         alert('有効なURLを入力してください');
//         return;
//     }

//     // シンプルなURL形式チェック
//     if (!isValidUrl(url)) {
//         alert('正しいURL形式で入力してください (例: https://example.com)');
//         return;
//     }

//     document.body.classList.add('loading');
    
//     try {
//         const response = await fetch('/api/optimize', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ 
//                 mode: selectedMode,
//                 url: url // URLを追加
//             })
//         });
        
//         if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(errorData.message || '最適化に失敗しました');
//         }
        
//         const data = await response.json();
//         localStorage.setItem('optimizedMenu', JSON.stringify(data));
//         window.location.href = '/result?mode=' + selectedMode;
//     } catch (error) {
//         console.error('Error:', error);
//         document.body.classList.remove('loading');
//         alert(error.message || '最適化に失敗しました');
//     }
// }

// 簡易URLバリデーション関数
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

//ここは本来ない。バックエンドが担う
function simulateOptimization(mode) {
    // ダミーデータ（実際にはAPI呼び出しに置き換え）
    setTimeout(() => {
        const sampleData = {
            "親子丼": 1,
            "白ご飯": 2,
            "味噌汁": 1
        };

        // 結果ページへ遷移
        window.location.href = `result.html?mode=${mode}`;
        // 実際の実装では結果ページにデータを渡す必要があります
    }, 1500);
}

// エフェクト初期化
document.querySelectorAll('.radio-item').forEach(item => {
    item.addEventListener('click', function() {
        this.querySelector('input[type="radio"]').checked = true;
    });
});
//url先に飛ぶ
document.addEventListener('DOMContentLoaded', function() {
    const visitUrlButton = document.getElementById('visitUrlButton');
    const menuUrlInput = document.getElementById('menuUrl');

    // 店舗データからセレクトボックスを生成
    storeData.forEach(store => {
        const option = document.createElement('option');
        option.value = store.url;
        option.textContent = `${store.name} (${store.hours})`;
        menuSelect.appendChild(option);
    });

    visitUrlButton.addEventListener('click', function() {
        // 入力されたURLを取得
        let url = menuUrlInput.value.trim();
        
        // URLのバリデーション（簡単なチェック）
        if (!url) {
            alert('URLを入力してください');
            return;
        }
        
        // http:// または https:// がついていない場合に追加
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        
        // 新しいタブでURLを開く
        window.open(url, '_blank');
    });
});

// ボタンにイベントリスナーを設定
document.getElementById('submitButton')?.addEventListener('click', handleSubmit);