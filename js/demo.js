{
    const posEl = document.getElementById('social').offsetTop;

    const lineEq = (y2, y1, x2, x1, currentVal) => {
        // y = mx + b 
        var m = (y2 - y1) / (x2 - x1), b = y1 - m * x1;
        return m * currentVal + b;
    };

    const lerp = (a,b,n) => (1 - n) * a + n * b;
    
    const distance = (x1,x2,y1,y2) => {
        var a = x1 - x2;
        var b = y1 - y2;
        return Math.hypot(a,b);
    };
    
    const getMousePos = (e) => {
        let posx = 0;
        let posy = 0;
        if (!e) e = window.event;
        if (e.pageX || e.pageY) {
            posx = e.clientX;
            posy = e.clientY;
        }
        else if (e.clientX || e.clientY) 	{
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        return { x : posx, y : posy }
    }
    
    // Window size
    let winsize;
    const calcWinsize = () => winsize = {width: window.innerWidth, height: window.innerHeight};
    calcWinsize();
    window.addEventListener('resize', calcWinsize);

    // The feDisplacementMap element
    const feDisplacementMapEl = document.querySelector('feDisplacementMap');

    class Menu {
        constructor() {
            this.DOM = {
                // The SVG element
                svg: document.querySelector('svg.distort'),
                // The menu element
                menu: document.querySelector('.menu')
            };
            // The images (one per menu link)
            this.DOM.imgs = [...this.DOM.svg.querySelectorAll('g > image')];
            // The menu links
            this.DOM.menuLinks = [...this.DOM.menu.querySelectorAll('.menu__link')];
            // Mouse position
            this.mousePos = {x: winsize.width/2, y: winsize.height/2};
            // Last mouse positions (one to consider for the image translation movement, another for the scale value of the feDisplacementMap element)
            this.lastMousePos = {
                translation: {x: winsize.width/2, y: winsize.height/2},
                displacement: {x: 0, y: 0}
            };
            // feDisplacementMap scale value
            this.dmScale = 0;
            // Current menu link position
            this.current = -1;
            
            this.initEvents();
            requestAnimationFrame(() => this.render());
        }
        initEvents() {
            // Update mouse position
            window.addEventListener('mousemove', ev => {
                this.mousePos = getMousePos(ev);
            });

            this.DOM.menuLinks.forEach((item, pos) => {
                // Create spans for each letter
                const letters = [...item.querySelectorAll('span')];

                const mouseenterFn = () => {
                    // Hide the previous menu image.
                    if ( this.current !== -1 ) {
                       TweenMax.set(this.DOM.imgs[this.current], {opacity: 0});
                    }
                    // Update current.
                    this.current = pos;

                    // Now fade in the new image if we are entering the menu or just set the new image's opacity to 1 if switching between menu items.
                    if ( this.fade ) {
                        TweenMax.to(this.DOM.imgs[this.current], 0.5, {ease: Quad.easeOut, opacity: 1});
                        this.fade = false;
                    }
                    else {
                        TweenMax.set(this.DOM.imgs[this.current], {opacity: 1});
                    }
                    
                    // Letters effect
                    TweenMax.staggerTo(letters, 0.2, {
                        ease: Sine.easeInOut,
                        y: this.lastMousePos.translation.y < this.mousePos.y ? 30 : -30,
                        startAt: {opacity: 1, y: 0},
                        opacity: 0,
                        yoyo: true,
                        yoyoEase: Back.easeOut,
                        repeat: 1,
                        stagger: {
                            grid: [1,letters.length-1],
                            from: 'center',
                            amount: 0.12
                        }
                    });
                };
                item.addEventListener('mouseenter', mouseenterFn);
            });

            const mousemenuenterFn = () => this.fade = true;
            const mousemenuleaveFn = () => TweenMax.to(this.DOM.imgs[this.current], .2, {ease: Quad.easeOut, opacity: 0});
            
            this.DOM.menu.addEventListener('mouseenter', mousemenuenterFn);
            this.DOM.menu.addEventListener('mouseleave', mousemenuleaveFn);
        }
        render() {
            // Translate the image on mousemove
            this.lastMousePos.translation.x = lerp(this.lastMousePos.translation.x, this.mousePos.x, 0.2);
            this.lastMousePos.translation.y = lerp(this.lastMousePos.translation.y, this.mousePos.y, 0.2);
            this.DOM.svg.style.transform = `translateX(${(this.lastMousePos.translation.x-winsize.width/2)}px) translateY(${this.mousePos.y-150}px)`;
            // Scale goes from 0 to 50 for mouseDistance values between 0 to 140
            this.lastMousePos.displacement.x = lerp(this.lastMousePos.displacement.x, this.mousePos.x, 0.1);
            this.lastMousePos.displacement.y = lerp(this.lastMousePos.displacement.y, this.mousePos.y, 0.1);
            const mouseDistance = distance(this.lastMousePos.displacement.x, this.mousePos.x, this.lastMousePos.displacement.y, this.mousePos.y);
            this.dmScale = Math.min(lineEq(50, 0, 140, 0, mouseDistance), 50);   
            feDisplacementMapEl.scale.baseVal = this.dmScale;

            requestAnimationFrame(() => this.render());
        }
    }

    new Menu();



        setTimeout(() => document.body.classList.add('render'), 60);
        // equation of a line

        function debounce(func, wait, immediate) {
            let timeout;
            return function() {
                let context = this, args = arguments;
                let later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                let callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        };

        class MorphingBG {
            constructor(el) {
                this.DOM = {};
                this.DOM.el = el;
                this.DOM.el.style.opacity = 0;
                this.DOM.el.style.transition = 'transform 2s ease-out';
                this.DOM.pathEl = this.DOM.el.querySelector('path');
                this.paths = this.DOM.pathEl.getAttribute('pathdata:id').split(';')
                this.paths.splice(this.paths.length, 0, this.DOM.pathEl.getAttribute('d'));
                this.win = {width: window.innerWidth, height: window.innerHeight};
                this.animate();
                this.initEvents();
            }
            animate() {
                anime.remove(this.DOM.pathEl);
                anime({
                    targets: this.DOM.pathEl,
                    duration: 10000,
                    easing: [0.5,0,0.5,1],
                    d: this.paths,
                    loop: true
                });
            }
            initEvents() {
                // Mousemove event / Tilt functionality.
                const tilt = {
                    tx: this.win.width/8,
                    ty: this.win.height/4,
                    rz: 45,
                    sx: [0.8,2],
                    sy: [0.8,2]
                }
                const onMouseMoveFn = (ev) => {
                    requestAnimationFrame(() => {
                        if ( !this.started ) {
                            this.started = true;
                            anime({
                                targets: this.DOM.el,
                                duration: 300,
                                easing: 'linear',
                                opacity: [0,1]
                            });
                        }
                        else {
                            const mousepos = getMousePos(ev);
                            const rotZ = 2*tilt.rz/this.win.height*mousepos.y - tilt.rz;
                            const scaleX = mousepos.x < this.win.width/2 ? lineEq(tilt.sx[0],tilt.sx[1],this.win.width/2,0,mousepos.x) : lineEq(tilt.sx[1],tilt.sx[0],this.win.width,this.win.width/2,mousepos.x);
                            const scaleY = mousepos.y < this.win.height/2 ? lineEq(tilt.sy[0],tilt.sy[1],this.win.height/2,0,mousepos.y) : lineEq(tilt.sy[1],tilt.sy[0],this.win.height,this.win.height/2,mousepos.y);
                            const transX = 2*tilt.tx/this.win.width*mousepos.x - tilt.tx;
                            const transY = 2*tilt.ty/this.win.height*mousepos.y - tilt.ty;

                            this.DOM.el.style.transform = `translate3d(${transX}px, ${transY}px,0) rotate3d(0,0,1,${rotZ}deg) scale3d(${scaleX},${scaleY},1)`;
                        }
                    });
                };

                // Window resize.
                const onResizeFn = debounce(() => this.win = {width: window.innerWidth, height: window.innerHeight}, 20);

                document.addEventListener('mousemove', onMouseMoveFn);
                document.addEventListener('touchstart', onMouseMoveFn);
                window.addEventListener('resize', ev => onResizeFn());
            }
        };

        new MorphingBG(document.querySelector('svg.scene'));
}
