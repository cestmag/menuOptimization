// URLパラメータからmodeを取得（必要に応じて利用）
const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode');

// localStorageから最適化結果（複数試行のデータ）を取得
// 形式例: { "trial_1": { "料理A": {quantity, image_url, price}, ... }, "trial_2": { ... } }
const optimizedMenuData = JSON.parse(localStorage.getItem('optimizedMenu')) || {};

/**
 * 画像要素を生成する関数
 * @param {string} foodName - 料理名
 * @param {string} imageUrl - 画像URL
 * @returns {HTMLElement} - 画像を含む要素
 */
function createPhotoItem(foodName, imageUrl) {
    const container = document.createElement('div');
    container.className = 'photo-item';

    const img = new Image();
    img.className = 'food-photo';
    img.alt = `${foodName}の写真`;
    img.src = imageUrl;

    img.onerror = () => {
        const fallback = document.createElement('div');
        fallback.className = 'photo-fallback';
        fallback.textContent = foodName;
        container.innerHTML = '';
        container.appendChild(fallback);
    };

    container.appendChild(img);
    return container;
}

/**
 * 指定された試行結果（trialData）をレンダリングする関数
 * trialData: { foodName: { quantity, image_url, price }, ... }
 */
function renderTrialResult(trialData) {
    const container = document.getElementById('container');
    container.innerHTML = ''; // 前回の結果をクリア

    Object.entries(trialData).forEach(([foodName, info]) => {
        const { quantity, image_url, price } = info;
        
        const section = document.createElement('div');
        section.className = 'food-section';

        const title = document.createElement('h2');
        title.className = 'food-title';
        title.textContent = `${foodName} - ${quantity}個 (${price}円)`;

        const grid = document.createElement('div');
        grid.className = 'photos-grid';

        for (let i = 0; i < quantity; i++) {
            grid.appendChild(createPhotoItem(foodName, image_url));
        }

        section.append(title, grid);
        container.appendChild(section);
    });
}

/**
 * 各試行ごとのプラン選択ボタンを生成する関数
 */
function renderTrialButtons() {
    const trialButtonsContainer = document.getElementById('trial-buttons');
    trialButtonsContainer.innerHTML = '';

    const trialKeys = Object.keys(optimizedMenuData);
    if (trialKeys.length === 0) {
        trialButtonsContainer.textContent = '最適化結果がありません';
        return;
    }
    
    trialKeys.forEach((trialKey, index) => {
        const button = document.createElement('button');
        button.className = 'trial-button';
        button.textContent = `プラン${index + 1}`;
        button.addEventListener('click', () => {
            renderTrialResult(optimizedMenuData[trialKey]);
            // ボタンのアクティブ状態更新
            document.querySelectorAll('.trial-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
        trialButtonsContainer.appendChild(button);
    });
}

window.addEventListener('load', () => {
    renderTrialButtons();
    const trialKeys = Object.keys(optimizedMenuData);
    if (trialKeys.length > 0) {
        // 初期表示は最初のプランの結果
        renderTrialResult(optimizedMenuData[trialKeys[0]]);
        const firstButton = document.querySelector('.trial-button');
        if (firstButton) firstButton.classList.add('active');
    }
});

window.addEventListener('resize', () => {
    document.querySelectorAll('.photo-item').forEach(item => {
        item.style.transform = 'none';
    });
});

document.getElementById('backButton')?.addEventListener('click', () => {
    const button = document.getElementById('backButton');
    button.style.boxShadow = `0 0 30px ${getComputedStyle(document.documentElement)
        .getPropertyValue('--accent-neon')}`;
    setTimeout(() => {
        window.location.href = '/';
    }, 300);
});

