    // --- 详情页逻辑 (支持多图 + PC端交互增强) ---
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

                const track = document.getElementById('gallery-track');
                const indicators = document.getElementById('gallery-indicators');
                const images = product.images || (product.image ? [product.image] : []);

                // 1. 渲染图片和小圆点
                images.forEach((imgUrl, index) => {
                    const img = document.createElement('img');
                    img.src = imgUrl;
                    img.alt = `${product.name} 图片 ${index + 1}`;
                    // 防止拖拽图片时出现“幽灵”图标
                    img.draggable = false; 
                    track.appendChild(img);

                    const dot = document.createElement('span');
                    dot.className = 'dot' + (index === 0 ? ' active' : '');
                    indicators.appendChild(dot);
                });

                // 更新小圆点状态的通用函数
                function updateDots() {
                    const scrollLeft = track.scrollLeft;
                    const trackWidth = track.offsetWidth;
                    const currentIndex = Math.round(scrollLeft / trackWidth);
                    const dots = indicators.querySelectorAll('.dot');
                    dots.forEach((dot, i) => {
                        dot.classList.toggle('active', i === currentIndex);
                    });
                }
                
                track.addEventListener('scroll', updateDots);

                // ==========================================
                // ✨ 核心新增：PC 端专属交互逻辑
                // ==========================================

                // A. 左右箭头点击切换
                const prevBtn = document.getElementById('prev-btn');
                const nextBtn = document.getElementById('next-btn');
                
                if (prevBtn && nextBtn) {
                    prevBtn.addEventListener('click', () => {
                        track.scrollBy({ left: -track.offsetWidth, behavior: 'smooth' });
                    });
                    nextBtn.addEventListener('click', () => {
                        track.scrollBy({ left: track.offsetWidth, behavior: 'smooth' });
                    });
                }

                // B. 鼠标滚轮横向滚动 (在图片上滚动鼠标，变成左右翻页)
                track.addEventListener('wheel', (e) => {
                    // 如果用户是垂直滚动（上下滚），拦截它，变成横向滚动
                    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                        e.preventDefault(); // 阻止页面上下跳动
                        track.scrollBy({
                            left: e.deltaY > 0 ? track.offsetWidth : -track.offsetWidth,
                            behavior: 'smooth'
                        });
                    }
                }, { passive: false });

                // C. 鼠标按住拖拽滑动 (像手机触屏一样)
                let isDown = false;
                let startX;
                let scrollLeftStart;

                track.addEventListener('mousedown', (e) => {
                    isDown = true;
                    track.classList.add('dragging');
                    startX = e.pageX - track.offsetLeft;
                    scrollLeftStart = track.scrollLeft;
                });

                track.addEventListener('mouseleave', () => {
                    isDown = false;
                    track.classList.remove('dragging');
                });

                track.addEventListener('mouseup', () => {
                    isDown = false;
                    track.classList.remove('dragging');
                    // 拖拽结束后，重新触发一次 scroll 事件，让 scroll-snap 自动吸附对齐
                    track.dispatchEvent(new Event('scroll'));
                });

                track.addEventListener('mousemove', (e) => {
                    if (!isDown) return;
                    e.preventDefault();
                    const x = e.pageX - track.offsetLeft;
                    const walk = (x - startX) * 1.5; // 1.5 是拖拽速度倍率
                    track.scrollLeft = scrollLeftStart - walk;
                });

                // 如果只有一张图，隐藏箭头和圆点
                if (images.length <= 1) {
                    if(prevBtn) prevBtn.style.display = 'none';
                    if(nextBtn) nextBtn.style.display = 'none';
                    indicators.style.display = 'none';
                }

            } else {
                document.body.innerHTML = '<div class="container" style="text-align:center; padding:50px;"><h1>未找到该产品</h1><a href="index.html">返回首页</a></div>';
            }
        } catch (error) {
            console.error('加载详情失败:', error);
        }
    }
