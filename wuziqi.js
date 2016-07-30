$(function() {
    var delay = function() {
        $('.left .ducu').css({
            'display': 'none'
        }).animate({
            opacity: 0
        });
    }
    delay();
    var $jishi = $('.time .font');
    var time = 0;
    var min = 0;
    var second = 0;
    var state;
    function jishi() {
        if (state == "over") {
            time = 0;
            min = 0;
            second = 0;
            $jishi.html('00:00');
        }
        time += 1;
        second = time % 60;
        if (time % 60 == 0) {
            min = parseInt(min);
            min += 1;
            min = (min < 10) ? '0' + min : min;
        }
        second = (second < 10) ? '0' + second : second;
        $jishi.html(min + ':' + second);
        state = "play";
      
    }
    var op = function() {
        state = "over";
        $('.op').on('click', function() {
            $('.side').removeClass('side');
            $(this).addClass('side');
            if ($(this).attr('id') === "computer") {
                isAi = true;
            } else {
                isAi = false;
            }
        })
    }
    op();
    var kongbai = {};
    var draw = function() {
        for (var i = 0; i < 15; i++) {
            $('<b>').addClass('heng').appendTo('.qipan');
            $('<i>').addClass('shu').appendTo('.qipan');
            for (var j = 0; j < 15; j++) {
                kongbai[i + '-' + j] = {
                    x: i,
                    y: j
                };
                $('<div>').addClass('qizi').attr('id', i + '-' + j).data('pos', {
                    x: i,
                    y: j
                }).appendTo('.qipan');
            }
        }
    }
    draw();
    var jion = function(n1, n2) {
        return n1 + '-' + n2;
    }
    var panduan = function(pos, color) {
        var dict = {};
        for (var i in biao) {
            if (biao[i] === color) {
                dict[i] = true;
            }
        }
        var h = 1
          , s = 1
          , zx = 1
          , yx = 1;
        var tx, ty;
        //youbiao
        tx = pos.x;
        ty = pos.y;
        while (dict[jion(tx, ty - 1)]) {
            h++;
            ty--;
        }
        tx = pos.x;
        ty = pos.y;
        while (dict[jion(tx, ty + 1)]) {
            h++;
            ty++;
        }
        // if(h>=5){
        // 	return true;
        // }
        // console.log(h);
        tx = pos.x;
        ty = pos.y;
        while (dict[jion(tx - 1, ty)]) {
            s++;
            tx--;
        }
        tx = pos.x;
        ty = pos.y;
        while (dict[jion(tx + 1, ty)]) {
            s++;
            tx++;
        }
        // if(s>=5){
        // 	return true;
        // }
        // console.log(s)
        tx = pos.x;
        ty = pos.y;
        while (dict[jion(tx - 1, ty + 1)]) {
            zx++;
            tx--;
            ty++;
        }
        tx = pos.x;
        ty = pos.y;
        while (dict[jion(tx + 1, ty - 1)]) {
            zx++;
            tx++;
            ty--;
        }
        // if(zx>=5){
        // 	return true;
        // }
        tx = pos.x;
        ty = pos.y;
        while (dict[jion(tx - 1, ty - 1)]) {
            yx++;
            tx--;
            ty--;
        }
        tx = pos.x;
        ty = pos.y;
        while (dict[jion(tx + 1, ty + 1)]) {
            yx++;
            tx++;
            ty++;
        }
        // if(yx>=5){
        // 	return true;
        // }
        return Math.max(h, s, zx, yx);
    }
    var ai = function() {
        var zuobiao;
        var max = -Infinity;
        for (var i in kongbai) {
            var weixie = panduan(kongbai[i], 'hei');
            if (weixie > max) {
                max = weixie;
                zuobiao = kongbai[i];
            }
        }
        var zuobiao2;
        var max2 = -Infinity;
        for (var i in kongbai) {
            var weixie = panduan(kongbai[i], 'hei');
            if (weixie > max2) {
                max2 = weixie;
                zuobiao2 = kongbai[i];
            }
        }
        return (max > max2) ? zuobiao : zuobiao2;
    }
    var biao = {};
    var isAi = true;
    var qizi = $('.qipan .qizi');
    var num = 0;
    var num1 = 0; 
    var timed;
    var t;
    function change(){          
		$('.left .ducu').css({'display': 'block'}).animate({opacity: 1});
		setTimeout(delay, 3000);                      
    }
    var drop = function() {
        var flag = true;
        state = 'over';
        $('.qipan .qizi').on('click', function() {
        	clearInterval(timed);
            if ($(this).hasClass('hei') || $(this).hasClass('bai')) {
                return;
            }
            var pos = $(this).data('pos');
            if (!isAi) {
                if (flag) {
                    $(this).addClass('hei');
                    biao[pos.x + '-' + pos.y] = 'hei';
                    flag = !flag;
                    // delete kongbai[jion(pos.x,pos.y)];
                    timed = setInterval(change, 3000);
                    t= setInterval(jishi, 1000);
                    // clearInterval(t);
                    if (panduan(pos, 'hei') >= 5) {
                        $('.content .tishi').css({
                            'display': 'block'
                        }).animate({
                            opacity: 1
                        })
                        // alert('黑棋获胜');
                        $('.qipan .qizi').off('click');
                        $('.tishi .button').on('click', function() {
                            window.location.reload();
                        })
                    }
                    $('#side2').addClass('side');
                    $('#side1').removeClass('side');
                    num += 1;
                    $('#side1').find($('.right span')).text(num);
                   
                } else {
                    $(this).addClass('bai');
                    biao[pos.x + '-' + pos.y] = 'bai';
                    flag = !flag;
                    timed = setInterval(change, 3000);
                    if (panduan(pos, 'bai') >= 5) {
                        $('.content .tishi').css({
                            'display': 'block'
                        }).animate({
                            opacity: 1
                        })
                        // alert('白棋获胜');
                        $('.qipan .qizi').off('click');
                        window.location.reload();
                    }
                    ;$('#side1').addClass('side');
                    $('#side2').removeClass('side');
                    num1 += 1;
                    $('#side2').find($('.right span')).text(num1);
                }
                // flag=!flag;
            } else {
                $(this).addClass('hei');
				timed = setInterval(change, 3000);
                 t= setInterval(jishi, 1000);
                biao[pos.x + '-' + pos.y] = 'hei';
                // flag=!flag;
                delete kongbai[jion(pos.x, pos.y)];
                if (panduan(pos, 'hei') >= 5) {
                    $('.content .tishi').css({
                        'display': 'block'
                    }).animate({
                        opacity: 1
                    })
                    // alert('黑棋获胜');
                    $('.qipan .qizi').off('click');
                    window.location.reload();
                }
                $('#side2').addClass('side');
                $('#side1').removeClass('side');
                num += 1;
                $('#side1').find($('.right span')).text(num);
                var pos = ai();
                // var x=Math.floor(Math.random()*15);
                // var y=Math.floor(Math.random()*15);
                $('#' + pos.x + '-' + pos.y).addClass('bai');
                biao[pos.x + '-' + pos.y] = 'bai';
                delete kongbai[jion(pos.x, pos.y)];
                if (panduan(pos, 'bai') >= 5) {
                    $('.content .tishi').css({
                        'display': 'block'
                    }).animate({
                        opacity: 1
                    })
                    // console.log('白棋获胜');
                    $('.qipan .qizi').off('click');
                    window.location.reload();
                }
                $('#side1').addClass('side');
                $('#side2').removeClass('side');
                num1 += 1;
                $('#side2').find($('.right span')).text(num1);
            }
        })

    }
    drop();
    
          
    
    var qipan = $('.qipan');
    $('#play').on('click', function() {
        // window.location.reload();
        qipan.empty();
        draw();
        drop();
		
        // op();
        biao = {};
        num = 0;
        num1 = 0;
        $('.side').removeClass('side')
        $('#side1').addClass('side').find('.right span').text(num);
        $('#side2').find('.right span').text(num1);
		//timed=setInterval(change,3000);
        // kaiguan = true;
    })
    $('.close').on('click', function() {
        alert('你将要离开游戏！！！')
        window.close();
    })
    var audio=$('#audio').get(0);
    var $audio=$('#audio');
     var $musicImg=$('.music');
    
        // if(musicImg.src.indexOf('music.png') > -1){
        // musicImg.src = 'images/musicClose.png';
        // $audio.pause();
        // }else if(musicImg.src.indexOf('musicClose.png') > -1){
        // musicImg.src = 'images/music.png';
        // $audio.play();
        // }
        $musicImg.on('click',function(){
            audio.play();
        })


})
