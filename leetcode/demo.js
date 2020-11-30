var a = b;
var b = 0;
function A(ad) {
    A = function (c) {
        console.log(ad + c++)
    }
    console.log(ad++);
    // console.log();
}
A(1)
A(2)

// 9  fun(1){ 把A 的指向转换一下  打印一个自己 1 }
//10  A已经