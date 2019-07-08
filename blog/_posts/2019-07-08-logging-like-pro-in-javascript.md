---
title: Looging like a PRO in javascript
comments: true
---

Inside JavaScript there is a built-in function `JSON.stringify` which converts any variable into json string.

The syntax is:

```js
JSON.stringify(value, replacer, space)
```

1. value 	- Any variable you want to convert into JSON string
2. replacer - This method will be called on each item of the variable
3. space 	- Number of spaces you want to add to each item of the variable

The second and thrird arguments are optional.

Lets have a look at the following example:

```js
const users = [
  {
    name: 'John',
    isActive: false,
  },
  {
    name: 'Jane',
    isActive: true,
  },
];
console.log(JSON.stringify(users, null, 2));
```

Upon running above code you will get the following output:

![Output](https://i.imgur.com/XHjhC50.png)
