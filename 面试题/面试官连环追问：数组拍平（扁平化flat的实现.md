# 面试官连环追问：数组拍平（扁平化） flat 方法实现 

## 一段代码总结 `Array.prototype.flat()` 特性

> 注：数组拍平方法 `Array.prototype.flat()` 也叫数组扁平化、数组拉平、数组降维。本文统一叫：数组拍平

```
const animals = ["🐷", ["🐶", "🐂"], ["🐎", ["🐑", ["🐲"]], "🐛"]];

// 不传参数时，默认“拉平”一层
animals.flat();
// ["🐷", "🐶", "🐂", "🐎", ["🐑", ["🐲"]], "🐛"]

// 传入一个整数参数，整数即“拉平”的层数
animals.flat(2);
// ["🐷", "🐶", "🐂", "🐎", "🐑", ["🐲"], "🐛"]

// Infinity 关键字作为参数时，无论多少层嵌套，都会转为一维数组
animals.flat(Infinity);
// ["🐷", "🐶", "🐂", "🐎", "🐑", "🐲", "🐛"]

// 传入 <=0 的整数将返回原数组，不“拉平”
animals.flat(0);
animals.flat(-10);
// ["🐷", ["🐶", "🐂"], ["🐎", ["🐑", ["🐲"]], "🐛"]];

// 如果原数组有空位，flat()方法会跳过空位。
["🐷", "🐶", "🐂", "🐎",,].flat();
// ["🐷", "🐶", "🐂", "🐎"]
```

### `Array.prototype.flat()` 特性总结

- `Array.prototype.flat()` 用于将嵌套的数组“拉平”，变成一维的数组。该方法返回一个新数组，对原数据没有影响。
- 不传参数时，默认“拉平”一层，可以传入一个整数，表示想要“拉平”的层数。
- 传入 `<=0` 的整数将返回原数组，不“拉平”
- `Infinity` 关键字作为参数时，无论多少层嵌套，都会转为一维数组
- 如果原数组有空位，`Array.prototype.flat()` 会跳过空位。

### 第一问：实现一个简单的数组拍平 `flat` 函数

如何实现呢，思路非常简单：实现一个有数组拍平功能的 `flat` 函数，**我们要做的就是在数组中找到是数组类型的元素，然后将他们展开**。这就是实现数组拍平 `flat` 方法的关键思路。

有了思路，我们就需要解决实现这个思路需要克服的困难：

- **第一个要解决的就是遍历数组的每一个元素；**
- **第二个要解决的就是判断元素是否是数组；**
- **第三个要解决的就是将数组的元素展开一层；**

#### 遍历数组的方案

遍历数组并取得数组元素的方法非常之多，**包括且不限于下面几种**：

- `for 循环`
- `for...of`
- `for...in`
- `forEach()`
- `entries()`
- `keys()`
- `values()`
- `reduce()`    划重点
- `map()`

```js
const arr = [1, 2, 3, 4, [1, 2, 3, [1, 2, 3, [1, 2, 3]]], 5, "string", { name: "弹铁蛋同学" }];
// 遍历数组的方法有太多，本文只枚举常用的几种
// for 循环
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}
// for...of
for (let value of arr) {
  console.log(value);
}
// for...in
for (let i in arr) {
  console.log(arr[i]);
}
// forEach 循环
arr.forEach(value => {
  console.log(value);
});
// entries（）
for (let [index, value] of arr.entries()) { //解包
  console.log(value);
}
// keys()
for (let index of arr.keys()) {
  console.log(arr[index]);
}
// values()
for (let value of arr.values()) {
  console.log(value);
}
// reduce()
arr.reduce((pre, cur) => {
  console.log(cur);
}, []);
// map()
arr.map(value => console.log(value));
```

#### 判断元素是数组的方案

- `instanceof`
- `constructor`
- `Object.prototype.toString`
- `isArray`

```
const arr = [1, 2, 3, 4, [1, 2, 3, [1, 2, 3, [1, 2, 3]]], 5, "string", { name: "弹铁蛋同学" }];
arr instanceof Array
// true
arr.constructor === Array
// true
Object.prototype.toString.call(arr) === '[object Array]'
// true
Array.isArray(arr)
// true
```

**说明**：

- `instanceof` 操作符是假定只有一种全局环境，如果网页中包含多个框架，多个全局环境，如果你从一个框架向另一个框架传入一个数组，那么传入的数组与在第二个框架中原生创建的数组分别具有各自不同的构造函数。（所以在这种情况下会不准确）

- `typeof` 操作符对数组取类型将返回 `object`

- 因为` constructor` 可以被重写，所以不能确保一定是数组。

  ```
  const str = 'abc';
  str.constructor = Array;
  str.constructor === Array 
  // true
  ```

#### 将数组的元素展开一层的方案

- 扩展运算符 + `concat`

`concat()` 方法用于合并两个或多个数组，在拼接的过程中加上扩展运算符会展开一层数组。详细见下面的代码。

- `conca`t +` apply`

这个方法很巧妙 就是连接数字，我们吧数组解包然后去连接3之就行



主要是利用 `apply` 在绑定作用域时，传入的第二个参数是一个数组或者类数组对象，其中的数组元素将作为单独的参数传给 `func` 函数。也就是在调用 `apply` 函数的过程中，会将传入的数组一个一个的传入到要执行的函数中，也就是相当对数组进行了一层的展开。

- `toString` + `split`

不推荐使用 `toString` + `split` 方法，因为操作字符串是和危险的事情，在[上一文章](https://juejin.im/post/5decf09de51d45584d238319)中我做了一个操作字符串的案例还被许多小伙伴们批评了。如果数组中的元素所有都是数字的话，`toString` +` split` 是可行的，并且是一步搞定。

### 方法一

```js
const arr = [1, 2, 3, 4, [1, 2, 3, [1, 2, 3, [1, 2, 3]]], 5, "string", { name: "弹铁蛋同学" }];
// concat + 递归
function flat(arr) {
  let arrResult = [];
  arr.forEach(item => {
    if (Array.isArray(item)) {
      console.log(arguments)
      console.log(arguments.callee)
      arrResult = arrResult.concat(arguments.callee(item));   // 递归
      // 或者用扩展运算符
      // arrResult.push(...arguments.callee(item));
    } else {
      arrResult.push(item);
    }
  });
  return arrResult;
}
flat(arr)
// [1, 2, 3, 4, 1, 2, 3, 1, 2, 3, 1, 2, 3, 5, "string", { name: "弹铁蛋同学" }];


/*arguments.callee(item)的解释*/
a rguments就是 当前函数的参数。  他下面有一个属性就是。callee  它是一个指针 指向了使用参数的方法 也就是当前的方法。 这样实现了低柜
```

### 方法二 用 `reduce` 实现 `flat` 函数

```
const arr = [1, 2, 3, 4, [1, 2, 3, [1, 2, 3, [1, 2, 3]]], 5, "string", { name: "弹铁蛋同学" }]
const flat = arr =>{
	return arr.reduce((pre,cur)=>{
	return pre.concat(Array.isArray(cur)?flat(cur):cur);
	}, [])
}

flat(arr)
```

### 第三问：使用栈的思想实现 `flat` 函数

```js
// 栈思想
function flat(arr) {
  const result = []; 
  const stack = [].concat(arr);  // 将数组元素拷贝至栈，直接赋值会改变原数组
  //如果栈不为空，则循环遍历
  while (stack.length !== 0) {
    const val = stack.pop(); 
    if (Array.isArray(val)) {
      stack.push(...val); //如果是数组再次入栈，并且展开了一层
    } else {
      result.unshift(val); //如果不是数组就将其取出来放入结果数组中
    }
  }
  return result;
}
const arr = [1, 2, 3, 4, [1, 2, 3, [1, 2, 3, [1, 2, 3]]], 5, "string", { name: "弹铁蛋同学" }]
flat(arr)
// [1, 2, 3, 4, 1, 2, 3, 1, 2, 3, 1, 2, 3, 5, "string", { name: "弹铁蛋同学" }];
```

### 第四问：通过传入整数参数控制“拉平”层数

```
//此时最好不要写箭头函数了
function flat(arr,num=1){
	return num>0 ? 
	 arr.reduce( (pre,cur) => pre.concat(Array.isArray(cur)?flat(cur,num-1):cur), [] )
	:arr.slice();//返回自己个
}

const arr = [1, 2, 3, 4, [1, 2, 3, [1, 2, 3, [1, 2, 3]]], 5, "string", { name: "弹铁蛋同学" }]
flat(arr, Infinity);
```

