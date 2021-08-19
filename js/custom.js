

//show menu//
$('.menu-icon, .menu-screen a').click(()=>{
    $('.menu-screen').toggleClass('show-menu');
    $('.menu-icon').toggleClass('menu-rotate');
});

//on scroll animation//
var $animation_elements = $('.check-scroll');
var $window = $(window);
function check_if_in_view() {
    var window_height = $window.height();
    var window_top_position = $window.scrollTop();
    var window_bottom_position = (window_top_position + window_height);

    $.each($animation_elements, function() {
        var $element = $(this);
        var element_height = $element.outerHeight();
        var element_top_position = $element.offset().top;
        var element_bottom_position = (element_top_position + element_height);

        //check to see if this current container is within viewport
        if ((element_bottom_position >= window_top_position) &&
            (element_top_position <= window_bottom_position)) {
            $element.addClass('text-slide-animation');
        } else {
            $element.removeClass('in-view');
        }
    });
}
$window.on('scroll resize', check_if_in_view);
$window.trigger('scroll');


// Splitter //
$('.fancy_title').each(function() {
        let arr = $(this).text().split("/");
        let html = "";
        for (i = 0; i < arr.length; ++i) {
            html += "<div><span>" + arr[i] + "</span></div>";
        }
        $(this).html(html);
    }
);


// wavy //
let spriteImages = $( '.slide-item__image' );
let spriteImagesSrc = [];

for ( var i = 0; i < spriteImages.length; i++ ) {
    var img = spriteImages[i];
    spriteImagesSrc.push( img.getAttribute('src' ) );
}
CanvasSlideshow({
    sprites: [spriteImagesSrc[0]],
    displacementImage: 'img/clouds.jpg',
    location:'slide-item'
});

CanvasSlideshow({
    sprites: [spriteImagesSrc[4]],
    displacementImage: 'img/clouds.jpg',
    location:'slide-item3'
});

CanvasSlideshow({
    sprites: [spriteImagesSrc[1]],
    displacementImage: 'img/clouds.jpg',
    location:'slide-item2'
});

CanvasSlideshow({
    sprites: [spriteImagesSrc[3]],
    displacementImage: 'img/clouds.jpg',
    location:'slide-item4'
});

CanvasSlideshow({
    sprites: [spriteImagesSrc[2]],
    displacementImage: 'img/clouds.jpg',
    location:'slide-item5'
});
