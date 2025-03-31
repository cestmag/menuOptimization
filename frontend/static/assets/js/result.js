 // 前回のJavaScriptコードと同じ内容
//  const foodData = {
//     "親子丼": 1,
//     "白ご飯": 2,
//     "味噌汁": 1,
//     "猛毒入りスープ": 3
// };//これは本来はバックエンドからもらってくる


// URLパラメータからモードを取得
const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode');

// localStorageからデータを取得
const foodData = JSON.parse(localStorage.getItem('optimizedMenu')) || {};

function createPhotoItem(foodName) {
    const container = document.createElement('div');
    container.className = 'photo-item';

    const img = new Image();
    img.className = 'food-photo';
    img.alt = `${foodName}の写真`;
    img.src = `images/${foodName}.jpg`;//ここはほんとは生協のページから写真をひっぱってくる

    img.onerror = () => {
        const fallback = document.createElement('div');
        fallback.className = 'photo-fallback';
        fallback.textContent = foodName;
        container.appendChild(fallback);
    };

    container.appendChild(img);
    return container;
}

function renderSections() {
    const container = document.getElementById('container');
    
    Object.entries(foodData).forEach(([foodName, count]) => {
        const section = document.createElement('div');
        section.className = 'food-section';

        const title = document.createElement('h2');
        title.className = 'food-title';
        title.textContent = foodName;
        
        const grid = document.createElement('div');
        grid.className = 'photos-grid';

        for (let i = 0; i < count; i++) {
            grid.appendChild(createPhotoItem(foodName));
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