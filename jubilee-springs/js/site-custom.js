$(window).load(function () {
    'use strict';
    $("#pageloader").delay(1200).fadeOut("slow");
    $(".loader-item").delay(700).fadeOut();
});

// Loading Animation On Page Scroll
wow = new WOW({animateClass: 'animated', offset: 100});
wow.init();

/* ==============================================
 Custom Javascript
 =============================================== */
$(document).ready(function () {

    'use strict';

    // Main Navigation
    $("#main-menu").menuzord({
        align: "right",
        animation: "drop-up",
        effect: "fade",
        indicatorFirstLevel: "<i class='fa fa-angle-down'></i>",
        indicatorSecondLevel: "<i class='fa fa-angle-right'></i>"
    });

    /* Tooltip */
    $('.team-social ul li a, .demo-button a, .portfolio-buttons a, .social-icons ul li a').tooltip({
        placement: 'top',
        animation: true,
        delay: {show: 200, hide: 100}
    });

    // Parallax Background
    $.stellar({
        responsive: true,
        horizontalScrolling: false,
        verticalOffset: 40
    });

    /* Counter */
    $('.counter').counterUp({
        delay: 10,
        time: 1000
    });

    $('.skillbar').appear();
    $('.skillbar').on('appear', function () {
        $(this).find('.skillbar-bar').animate({
            width: $(this).attr('data-percent')
        }, 3000);
    });

    // Twitter Feed
    $(".tweet-stream").tweet({
        username: "envato",
        modpath: "twitter/",
        count: 1,
        template: "{text}{time}",
        loading_text: "loading twitter feed..."
    });

    // Flickr Photostream
    $('#basicuse').jflickrfeed({
        limit: 9,
        qstrings: {
            id: '52617155@N08'
        },
        itemTemplate: '<li><a href="{{image_b}}"><img src="{{image_s}}" alt="{{title}}" /></a></li>'
    });

    /* Responsive Videos */
    $(".media.video").fitVids();

    /* hide #back-top first */
    $("#back-top").hide();
    // fade in #back-top
    $(function () {
        $(window).scroll(function () {
            if ($(this).scrollTop() > 100) {
                $('#back-top').fadeIn();
            } else {
                $('#back-top').fadeOut();
            }
        });
        // scroll body to 0px on click
        $('#back-top a').click(function () {
            $('body,html').animate({
                scrollTop: 0
            }, 800);
            return false;
        });
    });

    /* Fancybox Lightbox */
    $(".fancybox").fancybox({
        helpers: {
            overlay: {
                locked: false, // try changing to true and scrolling around the page
                title: {type: 'outside'},
                thumbs: {width: 50, height: 50}
            }
        }
    });


    // Portfolio Single Slider
    $("#portfolio-single").owlCarousel({
        items: 1,
        margin: 0,
        loop: true,
        nav: true,
        slideBy: 1,
        dots: false,
        center: false,
        autoplay: false,
        autoheight: true,
        navText: ['&#xf104;', '&#xf105'],
        responsive: {
            320: {items: 1},
            480: {items: 1},
            600: {items: 1},
            1000: {items: 1, loop: true},
            1200: {items: 1, loop: true}
        }
    });

    // Our Portfolio Slider
    $("#home-portfolio").owlCarousel({
        items: 5,
        margin: 0,
        loop: true,
        nav: false,
        slideBy: 1,
        dots: false,
        center: false,
        autoplay: false,
        autoheight: true,
        navText: ['&#xf104;', '&#xf105'],
        responsive: {
            320: {items: 1},
            480: {items: 2},
            600: {items: 2},
            1000: {items: 4, loop: true},
            1200: {items: 5, loop: true}
        }
    });

    $("#home-portfolio-2").owlCarousel({
        items: 3,
        margin: 30,
        loop: true,
        nav: true,
        slideBy: 1,
        dots: false,
        center: false,
        autoplay: true,
        autoheight: true,
        navText: ['&#xf104;', '&#xf105'],
        responsive: {
            320: {items: 1},
            480: {items: 2},
            600: {items: 2},
            1000: {items: 3, loop: true},
            1200: {items: 3, loop: true}
        }
    });

    // Testimonial Slider
    $("#home-testimonial, #shop-detail").owlCarousel({
        items: 1,
        margin: 0,
        loop: true,
        nav: false,
        slideBy: 1,
        dots: true,
        center: false,
        autoplay: false,
        autoheight: true,
        navText: ['&#xf104;', '&#xf105'],
        responsive: {
            320: {items: 1, nav: false},
            480: {items: 1, nav: false},
            600: {items: 1, nav: false},
            1000: {items: 1, loop: true, nav: false},
            1200: {items: 1, loop: true, nav: false}
        }
    });

    // Testimonial Slider
    $("#home-blog").owlCarousel({
        items: 1,
        margin: 30,
        loop: true,
        nav: true,
        slideBy: 1,
        dots: false,
        center: false,
        autoplay: false,
        autoheight: true,
        navText: ['&#xf104;', '&#xf105'],
        responsive: {
            320: {items: 1},
            480: {items: 2},
            600: {items: 2},
            1000: {items: 3, loop: true},
            1200: {items: 3, loop: true}
        }
    });

    // Home Clients Slider
    $("#home-clients").owlCarousel({
        items: 6,
        margin: 30,
        loop: true,
        nav: false,
        slideBy: 1,
        dots: false,
        center: false,
        autoplay: true,
        autoheight: true,
        navText: ['&#xf104;', '&#xf105'],
        responsive: {
            320: {items: 2},
            480: {items: 2},
            600: {items: 4},
            1000: {items: 5, loop: true},
            1200: {items: 6, loop: true}
        }
    });

    // Open Video
    jQuery('.play-video').on('click', function (e) {
        var videoContainer = jQuery('.video-box');
        videoContainer.prepend('<iframe width="560" height="315" src="https://www.youtube.com/embed/Ry4F9g3YYw0?rel=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>');
        videoContainer.fadeIn(300);
        e.preventDefault();
    });

    // Close Video
    jQuery('.close-video').on('click', function (e) {
        jQuery('.video-box').fadeOut(400, function () {
            jQuery("iframe", this).remove().fadeOut(300);
        });
    });

    // Google Map
    $("#map_extended").gMap({
        markers: [{
            address: "",
            html: '<h4>Office</h4>' +
            '<address>' +
            '<div>' +
            '<div><b>Address:</b></div>' +
            '<div>Envato Pty Ltd, 13/2<br> Elizabeth St Melbourne VIC 3000,<br> Australia</div>' +
            '</div>' +
            '<div>' +
            '<div><b>Phone:</b></div>' +
            '<div>+1 (408) 786 - 5117</div>' +
            '</div>' +
            '<div>' +
            '<div><b>Fax:</b></div>' +
            '<div>+1 (408) 786 - 5227</div>' +
            '</div>' +
            '<div>' +
            '<div><b>Email:</b></div>' +
            '<div><a href="mailto:info@mithiliya.com">info@info@mithiliya.com</a></div>' +
            '</div>' +
            '</address>',
            latitude: -33.87695388579145,
            longitude: 151.22183918952942,
            icon: {
                image: "images/pin.png",
                iconsize: [35, 48],
                iconanchor: [17, 48]
            }
        }],
        icon: {
            image: "images/pin.png",
            iconsize: [35, 48],
            iconanchor: [17, 48]
        },
        latitude: -33.87695388579145,
        longitude: 151.22183918952942,
        zoom: 16
    });


    // Contact Form
    jQuery("#contact_form").validate({
        meta: "validate",
        submitHandler: function (form) {
            var s_name = $("#name").val();
            var s_email = $("#email").val();
            var subject = $("#subject").val();
            var s_comment = $("#comment").val();
            $.post("contact.php", {
                    name: s_name,
                    email: s_email,
                    subject: subject,
                    comment: s_comment
                },
                function (result) {
                    $('#sucessmessage').append(result);
                });
            $('#contact_form').hide();
            return false;
        },
        /* */
        rules: {
            name: "required",

            lastname: "required",
            // simple rule, converted to {required:true}
            email: { // compound rule
                required: true,
                email: true
            },
            phone: {
                required: true,
            },
            comment: {
                required: true
            },
            subject: {
                required: true
            }
        },
        messages: {
            name: "Please enter your name.",
            lastname: "Please enter your last name.",
            email: {
                required: "Please enter email.",
                email: "Please enter valid email"
            },
            phone: "Please enter a phone.",
            subject: "Please enter a subject.",
            comment: "Please enter a comment."
        }
    });
    /*========================================*/


    /*Rev Slider*/
    $('.mainSlider').revolution({
        delay: 9000,
        startwidth: 960,
        startheight: 400,
        startWithSlide: 0,

        fullScreenAlignForce: "off",
        autoHeight: "off",
        minHeight: "off",

        shuffle: "off",

        onHoverStop: "on",

        thumbWidth: 100,
        thumbHeight: 50,
        thumbAmount: 3,

        hideThumbsOnMobile: "off",
        hideNavDelayOnMobile: 1500,
        hideBulletsOnMobile: "off",
        hideArrowsOnMobile: "off",
        hideThumbsUnderResoluition: 0,

        hideThumbs: 0,
        hideTimerBar: "off",

        keyboardNavigation: "on",

        navigationType: "bullet",
        navigationArrows: "solo",
        navigationStyle: "round-old",

        navigationHAlign: "center",
        navigationVAlign: "bottom",
        navigationHOffset: 30,
        navigationVOffset: 30,

        soloArrowLeftHalign: "left",
        soloArrowLeftValign: "bottom",
        soloArrowLeftHOffset: 0,
        soloArrowLeftVOffset: 0,

        soloArrowRightHalign: "right",
        soloArrowRightValign: "bottom",
        soloArrowRightHOffset: 0,
        soloArrowRightVOffset: 0,


        touchenabled: "on",
        swipe_velocity: "0.7",
        swipe_max_touches: "1",
        swipe_min_touches: "1",
        drag_block_vertical: "false",

        parallax: "mouse",
        parallaxBgFreeze: "on",
        parallaxLevels: [10, 7, 4, 3, 2, 5, 4, 3, 2, 1],
        parallaxDisableOnMobile: "off",

        stopAtSlide: -1,
        stopAfterLoops: -1,
        hideCaptionAtLimit: 0,
        hideAllCaptionAtLilmit: 0,
        hideSliderAtLimit: 0,

        dottedOverlay: "none",

        spinned: "spinner4",

        fullWidth: "off",
        forceFullWidth: "off",
        fullScreen: "off",
        fullScreenOffsetContainer: "#topheader-to-offset",
        fullScreenOffset: "0px",
        panZoomDisableOnMobile: "off",

        simplifyAll: "off",

        shadow: 0
    });

    $('.search-form').each(function () {
        var form = $(this), input = $('input', form);
        form.on('submit', function () {
            return (input.val().trim().length > 0);
        });
    });

});