// DOM要素の取得
const resultButton = document.getElementById('resultButton');
const spinner = document.querySelector('.spinner');
const flipCard = document.querySelector('.flip-card');
const codeDisplay = document.getElementById('codeDisplay');

// URLパラメータからモードとURLを取得
const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode');
const url = urlParams.get('url');  // index.js から渡すようにしておく

// --- フリップ処理：ボタン以外をタップでカードをひっくり返す ---
flipCard.addEventListener('click', (e) => {
    // クリックターゲットがボタンの場合は何もしない
    if (e.target.tagName.toLowerCase() === 'button') return;
    flipCard.classList.toggle('flip');
});

// --- 裏面のコードを外部テキストファイルから読み込む ---
function loadCode() {
    fetch('static/assets/code/optimize-code.txt')
        .then(response => {
            if (!response.ok) throw new Error('コードファイルの読み込みに失敗しました');
            return response.text();
        })
        .then(text => {
            // テキストを行ごとに分割
            const lines = text.split('\n');
            // 各行に行番号を付与するHTMLを生成
            const html = lines.map((line, index) => {
                return `<span class="code-line"><span class="line-number">${index + 1}</span>${line}</span>`;
            }).join('\n');
            codeDisplay.innerHTML = html;
        })
        .catch(error => {
            console.error(error);
            codeDisplay.textContent = '// コードの読み込みに失敗しました';
        });
}
loadCode();



// --- 新規追加：API を呼び出す関数 ---
function startOptimization(mode, menu_id) {
    fetch('/api/optimize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mode: mode, menu_id: menu_id })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.message || '最適化に失敗しました');
            });
        }
        return response.json();
    })
    .then(data => {
        localStorage.setItem('optimizedMenu', JSON.stringify(data));
        showResultReady();
    })
    .catch(error => {
        console.error('Error:', error);
        showError(error.message);
    });
}

// --- 既存関数：結果表示 ---
function showResultReady() {
    // スピナーを非表示に
    spinner.style.display = 'none';
    
    // loading-card 内の h2 と p を取得して非表示にする
    const loadingCard = document.querySelector('.loading-card');
    const titleElement = loadingCard.querySelector('h2');
    const descriptionElement = loadingCard.querySelector('p');
    if (titleElement) titleElement.style.display = 'none';
    if (descriptionElement) descriptionElement.style.display = 'none';
    
    // チェックマークを表示する要素を作成
    const checkMark = document.createElement('div');
    checkMark.className = 'check-mark';
    checkMark.textContent = '☑';
    
    // チェックマークを結果ボタンの上に追加
    loadingCard.insertBefore(checkMark, resultButton);
    
    // 成功メッセージ（任意）の場合は追加
    const successMsg = document.createElement('p');
    successMsg.className = 'success-message';
    successMsg.textContent = '最適化が完了しました！';
    loadingCard.insertBefore(successMsg, resultButton);
    
    // 結果ボタンを有効化
    resultButton.disabled = false;
    
    // ボタンにイベントリスナーを追加
    resultButton.addEventListener('click', () => {
        resultButton.innerHTML = '読み込み中... <span class="mini-spinner"></span>';
        window.location.href = `/result?mode=${mode}&url=${url}`;
    });
}



// --- 既存関数：エラー表示 ---
const errorTemplate = `
    <div class="error-content">
        <h2>最適化に失敗しました</h2>
        <p class="error-message"></p>
        <button class="retry-button">再試行する</button>
        <button class="home-button">TOPに戻る</button>
    </div>
`;

function showError(errorMessage) {
    spinner.style.display = 'none';
    const loadingCard = document.querySelector('.loading-card');
    loadingCard.innerHTML = errorTemplate;
    
    document.querySelector('.error-message').textContent = errorMessage || '不明なエラーが発生しました';
    
    document.querySelector('.retry-button').addEventListener('click', () => {
        localStorage.removeItem('optimizationError');
        localStorage.removeItem('optimizedMenu');
        window.location.reload();
    });
    
    document.querySelector('.home-button').addEventListener('click', () => {
        window.location.href = '/';
    });
}

// --- DOMContentLoaded 時に最適化を開始 ---
document.addEventListener('DOMContentLoaded', () => {

    

    startOptimization(mode, url);
    
    window.addEventListener('beforeunload', (e) => {
        if (!localStorage.getItem('optimizedMenu')) {
            e.preventDefault();
            e.returnValue = '最適化処理中です。ページを離れると処理が中断されます。';
        }
    });
});
