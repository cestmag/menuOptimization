// URLパラメータからモードを取得
const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode');

// localStorageからoptimized_menu形式のデータを取得
const foodData = JSON.parse(localStorage.getItem('optimizedMenu')) || {};

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
    // 画像URLを動的に設定
    img.src = imageUrl;

    // 画像読み込みエラー時のフォールバック
    img.onerror = () => {
        const fallback = document.createElement('div');
        fallback.className = 'photo-fallback';
        fallback.textContent = foodName;
        container.innerHTML = '';  // エラー時は画像をクリア
        container.appendChild(fallback);
    };

    container.appendChild(img);
    return container;
}

function renderSections() {
    const container = document.getElementById('container');
    
    // foodDataは { foodName: { quantity, image_url } } の形式
    Object.entries(foodData).forEach(([foodName, info]) => {
        const { quantity, image_url } = info;
        
        const section = document.createElement('div');
        section.className = 'food-section';

        const title = document.createElement('h2');
        title.className = 'food-title';
        title.textContent = foodName;
        
        const grid = document.createElement('div');
        grid.className = 'photos-grid';

        for (let i = 0; i < quantity; i++) {
            grid.appendChild(createPhotoItem(foodName, image_url));
        }

        section.append(title, grid);
        container.appendChild(section);
    });
}

window.addEventListener('load', renderSections);
window.addEventListener('resize', () => {
    document.querySelectorAll('.photo-item').forEach(item => {
        item.style.transform = 'none';
    });
});

document.getElementById('backButton')?.addEventListener('click', () => {
    // クリック時のエフェクト
    const button = document.getElementById('backButton');
    button.style.boxShadow = `0 0 30px ${getComputedStyle(document.documentElement)
        .getPropertyValue('--accent-neon')}`;
    
    setTimeout(() => {
        window.location.href = '/';
    }, 300);
});
