---
title: Handling errors in React using Error Boundary
comments: true
---

Error Boundary concept is introduced in React 16 to handle javascript errors and display a fallback UI.

Create a new react application by running below command inside your terminal:

```bash
yarn global add create-react-app
create-react-app react-error-boundary
cd react-error-boundary
```

Open `App.js` file inside your favourite editor and replace everything with the below content:

```js
import React, { useState } from "react";

export function App() {
  const [counter, setCounter] = useState(0);

  if (counter === 5) {
    throw new Error("Counter is reached at its maximum value :)");
  }

  return (
    <>
      <p>{counter}</p>
      <button onClick={() => setCounter(counter + 1)}>Add</button>
    </>
  );
}
```

Let's see what happens if we create a build and serve the application from there:

```bash
yarn run build
serve -s build
```

Upon running `serve` command two URLs will appear inside your terminal open one of them inside your browser. If you keep pressing on the `Add` button it will increase the value of the counter variable and after a while when counter values reache 5 your application will become unresponsive and following will happen:

![Demo1](https://imgur.com/jSez3Ox.gif)

To handle the above issue create a new component and you can name it anything you want but I will rename it to `ErrorBoundary` and after creating the file put following content inside of it:

```js
import React, { Component } from "react";

export class ErrorBoundary extends Component {
  state = {
    error: null,
    errorInfo: null
  };

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    // If there are no errors render
    // the child components
    if (!this.state.errorInfo) {
      return this.props.children;
    }

    // Display custom UI if there are errors
    // in our application
    return (
      <div>Something went wrong</div>
    );
  }
}
```

Lets open `index.js` and wrap `App` component with our `ErrorBoundary`:

```js
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import { ErrorBoundary } from "./ErrorBoundary";

ReactDOM.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
  document.getElementById("root")
);
```

We have to create a new build again and restart the build server:

```bash
yarn run build
serve -s build
```

Open the link which is appeared inside your terminal after running `serve` command.

![Demo2](https://imgur.com/5mXUmPF.gif)
