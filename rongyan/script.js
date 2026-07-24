document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    
    // 判断当前是首页还是详情页
    if (path.endsWith('index.html') || path.endsWith('/')) {
        initHomePage();
    } else if (path.includes('detail.html')) {
        initDetailPage();
    }

    // --- 首页逻辑 ---
    async function initHomePage() {
        const grid = document.getElementById('product-grid');
        const loadingState = document.getElementById('loading-state');
        const navBtns = document.querySelectorAll('.nav-btn');
        
        try {
            // 获取 JSON 数据
            const response = await fetch('products.json');
            const products = await response.json();

            // 渲染产品卡片函数
            function renderProducts(filterCategory) {
                grid.innerHTML = ''; // 清空当前列表
                
                // 核心筛选逻辑：
                // 1. 如果点击的是“全部”，不做任何过滤，显示所有产品
                // 2. 如果点击的是具体分类（如“发饰”），只显示 category 匹配的产品
                const filtered = filterCategory === '全部' 
                    ? products 
                    : products.filter(p => p.category === filterCategory);

                // 如果该分类下没有产品
                if (filtered.length === 0) {
                    grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:#888; padding:20px;">该分类下暂无产品</p>';
                    return;
                }

                // 遍历生成卡片
                filtered.forEach(product => {
                    const card = document.createElement('div');
                    card.className = 'card';
                    // 点击跳转到详情页
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
                    // 激活当前点击的按钮
                    e.target.classList.add('active');
                    // 重新渲染对应分类
                    renderProducts(e.target.dataset.category);
                });
            });

        } catch (error) {
            console.error('无法加载产品数据:', error);
            if(loadingState) loadingState.innerHTML = '<p style="color:red;">加载失败，请检查 products.json 文件是否存在。</p>';
        }
    }

    // --- 详情页逻辑 ---
    async function initDetailPage() {
        const params = new URLSearchParams(window.location.search);
        const productId = parseInt(params.get('id'));

        try {
            const response = await fetch('products.json');
            const products = await response.json();
            
            const product = products.find(p => p.id === productId);

            if (product) {
                // 动态修改网页标题 (利于 SEO 和分享)
                document.title = `${product.name} - 我的手工饰品店`; 
                
                document.getElementById('detail-img').src = product.image;
                document.getElementById('detail-title').innerText = product.name;
                document.getElementById('detail-price').innerText = `¥${product.price}`;
                document.getElementById('detail-description').innerText = product.description || '暂无详细描述';
            } else {
                document.body.innerHTML = '<div class="container" style="text-align:center; padding:50px;"><h1>未找到该产品</h1><a href="index.html">返回首页</a></div>';
            }
        } catch (error) {
            console.error('加载详情失败:', error);
        }
    }
});
