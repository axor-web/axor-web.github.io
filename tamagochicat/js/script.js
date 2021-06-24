'use strict';

class Cat {
    constructor({name, color}) {
        this._name      = name;
        this._color     = color;
        this._hp        = 100;
        this._hunger    = 100;
        this._happiness = 100;
        this._src       = `./materials/cat-assets/${this.color}/`;
        this._animation = `${this.src}cat_idle_blink_8.gif`;
        this._animName  = 'cat_idle_blink_8';
        this._html      = document.querySelector('.cat');
        this._x         = '22';
        this._y         = '10';
        this.isCooldown = false;
    }

    get name()      { return this._name;      }
    get color()     { return this._color;     }
    get hp()        { return this._hp;        }
    get hunger()    { return this._hunger;    }
    get happiness() { return this._happiness; }
    get src()       { return this._src;       }
    get animation() { return this._animation;  }
    get html()      { return this._html;      }
    get x()         { return this._x;         }
    get y()         { return this._y;         }

    set animation(value) {
        this._animation = this._src + value + '.gif';
        this._animName  = value;
        this.html.children[0].src = this.animation;
    }

    set hp(value) {
        this._hp += value;
        if (this._hp < 0  ) { this._hp = 0;   }
        if (this._hp > 100) { this._hp = 100; }
    }
    set hunger(value) {
        this._hunger += value;
        if (this._hunger < 0  ) { this._hunger = 0;   }
        if (this._hunger > 100) { this._hunger = 100; }
    }
    set happiness(value) {
        this._happiness += value;
        if (this._happiness < 0  ) { this._happiness = 0;   }
        if (this._happiness > 100) { this._happiness = 100; }
    }

    set color(color) {
        this._color = color;
        this._src = `./materials/cat-assets/${this.color}/`;
        this.animation = this._animName;
    }

    set x(value) {
        if (this.isCooldown) { return; }

        let old = this._x;

        if (value < 0)   { value = 0;   }
        if (value > 100) { value = 100; }
        this._x = value;

        if (this.x < old) {     //меняем направление куда смотрит кот
            this.html.children[0].style = 'transform: scaleX(-1)';
        }
        else {
            this.html.children[0].style = '';
        }

        let time = 0;

        this.html.style = 
        `transform: translateX(${this.x}vh) 
        translateY(-${this.y}vh);
        transition = ${time}s`;

        this.isCooldown = true;
        setTimeout(() => this.isCooldown = false, time);    
    }

    set y(value) {
        if (this.isCooldown) { return; }

        let old = this._y;

        if (value < 0)   { value = 0;   }
        if (value > 100) { value = 100; }
        this._y = value;

        let time = 0;

        this.html.style = 
        `transform: translateX(${this.x}vh) 
        translateY(-${this.y}vh);
        transition = ${time}s`;

        this.isCooldown = true;
        setTimeout(() => this.isCooldown = false, time);
    }


    render(animation, x, y) {
        this.animation = animation;
        this.x = x;
        this.y = y;
    }
}

class Game {
    constructor() {
        Object.defineProperties(this, {
            header: {
                enumerable: true,
                value: {
                    html: document.querySelector('.header'),

                    stats: {
                        hp: {
                            logo : document.querySelector('#hp-logo' ),
                            value: document.querySelector('#hp-value'),

                            updateColor(hp) {
                                if (hp >= 75) { this.value.className = 'green';  return; }
                                if (hp >= 25) { this.value.className = 'yellow'; return; }
                                this.value.className = 'red';
                            }
                        },
                        hunger: {
                            logo : document.querySelector('#hunger-logo' ),
                            value: document.querySelector('#hunger-value'),
                        },
                        happiness: {
                            logo : document.querySelector('#happiness-logo' ),
                            value: document.querySelector('#happiness-value'),

                            updateLogo(lvl) {
                                if (lvl >= 75) { this.logo.children[0].src = './materials/happy-face.png';  return; }
                                if (lvl >= 40) { this.logo.children[0].src = './materials/normal-face.png'; return; }
                                this.logo.children[0].src = './materials/sad-face.png';
                            }
                        },
                    },

                    acts: {
                        eat:  document.querySelector('#eat'),
                        play: document.querySelector('#play'),
                    },
                },
            },
            
            main: {
                enumerable: true,
                value: {
                    html: document.querySelector('.main'),
                },
            }
        });
    }

    start() {
        this.header.html.style = 'visibility: visible';
        this.main.html.style   = 'visibility: visible';
    }

    update(cat) {
        this.header.stats.hp.value.textContent = cat.hp;
        this.header.stats.hp.updateColor(cat.hp);

        this.header.stats.hunger.value.textContent = cat.hunger;

        this.header.stats.happiness.value.textContent = cat.happiness;
        this.header.stats.happiness.updateLogo(cat.happiness);
    }
}




let isGameStarted = false;
let game          = {};
let cat           = {};

if (isGameStarted) {

}

else {
    cat = new Cat({
        name: 'Iriska',
        color: 'black',
    });

    game = new Game();

    game.start();
    game.update(cat);

    cat.render('cat_idle_blink_8', 22, 10);
}

