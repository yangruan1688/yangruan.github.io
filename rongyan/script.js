// 加载产品数据
fetch('products.json')
  .then(res => res.json())
  .then(data => {
    renderProducts(data);
  })
  .catch(error => {
    console.error(error);
    document.querySelector('.product-container').innerHTML = `<div class="loading">加载失败，请检查网络或数据文件。</div>`;
  });

// 渲染产品列表
function renderProducts(data) {
  const container = document.querySelector('.product-container');
  const categories = ['all', 'hair', 'ear', 'pin', 'other'];

  // 初始化所有分类的数据
  let productsByCategory = {};
  categories.forEach(cat => {
    productsByCategory[cat] = data.filter(item => cat === 'all' || item.category === cat);
  });

  // 渲染当前分类的产品
  function renderCategoryProducts(products) {
    container.innerHTML = '';
    products.forEach(item => {
      const html = `
        <div class="product-item" data-id="${item.id}">
          <img src="${item.coverImage}">
          <div class="item-overlay">${item.name}</div>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', html);
    });
    bindItemClickEvents();
  }

  // 绑定导航栏点击事件
  document.querySelector('.navbar').addEventListener('click', e => {
    if (e.target.tagName === 'LI') {
      const category = e.target.dataset.category;
      categories.forEach(cat => {
        document.querySelector(`[data-category="${cat}"]`).classList.toggle('active', cat === category);
      });
      renderCategoryProducts(productsByCategory[category]);
    }
  });

  // 绑定产品项点击事件
  function bindItemClickEvents() {
    document.querySelectorAll('.product-item').forEach(item => {
      item.addEventListener('click', e => {
        const productId = e.currentTarget.dataset.id;
        const product = data.find(p => p.id === productId);
        renderProductModal(product);
      });
    });
  }

  // 渲染模态框
  function renderProductModal(product) {
    const modal = document.querySelector('.product-modal');
    modal.style.display = 'flex';

    const imagesContainer = modal.querySelector('.modal-images');
    imagesContainer.innerHTML = '';
    product.images.forEach(image => {
      imagesContainer.insertAdjacentHTML('beforeend', `<img src="${image}">`);
    });

    // 绑定模态框交互事件
    bindModalEvents(modal);
  }

  // 模态框交互逻辑
  function bindModalEvents(modal) {
    const images = modal.querySelectorAll('.modal-images img');
    const prevBtn = modal.querySelector('.modal-prev');
    const nextBtn = modal.querySelector('.modal-next');

    // 滑动切换图片
    images.forEach(image => {
      image.addEventListener('click', e => {
        const modalImage = e.currentTarget;
        modalImage.classList.add('active');
        images.forEach(img => img.classList.remove('active'));

        // 绑定箭头点击事件
        prevBtn.addEventListener('click', () => {
          const prevIndex = images.indexOf(modalImage) - 1;
          if (prevIndex >= 0) {
            images[prevIndex].click();
          }
        });
        nextBtn.addEventListener('click', () => {
          const nextIndex = images.indexOf(modalImage) + 1;
          if (nextIndex < images.length) {
            images[nextIndex].click();
          }
        });
      });
    });

    // 关闭模态框
    modal.addEventListener('click', e => {
      if (e.target === modal || e.target === modal.querySelector('.modal-close')) {
        modal.style.display = 'none';
      }
    });

    // 图片放大与恢复
    images.forEach(image => {
      image.addEventListener('click', e => {
        e.stopPropagation();
        const modalImage = e.currentTarget;
        modalImage.classList.add('zoomed');
        setTimeout(() => {
          modalImage.style.zIndex = 999;
        }, 100);
        modalImage.addEventListener('click', () => {
          modalImage.classList.remove('zoomed');
          modalImage.style.zIndex = 1;
        });
      });
    });
  }

  // 初始化渲染全部产品
  renderCategoryProducts(productsByCategory['all']);
}
