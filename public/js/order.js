document.querySelector('#lite-shop-order').onsubmit = function (event) {
    event.preventDefault();
    let firstName = document.querySelector('#firstName').value.trim();
    let lastName = document.querySelector('#lastName').value.trim();
    let phone = document.querySelector('#phone').value.trim();
    let email = document.querySelector('#email').value.trim();
    let address = document.querySelector('#address').value.trim();

    if (!document.querySelector('#rule').checked) {
        Swal.fire({
            title: 'Ошибка!',
            text: 'Примите пользовательское соглашение',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: 'orange',
        });
        return false;
    }

    if (firstName === "" || lastName === "" || phone === "" || email === "" || address === "") {
        Swal.fire({
            title: 'Ошибка!',
            text: 'Заполните все поля',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: 'orange',
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
        let res = JSON.parse(body);
        if (res.status === 1) {
            localStorage.removeItem('cart');
            Swal.fire({
                title: 'Заказ успешно оформлен!',
                text: 'Статус заказа можно отслеживать в личном кабинете',
                icon: 'success',
                confirmButtonText: '<i class="fa fa-thumbs-up"></i> Ok',
                confirmButtonColor: 'orange',
            });
        } else if (res.status === 2) {
            Swal.fire({
                title: 'Ошибка!',
                text: 'Пользователь с таким email уже существует. Войдите на сайт и завершите заказ',
                icon: 'error',
                confirmButtonText: 'Ok',
                confirmButtonColor: 'orange',
            });
        } else if (res.status === 3) {
            localStorage.removeItem('cart');
            Swal.fire({
                title: 'Заказ успешно оформлен!',
                html: 'Вам был создан личный кабинет. Для входа используйте email, который вы указали при оформлении заказа а также пароль: ' +
                    '<strong>' + res.password + '</strong>',
                icon: 'success',
                confirmButtonText: '<i class="fa fa-thumbs-up"></i> Ok',
                confirmButtonColor: 'orange',
            });
        } else {
            console.log(res.status);
            Swal.fire({
                title: 'Ошибка!',
                text: 'Не удалось оформить заказ',
                icon: 'error',
                confirmButtonText: 'Ok',
                confirmButtonColor: 'orange',
            });
        }
    });
}