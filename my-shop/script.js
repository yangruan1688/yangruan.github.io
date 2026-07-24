/* style.css */

/* --- 基础变量和重置 --- */
:root {
    --bg-color: #f9f7f2; /* 浅米色背景 */
    --card-bg: #ffffff;
    --text-main: #333333;
    --text-secondary: #888888;
    --price-color: #c07a5b; /* 棕色价格 */
    --accent-color: #d4af37; /* 金色高亮 */
    --btn-bg-inactive: #f0ece6;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    background-color: var(--bg-color);
    color: var(--text-main);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

/* --- 顶部导航栏 --- */
.top-nav {
    display: flex;
    gap: 15px;
    overflow-x: auto; /* 在小屏幕上允许横向滚动 */
    padding-bottom: 10px;
    scrollbar-width: none; /* Firefox 隐藏滚动条 */
}
.top-nav::-webkit-scrollbar {
    display: none; /* Chrome/Safari 隐藏滚动条 */
}

.nav-btn {
    background-color: var(--btn-bg-inactive);
    border: 1px solid transparent;
    border-radius: 25px;
    padding: 8px 20px;
    font-size: 1rem;
    color: var(--text-main);
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.3s ease;
}

.nav-btn:hover {
    background-color: #e8e4de;
}

.nav-btn.active {
    background-color: var(--card-bg);
    border-color: var(--accent-color);
    color: var(--accent-color);
    font-weight: bold;
}

/* --- 筛选和标题区域 --- */
.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 30px;
    margin-bottom: 20px;
}

.filter-sort {
    color: var(--text-secondary);
    font-size: 0.9rem;
    cursor: pointer;
}

.page-title {
    font-size: 1.5rem;
    font-weight: bold;
}

.item-count {
    color: var(--text-secondary);
    font-size: 0.9rem;
}

/* --- 产品网格布局 --- */
.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 25px;
}

/* --- 产品卡片样式 --- */
.product-card {
    background-color: var(--card-bg);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    text-decoration: none; /* 移除链接下划线 */
    color: inherit;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
}

.product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.product-image-container {
    width: 100%;
    height: 250px;
    overflow: hidden;
}

.product-image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.product-card:hover .product-image-container img {
    transform: scale(1.05);
}

.product-info {
    padding: 15px;
}

.product-name {
    font-size: 1.1rem;
    font-weight: 500;
    margin-bottom: 10px;
}

.product-price {
    font-size: 1.2rem;
    color: var(--price-color);
    font-weight: bold;
    margin-bottom: 10px;
}

.product-likes {
    font-size: 0.8rem;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    gap: 5px;
}

/* --- 响应式设计 --- */
@media (max-width: 768px) {
    .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
    .product-grid {
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    }
}
