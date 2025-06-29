// Carrinho de compras para o cardápio da paróquia

document.addEventListener('DOMContentLoaded', function() {
    // Cria o container do carrinho
    const cartContainer = document.createElement('div');
    cartContainer.className = 'cart-container';
    cartContainer.innerHTML = `
        <h3>Meu Carrinho</h3>
        <button id="remove-cart-btn" style="display:block;margin:0 auto 8px auto;background:#b71c1c;color:#fff;border:none;padding:6px 16px;border-radius:6px;cursor:pointer;">Fechar Carrinho</button>
        <button id="clear-cart-btn" style="display:block;margin:0 auto 10px auto;background:#e57373;color:#fff;border:none;padding:6px 16px;border-radius:6px;cursor:pointer;">Esvaziar Carrinho</button>
        <ul class="cart-items"></ul>
        <div class="cart-total">Total: R$ <span id="cart-total-value">0,00</span></div>
        <div class="cart-empty">Seu carrinho está vazio.</div>
    `;
    document.body.appendChild(cartContainer);

    const cartItemsList = cartContainer.querySelector('.cart-items');
    const cartTotalValue = cartContainer.querySelector('#cart-total-value');
    const cartEmpty = cartContainer.querySelector('.cart-empty');
    const clearCartBtn = cartContainer.querySelector('#clear-cart-btn');
    const removeCartBtn = cartContainer.querySelector('#remove-cart-btn');

    let cart = [];

    // Função para atualizar o carrinho na tela
    function updateCart() {
        cartItemsList.innerHTML = '';
        let total = 0;
        if (cart.length === 0) {
            cartEmpty.style.display = 'block';
        } else {
            cartEmpty.style.display = 'none';
            cart.forEach((item, index) => {
                const li = document.createElement('li');
                li.textContent = `${item.name} - R$ ${item.price.toFixed(2).replace('.', ',')}`;
                // Botão de remover
                const removeBtn = document.createElement('button');
                removeBtn.textContent = 'Remover';
                removeBtn.style.marginLeft = '10px';
                removeBtn.onclick = function() {
                    cart.splice(index, 1);
                    updateCart();
                };
                li.appendChild(removeBtn);
                cartItemsList.appendChild(li);
                total += item.price;
            });
        }
        cartTotalValue.textContent = total.toFixed(2).replace('.', ',');
    }

    // Adiciona botões de adicionar ao carrinho para cada item da tabela
    document.querySelectorAll('table tr').forEach((row, idx) => {
        if (idx === 0) return; // pula o cabeçalho
        const cells = row.querySelectorAll('td');
        if (cells.length === 2) {
            const btn = document.createElement('button');
            btn.textContent = 'Adicionar ao carrinho';
            btn.style.marginLeft = '10px';
            btn.onclick = function() {
                cart.push({
                    name: cells[0].textContent,
                    price: parseFloat(cells[1].textContent.replace('R$', '').replace(',', '.'))
                });
                updateCart();
            };
            cells[1].appendChild(btn);
        }
    });

    clearCartBtn.onclick = function() {
        cart = [];
        updateCart();
    };

    removeCartBtn.onclick = function() {
        cartContainer.remove();
    };

    // Torna o carrinho movimentável
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    cartContainer.style.cursor = 'move';
    cartContainer.style.userSelect = 'none';

    cartContainer.addEventListener('mousedown', function(e) {
        // Só inicia o drag se clicar no topo do carrinho (h3 ou área superior)
        if (e.target.tagName === 'H3' || e.target === cartContainer) {
            isDragging = true;
            offsetX = e.clientX - cartContainer.getBoundingClientRect().left;
            offsetY = e.clientY - cartContainer.getBoundingClientRect().top;
            cartContainer.style.transition = 'none';
        }
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            cartContainer.style.left = (e.clientX - offsetX) + 'px';
            cartContainer.style.top = (e.clientY - offsetY) + 'px';
            cartContainer.style.position = 'fixed';
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
        cartContainer.style.transition = '';
    });

    updateCart();
});
