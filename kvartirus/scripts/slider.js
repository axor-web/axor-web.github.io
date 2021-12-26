class Slider {
    constructor(html, imgsNames) {
        if (imgsNames) {
            for (let imgName of imgsNames) { 
                html.children[0].insertAdjacentHTML('beforeend', 
                    `<div class="slider__images-img"><img src="./img/${imgName}.jpg" srcset="./img/${imgName}.webp" alt="apartment" loading="lazy"></div>`
                );
            }
        }

        this.imgs = html.children[0];
        this.html = html;
        this.num = 0;
        this.touchCoordinates = {
            x1: 0,
            x2: 0,
        };
        this.x = 0;
        this.side = true;

        this.imgs.addEventListener('touchstart', this.touchStartHandler.bind(this));
        this.imgs.addEventListener('touchmove', this.touchMoveHandler.bind(this));
        this.imgs.addEventListener('touchend', this.touchEndHandler.bind(this));
        
        window.addEventListener('load', this.resizeImages.bind(this));
        window.addEventListener('resize', this.resizeImages.bind(this));
    }

    touchStartHandler(event) {
        let firstTouch = event.touches[0];
        
        this.touchCoordinates.x1 = firstTouch.clientX;
    }
    touchMoveHandler(event) {
        event.preventDefault();
        let firstTouch = event.touches[0];
        this.touchCoordinates.x2 = firstTouch.clientX;

        let xDiff = this.touchCoordinates.x1 - this.touchCoordinates.x2;

        this.swipe(xDiff);
        this.touchCoordinates.x1 = firstTouch.clientX;

        this.imgs.style.transition = '';
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
        if (num < 0)       { num = 0;      }
        if (num >= maxLen) { num = maxLen; }

        let imageWidth = this.imgs.children[0].clientWidth;

        this.x = num * imageWidth;
        this.imgs.style.transform = `translateX(-${this.x}px)`;
    }

    slideBack() {
        slideTo(this.num - 1);
    }
    slideForward() {
        slideTo(this.num + 1);
    }

    resizeImages() {
        for (let imgElem of this.imgs.children) {
            imgElem.style.width = this.html.clientWidth + 'px';
        }
    }
}