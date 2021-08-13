let cart = {};

document.querySelectorAll('.add-to-cart').forEach(function (element) {
    element.onclick = addToCart;
})

if (localStorage.getItem('cart')) {
    cart = JSON.parse(localStorage.getItem('cart'));
    ajaxGetGoodInfo();
}

function addToCart() {
    let goodId = this.dataset.goods_id;
    if (cart[goodId]) {
        cart[goodId]++;
    } else {
        cart[goodId] = 1;
    }
    ajaxGetGoodInfo();
}

function ajaxGetGoodInfo() {
    updateLocalStorageCart();
    fetch('/get-good-info', {
        method: 'POST',
        body: JSON.stringify({key: Object.keys(cart)}),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(function (res) {
        return res.text();
    }).then(function (body) {
        console.log(JSON.parse(body));
        showCart(JSON.parse(body));
    })
}

function showCart(data) {
    if (data === 0) {
        let out = '<span>В корзине пока пусто :(</span>';
        document.querySelector('#cart-nav').innerHTML = out;
        document.querySelector('.cart-icon').classList.add('disabled');
        return false;
    }
    let out = '<table class="table table-cart"><tbody>';
    let total = 0;
    let col = 0;
    for (let key in cart) {
        out += `<tr><td colspan="4"><a href="/goods?id=${key}">${data[key].name}</a></td>`;
        out += `<td><i class="fa fa-minus-square cart-minus color-orange" data-goods_id="${key}"></i></td>`;
        out += `<td>${cart[key]}</td>`;
        out += `<td><i class="fa fa-plus-square cart-plus color-orange" data-goods_id="${key}"></i></td>`;
        out += `<td>${formatPrice(data[key]['cost'] * cart[key])} ₽ </td>`
        out += '</tr>';
        total += cart[key] * data[key]['cost'];
        col++;
    }
    out += `<tr><td colspan="4">Итого: </td><td colspan="4">${formatPrice(total)} ₽</td></tr>`;
    out += '</tbody></table>';

    let orderForm = document.querySelector('#lite-shop-order');
    if(orderForm == null) out += '<div class="text-center"><a href="/order" target="_blank"><button data-name="btn-order" class="btn btn-primary site-btn order-btn">Оформить заказ</button></a>';

    document.querySelector('#cart-nav').innerHTML = out;
    document.querySelectorAll('.cart-minus').forEach(function (element) {
        element.onclick = cartMinus;
    });
    document.querySelectorAll('.cart-plus').forEach(function (element) {
        element.onclick = cartPlus;
    });
    let icon = document.querySelector('.cart-icon');
    icon.classList.remove('disabled');
    icon.innerText = col;
    col = 0;
}

function cartPlus() {
    let goodId = this.dataset.goods_id;
    cart[goodId]++;
    ajaxGetGoodInfo();
}

function cartMinus() {
    let goodId = this.dataset.goods_id;
    if (cart[goodId] - 1 > 0) {
        cart[goodId]--;
    } else {
        delete (cart[goodId]);
    }
    ajaxGetGoodInfo();
}

function updateLocalStorageCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function formatPrice(price) {
    return price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ');
}

$(document).ready(function() {
    $(document).on('click', '.dropdown-menu', function (e) {
        $(this).hasClass('cart') && e.stopPropagation();
    });
});