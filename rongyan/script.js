// script.js

// 模拟的产品数据
// 在实际项目中，这些数据可能来自 API 或 JSON 文件
const products = [
    {
        id: 1,
        name: "绒花 | 彼岸花",
        price: 428,
        category: "hair-accessories", // 发饰
        image: "https://placehold.co/600x400/e63946/ffffff?text=彼岸花", // 替换为你的图片路径，如 'images/image1.jpg'
        likes: 6
    },
    {
        id: 2,
        name: "绒花 | 丁香花",
        price: 488,
        category: "hair-accessories", // 发饰
        image: "https://placehold.co/600x400/a2d2ff/ffffff?text=丁香花",
        likes: 4
    },
    {
        id: 3,
        name: "郁金香花束",
        price: 350,
        category: "other", // 其他
        image: "https://placehold.co/600x400/ffb5a7/ffffff?text=郁金香",
        likes: 12
    },
    {
        id: 4,
        name: "蓝色妖姬胸针",
        price: 299,
        category: "brooches", // 胸针
        image: "https://placehold.co/600x400/0077b6/ffffff?text=蓝色妖姬",
        likes: 8
    }
];

// 获取DOM元素
const productListContainer = document.getElementById('product-list');
const navButtons = document.querySelectorAll('.nav-btn');
const totalItemsSpan = document.getElementById('total-items');

// 渲染产品卡片的函数
function renderProducts(itemsToRender) {
    productListContainer.innerHTML = ''; // 清空现有内容

    itemsToRender.forEach(product => {
        const productCard = document.createElement('a');
        productCard.className = 'product-card';
        // 点击时跳转到详情页，并带上产品ID
        productCard.href = `product-detail.html?id=${product.id}`;

        productCard.innerHTML = `
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">¥${product.price}</p>
                <p class="product-likes">♡ ${product.likes}</p>
            </div>
        `;
        productListContainer.appendChild(productCard);
    });

    // 更新显示的商品总数
    totalItemsSpan.textContent = itemsToRender.length;
}

// 初始化：默认显示所有产品
renderProducts(products);

// 为每个导航按钮添加点击事件监听器
navButtons.forEach(button => {
    button.addEventListener('click', () => {
        // 1. 移除所有按钮的 'active' 类
        navButtons.forEach(btn => btn.classList.remove('active'));
        // 2. 给当前点击的按钮添加 'active' 类
        button.classList.add('active');

        // 3. 获取要筛选的分类
        const category = button.dataset.category;

        // 4. 根据分类筛选产品
        let filteredProducts;
        if (category === 'all') {
            filteredProducts = products;
        } else {
            filteredProducts = products.filter(product => product.category === category);
        }

        // 5. 重新渲染页面
        renderProducts(filteredProducts);
    });
});
