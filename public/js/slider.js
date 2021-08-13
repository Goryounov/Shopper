let slider = document.querySelector('.slider-images');

setInterval(changeSlide, 2000);

function changeSlide() {
    for (let i = 0; i < slider.childNodes.length; i++) {
        if (slider.childNodes[i].classList.contains('active')) {
            slider.childNodes[i].classList.toggle('active');
            if (i === slider.childNodes.length - 1) {
                slider.childNodes[0].classList.add('active');
            } else {
                slider.childNodes[i + 1].classList.add('active');
            }
            break;
        }
    }
}