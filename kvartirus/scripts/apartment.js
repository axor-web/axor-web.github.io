const slider = new Slider(document.querySelector('.slider'), 
[
    'apartment1',
    'apartment2',
    'apartment3',
    'apartment4',
    'apartment5',
]);


window.onload = () => {
    setTimeout(() => document.querySelector('.main__map iframe').src = "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15051.073200557083!2d37.58078374853958!3d55.728877795253304!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sru!2sru!4v1640435531733!5m2!1sru!2sru", 100);
}