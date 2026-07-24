document.addEventListener('DOMContentLoaded', () => {
    // 获取当前页面的文件名，判断是首页还是详情页
    const path = window.location.pathname;
    
    // 1. 如果是首页 (包含 index.html 或者根目录)
    if (path.endsWith('index.html') || path.endsWith('/')) {
        initHomePage();
    } 
    // 2. 如果是详情页 (包含 detail.html)
    else if (path.includes('detail.html')) {
        initDetailPage();
    }

    // --- 首页逻辑 ---
    async function initHomePage() {
        const grid = document.getElementById('product-grid');
        const navBtns = document.querySelectorAll('.nav-btn');
        
        try {
            // 获取 JSON 数据
            const response = await fetch('products.json');
            const products = await response.json();

            // 渲染函数
            function renderProducts(filterCategory) {
                grid.innerHTML = ''; // 清空当前列表
                
                const filtered = filterCategory === '全部' 
                    ? products 
                    : products.filter(p => p.category === filterCategory);

                filtered.forEach(product => {
                    const card = document.createElement('div');
                    card.className = 'card';
                    // 点击跳转到详情页，带上 ID 参数
                    card.onclick = () => window.location.href = `detail.html?id=${product.id}`;
                    
                    card.innerHTML = `
                        <img src="${product.image}" alt="${product.name}">
                        <div class="card-info">
                            <h3 class="card-title">${product.name}</h3>
                            <div class="card-price">¥${product.price}</div>
                        </div>
                    `;
                    grid.appendChild(card);
                });
            }

            // 初始化显示全部
            renderProducts('全部');

            // 绑定导航点击事件
            navBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    // 移除所有激活状态
                    navBtns.forEach(b => b.classList.remove('active'));
                    // 激活当前按钮
                    e.target.classList.add('active');
                    // 重新渲染
                    renderProducts(e.target.dataset.category);
                });
            });

        } catch (error) {
            console.error('无法加载产品数据:', error);
            grid.innerHTML = '<p>加载失败，请检查 products.json 文件是否存在。</p>';
        }
    }

    // --- 详情页逻辑 ---
    async function initDetailPage() {
        // 从 URL 获取 ID (例如 ?id=1)
        const params = new URLSearchParams(window.location.search);
        const productId = parseInt(params.get('id'));

        try {
            const response = await fetch('products.json');
            const products = await response.json();
            
            // 查找对应 ID 的产品
            const product = products.find(p => p.id === productId);

            if (product) {
                document.title = product.name; // 修改网页标题
                document.getElementById('detail-img').src = product.image;
                document.getElementById('detail-title').innerText = product.name;
                document.getElementById('detail-price').innerText = `¥${product.price}`;
                document.getElementById('detail-description').innerText = product.description || '暂无详细描述';
            } else {
                document.body.innerHTML = '<div class="container"><h1>未找到该产品</h1><a href="index.html">返回首页</a></div>';
            }
        } catch (error) {
            console.error('加载详情失败:', error);
        }
    }
});
