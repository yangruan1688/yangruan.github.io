// 全局变量
let productsData = null;
let currentCategory = 'all';
let currentProductIndex = 0;
let isZoomed = false;
let startX = 0;
let currentImageIndex = 0;

// 初始化应用
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // 从JSON文件加载产品数据
    const response = await fetch('products.json');
    productsData = await response.json();
    
    // 设置初始分类
    const urlParams = new URLSearchParams(window.location.search);
    currentCategory = urlParams.get('category') || 'all';
    
    // 渲染导航栏
    renderNavbar();
    
    // 渲染产品列表
    renderProducts();
    
    // 如果是详情页，初始化详情页功能
    if (document.querySelector('.image-gallery')) {
      initDetailPage();
    }
  } catch (error) {
    console.error('加载产品数据失败:', error);
    document.querySelector('.products-grid').innerHTML = 
      '<div class="error-message" style="grid-column: 1/-1; text-align: center; padding: 30px; color: #e74c3c;">加载产品数据失败，请检查网络连接</div>';
  }
});

// 渲染导航栏
function renderNavbar() {
  const navbar = document.querySelector('.nav-items');
  if (!navbar) return;
  
  navbar.innerHTML = productsData.categories.map(category => 
    `<div class="nav-item ${category.id === currentCategory ? 'active' : ''}" 
       data-category="${category.id}"
       onclick="filterProducts('${category.id}')">
       ${category.name}
     </div>`
  ).join('');
}

// 渲染产品列表
function renderProducts() {
  const container = document.querySelector('.products-grid');
  if (!container) return;
  
  // 过滤当前分类的产品
  const filteredProducts = currentCategory === 'all' 
    ? productsData.products 
    : productsData.products.filter(p => p.category === currentCategory);
  
  if (filteredProducts.length === 0) {
    container.innerHTML = '<div class="no-products" style="grid-column: 1/-1; text-align: center; padding: 40px;">该分类暂无产品</div>';
    return;
  }
  
  container.innerHTML = filteredProducts.map(product => `
    <div class="product-card" onclick="viewProduct('${product.id}')">
      <img src="${product.cover}" alt="${product.name}" class="product-image">
      <div class="product-info">
        <div class="product-name">${product.name}</div>
        <div class="product-price">${product.price}</div>
      </div>
    </div>
  `).join('');
}

// 分类产品
function filterProducts(category) {
  currentCategory = category;
  renderNavbar();
  renderProducts();
  
  // 更新URL但不重新加载页面
  const newUrl = `${window.location.pathname}?category=${category}`;
  window.history.pushState({ category }, '', newUrl);
}

// 查看产品详情
function viewProduct(productId) {
  const product = productsData.products.find(p => p.id === productId);
  if (!product) return;
  
  // 创建临时表单提交到详情页
  const form = document.createElement('form');
  form.method = 'GET';
  form.action = 'detail.html';
  
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = 'id';
  input.value = productId;
  
  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
}

// 详情页初始化
function initDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  const product = productsData.products.find(p => p.id === productId);
  
  if (!product) {
    document.querySelector('.product-detail').innerHTML = 
      '<div class="error-message" style="padding: 40px; text-align: center; color: #e74c3c;">产品不存在</div>';
    return;
  }
  
  // 渲染图片画廊
  const galleryContainer = document.querySelector('.gallery-container');
  const imageCounter = document.querySelector('.image-counter');
  
  galleryContainer.innerHTML = product.images.map(img => 
    `<img src="${img}" class="gallery-image" onclick="toggleZoom(this)">`
  ).join('');
  
  imageCounter.textContent = `1 / ${product.images.length}`;
  
  // 初始化滑动功能
  initGallerySwiping();
  
  // 添加滑动提示（仅移动端）
  if (/Mobi|Android/i.test(navigator.userAgent)) {
    document.querySelector('.swipe-hint').style.display = 'block';
  }
}

// 初始化画廊滑动功能
function initGallerySwiping() {
  const gallery = document.querySelector('.gallery-container');
  const images = document.querySelectorAll('.gallery-image');
  const imageCounter = document.querySelector('.image-counter');
  
  // 点击控制按钮
  document.querySelector('.swipe-control.prev')?.addEventListener('click', () => swipeGallery(-1));
  document.querySelector('.swipe-control.next')?.addEventListener('click', () => swipeGallery(1));
  
  // 触摸事件
  gallery.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  });
  
  gallery.addEventListener('touchmove', e => {
    e.preventDefault();
  });
  
  gallery.addEventListener('touchend', e => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    
    if (Math.abs(diff) > 30) {
      swipeGallery(diff > 0 ? 1 : -1);
    }
  });
  
  // 鼠标拖动事件
  let isDragging = false;
  let startPos = 0;
  
  gallery.addEventListener('mousedown', e => {
    isDragging = true;
    startPos = e.clientX;
    gallery.style.cursor = 'grabbing';
  });
  
  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    
    const diff = startPos - e.clientX;
    if (Math.abs(diff) > 5) {
      isDragging = false;
      swipeGallery(diff > 0 ? 1 : -1);
    }
  });
  
  document.addEventListener('mouseup', () => {
    isDragging = false;
    gallery.style.cursor = 'grab';
  });
  
  // 键盘导航
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') swipeGallery(-1);
    if (e.key === 'ArrowRight') swipeGallery(1);
  });
  
  function swipeGallery(direction) {
    if (isZoomed) return;
    
    currentImageIndex = (currentImageIndex + direction + images.length) % images.length;
    const offset = -currentImageIndex * 100;
    
    gallery.style.transform = `translateX(${offset}%)`;
    imageCounter.textContent = `${currentImageIndex + 1} / ${images.length}`;
  }
}

// 切换图片缩放
function toggleZoom(img) {
  if (isZoomed) {
    img.classList.remove('zoomed');
    img.style.transform = 'none';
    isZoomed = false;
  } else {
    // 重置所有图片
    document.querySelectorAll('.gallery-image').forEach(i => {
      i.classList.remove('zoomed');
      i.style.transform = 'none';
    });
    
    img.classList.add('zoomed');
    isZoomed = true;
  }
}
