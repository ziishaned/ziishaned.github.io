---
title: Online and Offline events in JavaScript
comments: true
---

In this post you will learn how to build a fully offline-capable app that will show an alert to user when the application is offline or online. But first let me explain what are events and what are the advantages of using them in your application. Many function starts working when a webpage loads in a browser. But in many cases you want to start a function or take an action when a mouse button is clicked, mouse hovered on an object, when a page fully loaded in browser, input value is changed or keyboard button is pressed etc. All these actions are called events. You can write functions to run when a specific event happens. All these function listens for an event and then start taking the action by initiating the function.

There are two methods by which we can check the connection status both are listed below:

1. Navigator Object
2. Listening to events

## 1. Navigator Object

There is a global object **navigator** in javascript by which you can easliy check if a user is offline or online. The **navigator.onLine** returns `true` if a user is connected to the internet but it will return false if the user is offline.

```javascript
if (navigator.onLine)
    console.log("Congratulations, You are connected to the internet.")
else 
    console.log("Congratulations, You are not connected to the internet.")
```

## 2. Listening to events

Now lets review the other method to check the connection status. In this method we continually listen to the two events `online` and `offline`. And when the connection is interpreted the `offline` event is fired and we capture it by listening to this event. And when the connection is back online the `online` is fired. So, lets take a look at the following example:

### Example

```javascript
class Connection {
    constructor() {
        this.options = {
            onlineText: 'Your device is connected to the internet.',
            offlineText: 'Your device lost its internet connection.',
            reconnectText: 'Attempting to reconnect...',
            notifier: document.querySelector('.notifier'),
            notifierText: document.querySelector('.notifier span'),
            spinner: document.querySelector('.notifier .lds-css')
        };

        this.init();
    }

    init() {
        if (navigator.onLine) {
            this.on();
        } else {
            this.off();
            setTimeout(() => {
                this.reconnect();
            }, 1500);
        }

        window.addEventListener('online', () => {
            this.on();
        });

        window.addEventListener('offline', () => {
            this.off();
            setTimeout(() => {
                this.reconnect();
            }, 1500);
        });
    }

    on() {
        this.options.notifierText.innerText = this.options.onlineText;
        this.options.notifier.classList.remove('error', 'warning');
        this.options.notifier.classList.add('success');
        this.options.notifier.style.display = "block";
        this.options.spinner.style.display = "none";
    }

    off() {
        this.options.notifierText.innerText = this.options.offlineText;
        this.options.notifier.classList.remove('success', 'warning');
        this.options.notifier.classList.add('error');
        this.options.notifier.style.display = "block";
        this.options.spinner.style.display = "none";
    }

    reconnect() {
        this.options.notifierText.innerText = this.options.reconnectText;
        this.options.notifier.classList.remove('error', 'success');
        this.options.notifier.classList.add('warning');
        this.options.notifier.style.display = "block";
        this.options.spinner.style.display = "block";
    }
}

(function () {
    new Connection();
})();
```

<a href="https://codepen.io/zeeshanu/pen/zpLMxo">See demo on CodePen</a>