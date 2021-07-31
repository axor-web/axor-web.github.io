'use strict';

class Entity {
    constructor(game, html, speed, x, y) {
        this._x         = x || 0;
        this._y         = y || game?.bazeY || 0;
        this._speed     = speed || 25;
        this._html      = html;
        this._game      = game;
        this.isCooldown = false;

        game.main.html.append(this.html);
    }

    get html()       { return this._html;       }
    get x()          { return this._x;          }
    get y()          { return this._y;          }
    get speed()      { return this._speed;      }
    get game()       { return this._game;       }


    set speed(value) {
        if (value < 5) { value = 5 }
        this._speed = value;
    }

    set x(value) {
        if (this.isCooldown) { return; }
        this.isCooldown = true;

        let old = this._x;

        if (value < 0)  { value = 0; }
        if (value > 90 ) { value = 90; }
        if (value == old) { return; }

        this._x = value;

        let time = Math.abs((this._x - old)/this.speed);

        this.html.style = 
        `
        transform: translateX(${this.x}vw) 
        translateY(-${this.y}vh);
        transition: transform ${time}s linear;
        `;

        setTimeout(() => this.isCooldown = false, time*1000);
    }

    set y(value) {
        if (this.isCooldown) { return; }
        this.isCooldown = true;

        let old = this._y;

        if (value < 0)    { value = 0;   }
        if (value > 90)   { value = 90; }
        if (value == old) { return; }

        this.checkCollider(value);

        let time = Math.abs( 2 * (this._y - old) / 1000 )**0.5;

        this.html.style = 
        `
        transform: translateX(${this.x}vw) 
        translateY(-${this.y}vh);
        transition: transform ${time}s linear
        `;

        setTimeout(() => this.isCooldown = false, time*1000);
    }

    start(x) {
        let y = this.game.bazeY;

        this._x = x;
        this._y = y;

        this.html.style = `
        transform: translateX(${x}vw) 
        translateY(-${y}vh);
        `;
    }

    enableDragnDrop(rules) {
        this.html.ondragstart = () => false;
        this.html.onmousedown = (e) => {
            if (this.isCooldown) { return; }
            this.isCooldown = true;

            let timer = new Date();

            let shiftX = e.clientX - this.html.getBoundingClientRect().left;
            let shiftY = e.clientY - this.html.getBoundingClientRect().top;
        
            document.onmousemove = (e) => {
                let height = this.game.main.html.clientHeight;
                let width  = this.game.main.html.clientWidth;
    
                let x = (e.clientX - shiftX) / width * 100;
                let y = (e.clientY - shiftY) / height * 100;
                
                if (x < 0) { x = 0; }
                if (y < 0) { y = 0; }

                if (x > 90)  { x = 90;  }
                if (y > 100) { y = 100; }

                let old = this.x;
                this._x = x;
                this._y = 100 - y;

                if (this.x < old) {     //меняем направление
                    this.html.children[0].style = 'transform: scaleX(-1)';
                }
                else if (this.x > old) { this.html.children[0].style = ''; }

                this.html.style = `
                transform: translateX(${this.x}vw)
                translateY(calc(-${this.y}vh + 100%));
                transition: transform 0s linear;`;
            }

            document.onmouseup = (e) => {
                this.isCooldown = false;
                document.onmousemove = null;
                document.onmouseup = null;

                if (rules?.isCollider) {
                    this.y = this._y - 15;
                    return;
                }

                this.y = 0;
            };
        };
    }

    checkCollider(value) {
        let old = this._y;
        if (old == value) { return; }
        let elem = this.game.getCollider(this);

        if (this.y != this.game.bazeY) {
            this._y = this.game.bazeY;
        }

        if (elem) {
            let height  = this.game.main.html.clientHeight;
            let elemTop = (elem.top + elem.height*elem.areaCount) / height * 100;
            let elemBottom = 100 - elemTop;
            if (value > elemBottom) {
                this._y = elemBottom;                
            }
            else if (value < elemBottom) {
                this._y = this.game.bazeY;
            }
            else { return; }
        }
        else { return; }
    }
}


class Cat extends Entity {
    constructor({name, color, game, speed}) {
        let cat = document.createElement('div');
        cat.className = 'cat';
        cat.insertAdjacentHTML('beforeend', `
            <img src="">
            <div class="cat__name"></div>
        `);

        super(game, cat, speed ?? 25, 0, 0);
        
        this._name      = name;
        this._color     = color;
        this._hp        = 100;
        this._hunger    = 100;
        this._happiness = 100;
        this._src       = `./materials/cat-assets/${this.color}/`;
        this._animation = `${this.src}cat_idle_blink_8.gif`;
        this._animName  = 'cat_idle_blink_8';
        this.emaciation = { active: 20, sleep: 720 };
        this.hurtTimer  = false;
        this.healTimer  = false;
        this.isCooldown = false;
    }

    get name()       { return this._name;       }
    get color()      { return this._color;      }
    get hp()         { return this._hp;         }
    get hunger()     { return this._hunger;     }
    get happiness()  { return this._happiness;  }
    get src()        { return this._src;        }
    get animation()  { return this._animation;  }
    get x()          { return this._x;          }
    get y()          { return this._y;          }

    set animation(value) {
        if (value == this._animName) { return; }

        this._animation = this._src + value + '.gif';
        this._animName  = value;
        this.html.children[0].src = this.animation;
    }

    set x(value) {
        if (this.isCooldown) { return; }
        
        if (this.y != this.game.bazeY) { this.y = this.game.bazeY; return; }

        let old = this._x;

        if (value < 0)  { value = 0; }
        if (value > 90 ) { value = 90; }

        if (value == old) { return; }
        
        this.isCooldown = true;

        this._x = value;

        if (this.x < old) {     //меняем направление
            this.html.children[0].style = 'transform: scaleX(-1)';
        }
        else {
            this.html.children[0].style = '';
        }

        let time = Math.abs((this._x - old)/this.speed);

        this.html.style = 
        `
        transform: translateX(${this.x}vw) 
        translateY(-${this.y}vh);
        transition: transform ${time}s linear;
        `;

        this.animation = 'cat_run_12';

        setTimeout(() => {
            this.isCooldown = false;
            this.animation = 'cat_idle_blink_8';

            this.happiness += 1;
            this.hunger -= 1;

            this.checkStats();
            this.updateStats();
        }, time*1000);
    }

    set y(value) {
        if (this.isCooldown) { return; }
        

        let old = this._y;

        if (value < 0)    { value = 0;  }
        if (value > 90)   { value = 90; }
        if (value == old) { return;     }

        this.checkCollider(value);

        this.isCooldown = true;

        let time = Math.abs( 2 * (this._y - old) / 1000 )**0.5;

        this.html.style = `
        transform: translateX(${this.x}vw) 
        translateY(-${this.y}vh);
        transition: transform ${time}s linear`;

        if (this._y > old) {
            this.animation = 'cat_jump_12';
            setTimeout(() => this.animation = 'cat_fall_12', time*1000 < 250 ? time*1000 : 250);
            setTimeout(() => this.animation = 'cat_idle_blink_8', time*1000);
        }
        else {
            this.animation = 'cat_fall_12';
            setTimeout(() => this.animation = 'cat_land_12', time*1000 < 250 ? time*1000 : 250);
            setTimeout(() => this.animation = 'cat_idle_blink_8', time*1000);
        }


        setTimeout(() => {
            this.isCooldown = false;
        }, time*1000);
    }

    set hp(value) {
        if (value <= 0) {
            value = 0;

            if (this.hp != 0) { 
                this.die();
                this.isCooldown = true;
                this.happiness = 0;
                this.hunger = 0;
            }
        }

        else if (value < this._hp) {
            let old = this._animName;
            this.animation = 'cat_hurt_12';
            setTimeout(() => this.animation = old, 250);
        }

        if (value > this._hp) {
            if (this._hp == 0) {
                this.isCooldown = false;
                this.jump(5);
            }

            this.html.classList.add('cat_green');
            setTimeout(() => this.html.classList.remove('cat_green'), 200);
        }
        
        if (this._hp == 0 && value > 0) {
            
        }

        if (value > 100) { value = 100; }

        this._hp = value;
        this.checkStats();
        this.updateStats();
    }
    set hunger(value) {
        if (value < 0  ) { value = 0;   }
        if (value > 100) { value = 100; }
        this._hunger = value;
        
        this.checkStats();
        this.updateStats();
    }
    set happiness(value) {
        if (value < 0  ) { value = 0;   }
        if (value > 100) { value = 100; }
        this._happiness = value;

        this.checkStats();
        this.updateStats();
    }

    set color(color) {
        this._color = color;
        this._src = `./materials/cat-assets/${this.color}/`;
        this.animation = this._animName;
    }


    start(animation, x) {
        let y = this.game.bazeY;

        this.animation = animation;
        this.reloadAnimation();
        this._x = x;
        this._y = y;

        this.html.style = `
        transform: translateX(${x}vw) 
        translateY(-${y}vh);
        `;

        this.updateStats();

        this.html.children[1].textContent = this.name;

        setInterval(() => {
            this.hunger -= 1;
        }, this.emaciation.active * 1000);

        setInterval(() => {
            this.happiness -= 1;
        }, this.emaciation.active * 500);

        document.onclick = (e) => {
            let height = this.game.main.html.clientHeight;
            let x = e.clientX / height * 100;
            cat.x = x - 20;
        }
    }

    reloadAnimation() {
        this.html.children[0].src = this.animation;
    }

    startHurt() {
        if (this.hp == 0 || (this.hunger > 0 && this.happiness > 0)) { 
            this.stopHurt();
            return;
        }

        if (this.hurtTimer) { return; }

        this.hurtTimer = setInterval(() => {
            this.hp        -= 1;
            this.happiness -= 1;
        }, 1000);
    }
    stopHurt() {
        this.hurtTimer = clearInterval(this.hurtTimer);
    }

    startHeal() {
        
        if (this.hunger < 50 || this.happiness == 0 || this.hp == 100) { 
            this.stopHeal();
            return;
        }

        if (this.healTimer) { return; }

        this.healTimer = setInterval(() => {
            this.hp        += 1;
            this.hunger    -= 1;
        }, 1000);
    }
    stopHeal() {
        this.healTimer = clearInterval(this.healTimer);
    }

    checkStats() {
        if (this.hunger == 0 || this.happiness == 0) {
            this.startHurt();
            this.stopHeal();
            return;
        }
        this.stopHurt();
        
        if (this.hp == 0 && this.hunger > 0 && this.happiness > 0) {
            this.hp += 10; 
        }

        if (this.hunger > 50 && this.happiness > 0) {
            this.startHeal();
            this.stopHurt();
            return;
        }
        this.stopHeal();
    }

    updateStats() {
        let stats = this.game.header.stats;
        
        stats.hp.value.textContent = this.hp;
        if      (this.hp >= 75) { stats.hp.value.style = 'color: var(--green);'  }
        else if (this.hp >= 30) { stats.hp.value.style = 'color: var(--yellow);' }
        else                    { stats.hp.value.style = 'color: var(--red);'    }

        stats.happiness.value.textContent = this.happiness;
        let face = stats.happiness.logo.children[0];
        if      (this.happiness >= 70) { face.src = './materials/happy-face.png'  }
        else if (this.happiness >= 35) { face.src = './materials/normal-face.png' }
        else                           { face.src = './materials/sad-face.png'    }

        stats.hunger.value.textContent = this.hunger;
    }

    jump(height) {
        let old = this.y;
        if (this.isCooldown || height <= 0) { return; }

        this._y += height;

        this.html.style = `
        transform: translateX(${this.x}vw) 
        translateY(-${this.y}vh);
        transition: transform 0.1s linear`;

        setTimeout(() => {
            this._y -= height;
            this.html.style = `
            transform: translateX(${this.x}vw) 
            translateY(-${this.y}vh);
            transition: transform 0.1s linear`;
        }, 100);
        
        this.animation = 'cat_jump_12';
        setTimeout(() => this.animation = 'cat_fall_12', 100);
        setTimeout(() => this.animation = 'cat_idle_blink_8', 100);

        this.isCooldown = true;
        setTimeout(() => {
            this.isCooldown = false;
        }, 100);
    }

    die() {
        this.animation  = 'cat_die_12';
        setTimeout(() => this.animation = 'cat_dead', 250);
    }
}

class Enemy extends Entity {
    constructor(game, cat, html, speed, x, y) {
        super(game, html, speed, x, y);

        this.cat = cat;
        this.interval = null;
    }

    start(x, y) {
        this._x = x;
        this._y = y;

        this.html.style = `
        transform: translateX(${x}vw) 
        translateY(-${y}vh);
        `;

        let goToEnemy = () => {
            if (cat.y == game.bazeY && !cat.isCooldown) {
                cat.x = this.x;
            }

            else if (cat.y != game.bazeY) { cat.y = game.bazeY; }
        }

        this.interval = setInterval(goToEnemy, 300);
        
        this.y = game.bazeY;
    }

    destroy() {
        this.interval = clearInterval(this.interval);
        this.html.remove();
    }
}

class Food extends Enemy {
    constructor(foodName, game, cat, html, speed, x, y) {
        super(game, cat, html, speed, x, y);

        
    }
}

class Game {
    constructor(bazeY) {
        Object.defineProperties(this, {
            _bazeY: {
                enumerable: true,
                writable: true,
                value: bazeY,
            },

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

                    colliderObjects: {
                        bed: {
                            html: document.querySelector('.main__bed'),
                            areaCount: 0.45,
                        },
                    },
                },
            },

            food: {
                enumerable: true,
                writable: true,
                value: {
                    meat: {
                        src: './materials/meat.png',
                        hungerCount: 30,
                        happinessCount: 10,
                    },
                    
                    fish: {
                        src: './materials/fish.png',
                        hungerCount: 25,
                        happinessCount: 10,
                    },
    
                    soup: {
                        src: './materials/soup.png',
                        hungerCount: 20,
                        happinessCount: 5,
                    },
    
                    cake: {
                        src: './materials/cake.png',
                        hungerCount: 20,
                        happinessCount: 30,
                    },
                },
            },
        });
    }

    get bazeY() { return this._bazeY; }
    set bazeY(value) {
        if (value < 0)   { value = 0;   }
        if (value > 100) { value = 100; }
        
        this._bazeY = value;
    }

    start() {
        this.header.html.style = 'visibility: visible';
        this.main.html.style   = 'visibility: visible';

        this.header.acts.eat.addEventListener('click', (e) => {
            e.preventDefault();


        });
    }

    getCollider(cat) {
        for (let elem in this.main.colliderObjects) {
            elem = this.main.colliderObjects[elem];
            let coordinates = elem.html.getBoundingClientRect();
            let elemLeft    = coordinates.left  / this.main.html.clientWidth * 100;
            let elemRight   = coordinates.right / this.main.html.clientWidth * 100;

            cat             = cat.html.getBoundingClientRect();
            let catLeft     = cat.left  / this.main.html.clientWidth * 100;
            let catRight    = cat.right / this.main.html.clientWidth * 100;

            if (catLeft > elemLeft && catLeft < elemRight) {
                if (catRight > elemLeft && catRight < elemRight) {
                    coordinates.areaCount = elem.areaCount;
                    return coordinates;
                }
            }
        }

        return false;
    }

    dropFood(foodName) {
        let foodObj = {};
        
        
    }
}


let isGameStarted = false;
let game          = {};
let cat           = {};

if (isGameStarted) {
    
}

else {
    game = new Game(10);

    cat = new Cat({
        name: 'Iriska',
        color: 'black',
        game: game,
    });
}

game.start();
cat.start('cat_idle_blink_8', 14);
cat.enableDragnDrop({isCollider: true});

/*let meat = document.createElement('div');
meat.insertAdjacentHTML('beforeend', `<img src="./materials/meat.png">`);
meat.className = 'food';

meat = new Enemy(game, cat, meat, 25, 60, 60);
meat.start(60, 60);
meat.enableDragnDrop();*/