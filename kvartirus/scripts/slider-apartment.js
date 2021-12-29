class Slider {
    constructor(html, imgsNames) {
        if (imgsNames) {
            for (let imgName of imgsNames) { 
                html.children[0].insertAdjacentHTML('beforeend', 
                    `<div class="slider__images-img"><img src="./img/${imgName}.jpg" srcset="./img/${imgName}.webp" alt="apartment" loading="lazy"></div>`
                );
            }
        }

        this.html = html;
        this.imgs = html.children[0];
        this.btns = document.querySelector('.main__photo-btns');
        this.uncoverBtn = document.querySelector('.main__photo-btns-uncover');
        const list = this.btns.children[0];

        for (let i = 0; i < this.imgs.children.length; i++) {
            list.insertAdjacentHTML('beforeend', `<div><img src="./img/${imgsNames[i]}.jpg" srcset="./img/${imgsNames[i]}.webp" alt="apartment" loading="lazy"></div>`);
            list.children[i].addEventListener('click', (event) => {
                event.preventDefault();
                this.slideTo(i);
            }); 
        }

        list.children[0].classList.add('main__photo-btns_active');

        if (list.children.length <= 4) {
            this.uncoverBtn.style.display = 'none';
        }
        else {
            this.uncoverBtn.addEventListener('click', this.uncoverHandler.bind(this));
        }
        
        this.num = 0;
        this.touchCoordinates = {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0,
        };
        this.x = 0;
        this.side = true;

        if ('ontouchstart' in window) {
            this.html.classList.add('slider_active');
            this.imgs.addEventListener('touchstart', this.touchStartHandler.bind(this));
            this.imgs.addEventListener('touchmove', this.touchMoveHandler.bind(this));
            this.imgs.addEventListener('touchend', this.touchEndHandler.bind(this));
        }
        else {
            this.arrows = this.html.children[1];
            this.arrows.classList.add('slider__arrows_active');
            this.arrows.children[0].classList.add('slider__arrows_inactive');

            this.arrows.children[0].addEventListener('click', () => {
                this.slideBack();
            });
            this.arrows.children[1].addEventListener('click', () => {
                this.slideForward();
            });
        }
        
        window.addEventListener('load', this.resizeImages.bind(this));
        window.addEventListener('resize', this.resizeImages.bind(this));
    }

    uncoverHandler(event) {
        this.btns.children[0].classList.add('main__photo-btns-list_full');
        this.uncoverBtn.classList.add('main__photo-btns-uncover_disabled');
        this.uncoverBtn.removeEventListener('click', this.uncoverHandler);
        delete this.uncoverBtn;
    }

    touchStartHandler(event) {
        let firstTouch = event.touches[0];
        this.touchCoordinates.x1 = firstTouch.clientX;
        this.touchCoordinates.y1 = firstTouch.clientY;
        this.imgs.style.transition = '';
    }
    touchMoveHandler(event) {
        event.preventDefault();
        let firstTouch = event.touches[0];
        this.touchCoordinates.x2 = firstTouch.clientX;
        this.touchCoordinates.y2 = firstTouch.clientY;

        let xDiff = this.touchCoordinates.x1 - this.touchCoordinates.x2;
        let yDiff = this.touchCoordinates.y1 - this.touchCoordinates.y2;

        if (Math.abs(xDiff) < Math.abs(yDiff)) {
            return;
        }

        this.swipe(xDiff);
        this.touchCoordinates.x1 = firstTouch.clientX;
    }
    touchEndHandler(event) {
        this.moveToNearest();

        this.imgs.style.transition = 'transform .3s';
    }

    swipe(dist) {
        let imageWidth = this.imgs.children[0].clientWidth;
        let maxWidth = this.imgs.clientWidth - imageWidth;
        
        this.x += dist;

        if (this.x < 0)        { this.x = 0; }
        if (this.x > maxWidth) { this.x = maxWidth; }

        this.imgs.style.transform = `translateX(-${this.x}px)`;

        if (dist >= 0) { this.side = true;  }
        else           { this.side = false; }
    }

    moveToNearest() {
        let imageWidth = this.imgs.children[0].clientWidth;
        let num = 0;
        
        if (this.side) { num = Math.ceil((this.x / imageWidth) - 0.15);  }
        else           { num = Math.floor((this.x / imageWidth) + 0.15); }
        this.slideTo(num);
    }

    slideTo(num) {
        let maxLen = this.imgs.children.length;

        if (num < 0)           { num = 0;          }
        if (num >= maxLen - 1) { num = maxLen - 1; }
        if (!('ontouchstart' in window)) {
            if (num > this.num) {
                this.arrows.children[0].classList.remove('slider__arrows_inactive');
                if (num >= this.imgs.children.length - 1) { this.arrows.children[1].classList.add('slider__arrows_inactive'); }
            }
            else {
                this.arrows.children[1].classList.remove('slider__arrows_inactive');
                if (num <= 0) { this.arrows.children[0].classList.add('slider__arrows_inactive'); }
            }
        }

        if (num >= 4) { this.uncoverBtn?.dispatchEvent(new Event('click')); }

        this.num = num;

        let imageWidth = this.imgs.children[0].clientWidth;

        this.x = num * imageWidth;
        this.imgs.style.transition = 'transform .3s';
        this.imgs.style.transform = `translateX(-${this.x}px)`;

        for (let btn of this.btns.children[0].children) { btn.classList.remove('main__photo-btns_active'); }
        this.btns.children[0].children[num].classList.add('main__photo-btns_active');
    }

    slideBack() {
        this.slideTo(this.num - 1);
    }
    slideForward() {
        this.slideTo(this.num + 1);
    }

    resizeImages() {
        for (let imgElem of this.imgs.children) {
            imgElem.style.width = this.html.clientWidth + 'px';
        }
        this.slideTo(0);
    }
}