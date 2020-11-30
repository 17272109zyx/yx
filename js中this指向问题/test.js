obj = { x: 1 }

function test() {
    return this
}

// 使用apply来改变this的指向
console.log(
    test.apply(obj, [1, 2, 3])
);
// 使用apply来改变this的指向

console.log(
    test.call(obj, 1, 2, 3)
);


// 使用bind 来改变函数指向 不过bind的返回值的一个新函数 
// 自此以后这个nwfunc都是绑定的这个this
let nwfunc = test.bind(obj)

console.log(nwfunc());;