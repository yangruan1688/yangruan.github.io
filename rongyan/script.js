// script.js
let products = [];

// 1. 加载产品数据
async function loadProductData() {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = '<p style="text-align: center; padding: 20px; color: #666;">加载中...</p>';

  try {
    const response = await fetch('products.json');
    if (!response.ok) {
      throw new Error(`加载失败: ${response.status}`);
    }
    products = await response.json();
    console.log('产品数据加载成功:', products);
    initProductList();
  } catch (error) {
    console.error('加载产品数据时出错:', error);
    grid.innerHTML = '<p style="text-align: center; padding: 20px; color: #ff4757;">产品数据加载失败，请检查 products.json 文件路径和格式是否正确。</p>';
  }
}

// 2. 初始化产品列表页
function initProductList() {
  renderProducts(products);

  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      
      // 更新按钮状态
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // 过滤并渲染产品
      const filteredProducts = filter === 'all' ? products : products.filter(p => p.category === filter);
      renderProducts(filteredProducts);
    });
  });
}

// 3. 渲染产品列表
function renderProducts(productsArray) {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = '';

  if (productsArray.length === 0) {
    grid.innerHTML = '<p style="text-align: center; padding: 20px; color: #666;">该分类下暂无产品。</p>';
    return;
  }

  productsArray.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.images[0]}" alt="${product.title}" class="product-image">
      <div class="product-content">
        <h3 class="product-title">${product.title}</h3>
        <p class="product-price">${product.price}</p>
      </div>
    `;
    card.addEventListener('click', () => {
      localStorage.setItem('selectedProduct', JSON.stringify(product));
      window.location.href = 'product-detail.html';
    });
    grid.appendChild(card);
  });
}

// 4. 初始化产品详情页
function initProductDetail() {
  const product = JSON.parse(localStorage.getItem('selectedProduct'));
  if (!product) {
    document.getElementById('detailContainer').innerHTML = '<p style="text-align: center; padding: 20px; color: #ff4757;">产品信息加载失败。</p>';
    return;
  }

  document.getElementById('detailTitle').textContent = product.title;
  document.getElementById('detailPrice').textContent = product.price;
  document.getElementById('detailDescription').textContent = product.description;

  initCarousel(product.images);
}

// 5. 初始化轮播图
function initCarousel(images) {
  const swiperWrapper = document.getElementById('swiperWrapper');
  swiperWrapper.innerHTML = '';

  images.forEach(imgSrc => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.innerHTML = `<img src="${imgSrc}" alt="产品图片">`;
    swiperWrapper.appendChild(slide);
  });

  // 确保 Swiper 库已加载
  if (typeof Swiper !== 'undefined') {
    new Swiper('.swiper-container', {
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  } else {
    console.error('Swiper 库未加载成功，请检查网络连接或 CDN 链接。');
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  if (document.body.id === 'home') {
    loadProductData(); // 确保数据加载完成
  } else if (document.body.id === 'detail') {
    initProductDetail();
  }
});
