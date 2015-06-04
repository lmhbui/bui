/**
 * 对$类扩展一个对象banner
 *
 * @method $().banner
 * @param {Object} options
 * @param {Array | String} [options.data] banner的数据来源，可以是数组，也可以是json数据字符串，不填则默认找div下面的input的
 * @param {String} [options.css] css样式
 * @param {String | Number} [options.width] 宽度，默认为100%
 * @param {String | Number} [options.height] 高度，默认为250px
 * @param {Boolean} [options.auto] 是否自动播放, 默认为true
 * @param {Number} [options.autotime] 自动播放间隔，默认7000毫秒
 * @param {Number} [options.effect] 切换类型 0：渐变；1：左右;
 * @param {Boolean} [options.hideDot] 隐藏小圆点传ture， 不传显示
 * @param {Boolean} [options.hideBtn] 隐藏按钮传ture, 不传显示
 * @param {String | Number} [options.lazytime] 延时加载时间, 传'scroll'为滚动监测加载
 * @example
 *     $('#banner').banner({
 *         data : undefined,         //传数据，可以是数组，也可以是json数据字符串，不填则默认找div下面的input的
 *         css : '',                 //css
 *         width : 250,              //默认为100%
 *         height : 250,             //默认为250px
 *         auto : true,              //是否自动播放
 *         autotime : 3000,          //自动播放间隔
 *         effect : 1,               //特效类型 0：渐变；1：左右;
 *         efftime : 200,            //渐变时间
 *         hideDot : true,           //隐藏小圆点传ture， 不传显示
 *         hideBtn : true,           //隐藏按钮传ture, 不传显示
 *         lazytime : 'scroll'       //延时加载时间
 *     });
 * @return {jQuery} 返回值jquery对象
 * @for $
 */
$.fn.banner = function(opt) {
    var el = this;

    var o = opt || {},
        lazytime = o.lazytime || 0, //延时加载时间, 可以为'scroll' 或是数值
        width = o.width || '100%', //宽
        height = o.height || 250, //高
        css = o.css || '',
        auto = o.auto === undefined ? true : o.auto, //是否自动播放 bool
        autotime = o.autotime || 7000, //自动切换时间
        effect = o.effect || 0, //特效类型，0为渐变, 1为左右切换
        efftime = o.efftime || 300, //特效切换时间
        hideDot = o.hideDot, //特效的圆点true为显示，false为不显示
        hideBtn = o.hideBtn; //特效切换按钮true为显示，false为不显示

    if (typeof o.data === 'string' && o.data) {
        inputval = $.parseJSON(opt.data);
    } else if (!o.data) {
        inputval = $.parseJSON(el.find('input').val());
    } else {
        inputval = o.data;
    }

    $(el).module({
        template: function() {
            var btnHtml = '',
                dotBox = '',
                dotClass = '',
                dotHtml = '',
                aHtml = '',
                aStr = '';

            //按钮html
            if (!hideBtn) {
                btnHtml = '<a href="javascript:;" class="banner-btn banner-left"></a><a href="javascript:;" class="banner-btn banner-right"></a>';
            }

            //圆点html
            if (!hideDot) {
                dotHtml = _.reduce(inputval, function(memo, value, key, list) {
                    return memo + _.template('<i class="<%= cls %>"><%= eq %></i>')({
                        cls: key ? '' : 'curr',
                        eq: 1 + key
                    });
                }, '');
                dotBox = '<div class="banner-dotwrap">' + dotHtml + '</div>';
            }

            //图片html
            aHtml = _.reduce(inputval, function(memo, value, key, list) {
                var target = inputval[key].url ? '_blank' : '_self';
                var imgStr = '<img src="' + inputval[key].img + '" width="' + width + '" height="' + height + '"/>';

                if (inputval[key].url) {
                    if (key > 0) {
                        aStr = '<a target="' + target + '" href="' + inputval[key].url + '" class="banner-item"></a>';
                    } else {
                        aStr = '<a target="' + target + '" href="' + inputval[key].url + '" class="banner-item banner-item-first">' + imgStr + '</a>';
                    }
                } else {
                    if (key > 0) {
                        aStr = '<a target="' + target + '" href="javascript:;" class="banner-item"></a>';
                    } else {
                        aStr = '<a target="' + target + '" href="javascript:;" class="banner-item banner-item-first">' + imgStr + '</a>';
                    }
                }

                return memo + aStr;
            }, '');

            return aHtml + btnHtml + dotBox;
        },
        css: css,
        event: function(opt) {
            var my = $(this);

            my.css({
                width: width,
                height: height
            });

            var index = 0; //默认索引值
            var lastindex = 0; //上一次索引
            var btnDir = 'left'; //默认向左滚动
            var timer; //定时器方法
            var bannerWidth = my.width(); //banner宽度
            var len = inputval.length; //一共有几张图片

            //dom
            var dots = my.find('i'),
                btns = my.find('.banner-btn'),
                banners = my.find('.banner-item');

            // 小圆点点击事件
            my.on('click', 'i', function() {
                    lastindex = index;
                    index = $(this).text() - 1;
                    animateban();
                })
                // 左右按钮点击事件
                .on('click', '.banner-left', function() {
                    btnDir = 'right';
                    lastindex = index;
                    index--;
                    animateban();
                })
                //点击右边
                .on('click', '.banner-right', function() {
                    btnDir = 'left';
                    lastindex = index;
                    index++;
                    animateban();
                })
                .on('mouseenter', function() {
                    clearInterval(timer);
                    btns.show();
                })
                .on('mouseleave', function() {
                    setAuto();
                    btns.hide();
                });

            //修正规宽
            $(window).On('load resize', function() {
                bannerWidth = my.width();
                banners.eq(index).width(bannerWidth);
            }, 100);


            setAuto();
            autoLoadimg(); //自动载图

            //设置自动轮播
            function setAuto() {
                if (auto) {
                    timer = setInterval(autoPlay, autotime);
                }
            }

            //自动轮播
            function autoPlay() {
                lastindex = index;
                index = btnDir === 'left' ? index + 1 : index - 1;
                animateban();
            }

            //自动载图
            function autoLoadimg() {
                setTimeout(function() {
                    _.each(inputval, function(val) {
                        $('<img />').attr('src', val.img);
                    });
                }, 2000);
            }

            //切换
            function animateban() {
                if (index === lastindex) {
                    return;
                }

                indexFunc(); //修正index;
                loadimgFuc(); //处理图片
                dotFunc(); //处理小点


                //左右
                if (effect) {
                    swith();
                }
                //渐变
                else {
                    fadein();
                }
            }

            //渐变
            function fadein() {
                banners.eq(lastindex).css('zIndex', 1);
                banners.eq(index).css({
                    opacity: 0,
                    zIndex: 2
                }).animate({
                    opacity: 1
                });
            }

            //左左切换
            function swith() {
                var goleft = btnDir === 'left' ? -bannerWidth : bannerWidth;
                banners.eq(lastindex).stop().animate({
                    left: goleft
                });
                banners.eq(index).css({
                    left: -goleft
                }).stop().animate({
                    left: 0
                });
            }

            //处理index
            function indexFunc() {
                if (index === len) {
                    index = 0;
                }
                if (index < 0) {
                    index = len - 1;
                }
            }

            //加载图片
            function loadimgFuc() {
                banners.eq(index).html('<img src="' + inputval[index].img + '" widh="1920" height="250"/>');
            }

            //处理小点
            function dotFunc() {
                dots.eq(index).addClass('curr').siblings('i').removeClass('curr');
            }
        }
    }, lazytime)(opt);

    return el;
};