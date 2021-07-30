'use strict';



class Cat {
    constructor({name, color, game, speed}) {
        this._name      = name;
        this._color     = color;
        this._game      = game;
        this._speed     = speed || 25;
        this._hp        = 100;
        this._hunger    = 100;
        this._happiness = 100;
        this._src       = `./materials/cat-assets/${this.color}/`;
        this._animation = `${this.src}cat_idle_blink_8.gif`;
        this._animName  = 'cat_idle_blink_8';
        this._html      = document.querySelector('.cat');
        this._x         = 0;
        this._y         = 0;
        this.emaciation = { active: 20, sleep: 720 };
        this.isCooldown = false;
        this.hurtTimer  = false;
        this.healTimer  = false;
    }

    get name()       { return this._name;       }
    get color()      { return this._color;      }
    get game()       { return this._game;       }
    get hp()         { return this._hp;         }
    get hunger()     { return this._hunger;     }
    get happiness()  { return this._happiness;  }
    get src()        { return this._src;        }
    get animation()  { return this._animation;  }
    get html()       { return this._html;       }
    get x()          { return this._x;          }
    get y()          { return this._y;          }
    get speed()      { return this._speed;      }

    set animation(value) {
        this._animation = this._src + value + '.gif';
        this._animName  = value;
        this.html.children[0].src = this.animation;
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
                this.y += 5;
                setTimeout(() => this.y -= 5, 100);
                this.animation = 'cat_idle_blink_8';
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

    set speed(value) {
        if (value < 5) { value = 5 }
        this._speed = value;
    }

    set x(value) {
        if (this.isCooldown) { return; }

        let old = this._x;

        if (value < 0)  { value = 0; }
        if (value > 90 ) { value = 90; }
        this._x = value;

        if (this._x == old) { return; }

        if (this.x < old) {     //меняем направление куда смотрит кот
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
        this.isCooldown = true;

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

        if (value < 0)    { value = 0;   }
        if (value > 90)   { value = 90; }
        if (value == old) { return; }

        let elem = this.game.getCollider(this);
        if (elem) {
            if (value > old) {
                let height  = this.game.main.html.clientHeight;
                let elemTop = (elem.top + elem.height*elem.areaCount) / height * 100;

                this._y = 100 - elemTop;
                
            }
            if (value < old) {
                this._y = this.game.bazeY;
            }
        }

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


        this.isCooldown = true;
        setTimeout(() => {
            this.isCooldown = false;
        }, time);
    }

    start(animation, x) {
        let y = this.game.bazeY;

        this.animation = animation;
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

    die() {
        this.animation  = 'cat_die_12';
        setTimeout(() => this.animation = 'cat_dead', 250);
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