document.querySelector('#lite-shop-order').onsubmit = function (event) {
    event.preventDefault();
    let firstName = document.querySelector('#firstName').value.trim();
    let lastName = document.querySelector('#lastName').value.trim();
    let phone = document.querySelector('#phone').value.trim();
    let email = document.querySelector('#email').value.trim();
    let address = document.querySelector('#address').value.trim();

    if (!document.querySelector('#rule').checked) {
        Swal.fire({
            title : 'Warning!',
            text : 'Read and accept the rules',
            icon: 'error',
            confirmButtonText : 'Ok'
        });
        return false;
    }

    if (firstName == "" || lastName == "" || phone == "" || email == "" || address == "") {
        Swal.fire({
            title : 'Warning!',
            text : 'Fill all fields',
            icon: 'error',
            confirmButtonText : 'Ok'
        });
        return false;
    }

    fetch('/finish-order', {
        method: 'POST',
        body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            address: address,
            email: email,
            key: JSON.parse(localStorage.getItem('cart'))
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(function (res) {
        return res.text();
    }).then(function (body) {
        if (body == 1) {
            localStorage.removeItem('cart');
            Swal.fire({
                title : 'Заказ успешно оформлен!',
                text : 'Статус заказа можно отслеживать в личном кабинете',
                icon: 'success',
                confirmButtonText : 'Ok'
            });
        } else if(body == 2) {
            Swal.fire({
                title : 'Ошибка!',
                text : 'Пользователь с таким email уже существует. Войдите на сайт и завершите заказ',
                icon: 'error',
                confirmButtonText : 'Ok'
            });
        } else {
            Swal.fire({
                title : 'Ошибка!',
                text : 'Не удалось оформить заказ',
                icon: 'error',
                confirmButtonText : 'Ok'
            });
        }
    });
}