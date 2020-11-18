$function () {
    var input = $('top').getElementsByTagName('input')[0];  //开始游戏模块
    var Span = $('middle').getElementsByTagName('span');    //左边计分模块
    var Div = $('middle').getElementsByTagName('div')[1];   //右边大模块
    var Img = $('middle').getElementsByTagName('img')[0];   //掉下来的图片
    var arrImg = ['img/1.png', 'img/2.png', 'img/3.png', 'img/4.png', 'img/5.png', 'img/6.png', 'img/7.png','img/8.png', 'img/9.png', 'img/10.png'];
    var sdNum = 1; //图片运行速度
    var onOff = true; //假设一个开关，后面要用来判断
    for (var i = 0; i < Span.length; i++) {
        Span[i].num = 0; //一开始就把所有的得分和失分都归0
    }
    //给开始游戏注册一个点击事件
    input.onclick = function () {
        this.value = '游戏进行中…'; //点击后，游戏开始变成游戏进行中……
        this.disabled = true; //游戏进行中的时候让开始按钮无法再次点击
        var width = parseInt(getStyle(Div, 'width')); //获取图片活动的宽度
        var height = parseInt(getStyle(Div, 'height')) - 50; //获取图片活动的高度，并且减去本身的高度
        Img.style.display = 'block'; //让水果能够显示出来
        auto(); //开始执行代码
        function auto() {
            onOff = true; //假设为true就表示水果落到最下面时会被扣分
            var n = Math.round(Math.random() * (arrImg.length - 1)); //获取数组里面随机的水果
            var positions = Math.round(Math.random() * (width - 50)); //随机获取水果的位置
            Img.src = arrImg[n]; //赋值
            Img.style.left = positions + 'px'; //赋值
            doMove(Img, 'top', sdNum, height, function () { //落下去的时候
                if (onOff == true) { //假设为true就表示水果落到最下面时会扣分
                    shake($('middle'), 'top', function () { //掉下去后就会开始抖动窗口
                        Img.style.top = '0px'; //让水果回到0px的位置
                        Span[1].num++; //失分上面+1
                        Span[1].innerHTML = Span[1].num; //显示在失分上面
                        if (Span[1].num == 10) { //如果失去分大于了10
                            //Img.style.display = 'none';	//如果游戏结束，将水果清除
                            input.value = '开始游戏'; //可以重新点击开始游戏
                            input.disabled = false; //让开始游戏显示出来
                            alert('游戏结束，你共获得' + Span[0].num + '分'); //弹出游戏结束，并且显示得分
                            for (var i = 0; i < Span.length; i++) {
                                Span[i].num = 0; //得分和失分归零
                            }
                        } else {
                            auto();
                        }
                    });
                }

            });
        }

        Img.onclick = function () {
            onOff = false; //如果为false，哪怕水果掉在最下面，也不会获得失分
            Img.src = 'img/qq.png'; //点击最后，水果变成哭的样子

            //这是一个Bug,直线增长会造成用户的体验感差，修改如下，引入对数函数
            // sdNum = sdNum + 0.2; //每一次点击，水果下降的速度增加0,
            // console.log(sdNum);

            shake(Img, 'left', function () { //点击之后开始抖
                Img.style.top = '0px'; //然后水果恢复到0px的位置
                Span[0].num++; //获得得分+1
                Span[0].innerHTML = Span[0].num; //获得得分一枚
                
                sdNum=sdNum+0.2*Math.LOG10E;
                console.log(sdNum);
                auto(); //继续执行代码
            });
        }
    }

}