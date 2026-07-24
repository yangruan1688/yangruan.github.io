// 产品数据 (通常从服务器加载)
const products = [
  {
    "id": 1,
    "title": "简约珍珠项链",
    "category": "other",
    "price": "¥99.00",
    "description": "采用高品质淡水珍珠，设计简约大方，适合日常佩戴或搭配礼服。",
    "images": [
      "https://picsum.photos/id/10/400/400",
      "https://picsum.photos/id/11/400/400",
      "https://picsum.photos/id/12/400/400"
    ]
  },
  {
    "id": 2,
    "title": "流苏耳环",
    "category": "ear",
    "price": "¥59.99",
    "description": "时尚复古的流苏耳环，行走间摇曳生姿，彰显独特魅力。",
    "images": [
      "https://picsum.photos/id/20/400/400",
      "https://picsum.photos/id/21/400/400"
    ]
  },
  {
    "id": 3,
    "title": "手工珐琅胸针",
    "category": "brooch",
    "price": "¥89.99",
    "description": "精致的手工珐琅胸针，为您的大衣或围巾增添一抹亮色。",
    "images": [
      "https://picsum.photos/id/30/400/400"
    ]
  },
  {
    "id": 4,
    "title": "可爱卡通发箍",
    "category": "hair",
    "price": "¥29.99",
    "description": "可爱的卡通动物造型发箍，让你瞬间拥有好心情。",
    "images": [
      "https://picsum.photos/id/40/400/400",
      "https://picsum.photos/id/41/400/400",
      "https://picsum.photos/id/42/400/400"
    ]
  }
];

// 工具函数：从URL中获取产品ID
function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// 1. 初始化产品列表页
function initProductList() {
  renderProducts(products);

  const filterBtns = document.querySelectorAll('#categoryFilter .filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.getAttribute('data-filter');
      filterProducts(category);
    });
  });
}

// 2. 渲染产品列表
function renderProducts(productsArray) {
  const productsGrid = document.getElementById('productsGrid');
  productsGrid.innerHTML = '';

  if (productsArray.length === 0) {
    productsGrid.innerHTML = '<p style="text-align: center; padding: 20px; color: #666;">该分类下暂无产品。</p>';
    return;
  }

  productsArray.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.images[0]}" alt="${product.title}">
      <h3 class="product-title">${product.title}</h3>
      <p class="product-price">${product.price}</p>
    `;
    card.addEventListener('click', () => {
      window.location.href = `product-detail.html?id=${product.id}`;
    });
    productsGrid.appendChild(card);
  });
}

// 3. 过滤产品
function filterProducts(category) {
  let filteredProducts;
  if (category === 'all') {
    filteredProducts = products;
  } else {
    filteredProducts = products.filter(p => p.category === category);
  }
  renderProducts(filteredProducts);
}

// 4. 初始化产品详情页
function initProductDetail() {
  const productId = getProductIdFromUrl();
  if (!productId) {
    document.getElementById('detailContainer').innerHTML = '<p style="text-align: center; padding: 20px; color: #ff4757;">产品ID无效。</p>';
    return;
  }

  const product = products.find(p => p.id == productId);
  if (!product) {
    document.getElementById('detailContainer').innerHTML = '<p style="text-align: center; padding: 20px; color: #ff4757;">产品信息加载失败。</p>';
    return;
  }

  // 设置产品信息
  document.getElementById('detailTitle').textContent = product.title;
  document.getElementById('detailPrice').textContent = product.price;
  document.getElementById('detailDescription').textContent = product.description;

  // 生成轮播图HTML
  const swiperWrapper = document.getElementById('swiperWrapper');
  swiperWrapper.innerHTML = '';

  product.images.forEach((imgSrc, index) => {
    // 创建包裹图片的链接，用于Fancybox
    const slideLink = document.createElement('a');
    slideLink.setAttribute('data-fancybox', 'product-gallery');
    slideLink.setAttribute('href', imgSrc);
    slideLink.setAttribute('data-caption', product.title + ' (图' + (index + 1) + ')');

    const imgElement = document.createElement('img');
    imgElement.className = 'swiper-slide';
    imgElement.src = imgSrc;
    imgElement.alt = product.title + ' (图' + (index + 1) + ')';

    slideLink.appendChild(imgElement);
    swiperWrapper.appendChild(slideLink);
  });

  // 初始化Swiper轮播图
  initCarousel();

  // Fancybox会自动为所有带有 data-fancybox 属性的元素绑定点击事件
}

// 5. 初始化轮播图
function initCarousel() {
  if (typeof Swiper === 'undefined') {
    console.error('Swiper 库未加载');
    return;
  }
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
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  if (document.body.id === 'home') {
    initProductList();
  } else if (document.body.id === 'detail') {
    initProductDetail();
  }
});
