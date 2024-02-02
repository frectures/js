![](../img/douglas.jpg)

> **Douglas Crockford:** `class` was the most requested new feature in JavaScript.
> All of the requests came from Java programmers who have to program in JavaScript and don't want to have to learn how to do that.
> They wanted something that looks like Java so that they could be more comfortable.
>
> [Nordic.js 2014 • Douglas Crockford - The Better Parts](https://www.youtube.com/watch?v=PSGEjv3Tqo0&t=315)

- Established JavaScript OOP is quite complex:

```js
class Account {
    constructor(balance, id) {
        this.balance = balance;
        this.id = id;
    }

    deposit(amount) {
        this.balance += amount;
    }

    getBalance() {
        return this.balance;
    }
}

const account = new Account(1000, 42);  // Account { balance: 1000, id: 42 }

account.__proto__ === Account.prototype // true

account.balance = 100000000;            // Account { balance: 100000000, id: 42 }
```

- Douglas Crockford promotes much simpler OOP:

```js
function createAccount(balance, id) {
    // 1995
    return { deposit: deposit, getBalance: getBalance };

    // 2009
    return Object.freeze({ deposit: deposit, getBalance: getBalance });

    // 2015
    return Object.freeze({ deposit, getBalance });

    function deposit(amount) {
        balance += amount;
    }

    function getBalance() {
        return balance;
    }
}

const account = createAccount(1000, 42); // { deposit: [Function: deposit], getBalance: [Function: getBalance] }

account.__proto__ === Object.prototype   // true

account.balance                          // undefined
account.balance = 100000000;
account.balance                          // undefined
account.getBalance()                     // 1234
```

- Encapsulation 😀
- Frozen interface 😀
- Increased footprint 😐
- Looks unfamiliar 🤨
