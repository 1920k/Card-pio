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
        <button id="pay-btn" style="display:block;margin:18px auto 0 auto;background:#388e3c;color:#fff;border:none;padding:10px 24px;border-radius:8px;cursor:pointer;font-size:1.1em;">Pagar com PIX</button>
        <div id="pix-area" style="display:none;text-align:center;margin-top:12px;"></div>
    `;
    document.body.appendChild(cartContainer);

    const cartItemsList = cartContainer.querySelector('.cart-items');
    const cartTotalValue = cartContainer.querySelector('#cart-total-value');
    const cartEmpty = cartContainer.querySelector('.cart-empty');
    const clearCartBtn = cartContainer.querySelector('#clear-cart-btn');
    const removeCartBtn = cartContainer.querySelector('#remove-cart-btn');
    const payBtn = cartContainer.querySelector('#pay-btn');
    const pixArea = cartContainer.querySelector('#pix-area');

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
            // Evita adicionar múltiplos botões ao recarregar
            if (!cells[1].querySelector('.add-cart-btn')) {
                const btn = document.createElement('button');
                btn.textContent = 'Adicionar ao carrinho';
                btn.className = 'add-cart-btn';
                btn.style.marginLeft = '10px';
                btn.onclick = function() {
                    // Se o carrinho estiver oculto, reexibe
                    if (cartContainer.style.display === 'none') {
                        cartContainer.style.display = '';
                    }
                    cart.push({
                        name: cells[0].textContent,
                        price: parseFloat(cells[1].textContent.replace('R$', '').replace(',', '.'))
                    });
                    updateCart();
                };
                cells[1].appendChild(btn);
            }
        }
    });

    clearCartBtn.onclick = function() {
        cart = [];
        updateCart();
    };

    removeCartBtn.onclick = function() {
        cartContainer.style.display = 'none';
    };

    payBtn.onclick = function() {
        if (cart.length === 0) {
            pixArea.style.display = 'block';
            pixArea.innerHTML = '<span style="color:#b71c1c;">Adicione itens ao carrinho antes de pagar.</span>';
            return;
        }
        // Exemplo de chave PIX fictícia
        const chavePix = 'paroquiajesusnazare@pix.com';
        pixArea.style.display = 'block';
        pixArea.innerHTML = `
            <strong>Chave PIX:</strong><br>
            <span style="font-size:1.2em;color:#388e3c;">${chavePix}</span><br>
            <span style="font-size:0.95em;color:#444;">(Envie o valor total do carrinho para esta chave e apresente o comprovante na secretaria.)</span>
        `;
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
