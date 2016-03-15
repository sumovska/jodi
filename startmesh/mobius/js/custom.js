/*************************************************************
* ThemeOne custom jquery code
*************************************************************/

jQuery.noConflict();
var global = {};

(function($) {
			
"use strict";

/*************************************************************
BROWSERS CAPABILITY
*************************************************************/

var smoothScroll = !!('WebkitOverflowScrolling' in document.documentElement.style);
var touchDevice = (Modernizr.touch) ? true : false;
var css3 = (Modernizr.csstransforms3d) ? true : false;
var ua = navigator.userAgent;
if( ua.indexOf("Android") >= 0 ) {
	var androidversion = parseFloat(ua.slice(ua.indexOf("Android")+8)); 
	var android = (androidversion >= 4.0) ? true : false;
	smoothScroll = android;
}

var ie = (function() {
	var v = 3,
		div = document.createElement('div'),
		all = div.getElementsByTagName('i');
	do {
		div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->';
	}
	while (all[0]);
	return v > 4 ? v : document.documentMode; 		
}());

/*************************************************************
FIXED HEADER HEIGHT ON TOUCH DEVICE
*************************************************************/

var headerMinHeight  = $('#header').data('header-height');
if (touchDevice === true) {
	$('#header-container').attr('style', 'height:'+headerMinHeight+'px');
	$('#header-spacer').attr('style', 'height:'+headerMinHeight+'px');
}
$(window).on('statechangecomplete', function() {
	if (touchDevice === true) {
		headerMinHeight  = $('#header').data('header-height');
		$('#header-spacer').attr('style', 'height:'+headerMinHeight+'px');
	}
});

/*************************************************************
GET VENDOR PREFIX
*************************************************************/

var pre;
function prefix() {
	var styles = window.getComputedStyle(document.documentElement, '');
	pre = '-'+(Array.prototype.slice.call(styles).join('') .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o']))[1]+'-';
}
if (css3 === true) {
	prefix();
}

/*************************************************************
MODERNIZR ADD BOX SIZING TEST
*************************************************************/

Modernizr.addTest("boxsizing", function() {
    return Modernizr.testAllProps("boxSizing") && (document.documentMode === undefined || document.documentMode > 7);
});

/*************************************************************
REQUEST ANIMATION FRAME DECLARATION FOR SCROLLING
*************************************************************/

var lastTime = 0;

var scroll = window.requestAnimationFrame ||
             window.webkitRequestAnimationFrame ||
             window.mozRequestAnimationFrame ||
             window.msRequestAnimationFrame ||
             window.oRequestAnimationFrame ||
             function(callback){animationFallback();};

function animationFallback() {
	scroll = function(callback, element) {
		var currTime = new Date().getTime();
		var timeToCall = Math.max(0, 16 - (currTime - lastTime));
		var id = window.setTimeout(function() { callback(currTime + timeToCall); },timeToCall);
		lastTime = currTime + timeToCall;
		return id;
	};
}

/*************************************************************
REMOVE HOVER EFFECTS (60HZ, IMPROVE SCROLLING PERFORMANCE ON MOZILLA) 
*************************************************************/

if ((touchDevice === false && ie > 9) || (touchDevice === false && typeof ie === 'undefined')) {
	var body = document.body,
		timer;
	window.addEventListener('scroll', function() {
	  clearTimeout(timer);
	  if(!body.classList.contains('disable-hover')) {
		body.classList.add('disable-hover');
	  }
	  timer = setTimeout(function(){
		body.classList.remove('disable-hover');
	  },150);
	}, false);
}

/*************************************************************
PREVENT DRAG AND DROP IMAGE/LINK (NEEDED FOR IE8 SLIDER)
*************************************************************/

$(document).on('dragstart', function(event) {
    if (event.target.tagName.toLowerCase() === 'img' || event.target.tagName.toLowerCase() === 'a') {
        event.preventDefault();
    }
});

/*************************************************************
CALCUL MIN HEIGHT
*************************************************************/

function pageFH() {
	if ($('#outer-container').height() < $(window).height()) {
		var minH = $(window).height()-$('#outer-container').height();
		$('#footer').css('margin-top',minH);
	} else {
		$('#footer').css('margin-top',0);
	}
}

/*************************************************************
IF ADMIN BAR
*************************************************************/

if ($('body').hasClass('admin-bar')) {
	$('html').addClass('admin');
}

/*************************************************************
REMOVE POST/PORTFOLIO ITEM BORDER
*************************************************************/

if (!$('#to-author-bio').length && !$('.comment-respond').length) {
	$('#single-portfolio-section .portfolio-page-pp').css('border','none');
	$('#single-portfolio-section').css('padding','0');
}

$(window).on('statechangecomplete', function() {
	if (!$('#to-author-bio').length && !$('.comment-respond').length) {
		$('#single-portfolio-section .portfolio-page-pp').css('border','none');
		$('#single-portfolio-section').css('padding','0');
	}
});

/*************************************************************
SOCIAL SHARING COUNTER
*************************************************************/

var sharingHref,
	facebook  = '.facebook-share',
	twitter   = '.twitter-share',
	pinterest = '.pinterest-share',
	google1   = '.google-share',
	windowLocation = window.location.href.replace(window.location.hash, '');

$(document).on('click', facebook, function(e){
	e.preventDefault();
	window.open( 'https://www.facebook.com/sharer/sharer.php?u='+windowLocation, "facebookWindow", "height=380,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0" );
	return false;
});

$(document).on('click', twitter, function(e){
	e.preventDefault();
	window.open( 'http://twitter.com/intent/tweet?text='+ escape($('h1').text()) +' '+windowLocation, "twitterWindow", "height=380,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0" );
	return false;
});

$(document).on('click', pinterest, function(e){
	e.preventDefault();
	window.open( 'http://pinterest.com/pin/create/button/?url='+windowLocation+'&media='+$('article img').first().attr('src')+'&description='+$('h1').text(), "pinterestWindow", "height=640,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0" );
	return false;
});

$(document).on('click', google1, function(e){
	e.preventDefault();
	window.open( 'https://plus.google.com/share?url='+windowLocation, "googlePlusWindow", "height=380,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0" ) ;
	return false;
});

function socialCount() {
	if ($('.to-social').length) {
		$.ajax({
			type: 'POST',
			url: to_ajaxurl,
			data: {
				action : 'share_counter',
				url: window.location.href.replace(window.location.hash, '')
			},
			success:function(data) {
				data = $.parseJSON(data);
				var total = data.total;
				var postL = parseInt($('.to-social .post-like-count').text());
				$(facebook).find('.count').text(data.facebook);
				$(twitter).find('.count').text(data.twitter);
				$(pinterest).find('.count').text(data.pinterest);
				$(google1).find('.count').text(data.google);
				if (total+postL < 9999 && (Math.floor(total) == total && $.isNumeric(total))) {
					total = parseInt(total)+postL;
				} else {
					total = total;
				}
				$('.to-social-shared').find('.count').text(total);
			}
		});
	}
}

$(document).ready(function() {
	socialCount();
});

$(window).on('statechangecomplete', function() {
	windowLocation = window.location.href.replace(window.location.hash, '');
	socialCount();
});

/*************************************************************
Sliding sidebar ScrollBar
*************************************************************/

if (touchDevice === false) {
	
	var $scrollSideBar = $('#sliding-sidebar');
	$(document).ready(function() {
		$scrollSideBar.sly({
			speed: 800,
			easing: 'easeOutExpo',
			scrollBy: 120,
			syncSpeed: 0.1,
			dragHandle: 1,
			dynamicHandle: 1,
			clickBar: 1,
			mouseDragging: 1,
			touchDragging: 1,
			releaseSwing: 1,
			elasticBounds: 1
		});  
	});
	
	$(window).on('resize', function() {
		$scrollSideBar.sly('reload');
	});
	
	$('.widget .menu-item-has-children a').on('click', function() {
		setTimeout(function() {	
			$scrollSideBar.sly('reload');
		}, 350);
		
	});
	
}

/*************************************************************
Left menu no scrollBar
*************************************************************/

var scrolldiv   = document.getElementById('wrapper-scroll');
var innerWidth  = scrolldiv.offsetWidth;
var outerWidth  = document.getElementById('textarea-scroll').scrollWidth;
var menuWidth   = document.getElementById('sliding-menu-inner').offsetWidth;
var scrollWidth = innerWidth - outerWidth;
document.getElementById('sliding-menu-inner').style.width = menuWidth + scrollWidth + 'px';
$('#wrapper-scroll').remove();

/*************************************************************
PARALLAX PAGE HEADER
*************************************************************/

var pageHeading= '.to-page-heading',
	PageHeaderTrans,
	pageheaderP,
	pageheaderH;	

function initHeading() {
	if ($('#header-overlay').css('opacity') != 1 || $(pageHeading).data('transparent') === true) {
		PageHeaderTrans = true;
	}
	if (PageHeaderTrans === true) {
		pageheaderH = $('#header').data('header-max-height') + 15;
	} else {
		pageheaderH = $('#header').data('header-max-height') - $('#header').data('header-height') + 15;
	}
	pageheaderP = parseInt($(pageHeading).css('padding-top'));
	$(pageHeading).css({'padding-top':pageheaderP+pageheaderH,'margin-top':-pageheaderH});
}

$( document ).ready(function() {
	initHeading();
});

$(window).on('statechangecomplete', function() {
	initHeading();
});


var lastPositionH = -1;

function parallaxHeader(){
	if (lastPositionH == $(document).scrollTop()) {
        scroll(parallaxHeader);
        return false;
    } else {
		lastPositionH = $(document).scrollTop();
		if (touchDevice === false && css3 === true ) {
			var scrollTop = $(document).scrollTop();
			var headerPHeight= $('.to-page-heading').outerHeight(true);
			if (scrollTop < $('header').height() + headerPHeight) {
				var headerPosition = Math.round(scrollTop*0.4);
				var headerOpacity = 1-(scrollTop/headerPHeight);
				$('.to-page-heading.paratrue .to-header-image').css(pre+'transform', 'translate3d(0px, '+headerPosition+'px, 0px)');
				$('.to-page-heading.paratrue .section-container').css(pre+'transform', 'translate3d(0px, '+headerPosition*1.1+'px, 0px)').css('opacity', headerOpacity);
			} 
		}
	}
    scroll(parallaxHeader);
}

if (touchDevice === false) {
	parallaxHeader();
}

/*************************************************************
Portfolio sidebar
*************************************************************/

var lastPositionS = -1,
	psideBar = '.portfolio-sidebar',
	pcontent = 'article.type-portfolio .col-8',
	headerH = $('#header').data('header-height'),
	psideBarOff,
	pcontentH,
	adminBarH,
	sideBarH,
	sideBarMH,
	sideBarL,
	sideBarW;

if ($('body').data('menu') == 'left-nav') {
	headerH = 0;
}

$(document).ready(function() {
	if ($('#wpadminbar').length) {
		adminBarH = parseInt($('html').css('top'));
	} else {
		adminBarH = 0;
	}
});

function sideBarSet(){
	if ($(psideBar).length) {
		psideBarOff = $(pcontent).offset().top - headerH - 30;
		sideBarL = $(pcontent).outerWidth(true);
		sideBarW = $('article.type-portfolio').outerWidth(true) - sideBarL;
		sideBarH = $(psideBar).height();
		sideBarMH = $(pcontent).height() + psideBarOff;
		pcontentH = $(pcontent).height();
	}
}

function sideBarFixed(){
	sideBarSet();
	if (sideBarH >= pcontentH && $(window).width() > 1000) {
		$(psideBar).css({'position':'relative','margin': 0, 'right': 'auto', 'bottom':'auto'});
	} else if (lastPositionS == $(document).scrollTop()) {
        scroll(sideBarFixed);
        return false;
    } else {
		lastPositionS = $(document).scrollTop();
		sideBarCalc();
	}
    scroll(sideBarFixed);
}

function sideBarCalc(){
	if (touchDevice === false && css3 === true && $(window).width() > 1000) {
		var scrollTop = $(document).scrollTop();
		$(psideBar).css('width', sideBarW);
		if (scrollTop+adminBarH > psideBarOff && scrollTop+sideBarH+adminBarH <= sideBarMH) {
			$(psideBar).css({'position':'absolute','margin-top': $(document).scrollTop()-psideBarOff+adminBarH, 'margin-left': sideBarL, 'right': 'auto', 'bottom':'auto'});
		} else if (scrollTop < psideBarOff || sideBarH >= pcontentH) {
			$(psideBar).css({'position':'relative','margin': 0, 'right': 'auto', 'bottom':'auto'});
		} else if (scrollTop+sideBarH+headerH > sideBarMH) {
			$(psideBar).css({'position':'absolute','margin': 0, 'right': 0, 'bottom': 0});
		}
	} else {
		$(psideBar).removeAttr('style');
	}
}

$(document).ready(function() {
	if ($(psideBar).data('sidebar-follow') === true) {
		sideBarFixed(); 
	}
});

$(window).on('statechangecomplete', function() {
	if ($(psideBar).data('sidebar-follow') === true) {
		sideBarFixed();
	}
});

$(window).on('resize', function() {
	if ($(psideBar).data('sidebar-follow') === true) {
		if ($('#wpadminbar').length) {
			adminBarH = parseInt($('html').css('top'));
		} else {
			adminBarH = 0;
		}
		sideBarSet();
		sideBarCalc();
		headerImageSizes();
	}
});


function headerImageSizes() {
	if (ie < 9 && $('#header-image').length) {
		var $sImg = $('#header-image');
		var imgSRC = $sImg.css('background-image').replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
		var eImg = new Image();
		eImg.onload = function() {
			$sImg.css('filter', 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="'+imgSRC+'", sizingMethod="scale"))');
			$sImg.css('-ms-filter', '"progid:DXImageTransform.Microsoft.AlphaImageLoader(src="'+imgSRC+'", sizingMethod="scale")"');
			var iW = this.width;
			var iH = this.height;
			var pW = $sImg.parent().width();
			var pH = $sImg.parent().outerHeight(true);
			var wR = iW/pW;
			var hR = iH/pH;
			var scale = Math.min(wR,hR);
			var rW = (iW/scale)/pW*100;
			var rH = (iH/scale)/pH*100;
			var leftI = -(rW-100)/2;
			var topI = -(rH-100)/2;
			$sImg.width(rW+'%').height(rH+'%').css({'position': 'absolute','left':leftI+'%', 'top': topI+'%'});
		};
		eImg.src = imgSRC;
	}
}
headerImageSizes();

if (ie < 9 && $('#footer-inner-top .marg').length) {
	$('#footer-inner-top .marg').last().css('margin-right',0);
}

/*************************************************************
THEMEONE PARALLAX SLIDER
*************************************************************/
		
var toSliDef = {
		slider       : '#to-slider',
		sliderHolder : '#to-slider-holder',
		sliderParaDiv: '#to-slider-parallax',
		sliderNext   : '#to-slider-next',
		sliderPrev   : '#to-slider-prev',
		sliderNb     : '.to-slider-slidenb',
		sliderNextNb : '.to-slider-nextnb',
		sliderPrevNb : '.to-slider-prevnb',
		sliderPage   : '#to-slider-pages',
		sliderPages  : '#to-slider-pages li',
		sliderTimeW  : '#to-slider-timer',
		slide        : '.to-slide',
		slideImage   : '.to-slide-image',
		slideContent : '.to-slide-content',
		slideVideo   : '.to-slide-video',
		slideSRC     : '.to-slide-video video',
		slideYT      : '.to-slide iframe',
		sliderTimer  : false,
		sliderBar    : false,
		sliderTime   : 15000,
		timerStep    : 30,
		sliderPara   : false,
		fullHeight   : false
	};

var sliderTimerWidth;
var sliderPlayers = [];

function ToTouchSlider(element) {
	
	var self = this,		
		swipeSlider = false,
		toTrans,
		fullHeight,
		toTimeBar,
		toTimer,
		toTime,
		sliderTimerStep,
		step,
		slide_height,
		toMinHeight,
		toSlideNb,
		slide_count = $(toSliDef.slide).length,
		slide_width = 0,
		current_slide = 0,
		headerH = 0,
		sliderPlayers = [];
	
	fullHeight  = $(toSliDef.slider).attr('data-full-height') ? $(toSliDef.slider).data('full-height') : toSliDef.fullHeight;
	toTimer     = $(toSliDef.slider).attr('data-timer') ? $(toSliDef.slider).data('timer') : toSliDef.sliderTimer;
	toTimeBar   = $(toSliDef.slider).attr('data-time-bar') ? $(toSliDef.slider).data('time-bar') : toSliDef.sliderBar;
	toTime      = $(toSliDef.slider).attr('data-time') ? $(toSliDef.slider).data('time') : toSliDef.sliderTime;	
	toMinHeight = $(toSliDef.slider).attr('data-min-height') ? $(toSliDef.slider).data('min-height') : 300;
	toTrans     = $('#to-slider').data('transparent');
	sliderTimerStep = (100/(toTime*0.001))*toSliDef.timerStep*0.001;
	step = sliderTimerStep;
	
	if ($('#header-overlay').css('opacity') != 1) {
		toTrans = true;
	}
	
	if (toTrans === true) {
		headerH = $('#header').data('header-max-height') + 15;
	} else {
		headerH = $('#header').data('header-max-height') - $('#header').data('header-height') + 15;
	}
	
	if (touchDevice === true) {
		headerH = $('#header').data('header-height') + 15;
	}
	
	if ($('body').data('menu') == 'left-nav') {
		headerH = 15;
	}
	
	if ($(toSliDef.slider).next('section').children('.to-separator-top').length) {
		$(toSliDef.sliderPage).addClass('paddecor');
	}

	this.init = function() {
		$(toSliDef.slider).hide();
		sliderSizing();
		videoInit();
		videoVimeoSizes();
		sliderInitPages();
		$(toSliDef.sliderHolder).addClass('animate');
		if (toTimer === true) {
			sliderTimeBar();
		}
		$(window).on('resize', function() {
			$(toSliDef.sliderHolder).removeClass('animate');
			sliderSizing();
			videoSizes();
			videoYTSizes();
			videoVimeoSizes();
			$(toSliDef.sliderHolder).addClass('animate');
		});
		$(toSliDef.slider).show();
	};

	function sliderSizing() {
		slide_width = $(element).width();
		$(toSliDef.slide).each(function() {
			$(this).width(slide_width);
		});
		$(toSliDef.slider).add($(toSliDef.slide)).add($(toSliDef.slideContent)).height('auto');
		$(toSliDef.sliderHolder).width(slide_width*slide_count);
		if (fullHeight === true) {
			if (toTrans === true) {
				slide_height = $(window).height() + 15 - adminBarH;
			} else {
				slide_height = $(window).height() - $('header').height() - adminBarH;
			}
		} else {
			slide_height = Math.max.apply(null, $(toSliDef.slide).map(function () {
				if (toMinHeight < $(this).innerHeight()+headerH) {
					return $(this).innerHeight()+headerH;
				} else {
					return toMinHeight+headerH;
				}
			}).get());
		}
		if (!$('.to-page-heading ').length) {
			$(toSliDef.slider).css('margin-top',-headerH);
		}
		$(toSliDef.slide).add($(toSliDef.slideContent)).height(slide_height);
		$(toSliDef.slideContent).height(slide_height-headerH).css('margin-top', headerH);
		$(toSliDef.sliderPrev).add($(toSliDef.sliderNext)).css('top', slide_height/2+headerH/2);
		
		
		$(toSliDef.sliderHolder).height(slide_height);
	}

	this.showPane = function(index, animate) {
		sliderTimeReset();
		if (swipeSlider === true) {
			index = Math.max(0, Math.min(index, slide_count-1));
		} else {
			if (index > toSlideNb-1) {
				index = 0;
			}
			if (index < 0) {
				index = toSlideNb-1;
			}
		}
		current_slide = index;
		var offset = -((100/slide_count)*current_slide);
		swipeSlider = false;
		setContainerOffset(offset, animate);
	};

	function setContainerOffset(percent, animate) {
		$(toSliDef.sliderHolder).removeClass('animate');
		if(animate) {
			$(toSliDef.sliderHolder).addClass('animate');
		}
		if (Modernizr.csstransforms3d) {
			$(toSliDef.sliderHolder).css(pre+'transform', 'translate3d('+ percent +'%,0,0)');
		} else {
			var px = ((slide_width*slide_count) / 100) * percent;
			if (swipeSlider === true) {
				$(toSliDef.sliderHolder).css("left", px+"px");
			} else {
				$(toSliDef.sliderHolder).animate({left:px+'px'}, 700);
			}
		}
	}

	this.next = function() { 
		this.showPane(current_slide+1, true); 
		sliderUpdatePages();
	};
	this.prev = function() { 
		this.showPane(current_slide-1, true); 
		sliderUpdatePages();
	};
	
	function handleHammer(ev) {
		swipeSlider = true;
		switch(ev.type) {
			case 'dragright':
			case 'dragleft':
				ev.gesture.preventDefault();
				var pane_offset = -(100/slide_count)*current_slide;
				var drag_offset = ((100/slide_width)*ev.gesture.deltaX) / slide_count;
				if((current_slide === 0 && ev.gesture.direction == 'right') ||
					(current_slide == slide_count-1 && ev.gesture.direction == 'left')) {
					drag_offset *= 0.4;
				}
				setContainerOffset(drag_offset + pane_offset);
				break;
			case 'swipeleft':
				self.next();
				ev.gesture.stopDetect();
				break;
			case 'swiperight':
				self.prev();
				ev.gesture.stopDetect();
				break;
			case 'release':
				if(Math.abs(ev.gesture.deltaX) > slide_width/2) {
					if(ev.gesture.direction == 'right') {
						self.prev();
					} else {
						self.next();
					}
				} else {
					self.showPane(current_slide, true);
				}
				break;
		}
	}
	if ($('.to-slide').length > 1) {
		Hammer.defaults.stop_browser_behavior.touchAction = 'pan-y';
		var hammerSlider = new Hammer($(element)[0], { 
			drag_lock_to_axis: true,
			drag_lock_min_distance: 20,
			//swipe: false,
			hold: false,
			release: true,
			tap: false,
			touch: true
			
		}).on('release dragleft dragright swipeleft swiperight', handleHammer);
	}
	
	/*** SLIDER INIT AND UPDATE PAGES ON CLICK/TOUCH/DRAG ***/

	function sliderInitPages() {
		var i;
		toSlideNb = $(toSliDef.slide).length;
		if (toSlideNb > 1) {
			for (i=0; i<toSlideNb; i++){
				$(toSliDef.sliderPage).append('<li></li>');			
			}
			$(toSliDef.sliderNext).add($(toSliDef.sliderPrev)).show().find(toSliDef.sliderNb).html(toSlideNb);
			$(toSliDef.sliderPrevNb).html(toSlideNb);
			$(toSliDef.sliderNextNb).html(2);
			$(toSliDef.sliderPages).first().addClass('active');
		} else {
			toTimer   = false;
			toTimeBar = false;
		}
		$(toSliDef.slide).first().addClass('current-slide');
		sliderColor();
	}
	
	function sliderUpdatePages() {
		var prevNb = current_slide;
		var nextNb = current_slide+2;
		if (prevNb < 1) {
			prevNb = toSlideNb;
		}
		if (nextNb > toSlideNb) {
			nextNb = 1;
		}
		$(toSliDef.sliderPrevNb).html(prevNb);
		$(toSliDef.sliderNextNb).html(nextNb);
		$(toSliDef.sliderPages).removeClass('active').eq(current_slide).addClass('active');
		$(toSliDef.slide).removeClass('current-slide').eq(current_slide).addClass('current-slide');
		sliderUpdateVideo();
		sliderColor();
	}
	
	function sliderUpdateVideo() {
		var i;
		for(i=0; i<$(toSliDef.slideVideo).length; i++){
			sliderPlayers[i].pause();
		}
		if ($(toSliDef.slide).eq(current_slide).find(toSliDef.slideVideo).length) {
			$(toSliDef.slide).eq(current_slide).find(toSliDef.slideSRC)[0].play();
		}
		autoPlayPause();
	}
	
	function autoPlayPause() {
		$(toSliDef.slide).find('iframe.vimeo-player').each(function() {
			var sound = 0;
			var $f = $(this),
			url = 'http:'+$f.attr('src').split('?')[0];
			var data = { method: 'pause' };
			if ($(this).parent().hasClass('current-slide')) {
				var data = { method: 'play' };
			}
			$f[0].contentWindow.postMessage(JSON.stringify(data), url);
		});
		$(toSliDef.slide).find('iframe.to-slide-youtube').each(function() {
			var id = $(this).attr('id').replace('player','');
			if ($(this).parent().hasClass('current-slide')) {
				playYT(id);
			} else {
				pauseYT(id);
			}
		});
	}
	
	function sliderColor() {
		var SlideColor = $(toSliDef.slide).eq(current_slide).data('slide-color');
		$(toSliDef.slider).removeClass('dark light').addClass(SlideColor);
		if (toTrans === true) {
			$('#header').add($('#header-container')).removeClass('dark light').addClass(SlideColor);
		}
	}
	
	function videoInit() {	
		if (touchDevice === true || ie < 9 || !$(toSliDef.slideSRC).length) {
			$(toSliDef.slideVideo).remove();
		} else if ($(toSliDef.slideSRC).length) {
			mediaelementSlider();
		}
	}
	
	function mediaelementSlider() {	
		var succesVideo = 0;
		$(toSliDef.slideSRC).mediaelementplayer({
			pauseOtherPlayers: false,
			loop: true,
			success: function(mediaElement, domObject) {
				var volume = parseFloat($(mediaElement).closest('.to-slide').data('volume'));
				sliderPlayers.push(mediaElement);
				mediaElement.setMuted(0);
				mediaElement.setVolume(volume);
				mediaElement.addEventListener('playing', function(e) {
					var cursvid = e.target;
					if (!$(cursvid).hasClass('init')) {
						if (sliderPlayers[0].src != cursvid.src && !$(toSliDef.slide).eq(0).find(toSliDef.slideVideo).length) {
							cursvid.pause();
						}
					}
					videoSizes();
					$(cursvid).closest(toSliDef.slide).find('.loading-text').remove();
					$(cursvid).closest(toSliDef.slide).find('.to-slide-image').remove();
					$(cursvid).closest(toSliDef.slideVideo).css('opacity',1);
					$(cursvid).addClass('init');
					succesVideo++;
				}, false);
			},
			error:  function(domObject) {
				$(domObject).closest(toSliDef.slide).find('.loading-text').remove();
				$(domObject).closest(toSliDef.slideVideo).remove();
				succesVideo++;
			}
		});
	}
	
	function videoSizes() {
		$(toSliDef.slideSRC).each(function() {
			var $this = $(this);
			$this.attr('style','');			
			var videoW = $this.width(),
				videoH = $this.height(),
				sliderW = $(window).width(),
				sliderH = slide_height,
				videoR = videoW/videoH,
				testH = sliderW/videoR,
				topI,
				leftI;
			if (testH >= sliderH) {
				topI = Math.abs((testH-sliderH)/2)*-1;
				leftI = 0;
				sliderW = sliderW+'px';
				sliderH = 'auto';
			} else if(testH < sliderH) {
				topI = 0;
				leftI = Math.abs(((sliderH*videoR-sliderW))/2)*-1;
				sliderW = 'auto';
				sliderH = slide_height+'px';
			}
			$this.attr('style', 'height: '+sliderH+' !important; width: '+sliderW+' !important; margin-left: '+leftI+'px !important; margin-top: '+topI+'px !important;');
		});
	}
	
	function videoYTSizes() {
		$(toSliDef.slideYT).each(function() {
			var $el = $(this);
			var pYTW = $el.parent().width();
			var pYTH = $el.parent().height();
			var ratio;
			if (!$el.data('youtube-ratio')) {
				ratio = this.height / this.width;
				$el.attr('data-youtube-ratio', ratio);
			} else {
				ratio = $el.attr('data-youtube-ratio');
			}
			$el.removeAttr('height width');
			if (pYTW*ratio >= pYTH) {
				$el.height(pYTW*ratio).width('100%').css('margin-top', -(pYTW*ratio-pYTH)/2).css('margin-left', 0);
			} else {
				var left = -(pYTH/ratio-pYTW)/2;
				$el.height(pYTH).width(pYTH/ratio).css('margin-left', left).css('margin-top', 0);
			}
		});
	}
	
	function videoVimeoSizes() {
		$('.to-slide iframe.vimeo-player').each(function() {
			var $el = $(this);
			var pYTW = $el.parent().width();
			var pYTH = $el.parent().height();
			var ratio;
			if (!$el.data('vimeo-ratio')) {
				ratio = $el.data('height') / $el.data('width');
				$el.attr('data-vimeo-ratio', ratio);
			} else {
				ratio = $el.attr('data-vimeo-ratio');
			}
			$el.removeAttr('height width');
			if (pYTW*ratio >= pYTH) {
				$el.height(pYTW*ratio).width('100%').css('margin-top', -(pYTW*ratio-pYTH)/2).css('margin-left', 0);
			} else {
				var left = -(pYTH/ratio-pYTW)/2;
				$el.height(pYTH).width(pYTH/ratio).css('margin-left', left).css('margin-top', 0);
			}
		});
	}
	
	
	
	/*** SLIDER TIMER ***/
	
	function sliderTime() {	
		self.next();
		sliderTimerStep = 0;
	}
	
	function sliderTimeBar() {
		if (toTimeBar === true) {
			$(toSliDef.sliderTimeW).css('width', sliderTimerStep+'%');
		}
		sliderTimerStep = sliderTimerStep + step ;
		if (sliderTimerStep >= 100) {
			sliderTime();
		}
		sliderTimerWidth = setTimeout(sliderTimeBar, toSliDef.timerStep);
		window.sliderTimerWidth = sliderTimerWidth;
	}
	
	function sliderTimeReset() {
		$(toSliDef.sliderTimeW).css('width', 0);
		sliderTimerStep = 0;
	}
	
	$(toSliDef.slider).mouseenter( function() {
		if (toTimer === true) {
			clearTimeout(sliderTimerWidth);
		}
	}).mouseleave( function(){ 
		if (toTimer === true) {
			sliderTimerWidth = setTimeout(sliderTimeBar, toSliDef.timerStep);
		}
	});
	
	/*** SLIDER BUTTON/PAGE BULLETS CONTROLS ***/
	
	$(document).on('click touchend', toSliDef.sliderNext, function(e) {
		e.preventDefault();
		self.next();
	});
	$(document).on('click touchend', toSliDef.sliderPrev, function(e) {
		e.preventDefault();
		self.prev();
	});
	$(document).on('click touchend', toSliDef.sliderPages, function(e) {
		e.preventDefault();
		self.showPane($(this).index(), true); 
		sliderUpdatePages();
	});
	
}

var lastPosition = -1;
var sliderTop;
var toSliderPara;

$(document).ready(function(e) {
	initParaSlider();
});

function initParaSlider(){
	if ($("#to-slider").length) {
		toSliderPara = $(toSliDef.slider).attr('data-parallax') ? $(toSliDef.slider).data('parallax') : toSliDef.sliderPara;
		if ($('.to-page-heading ').length) {
			sliderTop = $(toSliDef.slider).position().top - $('#header').data('header-height');
			if ($('#header-overlay-slider').css('opacity') != 1) {
				sliderTop = $(toSliDef.slider).position().top + $('#header').data('header-max-height') - $('#header').data('header-height');
			}
		} else {
			sliderTop = 0;
		}
	}  	
}

function parallaxSlider(){
	if (lastPosition == $(document).scrollTop()) {
        scroll(parallaxSlider);
        return false;
    } else {
		lastPosition = $(document).scrollTop();
		if (touchDevice === false && css3 === true && toSliderPara === true) {
			var scrollTop = $(document).scrollTop() - sliderTop;
			var slideHeight= $(toSliDef.sliderHolder).height() + sliderTop;
			if (scrollTop + sliderTop >= sliderTop && scrollTop + sliderTop <= slideHeight) {
				var contentPosition = Math.round(scrollTop*0.4);
				var marginPages = Math.round(scrollTop*0.1+5);		
				var contentOpacity = 1-(scrollTop/slideHeight);
				var pagesOpacity = 1-(scrollTop/slideHeight)*1.5;
				$(toSliDef.sliderParaDiv).css(pre+'transform', 'translate3d(0px, '+contentPosition+'px, 0px)');
				$(toSliDef.slideContent).css('opacity', contentOpacity).css(pre+'transform', 'translate3d(0px, '+contentPosition*-0.25+'px, 0px)');
			} else if (scrollTop + sliderTop < sliderTop || scrollTop === 0 ) {
				$(toSliDef.sliderParaDiv).css(pre+'transform', 'translate3d(0,0,0)');
				$(toSliDef.slideContent).css('opacity', 1).css(pre+'transform', 'translate3d(0,0,0)');
			}
		}
	}
    scroll(parallaxSlider);
}
parallaxSlider();


$.fn.toSlider = function(options) {
	options = $.extend(toSliDef, options);
	var totouchslider = new ToTouchSlider(toSliDef.slider);
	totouchslider.init();
};

$(document).ready(function(e) {
	if ($("#to-slider").length) {
		$("#to-slider").toSlider();
	}    
});


$(window).on('statechangecomplete', function() {
	if(sliderTimerWidth !== "undefined"){
		clearTimeout(sliderTimerWidth);
	}
	if ($("#to-slider").length) {
		$("#to-slider").toSlider();
		lastPosition = -1;
		initParaSlider();
	}
});

$(document).on('mousemove', '.to-slide', function(e) {
	var factor = 2;
	var $target = $(this).find('.to-slide-content-move');
	if ($target.length) {
		var cx = Math.ceil($target.width()/2+$target.offset().left);
		var cy = Math.ceil($target.height()/2+$target.offset().top);
		var dx = e.pageX - cx ;
		var dy = e.pageY - cy ;
		var tiltx = -(dy / cy);
		var tilty =  (dx / cx);
		var radius = Math.sqrt(Math.pow(tiltx,2) + Math.pow(tilty,2));
		var degree = (radius * 8);//20
		if ($target.offset().left>0 && degree<90 && $('#to-slider-holder').hasClass('animate')) {
			$target.css(pre+'transform','rotate3d('+tiltx +','+tilty +',0,'+degree+'deg)');
		}
	}
});

$(document).on('click', '#to-slider-scrollto i', function(e) {
	$('html, body').animate({ scrollTop: $(this).closest('#to-slider').height() }, 800);
	
});

/*************************************************************
SLIDING MENUS PANEL
*************************************************************/

var $menuOpen = $('.sliding-menu-open'),
	$sidebarOpen = $('.sliding-sidebar-open'),
	$movingDiv = $('#body-overlay, #inner-container, footer, #scrollToTop, #push-anim-overlay'),
	$overDiv = $('html, body'),
	$menu = $('#sliding-menu'),
	$sidebar = $('#sliding-sidebar'),
	slideLeft,
	slideRight;

$sidebarOpen.on('click touchend', function(e) {
	e.stopPropagation();
	e.preventDefault();
	$('body').toggleClass('sidebar-anim');
});

$menuOpen.on('click touchend', function(e) {
	e.stopPropagation();
	e.preventDefault();
	$('body').toggleClass('menu-anim');
});

$movingDiv.on('click touchend', function(e) {
	if ($('body').is('.sidebar-anim, .menu-anim, .left-menu-anim')) {
		e.preventDefault();
		$('body').removeClass('sidebar-anim menu-anim left-menu-anim');
	}
});

$('#left-menu-button').on('click touchstart', function(e) {
	e.preventDefault();
	$('body').toggleClass('left-menu-anim');
});

$(window).on('resize', function() {
	$('body').removeClass('sidebar-anim menu-anim left-menu-anim');
});

$(window).on('statechange', function() {
	$('body').removeClass('sidebar-anim menu-anim left-menu-anim');
});





/*************************************************************
CUSTOM RESPONSIVE LIGHT-BOX IMAGE/VIDEO
*************************************************************/

var ToLbSource = '.to-item',
	ToLbLink = '.to-item-lightbox-link',
	ToLbHolder = '.to-lb-holder',
	ToLbOverlay = '.to-lb-overlay',
	ToLbInner = '.to-lb-inner',
	ToLbFigure = '.to-lb-inner figure',
	ToLbImage = '.to-lb-holder img',
	ToLbButtons = '.prev-lb-img, .next-lb-img',
	ToLbVideo = '.to-lb-video',
	ToLbAnim = 'to-lb-anim',
	ToLbAnim2 = 'to-lb-anim2',
	ToLbPlayer = false,
	ToLbVideoStructure,
	videoPoster,
	videoM4V,
	videoOGV,
	videoPlayer,
	videoEmbed,
	ToLbImg,
	ToLbTitle,
	ToLbLength,
	ToLbCurrent,
	ToLbindex,
	ToLbRatio,
	ToLbimgArr = [];
	

function mediaelementBox() {		
	videoPlayer = new MediaElementPlayer('.to-lb-holder video', {
		features: ['fullscreen','playpause', 'current', 'progress', 'duration', 'volume'],
		videoVolume: 'vertical',
		enableAutosize: false,
		pauseOtherPlayers: false,
		//pluginPath: './',
		//flashName: 'flashmediaelement.swf',
		success: function (mediaElement) { 
			ToLbPlayer = true;
			mediaElement.play();
			mediaElement.addEventListener('loadedmetadata', function() {
				toLbVideoCenter();
			});
			mediaElement.addEventListener("ended", function(){ 
				$('.to-lb-holder .mejs-poster').show();
			});
		}
	});
}
	
$(document).on('click', ToLbLink, function(e) {
	e.preventDefault();
	var ToLb = $('<div class="to-lb-holder dark">'+
					'<div class="to-lb-overlay"></div>'+
					'<div class="to-lb-inner">'+
					'<div class="to-lb-video"></div>'+
					'</div>'+
					'</div>');
	if ($(this).parent().parent().parent().hasClass('video')) {	
		videoPoster = $(this).closest(ToLbSource).find('.video-link').attr('data-video-poster');
		videoM4V = $(this).closest(ToLbSource).find('.video-link').attr('data-video-m4v');	
		videoOGV = $(this).closest(ToLbSource).find('.video-link').attr('data-video-ogv');
		videoEmbed = $(this).closest(ToLbSource).find('.video-link').attr('data-video-embed');
		if (videoEmbed === '') {
			if (videoM4V !== '') {
				videoM4V = '<source type="video/mp4" src='+videoM4V+' />';
			}
			if (videoOGV !== '') {
				videoOGV = '<source type="video/ogg" src='+videoOGV+' />';
			}
			ToLbVideoStructure = $('<video controls id="videoPlayer" poster="'+videoPoster+'" width="640" height="360" style="width: 100%; height: 100%;">'+
									videoM4V+
									videoOGV+
									'</video>');
		} else {
			ToLbVideoStructure = $('<div class="video-embed">'+videoEmbed+'</div>');
		}	
		$('body').append(ToLb);		
		$(ToLbVideo).append(ToLbVideoStructure);
		if (videoEmbed === '') {
			mediaelementBox();
		}
		$(ToLbHolder).show();
		$(ToLbOverlay).addClass(ToLbAnim);
		setTimeout(function() {	
			toLbVideoCenter();
			$(ToLbInner).addClass(ToLbAnim2);
		}, 450);		
	} else {		
		ToLbImg = $(this).data('img-src').split(';')[0];
		ToLbTitle = String($(this).data('img-title')).split(';')[0];
		toLbImgArray();
		$.map( ToLbimgArr, function( a, index ) {
			if(a.src == ToLbImg) {
				ToLbindex = index;
			}
		});
		ToLbCurrent = ToLbindex + 1;
		if (ToLbimgArr.length) {
			ToLb = $('<div class="to-lb-holder dark">'+
					'<div class="to-lb-overlay"></div>'+				
					'<div class="to-lb-inner">'+				
					'<figure>'+
					'<i class="icon-to-x accentColorHover"></i>'+
					'<img src="'+ToLbImg+'" />'+
					'<figcaption>'+ ToLbTitle +'<div class="to-lb-counter">'+ ToLbCurrent +'/'+ ToLbLength +'</div></figcaption>'+
					'</figure>'+
					'</div>'+
					'<div class="prev-lb-img accentColorHover"><i class="icon-to-left-arrow-thin"></i></div>'+
					'<div class="next-lb-img accentColorHover"><i class="icon-to-right-arrow-thin"></i></div>'+
					'</div>');
		} else {
			ToLb = $('<div class="to-lb-holder">'+
					'<div class="to-lb-overlay"></div>'+
					'<div class="to-lb-inner">'+
					'<figure>'+
					'<i class="icon-to-x accentColorHover"></i>'+
					'<img src="'+ToLbImg+'" />'+
					'<figcaption><div class="to-lb-counter">1/1</div></figcaption>'+
					'</figure>'+
					'</div>'+
					'</div>');
		}
		$('body').append(ToLb);
		$(ToLbHolder).show();
		$(ToLbOverlay).addClass(ToLbAnim);
		setTimeout(function() {
			$('.loading-container').addClass('ajax-load');
			$('<img src="'+ToLbImg+'">').load(function() {
				toLbImgCenter();
				$('.loading-container').removeClass('ajax-load');
				$(ToLbInner).add($(ToLbButtons)).addClass(ToLbAnim2);
			});
		}, 300);
	}
	$(ToLbHolder).bind('mousewheel touchmove', function() {
        return false;
	});
});

$(document).on('click touchend', function(e) {
	var $this = e.target;
	if ( $this.className == 'to-lb-inner to-lb-anim2' || $this.className == 'to-lb-overlay to-lb-anim' || $this.className == 'icon-to-x accentColorHover') {
		$('.loading-container').removeClass('ajax-load');
		$(ToLbInner).add($(ToLbButtons)).removeClass(ToLbAnim2).attr('style','');
		setTimeout(function() {
			$(ToLbOverlay).removeClass(ToLbAnim);
		}, 300);
		setTimeout(function() {
			if (ToLbPlayer === true) {
				videoPlayer.setSrc('');
				ToLbPlayer = false;
			}
			$(ToLbHolder).remove();
		}, 700);
	}
});

$(document).on('click touchend', '.prev-lb-img, .next-lb-img', function(e) {
	e.preventDefault();
	if ($(this).hasClass('prev-lb-img')) {
		if (ToLbindex-1 < 0) {
			ToLbindex = ToLbimgArr.length-1;
		} else {
			ToLbindex = ToLbindex - 1;
		}
	} else {
		if (ToLbindex+1 > ToLbimgArr.length-1) {
			ToLbindex = 0;
		} else {
			ToLbindex = ToLbindex + 1;
		}
	}
	$(ToLbInner).css('opacity',0);	
	setTimeout(function() {
		ToLbCurrent = ToLbindex+1;
		ToLbTitle = ToLbimgArr[ToLbindex].title;
		$('.to-lb-inner figcaption').html(ToLbTitle+'<div class="to-lb-counter">'+ ToLbCurrent +'/'+ ToLbLength +'</div></figcaption>');
		$('.loading-container').addClass('ajax-load');
		$('<img src="'+ToLbimgArr[ToLbindex].src+'">').load(function() {
			$('.loading-container').removeClass('ajax-load');
			$(ToLbImage).attr('src', ToLbimgArr[ToLbindex].src);
			toLbImgCenter();
			$(ToLbInner).css('opacity',1);
		});
	}, 500);
});


function toLbImgArray() {
	ToLbimgArr = [];
	$(ToLbSource).each(function() {
		var $imgItem = $(this).find('.to-item-lightbox-link');
		if ($(this).find('.to-img-gallery').length && $(this).find('.to-item-lightbox-link').length) {
			var imgArray = [];
			var imgsrc = $imgItem.data('img-src').split(';');
			var imgTitle = $imgItem.data('img-title').split(';');
			for (var i = 0; i < imgsrc.length; i++){
				imgArray.push({"src":[imgsrc[i]],"title":imgTitle[i]});
			}
			$.merge(ToLbimgArr,imgArray);
		} else if ($imgItem.data('img-src')) {
			ToLbimgArr.push({"src":$imgItem.data('img-src'),"title":$imgItem.data('img-title')});
		}
    });
	if ($('.inner-product-image .to-item-lightbox-link').length) {
		ToLbimgArr.push({"src":$('.to-item-lightbox-link').attr('data-img-src'),"title":$('.to-item-lightbox-link').attr('data-img-title')});
		$('.product-gallery').each(function(i) {
			if (i!==0) {
				ToLbimgArr.push({"src":$(this).attr('data-gallery-full'),"title":$(this).attr('data-img-title')});
			}
		});
	}
	ToLbLength = ToLbimgArr.length;
}

function toLbImgCenter() {
	if ($(ToLbHolder).find('img').length) {
		var imgSRC = $(ToLbHolder).find('img').attr('src');
		var eImg = new Image();
		eImg.onload = function() {
			var iW = this.width;
			var iH = this.height;
			var wW = $(window).width();
			var wH = $(window).height();
			if (wW > 480) {
				ToLbRatio = 0.8;
			} else {
				ToLbRatio = 0.7;
			}
			if (iW > wW*ToLbRatio || iH > wH*ToLbRatio) {
				var widthFact = wW*ToLbRatio / iW;
				var heightFact = wH*ToLbRatio / iH;
				var chooseFact = (widthFact > heightFact) ? heightFact : widthFact;
				iW = iW * chooseFact;
				iH = iH * chooseFact;
			}
			$(ToLbFigure).width(iW).height(iH).css({top: (wH-iH)*0.5+'px', left: (wW-iW)*0.5+'px'});
		};
		eImg.src = imgSRC;
	}
}

function toLbVideoCenter() {
	if ($(ToLbVideo).length) {
		$(ToLbVideo).css('margin-top',($(window).height()-$(ToLbHolder).find('video, .video-embed').outerHeight())/2);
	}
}

$(window).on('resize', function() {
	toLbImgCenter();
	toLbVideoCenter();
});

/*************************************************************
SCROLL TO TOP BUTTON
*************************************************************/

$(document).on('click', '#scrollToTop', function() {
	var time = parseInt(($(document).scrollTop()/$(window).height())*400);
	$('html, body').animate({ scrollTop: 0 }, time);
	return false;
});

var lastPositionST = 0;
var gridHome = $('.grid-home-page').length;

function scrollToTop(){
	var curscroll = $(document).scrollTop();
	if (gridHome && touchDevice === false) {
		$('#scrollToTop-inner').css('opacity', 0);
		scroll(scrollToTop);
		return false;
	}
	if (lastPositionST == curscroll) {
        scroll(scrollToTop);
        return false;
    } else if (touchDevice === false) {
		var scrollTop = curscroll;
		var scrollHeight= ($(document).height()-$(window).height());
		var scrollTopOpacity = (scrollTop/scrollHeight);
		$('#scrollToTop-inner').css('opacity', scrollTopOpacity);
	}
    scroll(scrollToTop);
}
scrollToTop();

$(window).on('statechangecomplete', function() {
	gridHome = $('.grid-home-page').length;
});

/*************************************************************
VIDEO PLAYER
*************************************************************/

var toArvideo = '.to-article-video-wrapper video';

function to_video() {	
	$(toArvideo).mediaelementplayer({
		features: ['fullscreen','playpause', 'current', 'progress', 'duration', 'volume'],
		videoVolume: 'vertical',
		pauseOtherPlayers: false,
		startVolume: 0.8,
		success: function(mediaElement, domObject) {	
			mediaElement.addEventListener("ended", function(e){ 
				$(e.target).closest('.to-article-video-wrapper').find(' .mejs-poster').show();
			});
		},
		error:  function(domObject) {
			$(domObject).closest('.mejs-container').remove();
		}
	});
}

$(document).ready(function() {
	to_video();
});

$(window).on('statechangecomplete', function() {
	to_video();
});

$(window).bind('statechange',function(){
	$('.mejs-container.mejs-video video').each(function() {
		$(this).closest('.mejs-container.mejs-video').hide();
		if (typeof ie === 'undefined') {
			$(this)[0].remove();
		}
	});
});


/*************************************************************
POST GALLERY SLIDER
*************************************************************/

function postGallerySlider() {
	$('.post-gallery-slider').owlCarousel({
		theme: '',
		singleItem: true,
		autoHeight: true,
		stopOnHover: true,
		navigation: true,
		navigationText: ['<div class="to-sc-button-over"></div><i class="icon-to-left-arrow-thin"></i>','<div class="to-sc-button-over"></div><i class="icon-to-right-arrow-thin"></i>']
	});
}

$(document).ready(function() {
	postGallerySlider();
});

$(window).on('statechangecomplete', function() {
	postGallerySlider();
});


/*************************************************************
AUDIO PLAYER
*************************************************************/

var $menuPlayer = $('#current-player audio'),
	$currentPlayer = $('#current-player'),
	$currentTitle = $('#current-title'),
	$currentArtiste = $('#current-artist'),
	$currentCover = $('#current-cover'),
	toItemWrapper = '.to-item-wrapper',
	toAudioPlayer = '.to-audio-player',
	currentLink = '.to-item-audio-link',
	currentTimeBar = '.to-item-time',
	iconPlay = '.li_sound, .fa-play',
	iconPause = '.fa-pause',
	volUp = '.to-audio-player .fa-volume-up',
	volOff = '.to-audio-player .fa-volume-off',
	audioCurtTime = '.to-item-currenttime',
	timeFloat = '.time-float',
	timeFloatCorn = '.time-float-corner',
	audioStyle,
	$currentSong,
	$prevSong,
	type,
	songMP3,
	songOGG,
	songACC,
	sources,
	dlSong,
	cover,
	title,
	artist,
	audioTimer,
	curT,
	widthT,
	setPlayerTime,
	totalSong = 1,
	upTime = 1,
	updateTimerAudio = false,
	sidePlayer = false,
	playerClick = false;

$(document).ready(function() {
	if (!touchDevice) {
		$('#overflow-player').remove();
		$currentPlayer.insertAfter($('#outer-container')).addClass('desktop');	
	}
	$('#current-player audio').mediaelementplayer({
		pauseOtherPlayers: false,
		features: ['fullscreen','playpause', 'current', 'progress', 'duration', 'volume'],
		audioVolume: 'vertical',
		startVolume: 0.8,
		//pluginPath: './',
		//flashName: 'flashmediaelement.swf',	
		success: function (mediaElement) {
				if (ie <= 9) {
					$currentPlayer.find('source').eq(1).remove().eq(2).remove();
				} else {
					$currentPlayer.find('audio').html('');
				}
				$currentPlayer.hide();
				mediaElement.addEventListener('loadedmetadata', function() {
					totalSong = mediaElement.duration;
					if (totalSong == 'Infinity') {
						totalSong = 1;
					}
				});
				mediaElement.addEventListener('ended', function(){ 
					$currentSong.find(iconPlay).show();
					$currentSong.find(iconPause).hide();
					$currentSong.parent().find(audioCurtTime).width('0');
					$currentSong.closest(toItemWrapper).removeClass('play');
					clearTimeout(audioTimer);
					if ($currentSong.closest(toAudioPlayer).length) {
						$currentSong.closest(toAudioPlayer).find('.to-audio-player-curtime').html('00:00');
					}
				});
				mediaElement.addEventListener('play', function() {
					$(toItemWrapper).not($currentSong.closest(toItemWrapper)).removeClass('play');
					$currentSong.closest(toItemWrapper).addClass('play');
					$(currentLink).find(iconPlay).show();
					$(currentLink).find(iconPause).hide();
					$currentSong.find(iconPlay).hide();
					$currentSong.find(iconPause).show();
					audioTime();
					
				});
				mediaElement.addEventListener('playing', function() {
					if ($currentSong.closest(toAudioPlayer).length && $currentSong.closest(toAudioPlayer).find('.to-audio-player-duration').html() == '00:00') {
						$currentSong.closest(toAudioPlayer).find('.to-audio-player-duration').html($('#current-player .mejs-duration').html());
					}
				});
				mediaElement.addEventListener('pause', function() {
					$currentSong.closest(toItemWrapper).removeClass('play');
					$(currentLink).find(iconPlay).show();
					$(currentLink).find(iconPause).hide();
					clearTimeout(audioTimer);
				});
				mediaElement.addEventListener('volumechange', function() {
					if (!mediaElement.muted) {
						$(volUp).show();
						$(volOff).hide();
					} else {
						$(volUp).hide();
						$(volOff).show();
					}
				});
		}
	});
});

$(document).on('click touchend', '.to-item-audio-link', function(e) {
	e.preventDefault();
	$currentSong = $(this);
	songMP3 = $currentSong.attr('data-mp3');
	songOGG = $currentSong.attr('data-ogg');
	songACC = $currentSong.attr('data-acc');
	if (ie <= 9) {
		type = 'mp3';
	} else {
		type = $currentPlayer.find('audio').attr('src').split('.').pop();
	}
	if (type == 'mp3' && songMP3 !== '') {
		sources = songMP3;
	} else  if (type == 'mp3' && songMP3 === '') {
		cantPlay();
		return false;
	}
	if (type == 'ogg' && songOGG !== '') {
		sources = songOGG;
	} else if (type == 'ogg' && songOGG === '') {
		cantPlay();
		return false;
	}
	if (type == 'acc' && songACC !== '') {
		sources = songACC;
	} else if (type == 'acc' && songACC === '') {
		cantPlay();
		return false;
	}
	if ($currentSong != $prevSong) {
		$('#cantPlay').slideUp(100);
	}
	$currentPlayer.show();
	cover = $currentSong.attr('data-cover'); 
	title = $currentSong.attr('data-song-name');
	if ($currentSong.attr('data-artist') != '') {
		artist = 'by '+$currentSong.attr('data-artist');
	}
	if ($currentSong.find(iconPlay).is(':visible')) {
		if (updateTimerAudio === true) {
			clearTimeout(audioTimer);
		}
		$currentTitle.html(title);
		$currentArtiste.html(artist);
		if (cover !== '') {
			$currentCover.css('background-image', 'url("'+cover+'")');
		}
		$menuPlayer[0].player.setSrc('');
		$menuPlayer[0].player.pause();
		$menuPlayer[0].player.setSrc(sources);
		$menuPlayer[0].player.load();
		setTimeout(function(){
			$currentPlayer.addClass('animplayer');
			trueTime();
			audioTime();
		}, 300);
	} else {
		$menuPlayer[0].player.pause();
	}
	sidePlayer = true;
	$prevSong = $currentSong;
	return false;
});

$(document).on('click mousemove', '#current-player .mejs-time-rail', function() {
	updateTime();
});

$(document).on('click',volUp, function() {
	$menuPlayer[0].player.setMuted(1);
	$(volUp).show();
	$(volOff).hide();
});

$(document).on('click',volOff, function() {
	$menuPlayer[0].player.setMuted(0);
	$(volUp).hide();
	$(volOff).show();
});

function cantPlay() {
	$currentSong = $prevSong;
	$('#current-player audio')[0].player.pause();
	clearTimeout(audioTimer);
	if (songMP3 !== '') {
		dlSong = songMP3;
	} else if (songOGG !== '') {
		dlSong = songOGG;
	} else if (songACC !== '') {
		dlSong = songACC;
	}
	$('.dlSong').attr('href', dlSong);
	$('#cantPlay').slideDown(100);
}

$(document).on('click', '#cantPlay .fa-times', function() {
	$('#cantPlay').slideUp(100);
});

function audioTime() {
	updateTime();
    audioTimer = setTimeout(audioTime, 500);
}

function updateTime() {
	if (!$currentSong.parent().find(iconPlay).is(':visible')) {
		updateTimerAudio = true;
		var totalTime = $('#current-player .mejs-time-total').width();
		var currentTime = $('#current-player .mejs-time-current').width();
		var percentTime = currentTime/totalTime*100;
		$currentSong.parent().find(audioCurtTime).css('width', percentTime+'%');
		$currentSong.closest(toAudioPlayer).find('.to-audio-player-curtime').html($('#current-player .mejs-currenttime').html());
	}
}

function trueTime() {
	var tTime = $currentSong.parent().find('.to-item-time').width();
	var cTime = $currentSong.parent().find(audioCurtTime).width();
	var pTime = cTime/tTime;
	if (cTime != '0') {
		upTime =  parseInt(Math.round(totalSong*pTime));
		if (totalSong > 1) {
			$menuPlayer[0].player.setCurrentTime(upTime);
			$menuPlayer[0].player.setCurrentRail();
			$menuPlayer[0].player.pause();
		}
	}
	$menuPlayer[0].player.play();
}

$(document).on('mousemove', currentTimeBar, function(e) {
	var $this = $(this);
	var posX = $this.offset().left;
	curT = e.pageX - posX;
	widthT = $this.width();
	setPlayerTime = curT/widthT;
	if (typeof $currentSong !== 'undefined') {
		if (!$this.parent().find(iconPlay).is(':visible')) {
			$this.parent().find(timeFloat).show();
			upTime = parseInt(Math.round(totalSong*setPlayerTime));
			var mins = Math.floor(upTime/60);
			var secs = pad2(Math.round((upTime/60-mins)*60));
			$this.parent().find('.time-float-current').html(mins+':'+secs);
			if (curT < 10 && !$currentSong.closest(toAudioPlayer).length) {
				$this.parent().find(timeFloat).css('left', 10+'px');
				$this.parent().find(timeFloatCorn).css('left', curT-5+'px');
			} else if (curT > widthT-26 && !$currentSong.closest(toAudioPlayer).length) {
				$this.parent().find(timeFloat).css('left', widthT-26+'px');
				$this.parent().find(timeFloatCorn).css('left', curT-widthT+31+'px');
			} else if (curT >= 10 && curT <= widthT-26 || $currentSong.closest(toAudioPlayer).length){
				$this.parent().find(timeFloat).css('left', curT+'px');
				$this.parent().find(timeFloatCorn).css('left', 5+'px');
			}
			if (playerClick === true) {
				$menuPlayer[0].player.setCurrentTime(upTime);
				$this.parent().find(audioCurtTime).css('width', curT+'px');
			}
		}
	}	
});

$(document).on('click', currentTimeBar, function() {
	if (typeof $currentSong !== 'undefined') {
		if (!$(this).parent().find(iconPlay).is(':visible')) {
			$menuPlayer[0].player.setCurrentTime(upTime);
		}
	}
	$(this).find(audioCurtTime).css('width', curT+'px');
});

$(document).on('mouseleave', currentTimeBar, function() {
	playerClick = false;
	$(timeFloat).hide();
});
$(document).on('mousedown', currentTimeBar, function() {
	playerClick = true;
});
$(document).on('mouseup', currentTimeBar, function() {
	playerClick = false;
});
function pad2(number) {  
     return (number < 10 ? '0' : '') + number;
}

var posX=0, 
	posY=0,
	lastPosX=0, 
	lastPosY=0,
	transform;
	
$(document).ready(function() {
	var dragPlayer = $('#current-player');
	if (dragPlayer.hasClass('desktop')) {
		var hammertime = new Hammer(dragPlayer, {
			transform_always_block: true,
			drag_block_horizontal: true,
			drag_block_vertical: true,
			drag_min_distance: 0
		});

		hammertime.on('touch drag dragend', function(ev) {
			if (!dragPlayer.hasClass('close')) {
				$currentPlayer.addClass('notransition');
				switch(ev.type) {
					case 'drag':
						posX = ev.gesture.deltaX + lastPosX;
						posY = ev.gesture.deltaY + lastPosY;
						break;
					case 'dragend':
						lastPosX = posX;
						lastPosY = posY;
						break;
				}
				$('#current-player').css(pre+'transform', 'translate3d('+posX+'px,'+posY+'px, 0)');
			}
		});
	}
});

$(document).on('click', '.current-player-close', function() {
	$currentPlayer.removeClass('animplayer notransition').css(pre+'transform', 'translate3d(-250px,0,0)');
	posX=0;
	posY=0;
	lastPosX=0; 
	lastPosY=0;
	setTimeout(function() {	
		$currentPlayer.find('.mejs-playpause-button').addClass('notransition');
		$currentPlayer.addClass('close');
		$currentPlayer.css(pre+'transform', 'translate3d(-215px,0,0)');
		setTimeout(function() {	
			$currentPlayer.find('.mejs-playpause-button').removeClass('notransition');
		}, 50);
	}, 400);
});

$(document).on('click', '.current-player-open', function() {
	$currentPlayer.css(pre+'transform', 'translate3d(-250px,0,0)');
	setTimeout(function() {	
		$currentPlayer.removeClass('close');
		$currentPlayer.css(pre+'transform', 'translate3d(0,0,0)');
	}, 400);
});

/*************************************************************
HEADER SEARCH FORM ANIMATION
*************************************************************/

var $header       = $('#header'),
	$search       = $('.search-button'),
	$searchClose  = $('#search-inner #searchform .fa-times'),
	$searchDiv    = $('#search-container'),
	$searchOver   = $('#search-overlay'),
	inputTxt      = $('#s:input').val();


$('form').submit(function(e) {
	if ((ie > 9 || !ie) && $(this).find('.ajaxify-search').length) {
		e.preventDefault();
		var sval = $(this).find('.ajaxify-search').val();
		var root = $(this).attr('action');
		$('.search_results_ajax').attr('href', root+'/?s='+sval);
		$('#search_results_click')[0].click();
	}
});

function toggleSearch() {
	if (!$('.search-anim').length) {
		openSearch();
		return false;
	} else {
		closeSearch();
		return false;
	}
	
}

function openSearch() {
	$searchDiv.bind('mousewheel', function() {
        return false;
	});
	$('body').bind('mousedown.prev DOMMouseScroll.prev mousewheel.prev', function(e, d){  
		e.preventDefault();
	});
	$('body').removeClass('sidebar-anim menu-anim');
	$('#search-msg, #search-inner .search-results').html('');
	$searchDiv.find('input').val('');
	var $searchSly = $('#search-container');
	$searchSly.sly('reload');
	$header.addClass('search-anim');
	$searchDiv.show();
	setTimeout(function() {	
		$searchDiv.addClass('search-anim');
		$('#search-inner input').focus();
	}, 50);
}

function closeSearch() {
	$('body').unbind('mousedown.prev DOMMouseScroll.prev mousewheel.prev');
	$('.loading-container').removeClass('ajax-load');
	$header.removeClass('search-anim');
	$searchDiv.removeClass('search-anim');
	setTimeout(function() {	
		$searchDiv.hide();	
	}, 500);
}

$search.add($searchOver).add($searchClose).on('click', function(e) {
	e.preventDefault();
	toggleSearch();
});

$(window).bind('statechange',function(){
	if ($searchDiv.is(':visible')) {
		closeSearch();
	}
});

/**********************************************************************************
HEADER TOP NAV MENU SUBMENU / SMART HEADER SUBMENU WIDTH / HEADER SIZING SCROLLING
**********************************************************************************/

var megamenu = false,
	logoW,
	nextW,
	menuW = 0,
	prevMenuMW = 0,
	submenuW = 190,
	minDist,
	hideMenu,
	menuWidth,
	indexLnav = 0,
	headerMenu = 'header-menu',
	headerMobile = 'header-mobile',
	$headerDiv = $('#header-container'),
	$topNavItem = $('#top-nav > ul > .menu-item-has-children:not(".megamenu")');

$('.widget.widget_nav_menu li.menu-item-has-children').each(function(index, element) {
    $(this).children('a').attr('href','');
});
$('.left-menu').find('.menu-item-has-children').each(function() {
	$(this).children('a').first().attr('href','');   
});

if ($header.length) {	
	if (!$(header).data('menu-link')) {
		$('.top-menu').find('.menu-item-has-children').each(function() {
			$(this).children('a').first().attr('href','');   
		});
	}
}

$('.widget.widget_nav_menu li.menu-item-has-children > a').on('click', function(e){
	e.preventDefault();
	if (!$(this).parent().hasClass('open')) {
		$(this).parent().addClass('open').find('ul').first().slideDown(300);
		return false;
	}
	if ($(this).parent().hasClass('open')) {
		$(this).parent().removeClass('open').find('ul').first().slideUp(300);
		return false;
	}
});

$('#top-nav > ul > li').on('mouseenter mouseleave', function(e){
	$(this).children('a').toggleClass('hover');
});

function megamenuPosition() {
	$('#top-nav .megamenu > .sub-menu').each(function() {
		if ($(this).position().left > 0) {
			$(this).css({'left':-$(this).position().left, 'width':$('#top-nav').width()});
		}
	});
}

megamenuPosition();
$(window).on('resize', function() {
	megamenuPosition();
});

$('#left-nav li:not(".menu-item-language") .sub-menu').each(function() {
	var top = -parseInt($(this).offset().top)+$('#left-nav').offset().top+30;
	$(this).attr('style','top:'+top+'px !important');   
})

$('#left-nav ul li a.menu-link-parent').each(function() {
	$(this).removeAttr('href');
})
var left_menuH = $('#left-nav').height();
$('#left-nav').css({'height':left_menuH,'min-height':left_menuH});

$('#left-nav ul > li.back-sub-menu').on('click', function(e) {
	indexLnav = $(this).data('depth');
	var $this = $(this).closest('.sub-menu');
	var el    = $this.closest('.menu-item-has-children').closest('ul').height();
	$this.removeClass('sub-menu-show');
	animLeftMenu(el);
});
$('#left-nav ul li a.menu-link-parent').on('click', function(e) {
	indexLnav = $(this).data('depth');
	var $this = $(this).parent().find('ul').first();
	var el    = $this.height();
	$this.addClass('sub-menu-show');
	animLeftMenu(el);
});

function animLeftMenu(el) {
	$('#left-nav').height(el);
	if (!$('html').is('.csstransitions')) {
		$('.left-menu').animate({left:-indexLnav*100+'%'}, 500);
	} else {
		$('.left-menu').css(pre+'transform', 'translate3d('+-indexLnav*100+'%,0,0)');
	}
}

switchMenu();
$(window).resize(function(){
	switchMenu();
});

$topNavItem.on('mouseover',function() { 
	var $this     = $(this),
		submenuNb = $this.find('.sub-menu').length,
		itemOff   = $this.offset().left,
		itemPos   = $this.position().left,
		menuSubW  = submenuW * submenuNb,
		menuPos   = itemOff + menuSubW,
		windowW   = $(window).width(),
		sectionW  = $('.section-container'),
		menuMW    = itemPos + $this.width() - menuSubW + (windowW - sectionW.width())/2;
	if (menuPos > $('body').width() && submenuNb > 1) {
		$this.addClass('right');
	} else {
		$this.removeClass('right');
	}
});

function switchMenu() { 
	var ww = $('body').width();
	var headerType = $header.data('header-type');
	if (ww < 1080 && headerType != headerMobile) {
		$header.addClass(headerMobile).removeClass(headerMenu);	
	} else if (ww >= 1080 && headerType == headerMenu) {
		$header.removeClass(headerMobile).addClass(headerMenu);
	}
}

/**********************************************************************************
HEADER FUNCTIONNALITY/COLOR SCHEME
**********************************************************************************/

var $headerContainer = $('#header-container'),
	headerResize     = $('#header').data('header-rezise'),
	headerMinHeight  = $('#header').data('header-height'),
	headerMaxHeight  = $('#header').data('header-max-height'),
	lastPositionM    = -1,
	headerTop        = false,
	headerMid        = false,
	headerBot        = false,
	headerTrans,
	minHeaderTrans,
	headerColor;

function checkHeaderColor() {
	if ($('.to-page-heading').length && $('.to-page-heading').data('transparent') === true) {
		headerTrans = true;	
		minHeaderTrans = $('.to-page-heading').outerHeight();
		headerColor = $('.to-page-heading').data('header-color');
		$('#header').add($('#header-container')).removeClass('dark light').addClass(headerColor);
	} else if ($('#to-slider').length && $('#to-slider').data('transparent') === true && !$('.to-page-heading').length) {
		headerTrans = true;	
		if ($('#to-slider').data('full-height') === true) {
			minHeaderTrans = $(window).height();
		} else {
			minHeaderTrans = $('#to-slider').height();
		}
	} else {
		headerTrans = false;	
		$('#header').add($('#header-container')).removeClass('dark light trans');
	}
}

function sizeMenu(){	
	var scrollTop = $(document).scrollTop();
	if (lastPositionM == $(document).scrollTop()) {
		scroll(sizeMenu);
        return false;
    } else {
		if (headerTrans !== true) {
			if (scrollTop < 10) {
				$headerContainer.attr('style', 'height:'+headerMaxHeight+'px');
				headerTop = headerMid = headerBot = false;
			} else if (scrollTop >= 10) {
				$headerContainer.attr('style', 'height:'+headerMinHeight+'px');
				headerTop = headerMid = headerBot = false;
			}
		} else {
			if (scrollTop < 10 && headerTop === false) {
				$headerDiv.add($header).addClass('trans');
				smartHeader(headerMaxHeight,0,true,false,false);
			} else if (scrollTop >= 10 && scrollTop < minHeaderTrans && headerMid === false) {
				$headerDiv.add($header).addClass('trans');
				smartHeader(headerMinHeight,'-100%',false,true,false);
			} else if (scrollTop >= minHeaderTrans && headerBot === false) {
				$headerDiv.add($header).removeClass('trans');
				smartHeader(headerMinHeight,0,false,false,true);
			}
		}
	}
	scroll(sizeMenu);
}

function smartHeader(a,b,c,d,e) {
	if ($headerContainer.height() != a) {
	$headerContainer.attr('style', 'height:'+a+'px');
	}
	if (!ie) {
		$header.css(pre+'transform', 'translate3d(0,'+b+',0)');
	}
	headerTop = c;
	headerMid = d;
	headerBot = e;
}

$(document).ready(function(e) {
	//$('iframe').contents().find('#inner-container').css('opacity','0');
	checkHeaderColor();
	if (touchDevice === false) {
		sizeMenu();
	}
});

$('#vc_inline-frame-wrapper iframe').css('top',headerMaxHeight);
$('#vc_inline-frame').load(function(){ 
	$(this).find('#inner-container').css('top',headerMaxHeight);
	$(this).css('top',headerMaxHeight);
});


$(window).on('resize', function() {
	checkHeaderColor();
});

$(window).on('statechangecomplete', function() {
	headerTop = false;
	headerMid = false;
	headerBot = false;
	checkHeaderColor();
});

/**********************************************************************************
GOOGLE MAP
**********************************************************************************/

var googleMap = '#google-map',
	animationDelay = 0,
	bounceTimer,
	centerlat,
	centerlng,
	markerImg,
	zoomLevel,
	enableZoom,
	enableAnimation,
	enableAnimationHover,
	mapDraggable,
	mapType,
	map,
	infowindow,
	marker,
	lngs,
	lats,
	infos,
	markers,
	mapColorScheme,
	styles,
	satellite,
	accentcolor = $('.accentColorHover').css('color'),
	$flatObj = [],
	$darkColorObj = [];

function initGooggleVar () {
	mapType = $(googleMap).data('map-type');
	mapColorScheme = $(googleMap).data('map-color');
	mapDraggable = $(googleMap).data('map-draggable');
	centerlat = parseFloat($(googleMap).data('center-lat'));
	centerlng = parseFloat($(googleMap).data('center-lng'));
	markerImg = $(googleMap).data('marker');
	zoomLevel = parseFloat($(googleMap).data('zoom-level'));
	enableZoom = $(googleMap).data('enable-zoom');
	enableAnimation = $(googleMap).data('enable-animation');
	enableAnimationHover = $(googleMap).data('enable-animation-hover');

	if (isNaN(zoomLevel)) { 
		zoomLevel = 12;
	}
	if (isNaN(centerlat)) {
		centerlat = 51.47;
	}
	if (isNaN(centerlng)) { 
		centerlng = -0.268199;
	}
}

global.initGooggleMap = function () {
	markerImg = $(googleMap).attr('data-markers').split(';');	
	lngs = $(googleMap).attr('data-lngs').split(';');
	lats = $(googleMap).attr('data-lats').split(';');
	infos = $(googleMap).attr('data-infos').split(';');
	infowindow = new google.maps.InfoWindow();
	mapcolor(mapColorScheme);
	var latLng = new google.maps.LatLng(lats[0],lngs[0]);
	var styledMap = new google.maps.StyledMapType(styles,{name: "Styled Map"});
	var mapOptions = {
			zoom: zoomLevel,
			mapTypeControlOptions: {
				mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
			},
			scrollwheel: false,
			panControl: false,
			draggable: mapDraggable,
			zoomControl: enableZoom,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.LARGE,
				position: google.maps.ControlPosition.LEFT_CENTER
			},
			mapTypeControl: false,
			scaleControl: false,
			streetViewControl: false
		};

	map = new google.maps.Map(document.getElementById('google-map'), mapOptions);
	if (mapType == 'ROADMAP') {
		map.mapTypes.set('map_style', styledMap);
		map.setMapTypeId('map_style');
	} else {
		map.setMapTypeId(google.maps.MapTypeId[mapType]);
	}
	addmarker(latLng);
};

function addmarker(latilongi) {
	markers = [];
	var bounds = new google.maps.LatLngBounds();
	for (var i = 0; i < lngs.length; i++) {
		if (markerImg[i] == '') {
			marker = new google.maps.Marker({
				position: new google.maps.LatLng(lats[i], lngs[i]),
				draggable: false,
				map: map,
				animation: enableAnimation
			});
		} else {
			marker = new google.maps.Marker({
				position: new google.maps.LatLng(lats[i], lngs[i]),
				draggable: false,
				map: map,
				icon : markerImg[i],
				animation: enableAnimation
			});
		}	
		markers.push(marker);
		bounds.extend(marker.position);
		google.maps.event.addListener(marker, 'click', (function(marker, i) {
			return function() {
				infowindow.setContent('<div class="scrollFix">'+infos[i]+'</div>');
				infowindow.open(map, marker);
			};
		})(marker, i));
		if (enableAnimationHover === 1) {
			google.maps.event.addListener(marker, 'mouseover', function() {
				if (this.getAnimation() === null || typeof this.getAnimation() === 'undefined') {
					clearTimeout(bounceTimer);
					var that = this;
					bounceTimer = setTimeout(function(){
						that.setAnimation(google.maps.Animation.BOUNCE);
					},150);
				}
			});
			google.maps.event.addListener(marker, 'mouseout', function() {
				if (this.getAnimation() !== null) {
					this.setAnimation(null);
				}
				clearTimeout(bounceTimer);
			});
		}
	}
	if (markers.length > 1) {
		map.fitBounds(bounds);
		map.setCenter(bounds.getCenter());
		map.setZoom(zoomLevel);
	} else {
		var pt = new google.maps.LatLng(lats[0], lngs[0]);
		map.setCenter(pt);
	}
	setTimeout(function(){
		for (var i = 0; i < markers.length; i++) {
			markers[i].setAnimation(null);
		}
	},1000);
}

function mapcolor(mapcolor) {
	if(mapColorScheme == 'flat') {
		styles = [{"featureType": "transit","elementType": "geometry","stylers": [{ "visibility": "off" }]},{"elementType": "labels","stylers": [{ "visibility": "off" }]},{"featureType": "administrative","stylers": [{ "visibility": "off" }]}];
	} else if(mapColorScheme == 'dark') {
		styles = [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]}];
	} else if (mapColorScheme == 'grey') {
		styles = [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}];
	} else if (mapColorScheme == 'pale-dawn') {
		styles = [{"featureType":"water","stylers":[{"visibility":"on"},{"color":"#acbcc9"}]},{"featureType":"landscape","stylers":[{"color":"#f2e5d4"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#c5c6c6"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#e4d7c6"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#fbfaf7"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#c5dac6"}]},{"featureType":"administrative","stylers":[{"visibility":"on"},{"lightness":33}]},{"featureType":"road"},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":20}]},{},{"featureType":"road","stylers":[{"lightness":20}]}];
	} else if (mapColorScheme == 'simple') {
		styles = [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-100},{"lightness":20}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-100},{"lightness":40},{"hue":accentcolor}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-10},{"lightness":30}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":-60},{"lightness":10}]},{"featureType":"landscape.natural","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":-60},{"lightness":60}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"},{"saturation":-100},{"lightness":60}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"},{"saturation":-100},{"lightness":60}]}];
	} else if (mapColorScheme == 'monochrome') {
		styles = [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"visibility":"simplified"},{"color":"#fcfcfc"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"visibility":"simplified"},{"color":"#fcfcfc"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"simplified"},{"color":"#dddddd"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"visibility":"simplified"},{"color":"#dddddd"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"visibility":"simplified"},{"color":"#eeeeee"}]},{"featureType":"water","elementType":"geometry","stylers":[{"visibility":"simplified"},{"color":"#dddddd"}]}];
	} else {
		 styles = [];
	}
}

function loadGoogleMap(){
	if ($(googleMap).length) {
		initGooggleVar();
		if (!$('#google-map-script').length) {
			var script  = document.createElement('script');
			script.type = 'text/javascript';
			script.src  = '//maps.google.com/maps/api/js?sensor=false&callback=global.initGooggleMap';
			script.id   = "google-map-script"; 
			document.head.appendChild(script);
		} else {
			global.initGooggleMap();
		}
		
	}
}
loadGoogleMap();

$(window).on('statechangecomplete', function() {
	loadGoogleMap();
});

/**********************************************************************************
CONTACT FORM
**********************************************************************************/

function wpcf7RemoveHover() {
	$.fn.wpcf7NotValidTip = function(message) {
		return this.each(function() {
			var into = $(this);
			into.append('<span class="wpcf7-not-valid-tip">' + message + '</span>');
			$('span.wpcf7-not-valid-tip').mouseover(function() {
				$(this).fadeOut('fast');
			});
			into.find(':input').mouseover(function() {
				into.find('.wpcf7-not-valid-tip').not(':hidden').fadeOut('fast');
			});
			into.find(':input').focus(function() {
				into.find('.wpcf7-not-valid-tip').not(':hidden').fadeOut('fast');
			});
		});
	};
}
wpcf7RemoveHover();

$(window).on('statechangecomplete', function() {
	if ($('.wpcf7').length) {
		var scripts = document.getElementsByTagName("script");
		for(var i = 0; i < scripts.length; i++){
			if (scripts[i].src.match('/contact-form-7/includes/js/scripts')) {
				var scriptLocation = scripts[i].src;
				jQuery.get(scriptLocation, function(data) {
					/*jslint evil: true */ 
					eval(data); 
					$('.wpcf7 .ajax-loader').last().remove();
					wpcf7RemoveHover();
				});
				return false;
			}
		}
	}
});

/**********************************************************************************
WOOCOMMERCE
**********************************************************************************/

var zoom = 2,
	native_width,
	native_widthS,
	native_height;

function productZoom() {
	native_width = 0;
	native_height = 0;
	$(".magnify").mousemove(function(e){
		if(!native_width && !native_height) {
			var image_object = new Image();
			image_object.src = $(".large").css('background-image').replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
			native_width = image_object.width;
			native_height = image_object.height;
			native_widthS = $(".small").width();
		} else if (native_widthS*1.2 <= native_width) {
			var magnify_offset = $(this).offset();
			var mx = e.pageX - magnify_offset.left;
			var my = e.pageY - magnify_offset.top;
			if($(".large").is(":visible")) {
				var rx = Math.round(mx/$(".small").width()*native_width - $(".large").width()/2)*-1;
				var ry = Math.round(my/$(".small").height()*native_height - $(".large").height()/2)*-1;
				var bgp = rx + "px " + ry + "px";
				var px = mx - $(".large").width()/2;
				var py = my - $(".large").height()/2;
				$(".large").css({left: px, top: py, backgroundPosition: bgp});

			}
		}
	});
	$(".magnify").mouseenter(function(e){
		$(".large").stop(true).fadeIn(400);
	});
	$(".magnify").mouseleave(function(e){
		$(".large").stop(true).fadeOut(400);
	});
	$(document).scroll(function(e) {
        $(".large").stop(true).fadeOut(400);
    });
}

if ($(".magnify").length) {
	productZoom();
}

$(document).on('click', '.magnify.inner-product-image', function(e){
	e.preventDefault();
	$(".large").fadeOut(100);
});

var imgGal = '.product-gallery img',
	imgSmall = '.single-product-main-image .small',
	imgLarge = '.single-product-main-image .large',
	imgFull;

$(document).on('click', imgGal, function(e){
	e.preventDefault();
	e.stopPropagation();
	$('.single-product-main-image .thumbnails img').removeClass('active');
	$(this).addClass('active');
	var photo_fullsize =  $(this).parent('.product-gallery').data('gallery-full');
	var photo_smallsize =  $(this).parent('.product-gallery').data('gallery-img');
	if (photo_fullsize != $(imgSmall).attr('src')) {
		$('.woocommerce .images .magnify .loading').fadeIn(100);
		$('<img src="'+ photo_fullsize +'">').load(function() {
			$('.woocommerce .images .magnify .loading').fadeOut(100);
			$(imgSmall).attr('src', photo_smallsize);
			$(imgLarge).attr('style', 'background-image: url('+photo_fullsize+')');
			$('.to-item-lightbox-link').data('img-src',photo_fullsize);
			native_width = 0;
			native_height = 0;
		});
	}
	return false;
});

$(".woocommerce-tabs ul.tabs li a").click(function(e){
	e.preventDefault();
    e.stopPropagation();
	return false;
});

$(document).on( 'change', '.variations select', function(event) {
	if ($(imgSmall).attr('src') != $(imgLarge).attr('src')) {
		for(var key in imgArray) {
			if (imgArray[key][0] == $(imgSmall).attr('src')) {
				if (imgArray[key][1]) {
					imgFull = imgArray[key][1];
				} else {
					imgFull = imgArray[key][0];
				}
			}
		}
		if (imgFull == null) {
			imgFull = $(imgSmall).attr('src');
		}
		$(imgLarge).attr('style', 'background-image: url('+imgFull+')');
		$('.to-item-lightbox-link').data('img-src',imgFull);
		native_width = 0;
		native_height = 0;
	}
});

var imgArray;
function getImgVaration() {
	imgArray = null;
	if ($('.variations_form.cart').length) {
		var variationIMG = $('.variations_form.cart').data('product_variations');
		imgArray = $.map(variationIMG, function (img) {
			return [[ img.image_src, img.image_link ]];
		});
	}
}
getImgVaration();

function toscSlider() {
	$('.single-product-main-image .thumbnails').owlCarousel({
		theme: '',
		autoHeight: true,
		stopOnHover: true,
		items : 4,
		navigation : false,
		pagination : false,
		itemsDesktop : [1199,4],
		itemsDesktopSmall : [980,4],
		itemsTablet: [768,4],
		itemsTabletSmall: false,
		itemsMobile : [479,4]
	});
}

if ($('.single-product-main-image .thumbnails .product-gallery').length > 4) {
	toscSlider();
}

$(document).on('click', '.product-img-wrap .add_to_cart_button', function(){
	var $this = $(this);
	var productAdded = $this.parents('li.product').find('h3').text();
	$('.cart-notification .item-product').html('"'+productAdded+'"');
	$this.parents('li.product').find('.product-img-wrap div.loading').fadeIn(100);
	setTimeout(function(){
		$('#header .cart-counter').animate({top:0}, 400);
		$this.parents('li.product').find('.product-img-wrap div.loading').fadeOut(100);
		$('#header .cart-notification').fadeIn(400);
		to_cart_count();
		setTimeout(function(){
			$('#header .cart-notification').fadeOut(400);
		},2250);
	},1000);
	
});

function to_cart_count() {
	$.ajax({
		type: 'POST',
		url: to_ajaxurl,
		data: {action : 'themeone_woocommerce_cart_counter'},
		success:function(data) {
			$('#sliding-menu .left-cart-number').text(data);
		}
	});
}

$('#header .cart-counter').on('mouseenter', function(){
	$('#header .widget_shopping_cart').stop(true,true).fadeIn(400);
});

$('#header, #header .widget_shopping_cart').on('mouseleave', function(){
	if ($(this).attr('class') != 'widget woocommerce widget_shopping_cart') {
		$('#header .widget_shopping_cart').stop(true,true).fadeOut(400);
	}
});

function showCart() {
	if($('#header .cart-counter .cart-number').text() == 0 ) {
		$('#header .cart-counter').animate({top:'-100%'}, 0);
	} else {
		$('#header .cart-counter').animate({top:0}, 400);
	}
}

function product_per_page() {
	if ($('#slider_per_page').length) {
		var value = $('#woocommerce-sort-by-columns').attr('value');
		var text = $('.itemsorder span').text();
		$('#slider_per_page').slider({
			value: value,
			min: 6,
			max: 60,
			step: 6,
			range: 'min',
			slide: function( event, ui ) {
				$('#woocommerce-sort-by-columns').val(ui.value);
				$('.itemsorder span').html('<strong>'+ ui.value +'</strong> '+ text);
			}
		});
		$('.itemsorder span').html('<strong>'+ value +'</strong> '+ text);
		$('#woocommerce-sort-by-columns').val(value);
	}
}

function productCatSlider() {
	$('.woocommerce ul.products').each(function(index, element) {
		if ($(this).find('.product-category').length) {
			$(this).owlCarousel({
				theme: '',
				items : 4,
				itemsCustom : false,
				itemsDesktop : [1299,3],
				itemsDesktopSmall : [999,2],
				itemsTablet: [689,2],
				itemsTabletSmall: false,
				itemsMobile : [479,1],
				autoHeight: true,
				stopOnHover: true,
				pagination: false,
				navigation: true,
				navigationText: ['<i class="icon-to-left-arrow-thin"></i>','<i class="icon-to-right-arrow-thin"></i>']
			}); 
		}
    });
	$('.related.products ul, .upsells.products ul').each(function(index, element) {
		$(this).owlCarousel({
			theme: '',
			items : 4,
			itemsCustom : false,
			itemsDesktop : [1299,3],
			itemsDesktopSmall : [999,2],
			itemsTablet: [689,1],
			itemsTabletSmall: false,
			itemsMobile : [479,1],
			autoHeight: true,
			stopOnHover: true,
			pagination: true,
			navigation: false,
		}); 
    });
}

$(document).ready(function() {
	$('.single-product-main-image .thumbnails img').first().addClass('active');
	showCart();
	productCatSlider();
	product_per_page();
});

$(window).on('statechangecomplete', function() {
	showCart();
	$('.single-product-main-image .thumbnails img').first().addClass('active');
	productCatSlider();
	product_per_page();
	getImgVaration();
	if ($(".magnify").length) {
		productZoom();
	}
	if ($('.single-product-main-image .thumbnails .product-gallery').length > 4) {
		toscSlider();
	}
});

/*************************************************************
WOOCOMMERCE  WISHLIST
*************************************************************/

function to_wishlist_count() {
	$.ajax({
		type: 'POST',
		url: to_ajaxurl,
		data: {action : 'wishlist_counter'},
		success:function(data) {
			$('.to-wishlist-number').html(data);
			if(parseInt(data) === 0 ) {
				$('.to-wishlist-counter').animate({top:'-100%'}, 0);
			} else {
				$('.to-wishlist-counter').animate({top:0}, 400);
			}
		}
	});
}

$(document).ready(function() {
	to_wishlist_count();
});
	
$(document).on('click', '.product-remove a', function() {
	setTimeout(function() {	
		to_wishlist_count();
	}, 1500);
});

$(document).on('click', '.add_to_wishlist', function(){
	var $this = $(this);
	var productAdded = $this.parents('li.product').find('h3').text();
	if (productAdded == '') {
		productAdded = $('h1').text();
	}
	$('.wishlist-notification .item-product').html('"'+productAdded+'"');
	$this.parents('li.product').find('.product-img-wrap div.loading').fadeIn(100);
	setTimeout(function(){
		$('.to-wishlist-number').html(parseInt($('.to-wishlist-number').html())+1);
		$this.parents('li.product').find('.product-img-wrap div.loading').fadeOut(100);
		$('#header .wishlist-notification').fadeIn(400);
		setTimeout(function(){
			to_wishlist_count();
			$('#header .wishlist-notification').fadeOut(400);
		},2250);
	},500);
});

})(jQuery);

/**********************************************************************************
YOUTUBE VIDEO HOME SLIDER
**********************************************************************************/

(function($) {
	
	var tag = document.createElement('script');
		tag.src = "//www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	var playerYT = {},
		volume = null,
		canPlayHTML5,
		vi;
	
	function getVideoID(el) {
		var videoIframe = el;
		var videoURL = videoIframe.attr('data-youtube-url');
		var reg =  /(\?v=|\&v=|\/\d\/|\/embed\/|\/v\/|\.be\/)([a-zA-Z0-9\-\_]+)/;
		var id = videoURL.match(reg)[2];
		el.attr('id','player'+vi);
		el.attr('data-volume',el.closest('.to-slide').data('volume'));
		return (id);
	}
	
	var v = document.createElement('video');
	if (v.canPlayType ) { 
		canPlayHTML5 = 1;
	} else {
		canPlayHTML5 = 0;
	}
		
	window.onYouTubeIframeAPIReady = function() {
		vi = 1;
		$('.to-slide-youtube, .to-para-youtube').each(function(event) {
			var $thisYT = $(this);
			var videoID = getVideoID($thisYT);
			var ID = $(this).attr('id');
			playerYT[vi] = new YT.Player('player'+vi, {
				videoId: videoID,
				playerVars: {
					autoplay: 1, 
					modestbranding: 1, 
					controls: 0, 
					showinfo: 0,
					loop: 1,
					rel: 0, 
					enablejsapi: 1, 
					version: 3, 
					origin: '*', 
					allowfullscreen: true, 
					wmode: 'transparent', 
					iv_load_policy: 3,
					html5: canPlayHTML5
				},
				events: {
					'onReady': onPlayerReady(ID),
					'onStateChange': onPlayerStateChange
				}
			});
			vi++;
		});
	};
	
	if (window.YT) {
		onYouTubePlayerAPIReady();
	}
	
	function onPlayerReady(ID) {
		return function (event) {
			youtubeSizes();
			youtubeSliderSizes();
			volume = parseFloat($('#'+ID).data('volume'))*100;
			event.target.setVolume(volume);
			var $parent = $(event.target.getIframe().parentNode);
			if ($parent.hasClass('current-slide') || !$parent.hasClass('to-slide')) {
				event.target.playVideo();
			} else {
				event.target.pauseVideo();
			}
		}
	}
	
	function onPlayerStateChange(event) {		
		var state = event.target.getPlayerState();
		if (state === 0) {
			event.target.playVideo();
		}
	}
	
	$(window).on('statechangecomplete', function() {
		if (window.YT) {
			onYouTubeIframeAPIReady();
		}
	});
	
	$(window).bind('statechange',function(){
		$('iframe').each(function() {
			$(this).remove();
		});
	});
	
	window.pauseYT = function(id) {
		playerYT[id].pauseVideo();
	}
	
	window.playYT = function(id) {
		playerYT[id].playVideo();
	}
	
	function youtubeSizes() {
		var $YTVideos = $('.parallax-container-inner iframe.to-para-youtube');
		$YTVideos.each(function() {
			var $el = $(this);
			var pYTW = $el.parent().width();
			var pYTH = $el.parent().height();
			var ratio;
			if (!$el.data('youtube-ratio')) {
				ratio = this.height / this.width;
				$el.attr('data-youtube-ratio', ratio);
			} else {
				ratio = $el.attr('data-youtube-ratio');
			}
			$el.removeAttr('height width');
			if (pYTW*ratio >= pYTH) {
				$el.height(pYTW*ratio).width('100%').css('margin-top', -(pYTW*ratio-pYTH)/2).css('margin-left', 0);
			} else {
				var left = -(pYTH/ratio-pYTW)/2;
				$el.height(pYTH).width(pYTH/ratio).css('margin-left', left).css('margin-top', 0);
			}
		});
	}
	
	function youtubeSliderSizes() {
		$('.to-slide-youtube').each(function() {
			var $el = $(this);
			var pYTW = $el.parent().width();
			var pYTH = $el.parent().height();
			var ratio;
			if (!$el.data('youtube-ratio')) {
				ratio = this.height / this.width;
				$el.attr('data-youtube-ratio', ratio);
			} else {
				ratio = $el.attr('data-youtube-ratio');
			}
			$el.removeAttr('height width');
			if (pYTW*ratio >= pYTH) {
				$el.height(pYTW*ratio).width('100%').css('margin-top', -(pYTW*ratio-pYTH)/2).css('margin-left', 0);
			} else {
				var left = -(pYTH/ratio-pYTW)/2;
				$el.height(pYTH).width(pYTH/ratio).css('margin-left', left).css('margin-top', 0);
			}
		});
	}
		
	$(window).on('resize', function() {
		youtubeSizes();
	});

})(jQuery, window);


/**********************************************************************************
VIMEO VIDEO HOME SLIDER
**********************************************************************************/

(function($) {

	if (window.addEventListener) {
		window.addEventListener('message', onMessageReceived, false);
	} else {
		window.attachEvent('onmessage', onMessageReceived, false);
	}
	
	function onMessageReceived(e) {
		var data = JSON.parse(e.data);
		switch (data.event) {
			case 'onReady': case 'ready':
				$('iframe.vimeo-player').each(function() {
					var volume = parseFloat($(this).closest('.to-slide').data('volume')),
						$f = $(this),
						url = 'http:'+$f.attr('src').split('?')[0];
					if (volume == '') {
						volume = 0;
					}
					var data = { method: 'setVolume', value: volume };
					$f[0].contentWindow.postMessage(JSON.stringify(data), url);
					if ($(this).parent('.to-slide.current-slide').length) {
						var data = { method: 'play' };
						$f[0].contentWindow.postMessage(JSON.stringify(data), url);
					} else {
						var data = { method: 'pause' };
						$f[0].contentWindow.postMessage(JSON.stringify(data), url);
					}
					
                });
				break;
		}
	}
	
})(jQuery, window);

/**********************************************************************************
PARTICULES CANVAS PARALLAX
**********************************************************************************/

(function($) {
  
  "use strict";
  
  var pluginName = 'particleground';

  function Plugin(element, options) {
    var el = element;
    var $el = $(element);
    var canvasSupport = !!document.createElement('canvas').getContext;
    var canvas;
	var $canvas;
	var pointerX;
	var pointerY;
    var ctx;
    var particles = [];
    var raf;
    var mouseX = 0;
    var mouseY = 0;
    var winW;
    var winH;
    var desktop = !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i);
    var orientationSupport = !!window.DeviceOrientationEvent;
    var tiltX = 0;
    var tiltY = 0;
    var paused = false;

    options = $.extend({}, $.fn[pluginName].defaults, options);

    /**
     * Init
     */
    function init() {
      if (!canvasSupport) { return; }

      //Create canvas
      $canvas = $('<canvas class="pg-canvas"></canvas>');
      $el.prepend($canvas);
      canvas = $canvas[0];
      ctx = canvas.getContext('2d');
      styleCanvas();

      // Create particles
      var numParticles = Math.round((canvas.width * canvas.height) / options.density);
      for (var i = 0; i < numParticles; i++) {
        var p = new Particle();
        p.setStackPos(i);
        particles.push(p);
      }

      $(window).on('resize', function() {
        resizeHandler();
      });

      $(document).on('mousemove','.to-page-heading', function(e) {
        mouseX = e.pageX;
        mouseY = e.pageY;
      });

      if (orientationSupport && !desktop) {
        window.addEventListener('deviceorientation', function () {
          // Contrain tilt range to [-30,30]
          tiltY = Math.min(Math.max(-event.beta, -30), 30);
          tiltX = Math.min(Math.max(-event.gamma, -30), 30);
        }, true);
      }

      draw();
      hook('onInit');
    }

    /**
     * Style the canvas
     */
    function styleCanvas() {
      canvas.width = $el.width();
      canvas.height = $el.height();
      ctx.fillStyle = options.dotColor;
      ctx.strokeStyle = options.lineColor;
      ctx.lineWidth = options.lineWidth;
    }

    /**
     * Draw particles 
     */
    function draw() {
      if (!canvasSupport) { return; }

      winW = $(window).width();
      winH = $(window).height();

      // Wipe canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update particle positions
      for (var i = 0; i < particles.length; i++) {
        particles[i].updatePosition();
      }
      // Draw particles
      for (i = 0; i < particles.length; i++) {
        particles[i].draw();
      }

      // Call this function next time screen is redrawn
      if (!paused) {
        raf = requestAnimationFrame(draw);
      }
    }

    /**
     * Add/remove particles.
     */
    function resizeHandler() {
      // Resize the canvas
      styleCanvas();

      // Remove particles that are outside the canvas
      for (var i = particles.length - 1; i >= 0; i--) {
        if (particles[i].position.x > $el.width() || particles[i].position.y > $el.height()) {
          particles.splice(i, 1);
        }
      }

      // Adjust partivcle density
      var numParticles = Math.round((canvas.width * canvas.height) / options.density);
      if (numParticles > particles.length) {
        while (numParticles > particles.length) {
          var p = new Particle();
          particles.push(p);
        }
      } else if (numParticles < particles.length) {
		particles.splice(numParticles);
      }

      // Re-index particles
      for (i = particles.length - 1; i >= 0; i--) {
        particles[i].setStackPos(i);
      }
    }

    /**
     * Pause particle system 
     */
    function pause() {
      paused = true;
    }

    /**
     * Start particle system 
     */
    function start() {
      paused = false;
      draw();
    }

    /**
     * Particle 
     */
    function Particle() {
      this.active = true;
      this.layer = Math.ceil(Math.random() * 3);
      this.parallaxOffsetX = 0;
      this.parallaxOffsetY = 0;
      // Initial particle position
      this.position = {
        x: Math.ceil(Math.random() * canvas.width),
        y: Math.ceil(Math.random() * canvas.height)
      };
      // Random particle speed, within min and max values
      this.speed = {};
      switch (options.directionX) {
        case 'left':
          this.speed.x = +(-options.maxSpeedX + (Math.random() * options.maxSpeedX) - options.minSpeedX).toFixed(2);
          break;
        case 'right':
          this.speed.x = +((Math.random() * options.maxSpeedX) + options.minSpeedX).toFixed(2);
          break;
        default:
          this.speed.x = +((-options.maxSpeedX / 2) + (Math.random() * options.maxSpeedX)).toFixed(2);
          this.speed.x += this.speed.x > 0 ? options.minSpeedX : -options.minSpeedX;
          break;
      }
      switch (options.directionY) {
        case 'up':
          this.speed.y = +(-options.maxSpeedY + (Math.random() * options.maxSpeedY) - options.minSpeedY).toFixed(2);
          break;
        case 'down':
          this.speed.y = +((Math.random() * options.maxSpeedY) + options.minSpeedY).toFixed(2);
          break;
        default:
          this.speed.y = +((-options.maxSpeedY / 2) + (Math.random() * options.maxSpeedY)).toFixed(2);
          this.speed.x += this.speed.y > 0 ? options.minSpeedY : -options.minSpeedY;
          break;
      }
    } 

    /**
     * Draw particle 
     */
    Particle.prototype.draw = function() {
      // Draw circle
      ctx.beginPath();
      ctx.arc(this.position.x + this.parallaxOffsetX, this.position.y + this.parallaxOffsetY, options.particleRadius / 2, 0, Math.PI * 2, true); 
      ctx.closePath();
      ctx.fill();

      // Draw lines
      ctx.beginPath();
      // Iterate over all particles which are higher in the stack than this one
      for (var i = particles.length - 1; i > this.stackPos; i--) {
        var p2 = particles[i];

        // Pythagorus theorum to get distance between two points
        var a = this.position.x - p2.position.x;
        var b = this.position.y - p2.position.y;
        var dist = Math.sqrt((a * a) + (b * b)).toFixed(2);

        // If the two particles are in proximity, join them
        if (dist < options.proximity) {
          ctx.moveTo(this.position.x + this.parallaxOffsetX, this.position.y + this.parallaxOffsetY);
          if (options.curvedLines) {
            ctx.quadraticCurveTo(Math.max(p2.position.x, p2.position.x), Math.min(p2.position.y, p2.position.y), p2.position.x + p2.parallaxOffsetX, p2.position.y + p2.parallaxOffsetY);
          } else {
            ctx.lineTo(p2.position.x + p2.parallaxOffsetX, p2.position.y + p2.parallaxOffsetY);
          }
        }
      }
      ctx.stroke();
      ctx.closePath();
    };

    /**
     * update particle position 
     */
    Particle.prototype.updatePosition = function() {
      if (options.parallax) {
        if (orientationSupport && !desktop) {
          // Map tiltX range [-30,30] to range [0,winW]
          var ratioX = (winW - 0) / (30 - (-30));
          pointerX = (tiltX - (-30)) * ratioX + 0;
          // Map tiltY range [-30,30] to range [0,winH]
          var ratioY = (winH - 0) / (30 - (-30));
          pointerY = (tiltY - (-30)) * ratioY + 0;
        } else {
          pointerX = mouseX;
          pointerY = mouseY;
        }
        // Calculate parallax offsets
        this.parallaxTargX = (pointerX - (winW / 2)) / (options.parallaxMultiplier * this.layer);
        this.parallaxOffsetX += (this.parallaxTargX - this.parallaxOffsetX) / 10; // Easing equation
        this.parallaxTargY = (pointerY - (winH / 2)) / (options.parallaxMultiplier * this.layer);
        this.parallaxOffsetY += (this.parallaxTargY - this.parallaxOffsetY) / 10; // Easing equation
      }

      switch (options.directionX) {
        case 'left':
          if (this.position.x + this.speed.x + this.parallaxOffsetX < 0) {
            this.position.x = $el.width() - this.parallaxOffsetX;
          }
          break;
        case 'right':
          if (this.position.x + this.speed.x + this.parallaxOffsetX > $el.width()) {
            this.position.x = 0 - this.parallaxOffsetX;
          }
          break;
        default:
          // If particle has reached edge of canvas, reverse its direction
          if (this.position.x + this.speed.x + this.parallaxOffsetX > $el.width() || this.position.x + this.speed.x + this.parallaxOffsetX < 0) {
            this.speed.x = -this.speed.x;
          }
          break;
      }

      switch (options.directionY) {
        case 'up':
          if (this.position.y + this.speed.y + this.parallaxOffsetY < 0) {
            this.position.y = $el.height() - this.parallaxOffsetY;
          }
          break;
        case 'down':
          if (this.position.y + this.speed.y + this.parallaxOffsetY > $el.height()) {
            this.position.y = 0 - this.parallaxOffsetY;
          }
          break;
        default:
          // If particle has reached edge of canvas, reverse its direction
          if (this.position.y + this.speed.y + this.parallaxOffsetY > $el.height() || this.position.y + this.speed.y + this.parallaxOffsetY < 0) {
            this.speed.y = -this.speed.y;
          }
          break;
      }

      // Move particle
      this.position.x += this.speed.x;
      this.position.y += this.speed.y;
    };

    /**
     * Setter: particle stacking position
     */
    Particle.prototype.setStackPos = function(i) {
      this.stackPos = i;
    };

    function option (key, val) {
      if (val) {
        options[key] = val;
      } else {
        return options[key];
      }
    }

    function destroy() {
      $el.find('.pg-canvas').remove();
      hook('onDestroy');
      $el.removeData('plugin_' + pluginName);
    }

    function hook(hookName) {
      if (options[hookName] !== undefined) {
        options[hookName].call(el);
      }
    }

    init();

    return {
      option: option,
      destroy: destroy,
      start: start,
      pause: pause
    };
  }

  $.fn[pluginName] = function(options) {
    if (typeof arguments[0] === 'string') {
      var methodName = arguments[0];
      var args = Array.prototype.slice.call(arguments, 1);
      var returnVal;
      this.each(function() {
        if ($.data(this, 'plugin_' + pluginName) && typeof $.data(this, 'plugin_' + pluginName)[methodName] === 'function') {
          returnVal = $.data(this, 'plugin_' + pluginName)[methodName].apply(this, args);
        }
      });
      if (returnVal !== undefined){
        return returnVal;
      } else {
        return this;
      }
    } else if (typeof options === "object" || !options) {
      return this.each(function() {
        if (!$.data(this, 'plugin_' + pluginName)) {
          $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
        }
      });
    }
  };

  $.fn[pluginName].defaults = {
    minSpeedX: 0.1,
    maxSpeedX: 0.7,
    minSpeedY: 0.1,
    maxSpeedY: 0.7,
    directionX: 'center', // 'center', 'left' or 'right'. 'center' = dots bounce off edges
    directionY: 'center', // 'center', 'up' or 'down'. 'center' = dots bounce off edges
    density: 10000, // How many particles will be generated: one particle every n pixels
    dotColor: '#666666',
    lineColor: '#666666',
    particleRadius: 7, // Dot size
    lineWidth: 1,
    curvedLines: false,
    proximity: 100, // How close two dots need to be before they join
    parallax: true,
    parallaxMultiplier: 5, // The lower the number, the more extreme the parallax effect
    onInit: function() {},
    onDestroy: function() {}
  };

	function initParticles() {
		var color = '#a1a1a1';
		if ($('.to-page-heading').is('.dark')) {
			color  = '#E6E6E6';
		}
		$('#particles').particleground({
			dotColor: color,
			lineColor: color
		});
	}
	$(document).ready(function() {
		initParticles();
	});
	
	$(window).on('statechangecomplete', function() {
		initParticles();
	});

})(jQuery);


(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());