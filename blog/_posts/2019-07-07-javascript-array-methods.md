---
title: JavaScript array methods
comments: true
---

There are many javascript array mehthods but we will discuss only the following:

* Map
* Reduce
* Filter
* Some
* Every

### Map

This method will executes the callback function on each element of the array.

```js
array.map((item, index, array) => {}, thisValue)
```

Now lets have a look at the usage of the `map` method:

```js
const names = ["John", "Jane"];
const greetings = names.map((name, index) => {
    console.log(index);
    return `Hi, ${name}`;
});
console.log(greetings);
```

Executing above code will output the following:

```json
0, 1
[ "Hi, John", "Hi, Jane" ]
```

### Reduce

This method will reduce the array into one element.

```js
const numbers = [1, 2, 3];
const total = numbers.reduce((total, currentValue) => total + currentValue);
console.log(total);
```

Executing above code will output the following:

```json
6
```

### Filter

This method will extract all the elements from the array which passed the provided condition inside call back function.

```js
const users = [
  {
    name: 'John',
    isActive: true,
  },
  {
    name: 'Alice',
    isActive: false,
  },
  {
    name: 'Bob',
    isActive: true,
  },
];

const activeUsers = users.filter(user => user.isActive);
console.log(activeUsers);
```

Executing above code will output the following:

```json
[
  {
    "name": "John",
    "isActive": true
  },
  {
    "name": "Bob",
    "isActive": true
  }
]
```

### Some

This method will return `true` if one element passed the condition otherwise it will return `false`.

```js
const users = [
  {
    name: 'John',
    isActive: false,
  },
  {
    name: 'Alice',
    isActive: false,
  },
  {
    name: 'Bob',
    isActive: true,
  },
];

const isOneUserActive = users.some(user => user.isActive === true);
console.log(isOneUserActive);
```

Executing above code will output the following:

```json
true
```

### Every

This method will return `true` if all elements passed the condition provided inside callback function otherwise it will return `false`.

```js
const users = [
  {
    name: 'John',
    isActive: false,
  },
  {
    name: 'Alice',
    isActive: true,
  },
  {
    name: 'Bob',
    isActive: true,
  },
];

const isAllUserActive = users.every(user => user.isActive === true);
console.log(isAllUserActive);
```

Executing above code will output the following:

```json
false
```
