(function(modules) {
    var installedModules = {};

    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) {
            return installedModules[moduleId].exports;
        }
        var module = installedModules[moduleId] = {
            i: moduleId,
            l: false,
            exports: {}
        };
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        module.l = true;
        return module.exports;
    }
    __webpack_require__.m = modules;
    __webpack_require__.c = installedModules;
    __webpack_require__.d = function(exports, name, getter) {
        if (!__webpack_require__.o(exports, name)) {
            Object.defineProperty(exports, name, {
                configurable: false,
                enumerable: true,
                get: getter
            });
        }
    };
    __webpack_require__.n = function(module) {
        var getter = module && module.__esModule ? function getDefault() {
            return module['default'];
        } : function getModuleExports() {
            return module;
        };
        __webpack_require__.d(getter, 'a', getter);
        return getter;
    };
    __webpack_require__.o = function(object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    };
    __webpack_require__.p = "";
    return __webpack_require__(__webpack_require__.s = 5);
})({
    5: (function(module, exports) {
        (function($) {
            $(document).ready(function() {
                setTimeout(function() {
                    $('.loader').addClass('hidden').delay(200).remove();
                    $('.slide-in').each(function() {
                        $(this).addClass('visible');
                    });
                }, 1900);
                $('[data-toggle="popover"]').popover();
                $('[data-toggle="tooltip"]').tooltip();
                $('.example a').click(function(event) {
                    event.target.getAttribute('href') === '#' && event.preventDefault();
                });
                $('#scroll-to-content').click(function(ev) {
                    ev.preventDefault();
                    if (typeof ev.target.dataset.scrollTo === 'undefined') {
                        return;
                    }
                    $('html, body').animate({
                        scrollTop: $(ev.target.dataset.scrollTo).offset().top - 100
                    }, 1000)
                });
                $('.ripple').on('mousedown', function(event) {
                    event.preventDefault();
                    $(this).append('<div class="rippleEffect"/>');
                    var $rippleEffect = $('.rippleEffect');
                    var btnOffset = $(this).offset();
                    var top = event.pageY - btnOffset.top;
                    var left = event.pageX - btnOffset.left;
                    $rippleEffect.css({
                        'top': top - 19,
                        'left': left - 19
                    });
                    $(this).addClass('pressed');
                });
                $('.ripple').on('mouseup, mouseout', function() {
                    var $rippleEffect = $('.rippleEffect');
                    $rippleEffect.css({
                        'opacity': 0,
                        'transition': 'opacity 1s linear'
                    });
                    setTimeout(function() {
                        $rippleEffect.remove();
                        $('.ripple').removeClass('pressed');
                    }, 600);
                });
                // $('#slider-example-2').customSlider({
                //     start: [10, 80],
                //     range: {
                //         min: 0,
                //         max: 100
                //     },
                //     connect: true,
                //     tooltips: true
                // });
                $('#datepicker-example-1').datepicker({});
                $('#datepicker-example-2').datepicker({});
            });
        })(jQuery);
    })
});