参考链接：https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/431

## 预备知识

### Object.entries()

```
Object.entries()方法返回一个给定对象自身可枚举属性的键值对数组，其排列与使用 for...in 循环遍历该对象时返回的顺序一致（区别在于 for-in 循环还会枚举原型链中的属性）。
直接对别python里面的 dict.items() 
就是同时迭代key和val

当然js中还有其他方法如： 属性的可枚举性和所有权
Object.keys()
Object.values() 
Object.prototype.propertyIsEnumerable()
Object.create()
Object.getOwnPropertyNames()

参考链接：
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
```

#### 使用

```javascript
const object1 = {
  a: 'somestring',
  b: 42
};

for (const [key, value] of Object.entries(object1)) { //js里面的解包
  console.log(`${key}: ${value}`); //就是字符串格式化的意思 对比c里面的%s 这样
}

//关于解包
const arr = [1,2]
const [x,y] = arr
那么现在： x就是1。y就是2了！
```

#### 示例

```javascript
const obj = { foo: 'bar', baz: 42 };
console.log(Object.entries(obj)); // [ ['foo', 'bar'], ['baz', 42] ]

// array like object
const obj = { 0: 'a', 1: 'b', 2: 'c' };
console.log(Object.entries(obj)); // [ ['0', 'a'], ['1', 'b'], ['2', 'c'] ]

// array like object with random key ordering
const anObj = { 100: 'a', 2: 'b', 7: 'c' };
console.log(Object.entries(anObj)); // [ ['2', 'b'], ['7', 'c'], ['100', 'a'] ]

// getFoo is property which isn't enumerable
const myObj = Object.create({}, { getFoo: { value() { return this.foo; } } });
myObj.foo = 'bar';
console.log(Object.entries(myObj)); // [ ['foo', 'bar'] ]

// non-object argument will be coerced to an object
console.log(Object.entries('foo')); // [ ['0', 'f'], ['1', 'o'], ['2', 'o'] ]

// iterate through key-value gracefully
const obj = { a: 5, b: 7, c: 9 };
for (const [key, value] of Object.entries(obj)) {
  console.log(`${key} ${value}`); // "a 5", "b 7", "c 9"
}

// Or, using array extras
Object.entries(obj).forEach(([key, value]) => {
console.log(`${key} ${value}`); // "a 5", "b 7", "c 9"
});
```

### JSON.stringify()九大特性

#### 第一大特性

**对于 `undefined`、任意的函数以及 `symbol` 三个特殊的值分别作为对象属性的值、数组元素、单独的值时 `JSON.stringify() `将返回不同的结果**

```javascript
//先来一道题目吧。
1.1
const data = {
  a: "aaa",
  b: undefined,
  c: Symbol("dd"),
  fn: function() {
    return true;
  }
};
JSON.stringify(data); // 输出：？

// "{"a":"aaa"}"

//考察内容
//undefined、任意的函数以及 symbol 作为对象属性值时 JSON.stringify() 跳过（忽略）对它们进行序列化

追问：
假设 undefined、任意的函数以及 symbol 值作为数组元素会是怎样呢？
1.2
JSON.stringify(["aaa", undefined, function aa() {
    return true
  }, Symbol('dd')])  // 输出：？

// "["aaa",null,null,null]"

//知识点是：
//undefined、任意的函数以及 symbol 作为数组元素值时，JSON.stringify() 将会将它们序列化为 null


再思考 如果单独序列化这些值会是什么样的结果呢？
1.3
JSON.stringify(function a (){console.log('a')})
// undefined
JSON.stringify(undefined)
// undefined
JSON.stringify(Symbol('dd'))
// undefined

结论：undefined、任意的函数以及 symbol 被 JSON.stringify() 作为单独的值进行序列化时都会返回 undefined


【怎么记忆：？ 对象是不序列化，数组是序列化成null，自己会被序列化成undefined】
```

第一大特性总结

- `undefined`、任意的函数以及 `symbol` 作为对象属性值时 `JSON.stringify()` 对跳过（忽略）它们进行序列化
- `undefined`、任意的函数以及 `symbol` 作为数组元素值时，`JSON.stringify()` 将会将它们序列化为 `null`
- `undefined`、任意的函数以及 `symbol` 被 `JSON.stringify()` 作为单独的值进行序列化时，都会返回 `undefined`

#### 第二大特性

```javascript
非数组对象的属性不能保证以特定的顺序出现在序列化后的字符串中。
const data = {
  a: "aaa",
  b: undefined,
  c: Symbol("dd"),
  fn: function() {
    return true;
  },
  d: "ddd"
};
JSON.stringify(data); // 输出：？
// "{"a":"aaa","d":"ddd"}"

JSON.stringify(["aaa", undefined, function aa() {
    return true
  }, Symbol('dd'),"eee"])  // 输出：？

// "["aaa",null,null,null,"eee"]"

说人话？就是你在序列化非数组对象的时候 中间可能会缺值导致“不是特定顺序”
```

#### 第三大特性

```javascript
转换值如果有 toJSON() 函数，该函数返回什么值，序列化结果就是什么值，并且忽略其他属性的值。
JSON.stringify({
    say: "hello JSON.stringify",
    toJSON: function() {
      return "today i learn";
    }
  })
// "today i learn"   「并且忽略其他属性的值。」 很重要 忽略了say这个键值对
```

#### 第四大特性

```javascript
JSON.stringify() 将会正常序列化 Date 的值。

JSON.stringify({ now: new Date() });
"{"now":"2020-11-15T05:34:18.998Z"}"

```

#### 第五大特性

```js
NaN 和 Infinity 格式的数值及 null 都会被当做 null。
//NaN 属性是代表非数字值的特殊值。该属性用于指示某个值不是数字。可以把 Number 对象设置为该值，来指示其不是数字值。就理解成 BIG_INT吧
Number.NaN 是一个特殊值，说明某些算术运算（如求负数的平方根）的结果不是数字。方法 parseInt() 和 parseFloat() 在不能解析指定的字符串时就返回这个值。对于一些常规情况下返回有效数字的函数，也可以采用这种方法，用 Number.NaN 说明它的错误情况。

JavaScript 以 NaN 的形式输出 Number.NaN。请注意，NaN 与其他数值进行比较的结果总是不相等的，包括它自身在内。因此，不能与 Number.NaN 比较来检测一个值是不是数字，而只能调用 isNaN() 来比较。


eg:
JSON.stringify(NaN)
// "null"
JSON.stringify(null)
// "null"
JSON.stringify(Infinity)
// "null"
```

#### 第六大特性

```js
关于基本类型的序列化：
布尔值、数字、字符串的包装对象在序列化过程中会自动转换成对应的原始值。
JSON.stringify([new Number(1), new String("false"), new Boolean(false)]);
//可以理解为把它里面的东西们给 都 “运行” 一次

"[1,"false",false]"
```

#### 第七大特性

```js
其他类型的对象，包括 Map/Set/WeakMap/WeakSet，仅会序列化可枚举的属性。

// 不可枚举的属性默认会被忽略：
JSON.stringify( 
    Object.create(
        null, 
        { 
            x: { value: 'json', enumerable: false }, 
            y: { value: 'stringify', enumerable: true } 
        }
    )
);
// "{"y","stringify"}"

```

#### 第八大特性

```js
实现深拷贝最简单粗暴的方式就是序列化：JSON.parse(JSON.stringify())，但是这个方式实现深拷贝会因为序列化的诸多特性导致诸多的坑点：比如现在我们要说的循环引用问题。

// 对包含循环引用的对象（对象之间相互引用，形成无限循环）执行此方法，会抛出错误。 
const obj = {
  name: "loopObj"
};
const loopObj = {
  obj
};
```

#### 第九大特性

```js
所有以 symbol 为属性键的属性都会被完全忽略掉，即便 replacer 参数中强制指定包含了它们。
JSON.stringify({ [Symbol.for("json")]: "stringify" }, function(k, v) {
    if (typeof k === "symbol") {
      return v;
    }
  })
// underfined
```

### JSON.stringify() 第二个参数和第三个参数

`replacer` 参数有两种形式，可以是一个函数或者一个数组。作为函数时，它有两个参数，键（key）和值（value），函数类似就是数组方法 `map`、`filter` 等方法的回调函数，对每一个属性值都会执行一次该函数。如果 `replacer` 是一个数组，数组的值代表将被序列化成 JSON 字符串的属性名。

### `replacer` 作为函数时

#### 可以打破九大特性的大多数特性

第二个参数`replacer` 非常强大， `replacer` 作为函数时，我们可以打破九大特性的大多数特性，我们直接来看代码吧。

```js
const data = {
  a: "aaa",
  b: undefined,
  c: Symbol("dd"),
  fn: function() {
    return true;
  }
};
// 不用 replacer 参数时
JSON.stringify(data); 

// "{"a":"aaa"}"
// 使用 replacer 参数作为函数时
JSON.stringify(data, (key, value) => {
  switch (true) {
    case typeof value === "undefined":
      return "undefined";
    case typeof value === "symbol":
      return value.toString();
    case typeof value === "function":
      return value.toString();
    default:
      break;
  }
  return value;
})
// "{"a":"aaa","b":"undefined","c":"Symbol(dd)","fn":"function() {\n    return true;\n  }"}"
```

虽然使用 toString() 方法有点耍流氓的意思但是不得不说第二个参数很强大。

#### 传入 `replacer` 函数的第一个参数

**需要注意的是，replacer 被传入的函数时，第一个参数不是对象的第一个键值对，而是空字符串作为 key 值，value 值是整个对象的键值对：**

```js
const data = {
  a: 2,
  b: 3,
  c: 4,
  d: 5
};
JSON.stringify(data, (key, value) => {
  console.log(value);
  return value;
})
// 第一个被传入 replacer 函数的是 {"":{a: 2, b: 3, c: 4, d: 5}}
// {a: 2, b: 3, c: 4, d: 5}   
// 2
// 3
// 4
// 5
```

#### 实现 `map` 函数

我们还可以用它来手写实现一个对象的类似 map 的函数。

```js
// 实现一个 map 函数
const data = {
  a: 2,
  b: 3,
  c: 4,
  d: 5
};
const objMap = (obj, fn) => {
  if (typeof fn !== "function") {
    throw new TypeError(`${fn} is not a function !`);
  }
  return JSON.parse(JSON.stringify(obj, fn));
};
objMap(data, (key, value) => {
  if (value % 2 === 0) {
    return value / 2;
  }
  return value;
});
// {a: 1, b: 3, c: 2, d: 5}
```

### `replacer` 作为数组时

`replacer` 作为数组时，结果非常简单，数组的值就代表了将被序列化成 JSON 字符串的属性名。

```js
const jsonObj = {
  name: "JSON.stringify",
  params: "obj,replacer,space"
};

// 只保留 params 属性的值
JSON.stringify(jsonObj, ["params"]);
// "{"params":"obj,replacer,space"}" 
```

## 有意思却没啥用的第三个参数 `space`

`space` 参数用来控制结果字符串里面的间距。首先看一个例子就是到这东西到底是干啥用的：

```js
const tiedan = {
  name: "弹铁蛋同学",
  describe: "今天在学 JSON.stringify()",
  emotion: "like shit"
};
JSON.stringify(tiedan, null, "🐷");
// 接下来是输出结果
// "{
// 🐷"name": "弹铁蛋同学",
// 🐷"describe": "今天在学 JSON.stringify()",
// 🐷"emotion": "like shit"
// }"
JSON.stringify(tiedan, null, 2);
// "{
//   "name": "弹铁蛋同学",
//   "describe": "今天在学 JSON.stringify()",
//   "emotion": "like shit"
// }"
```

上面代码一眼就能看出第三个参数的作用了，花里胡哨的，其实这个参数还是比较鸡肋的，除了好看没啥特别的用处。我们用 `\t`、 `\n` 等缩进能让输出更加格式化，更适于观看。

- 如果是一个数字, 则在字符串化时每一级别会比上一级别缩进多这个数字值的空格（最多10个空格）；
- 如果是一个字符串，则每一级别会比上一级别多缩进该字符串（或该字符串的前10个字符）。

