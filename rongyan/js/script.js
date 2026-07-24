document.addEventListener('DOMContentLoaded', () => {
  const productsGrid = document.querySelector('.products-grid');
  const navItems = document.querySelectorAll('.nav-item');
  
  // 加载JSON数据
  fetch('data/products.json')
    .then(res => res.json())
    .then(renderProducts)
    .catch(err => console.error('数据加载失败:', err));

  // 渲染产品列表
  function renderProducts(products, category = 'all') {
    productsGrid.innerHTML = '';
    
    const filtered = category === 'all' 
      ? products 
      : products.filter(p => p.category === category);
    
    if (filtered.length === 0) {
      productsGrid.innerHTML = '<div class="no-products">暂无该类别商品</div>';
      return;
    }
    
    filtered.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${product.coverImage}" 
             class="product-img" 
             alt="${product.name}"
             data-id="${product.id}">
        <div class="product-info">
          <h3>${product.name}</h3>
          <p>${product.category}</p>
        </div>
      `;
      productsGrid.appendChild(card);
    });
    
    // 绑定产品点击事件
    document.querySelectorAll('.product-img').forEach(img => {
      img.addEventListener('click', () => {
        window.location.href = `product.html?id=${img.dataset.id}`;
      });
    });
  }

  // 导航栏交互
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      // 更新激活状态
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
      
      // 渲染对应类别
      renderProducts(window.productsData, item.dataset.category);
    });
  });

  // 首次加载存储产品数据
  fetch('data/products.json')
    .then(res => res.json())
    .then(data => {
      window.productsData = data;
      renderProducts(data);
    });
});
