$(document).ready(function() {
    const $slider = $('.reviews-scroll');
    const $container = $('.reviews-container');
    const $dots = $('.dot');
    const $cards = $('.review-card');
    const cardCount = $cards.length;
    
    if (!$slider.length || !$container.length || !$dots.length || !$cards.length) {
        console.warn('Reviews slider: Required elements not found');
        return;
    }
    
    let currentIndex = 0;
    let isScrolling = false;
    let scrollTimeout;
    let autoSlideInterval;
    let isAnimating = false;
    
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    let isSwiping = false;
    
    function initSlider() {
        $container.attr({
            'role': 'region',
            'aria-label': 'Отзывы клиентов'
        });
        
        $dots.each(function(index) {
            $(this).attr({
                'role': 'button',
                'aria-label': `Перейти к отзыву ${index + 1}`,
                'tabindex': '0'
            });
        });
        
        updateDots();
        
        initScrollHandler();
        initDotClickHandlers();
        initSwipeHandlers();
        initKeyboardHandlers();
        initAutoSlide();
    }
    
    function initScrollHandler() {
        $slider.on('scroll', function() {
            if (!isScrolling) {
                isScrolling = true;
            }
            
            clearTimeout(scrollTimeout);
            
            scrollTimeout = setTimeout(function() {
                isScrolling = false;
                updateActiveIndex();
            }, 150);
            
            updateActiveIndex();
        });
    }
    
    function updateActiveIndex() {
        const scrollLeft = $slider.scrollLeft();
        let newIndex = 0;
        
        $cards.each(function(index) {
            const cardLeft = $(this).position().left + scrollLeft;
            const cardCenter = cardLeft + $(this).outerWidth() / 2;
            const containerCenter = scrollLeft + $slider.width() / 2;
            
            if (cardCenter <= containerCenter) {
                newIndex = index;
            }
        });
        
        newIndex = Math.max(0, Math.min(newIndex, cardCount - 1));
        
        if (newIndex !== currentIndex) {
            currentIndex = newIndex;
            updateDots();
        }
    }
    
    function updateDots() {
        $dots.removeClass('active').attr('aria-pressed', 'false');
        $dots.eq(currentIndex).addClass('active').attr('aria-pressed', 'true');
        
        $container.attr('aria-label', `Отзывы клиентов. Показан отзыв ${currentIndex + 1} из ${cardCount}`);
    }
    
    function initDotClickHandlers() {
        $dots.on('click keydown', function(e) {
            if (e.type === 'click' || e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                
                const index = parseInt($(this).data('index'));
                if (!isNaN(index) && index >= 0 && index < cardCount) {
                    scrollToCard(index);
                    resetAutoSlide();
                }
            }
        });
    }
    
    function scrollToCard(index) {
        if (index < 0 || index >= cardCount) return;
        
        isAnimating = true;
        const $targetCard = $cards.eq(index);
        const cardLeft = $targetCard.position().left;
        const scrollLeft = $slider.scrollLeft();
        const targetScrollLeft = scrollLeft + cardLeft;
        
        $slider.animate({
            scrollLeft: targetScrollLeft
        }, 500, 'swing', function() {
            currentIndex = index;
            updateDots();
            isAnimating = false;
        });
    }
    
    function initSwipeHandlers() {
        $container.on('touchstart', function(e) {
            startX = e.originalEvent.touches[0].clientX;
            startY = e.originalEvent.touches[0].clientY;
            isSwiping = false;
            clearInterval(autoSlideInterval);
        });
        
        $container.on('touchmove', function(e) {
            if (!isSwiping) {
                const currentX = e.originalEvent.touches[0].clientX;
                const currentY = e.originalEvent.touches[0].clientY;
                const diffX = Math.abs(currentX - startX);
                const diffY = Math.abs(currentY - startY);
                
                if (diffX > diffY && diffX > 10) {
                    isSwiping = true;
                    e.preventDefault(); 
                }
            } else {
                e.preventDefault();
            }
        });
        
        $container.on('touchend', function(e) {
            if (isSwiping) {
                endX = e.originalEvent.changedTouches[0].clientX;
                const diff = startX - endX;
                
                if (Math.abs(diff) > 50) { 
                    if (diff > 0 && currentIndex < cardCount - 1) {
                        scrollToCard(currentIndex + 1);
                    } else if (diff < 0 && currentIndex > 0) {
                        scrollToCard(currentIndex - 1);
                    }
                }
            }
            
            isSwiping = false;
            resetAutoSlide();
        });
    }
    
    function initKeyboardHandlers() {
        $(document).on('keydown', function(e) {
            if ($('.reviews').is(':visible')) {
                if (e.key === 'ArrowLeft' && currentIndex > 0) {
                    scrollToCard(currentIndex - 1);
                    resetAutoSlide();
                } else if (e.key === 'ArrowRight' && currentIndex < cardCount - 1) {
                    scrollToCard(currentIndex + 1);
                    resetAutoSlide();
                }
            }
        });
    }
    
    function initAutoSlide() {
        startAutoSlide();
        
        $container.on('mouseenter focusin', function() {
            clearInterval(autoSlideInterval);
        });
        
        $container.on('mouseleave focusout', function() {
            startAutoSlide();
        });
        
        $dots.on('focus', function() {
            clearInterval(autoSlideInterval);
        });
        
        $dots.on('blur', function() {
            startAutoSlide();
        });
        
        $(document).on('visibilitychange', function() {
            if (document.hidden) {
                clearInterval(autoSlideInterval);
            } else {
                startAutoSlide();
            }
        });
    }
    
    function startAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
        
        autoSlideInterval = setInterval(function() {
            if (!isAnimating && !isScrolling) {
                const nextIndex = currentIndex + 1;
                if (nextIndex < cardCount) {
                    scrollToCard(nextIndex);
                } else {
                    clearInterval(autoSlideInterval);
                    console.log('Auto-slide stopped: reached end of reviews');
                }
            }
        }, 5000);
    }
    
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        if (currentIndex < cardCount - 1) {
            startAutoSlide();
        }
    }
    
    $(window).on('resize', function() {
        setTimeout(function() {
            updateActiveIndex();
        }, 100);
    });
    
    window.addEventListener('error', function(e) {
        if (e.filename && e.filename.includes('scr_otz.js')) {
            console.error('Reviews slider error:', e.message);
        }
    });
    
    initSlider();
    
    console.log('Reviews slider initialized successfully!');
    console.log(`Found ${cardCount} review cards`);
    console.log('Features enabled: native scroll, scroll-snap, dot synchronization, auto-slide, swipe, keyboard');
});