
// Dados de exemplo para produtos
let products = [
    {
        id: 1,
        name: 'Smartphone XYZ',
        description: 'Um smartphone incrível com câmera de alta resolução e bateria de longa duração.',
        price: 1999.99,
        image: '/api/placeholder/300/200',
        stock: 15
    },
    {
        id: 2,
        name: 'Notebook ABC',
        description: 'Notebook leve e potente para suas tarefas diárias.',
        price: 3499.99,
        image: '/api/placeholder/300/200',
        stock: 8
    },
    {
        id: 3,
        name: 'Smart TV 50"',
        description: 'Smart TV com resolução 4K e sistema operacional inteligente.',
        price: 2799.99,
        image: '/api/placeholder/300/200',
        stock: 12
    },
    {
        id: 4,
        name: 'Fones de Ouvido Bluetooth',
        description: 'Fones de ouvido sem fio com cancelamento de ruído e bateria de longa duração.',
        price: 299.99,
        image: '/api/placeholder/300/200',
        stock: 25
    },
    {
        id: 5,
        name: 'Console de Jogos Pro',
        description: 'O console mais avançado do mercado com gráficos impressionantes.',
        price: 4999.99,
        image: '/api/placeholder/300/200',
        stock: 6
    },
    {
        id: 6,
        name: 'Câmera Digital HD',
        description: 'Câmera digital profissional para capturar seus melhores momentos.',
        price: 1599.99,
        image: '/api/placeholder/300/200',
        stock: 10
    }
];

// Carrinho de compras
let cart = [];

// Estado da autenticação
let isAuthenticated = false;

// Quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Elementos da página
    const productsContainer = document.getElementById('products-container');
    const cartIcon = document.getElementById('cart-icon');
    const cartContainer = document.getElementById('cart-container');
    const closeCart = document.getElementById('close-cart');
    const overlay = document.getElementById('overlay');
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const clearCart = document.getElementById('clear-cart');
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutContainer = document.getElementById('checkout-container');
    const closeCheckout = document.getElementById('close-checkout');
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutTotal = document.getElementById('checkout-total');
    const orderSuccess = document.getElementById('order-success');
    const backToShop = document.getElementById('back-to-shop');
    const adminLink = document.getElementById('admin-link');
    const homeLink = document.getElementById('home-link');
    const adminPage = document.getElementById('admin-page');
    const productsPage = document.getElementById('products-page');
    const loginPage = document.getElementById('login-page');
    const loginForm = document.getElementById('login-form');
    const addProductBtn = document.getElementById('add-product-btn');
    const productForm = document.getElementById('product-form');
    const productFormContainer = document.getElementById('product-form-container');
    const productsListContainer = document.getElementById('products-list-container');
    const cancelForm = document.getElementById('cancel-form');
    const productsTableBody = document.getElementById('products-table-body');
    const formTitle = document.getElementById('form-title');

    // Credenciais de exemplo para admin
    const adminCredentials = {
        username: 'admin',
        password: 'admin123'
    };

    // Renderizar produtos
    function renderProducts() {
        productsContainer.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p>${product.description}</p>
                    <p class="product-price">R$ ${product.price.toFixed(2)}</p>
                    <button class="btn btn-block add-to-cart" data-id="${product.id}">Adicionar ao Carrinho</button>
                </div>
            `;
            productsContainer.appendChild(productCard);
        });

        // Adicionar evento de clique aos botões de adicionar ao carrinho
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                addToCart(productId);
            });
        });
    }

    // Renderizar tabela de produtos para o admin
    function renderProductsTable() {
        productsTableBody.innerHTML = '';
        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>R$ ${product.price.toFixed(2)}</td>
                <td>${product.stock}</td>
                <td>
                    <button class="action-btn edit-btn" data-id="${product.id}">Editar</button>
                    <button class="action-btn delete-btn" data-id="${product.id}">Excluir</button>
                </td>
            `;
            productsTableBody.appendChild(row);
        });

        // Adicionar eventos para botões de editar e excluir
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                editProduct(productId);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                deleteProduct(productId);
            });
        });
    }

    // Adicionar produto ao carrinho
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        
        if (product && product.stock > 0) {
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                if (existingItem.quantity < product.stock) {
                    existingItem.quantity++;
                } else {
                    alert('Não há mais estoque disponível para este produto!');
                    return;
                }
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
            }
            
            updateCart();
            alert('Produto adicionado ao carrinho!');
        }
    }

    // Atualizar exibição do carrinho
    function updateCart() {
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p>Seu carrinho está vazio.</p>';
            cartCount.textContent = '0';
            cartTotal.textContent = 'Total: R$ 0,00';
            checkoutTotal.textContent = 'Total: R$ 0,00';
            return;
        }

        let total = 0;
        let count = 0;

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <h3 class="cart-item-title">${item.name}</h3>
                    <p class="cart-item-price">R$ ${item.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                        <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}">
                        <button class="quantity-btn increase" data-id="${item.id}">+</button>
                        <button class="action-btn delete-btn" data-id="${item.id}" style="margin-left: 10px;">Remover</button>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItem);

            total += item.price * item.quantity;
            count += item.quantity;
        });

        // Adicionar eventos para os botões de quantidade
        document.querySelectorAll('.decrease').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                decreaseQuantity(productId);
            });
        });

        document.querySelectorAll('.increase').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                increaseQuantity(productId);
            });
        });

        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                const newQuantity = parseInt(this.value);
                updateQuantity(productId, newQuantity);
            });
        });

        document.querySelectorAll('.cart-item .delete-btn').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                removeFromCart(productId);
            });
        });

        cartCount.textContent = count.toString();
        cartTotal.textContent = `Total: R$ ${total.toFixed(2)}`;
        checkoutTotal.textContent = `Total: R$ ${total.toFixed(2)}`;
    }

    // Diminuir quantidade no carrinho
    function decreaseQuantity(productId) {
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem && cartItem.quantity > 1) {
            cartItem.quantity--;
            updateCart();
        }
    }

    // Aumentar quantidade no carrinho
    function increaseQuantity(productId) {
        const cartItem = cart.find(item => item.id === productId);
        const product = products.find(p => p.id === productId);
        
        if (cartItem && product && cartItem.quantity < product.stock) {
            cartItem.quantity++;
            updateCart();
        } else if (cartItem && product) {
            alert('Não há mais estoque disponível para este produto!');
        }
    }

    // Atualizar quantidade no carrinho
    function updateQuantity(productId, newQuantity) {
        const cartItem = cart.find(item => item.id === productId);
        const product = products.find(p => p.id === productId);
        
        if (cartItem && product) {
            if (newQuantity > 0 && newQuantity <= product.stock) {
                cartItem.quantity = newQuantity;
            } else if (newQuantity > product.stock) {
                cartItem.quantity = product.stock;
                alert(`Apenas ${product.stock} unidades disponíveis no estoque.`);
            } else {
                cartItem.quantity = 1;
            }
            updateCart();
        }
    }

    // Remover item do carrinho
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCart();
    }

    // Editar produto (para admin)
    function editProduct(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            document.getElementById('product-id').value = product.id;
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-description').value = product.description;
            document.getElementById('product-price').value = product.price;
            document.getElementById('product-image').value = product.image;
            document.getElementById('product-stock').value = product.stock;
            
            formTitle.textContent = 'Editar Produto';
            productsListContainer.style.display = 'none';
            productFormContainer.style.display = 'block';
        }
    }

)