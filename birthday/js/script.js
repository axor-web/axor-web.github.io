'use strict';

class Entity {
    constructor(game, html, speed, x, y) {
        if (x < 0)   { x = 0;   }
        if (x > 100) { x = 100; }

        if (y < 0)   { y = 0;   }
        if (y > 100) { y = 100; }

        this._x         = x ?? 0;
        this._y         = y ?? game?.bazeY ?? 0;
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

        this.html.style = `
        transform: translateX(${this.x}vw) 
        translateY(calc(${100-this.y}vh - 100%));
        transition: transform ${time}s linear;
        `;

        setTimeout(() => this.isCooldown = false, time*1000);
    }

    set y(value) {
        if (this.isCooldown) { return; }
        this.isCooldown = true;

        let old = this._y;

        if (value < 0)    { value = 0;   }
        if (value > 100)  { value = 100; }
        if (value == old) { return;      }

        this.checkCollider(value);

        let time = Math.abs( 2 * (this._y - old) / 1000 )**0.5;
        
        this.html.style = 
        `
        transform: translateX(${this.x}vw) 
        translateY(calc(${100-this.y}vh - 100%));
        transition: transform ${time}s linear;
        `;

        setTimeout(() => this.isCooldown = false, time*1000);
    }

    start(x) {
        let y = this.game.bazeY;

        this._x = x;
        this._y = y;

        this.html.style = `
        transform: translateX(${x}vw) 
        translateY(calc(${100-this.y}vh - 100%));
        `;
    }

    enableDragnDrop(rules) {
        if (/iPhone|iPad|Android/i.test(navigator.userAgent)) {
            this.enableMobileDragnDrop(rules);

            return;
        }

        this.html.ondragstart = () => false;
        this.html.onmousedown = (e) => {
            if (this.isCooldown) { return; }
            this.isCooldown = true;

            let timer = new Date();

            let shiftX = e.clientX - e.target.getBoundingClientRect().left;
            let shiftY = e.clientY - e.target.getBoundingClientRect().top;
            
            document.onmousemove = (e) => {
                let height = document.body.clientHeight;
                let width  = document.body.clientWidth;
    
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
                    this.html.children[0].style.transform = 'scaleX(-1)';
                    if (this.curtain) {
                        this.curtain.style.transform = 'scaleX(-1)'
                    }
                }
                else if (this.x > old) { 
                    this.html.children[0].style.transform = '';
                    if (this.curtain) {
                        this.curtain.style.transform = ''
                    }
                 }

                this.html.style = `
                transform: translateX(${this.x}vw)
                translateY(calc(${100-this.y}vh));
                transition: transform 0s linear;`;
            }

            document.onmouseup = (e) => {
                this.isCooldown = false;
                document.onmousemove = null;
                document.onmouseup = null;

                if (rules?.isCollider) {
                    this.y = this._y - 10;
                    return;
                }

                this.y = 0;
            };
        };
    }

    enableMobileDragnDrop(rules) {
        this.html.ondragstart = () => false;
        
        this.html.ontouchstart = (e) => {
            if (this.isCooldown) { return; }
            this.isCooldown = true;

            let timer = new Date();

            let shiftX = e.touches[0].clientX - e.touches[0].target.getBoundingClientRect().left;
            let shiftY = e.touches[0].clientY - e.touches[0].target.getBoundingClientRect().top;
        
            document.ontouchmove = (e) => {
                let height = document.body.clientHeight;
                let width  = document.body.clientWidth;
    
                let x = (e.touches[0].clientX - shiftX) / width * 100;
                let y = (e.touches[0].clientY - shiftY) / height * 100;
                
                if (x < 0) { x = 0; }
                if (y < 0) { y = 0; }

                if (x > 90)  { x = 90;  }
                if (y > 100) { y = 100; }

                let old = this.x;
                this._x = x;
                this._y = 100 - y;

                if (this.x < old) {     //меняем направление
                    this.html.children[0].style.transform = 'scaleX(-1)';
                    if (this.curtain) {
                        this.curtain.style.transform = 'scaleX(-1)'
                    }
                }
                else if (this.x > old) { 
                    this.html.children[0].style.transform = '';
                    if (this.curtain) {
                        this.curtain.style.transform = ''
                    }
                 }

                this.html.style = `
                transform: translateX(${this.x}vw)
                translateY(calc(${100-this.y}vh));
                transition: transform 0s linear;`;
            }

            document.ontouchend = (e) => {
                this.isCooldown = false;
                document.ontouchmove = null;
                document.ontouchend = null;

                if (rules?.isCollider) {
                    this.y = this._y - 10;
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
            let height  = document.querySelector('.main__wall').clientHeight;
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
        this._y = Math.round(this._y * 10) / 10;
    }
}


class Cat extends Entity {
    constructor({name, color, game, speed}) {
        let cat = document.createElement('div');
        cat.className = 'cat';
        cat.insertAdjacentHTML('beforeend', `
            <img src="">
            <div class="cat__name"></div>
            <div class="cat__curtain"><img src=""></div>
        `);

        super(game, cat, speed ?? 25, 0, 0);
        
        this._name       = name;
        this._color      = color;
        this._src        = `./materials/cat-assets/${this.color}/`;
        this._animation  = `${this.src}cat_idle_blink_8.gif`;
        this._animName   = 'cat_idle_blink_8';
        this.emaciation  = { active: 20, sleep: 720, };
        this.timer       = new Date();
        this._isCooldown = false;
        this._curtain    = document.querySelector('.cat__curtain > img');
    }

    get name()       { return this._name;       }
    get color()      { return this._color;      }
    get src()        { return this._src;        }
    get animation()  { return this._animation;  }
    get x()          { return this._x;          }
    get y()          { return this._y;          }
    get isCooldown() { return this._isCooldown; }
    get curtain()    { return this._curtain;    }

    set isCooldown(bool) {
        this._isCooldown = bool;
        this.timer = new Date();
    }

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
        if (value > 90) { value = 90; }

        if (value == old) { return; }
        
        this.isCooldown = true;

        this._x = value;

        if (this.x < old) {     //меняем направление
            this.html.children[0].style.transform = 'scaleX(-1)';
            this.curtain.style.transform = 'scaleX(-1)';
        }
        else {
            this.html.children[0].style.transform = '';
            this.curtain.style.transform = '';
        }

        let time = Math.abs((this._x - old)/this.speed);

        this.html.style = 
        `
        transform: translateX(${this.x}vw) 
        translateY(calc(${100-this.y}vh - 100%));
        transition: transform ${time}s linear;
        `;

        this.animation = 'cat_run_12';

        setTimeout(() => {
            this.isCooldown = false;
            this.animation = 'cat_idle_blink_8';
        }, time*1000);
    }

    set y(value) {
        if (this.isCooldown) { return; }
        

        let old = this._y;

        if (value < 0)    { value = 0;  }
        if (value > 90)   { value = 90; }

        this.checkCollider(value);

        if (this._y == old) { return;   }

        this.isCooldown = true;

        let time = Math.abs( 2 * (this._y - old) / 1000 )**0.5;

        this.html.style = `
        transform: translateX(${this.x}vw) 
        translateY(calc(${100-this.y}vh - 100%));
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

    set curtain(animation) {
        if (!animation) { 
            this.html.children[0].style.opacity = 1;
            this._curtain.src = '';
            return;
        }

        this.html.children[0].style.opacity = 0;
        this._curtain.src = `${this.src}${animation}.gif`;
    }

    set color(color) {
        this._color = color;
        this._src = `./materials/cat-assets/${this.color}/`;
        this.animation = this._animName;
    }


    start(animation = this.animation, x = this.x) {
        let y = this.game.bazeY;

        this.animation = animation;
        this.reloadAnimation();
        this._x = x;
        this._y = y;

        this.html.style = `
        transform: translateX(${x}vw) 
        translateY(calc(${100-y}vh - 100%));
        `;

        this.html.children[1].textContent = this.name;

        this.game.main.html.addEventListener('click', (e) => {
            if (!this.isCooldown) {
                let width = this.game.main.html.clientWidth;
                let x = e.clientX / width * 100;
                cat.x = x;
            }
        });

        window.addEventListener('resize', () => this.y = game.bazeY);
    }

    reloadAnimation() {
        this.html.children[0].src = this.animation;
    }

    sit() {
        if (!this.isCooldown) { cat.animation = 'cat_sit_8'; }
    }

    jump(height) {
        let old = this.y;
        if (height <= 0) { return; }

        this._y += height;

        this.html.style = `
        transform: translateX(${this.x}vw) 
        translateY(calc(${100-this.y}vh - 100%));
        transition: transform 0.1s linear`;

        setTimeout(() => {
            this._y -= height;
            this.html.style = `
            transform: translateX(${this.x}vw) 
            translateY(calc(${100-this.y}vh - 100%));
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

    attack() {
        if (this.isCooldown) { return; }

        this.isCooldown = true;
        this.animation = 'cat_attack_12';
        this.html.style.width = '28vh';
        setTimeout(() => {
            this.animation = 'cat_idle_blink_8';
            this.isCooldown = false;
            this.html.style.width = '';
        }, 250);
    }

    eat(foodObj) {
        this.attack();
        this.happiness += foodObj.happinessCount;
        this.hunger    += foodObj.hungerCount;
    }

    play(toyObj) {
        let timer = setInterval(() => {
            this.attack();
        }, 250);

        setTimeout(() => {
            timer = clearInterval(timer);
            this.happiness += toyObj.happinessCount;
        }, 500);
    }

    enableDragnDrop(rules) {
        this.html.addEventListener('mousedown', () => {
            if (!this.isCooldown) {
                this.animation = 'cat_idle_blink_8';
            }
        });

        super.enableDragnDrop(rules);
    }

    disableDragnDrop() {
        this.html.onmousedown = null;
        this.html.ontouchstart = null;
    }

    enableCutscene() {
        this.isCooldown = true;
    }
}

class Enemy extends Entity {
    constructor(game, cat, html, speed, x, y) {
        if (x < 5)  { x = 5  }
        if (x > 80) { x = 80 }

        super(game, html, speed, x, y);

        this.cat = cat;
        this.interval = null;
    }

    start(x = this.x, y = this.y) {
        this._x = x;
        this._y = y;

        this.html.style = `
        transform: translateX(${x}vw) 
        translateY(-${y}vh);
        `;

        let goToEnemy = () => {
            if (!cat.isCooldown) {
                if   (cat.y == game.bazeY) { cat.x = this.x;     }
                else                       { cat.y = game.bazeY; }
            }
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
    constructor(foodName, game, cat, speed, x, y) {
        let html = document.createElement('div');
        html.className = 'food';
        html.insertAdjacentHTML('beforeend', `
        <img src="./materials/${foodName}.png" alt="foodName" draggable="false">
        `);

        super(game, cat, html, speed, x, y);

        this.foodObj = game.food[foodName];
    }

    start(x = this.x, y = this.y) {
        if (game.isDropped) { return; }

        super.start(x, y);

        game.isDropped = true;

        this.interval = clearInterval(this.interval);

        let goToEnemy = () => {
            if (!cat.isCooldown) {
                if (cat.x == this.x && cat.y == this.y && !this.isCooldown) { 
                    cat.eat(this.foodObj); 
                    this.destroy();
                    game.isDropped = false;
                    return; 
                }

                if   (cat.y == game.bazeY) { cat.x = this.x;     }
                else                       { cat.y = game.bazeY; }
            }
        }

        this.interval = setInterval(goToEnemy, 300);
    }
}


class Game {
    constructor(bazeY) {
        Object.defineProperties(this, {
            _bazeY: {
                enumerable: true,
                writable: true,
                value: bazeY || 20,
            },

            isBazeYChanged : {
                enumerable: true,
                writable: true,
                value: false,
            },

            isDropped: {
                enumerable: true,
                writable: true,
                value: false,
            },

            header: {
                enumerable: true,
                value: {
                    html: document.querySelector('.header'),

                    stats: {
                        task: {
                            html: document.querySelector('.header__stats-task'),
                        }
                    },
                },
            },
            
            main: {
                enumerable: true,
                value: {
                    html: document.querySelector('.main'),

                    colliderObjects: {
                        
                    },

                    wall: {
                        html: document.querySelector('.main__wall')
                    }
                },
            },
        });

        this.checkHeight();
    }

    get bazeY() { return this._bazeY; }
    set bazeY(value) {
        if (value < 0)   { value = 0;   }
        if (value > 100) { value = 100; }
        
        this._bazeY = value;
    }

    start() {
        window.onload = () => {
            setTimeout(() => window.scrollTo(0, 0), 10);
        };
        document.body.style.height = window.innerHeight + 'px';

        this.header.html.style.visibility = 'visible';
        this.main.html.style.visibility   = 'visible';

        window.addEventListener('resize', () => {
            window.scrollTo(0, 0)
            document.body.style.height = window.innerHeight + 'px';
            this.checkHeight();
        });


        let s = `Привет, моя Любимая Ириска! Предлагаю тебе пройти мини-квест про наш сегодняшний день!!! 🐈 <br>Для начала нужно сходить в школу!`;

        this.message(cat, s, () => {
            this.setTask('Цель: доведите Ириску до школы (Подойдите к двери)');
            this.main.wall.html.style = 'background-image: url(./materials/school.png);'

            let interval = setInterval(() => {
                if (cat.x > 30 && cat.x < 60 && !cat.isCooldown) {
                    let s1 = `Моя любимая самая умненькая солнышко, как и всегда, отлично и продуктивно отучилась! <br>Время встретить меня с подарками!`;
                    this.message(cat, s1, () => {
                        this.setTask('Цель: подойти ко мне и забрать подарочки!');
                        
                        let alex = new Cat({
                            name: 'Alex',
                            color: 'default',
                            game: game,
                        });
                        alex.start('cat_idle_blink_8', 10);
                        alex.isCooldown = true;

                        let lexInterval = setInterval(() => {
                            alex.jump(10);
                        }, 700);

                        let interval = setInterval(() => {
                            if (cat.x < 20 && !cat.isCooldown) {
                                lexInterval = clearInterval(lexInterval);
                                interval = clearInterval(interval);

                                let s2 = `Ты очень обрадовалась подарочкам и мы поехали до дома. Ты посмотрела подарочки и тебе понравилось!<br>Ты немного посидела с родителями, и теперь побежали на крутяцкий концерт!!!`;
                                this.message(cat, s2, () => {
                                    this.setTask('Цель: сходить на концерт! (Доведите Ириску до входа)');
                                    this.main.wall.html.style = `background-image: url('./materials/club.jpeg')`;
                                    alex.isCooldown = false;
                                    alex.x = 90;
                                }, 'Пофли на концерт!!!');

                                interval = setInterval(() => {
                                    if (cat.x > 80 && !cat.isCooldown) {
                                        interval = clearInterval(interval);

                                        let s3 = `Мы сходили на концерт и супер круто провели время, получив кучу впечатлений!! Это был топовый день и лучший праздник в мире!!!<br>Спасибо что ты есть, солнышко моё!!! Бесконечно сильно тебя люблю и счастлив, что ты у меня есть!`;
                                        this.message(cat, s3, () => {
                                            this.main.html.textContent = '';
                                            this.setTask('');
                                        }, 'Спасибо, котёнок!');
                                    }
                                }, 500);
                            }
                        }, 500);
                    }, 'Забрать подарочки!!!');

                    interval = clearInterval(interval);
                }
            }, 500)
        });

        
    }

    checkHeight() {
        let wall = document.querySelector('.main__wall');
        if (window.innerHeight != wall.clientHeight && !this.isBazeYChanged && window.innerHeight <= window.innerWidth) {
            this.bazeY += 10;
            this.isBazeYChanged = true;
        }
        else if (this.isBazeYChanged) {
            this.bazeY -= 10;
            this.isBazeYChanged = false;
        }
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

    dropEnemy(type, name, x, y) {
        if (!['food', 'toy'].includes(type)) {
            return false;
        }

        x = x ?? Math.random()*100;

        y = y ?? 80;

        if (!this.isDropped && !document.querySelector('.' + type)) {
            let enemy;

            if      (type == 'food') { enemy = new Food(name, game, cat, 25, x, y); }
            else if (type == 'toy')  { enemy = new Toy(name, game, cat, 25, x, y); }

            enemy.start();
            enemy.enableDragnDrop();

            enemy.html.children[0].ondragstart = null;
            

            /*
            enemy._x = x;
            enemy._y = y;
            enemy.style = `
            transform: translateX(${x}vw) 
            translateY(-${y}vh);
            `;*/

            return enemy;
        }
    }

    setTask(task) {
        let taskHtml = this.header.stats.task.html
        taskHtml.textContent = task;
        taskHtml.classList.add('header__stats-task_visible')
    }

    message(cat, text, action, button) {
        let message = document.querySelector('.message');
        message.classList.add('message_visible');

        message.children[0].insertAdjacentHTML('beforeend', text);

        if (!button) {
            button = 'OK'
        }

        message.children[1].textContent = button;

        message.children[1].onclick = () => {
            message.classList.remove('message_visible');
            action();
            setTimeout(() => message.children[0].textContent = '', 400);
        };
    }
}


let isGameStarted = false;
let game          = {};
let cat           = {};


game = new Game(10);

cat = new Cat({
    name: 'Iriska',
    color: 'black',
    game: game,
});


game.start();
cat.start('cat_idle_blink_8', 80);
cat.enableDragnDrop({isCollider: true});
