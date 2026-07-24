document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    
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
            const response = await fetch('products.json');
            const products = await response.json();

            function renderProducts(filterCategory) {
                grid.innerHTML = ''; 
                
                const filtered = filterCategory === '全部' 
                    ? products 
                    : products.filter(p => p.category === filterCategory);

                if (filtered.length === 0) {
                    grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:#888; padding:20px;">该分类下暂无产品</p>';
                    return;
                }

                filtered.forEach(product => {
                    const card = document.createElement('div');
                    card.className = 'card';
                    card.onclick = () => window.location.href = `detail.html?id=${product.id}`;
                    
                    // 核心修改：取 images 数组的第一张图作为封面图
                    const coverImage = product.images && product.images.length > 0 ? product.images[0] : '';
                    
                    card.innerHTML = `
                        <img src="${coverImage}" alt="${product.name}">
                        <div class="card-info">
                            <h3 class="card-title">${product.name}</h3>
                            <div class="card-price">¥${product.price}</div>
                        </div>
                    `;
                    grid.appendChild(card);
                });
            }

            renderProducts('全部');

            navBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    navBtns.forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    renderProducts(e.target.dataset.category);
                });
            });

        } catch (error) {
            console.error('无法加载产品数据:', error);
            if(loadingState) loadingState.innerHTML = '<p style="color:red;">加载失败，请检查网络或 products.json 文件。</p>';
        }
    }

    // --- 详情页逻辑 (支持多图) ---
    async function initDetailPage() {
        const params = new URLSearchParams(window.location.search);
        const productId = parseInt(params.get('id'));

        try {
            const response = await fetch('products.json');
            const products = await response.json();
            
            const product = products.find(p => p.id === productId);

            if (product) {
                document.title = `${product.name} - 我的手工饰品店`; 
                
                document.getElementById('detail-title').innerText = product.name;
                document.getElementById('detail-price').innerText = `¥${product.price}`;
                document.getElementById('detail-description').innerText = product.description || '暂无详细描述';

                // === 核心：渲染多图画廊 ===
                const track = document.getElementById('gallery-track');
                const indicators = document.getElementById('gallery-indicators');
                
                // 兼容旧数据：如果没有 images 数组，则降级使用单张 image
                const images = product.images || (product.image ? [product.image] : []);

                images.forEach((imgUrl, index) => {
                    // 1. 插入图片
                    const img = document.createElement('img');
                    img.src = imgUrl;
                    img.alt = `${product.name} 图片 ${index + 1}`;
                    track.appendChild(img);

                    // 2. 插入底部小圆点
                    const dot = document.createElement('span');
                    dot.className = 'dot' + (index === 0 ? ' active' : '');
                    indicators.appendChild(dot);
                });

                // 3. 监听滑动事件，让小圆点跟着动
                track.addEventListener('scroll', () => {
                    const scrollLeft = track.scrollLeft;
                    const trackWidth = track.offsetWidth;
                    // 计算当前滑到了第几张图 (四舍五入)
                    const currentIndex = Math.round(scrollLeft / trackWidth);
                    
                    // 更新小圆点状态
                    const dots = indicators.querySelectorAll('.dot');
                    dots.forEach((dot, i) => {
                        dot.classList.toggle('active', i === currentIndex);
                    });
                });

            } else {
                document.body.innerHTML = '<div class="container" style="text-align:center; padding:50px;"><h1>未找到该产品</h1><a href="index.html">返回首页</a></div>';
            }
        } catch (error) {
            console.error('加载详情失败:', error);
        }
    }
});
