[![N|Solid](https://static.wixstatic.com/media/72ffe6_da8d2142d49c42b29c96ba80c8a91a6c~mv2.png)](https://nasriya.net)
# NasriyaCron.
[![Static Badge](https://img.shields.io/badge/license-Free_(Restricted)-blue)](https://github.com/nasriyasoftware/NasriyaCron?tab=License-1-ov-file) ![Repository Size](https://img.shields.io/github/repo-size/nasriyasoftware/NasriyaCron.svg) ![Last Commit](https://img.shields.io/github/last-commit/nasriyasoftware/NasriyaCron.svg) [![Status](https://img.shields.io/badge/Status-Stable-green.svg)](link-to-your-status-page)
##### Visit us at [www.nasriya.net](https://nasriya.net).

Easily generate cron-expressions, schedule periodic cron jobs as well as time specific tasks.

Made with ❤️ in **Palestine** 🇵🇸

> [!IMPORTANT]
> 🌟 **Support Our Open-Source Development!** 🌟
> We need your support to keep our projects going! If you find our > work valuable, please consider contributing. Your support helps us > continue to develop and maintain these tools.
> 
> **[Click here to support us!](https://fund.nasriya.net/)**
> 
> Every contribution, big or small, makes a difference. Thank you for > your generosity and support!
___
You can schedule [cron jobs](https://en.wikipedia.org/wiki/Cron) to run periodically or at specific times.

**Notes:**
- **NasriyaCron** is part of [HyperCloud](https://www.npmjs.com/package/@nasriya/HyperCloud)'s HTTP2 server framework.
___
## Quick Start Guide

### Installation
```shell
npm i @nasriya/cron
```

### Importing
To use the cron scheduler, you must first import the cron-manager instance:
Import in **ES6** modules:
```ts
import cronManager from '@nasriya/cron';
```

Import in **CommonJS (CJS)**
```js
const cronManager = require('@nasriya/cron').default;
```

## Usage
###### Generate Time Expressions
Use the `time` module on the cron manager to easily generate cron-expressions.

```ts
// Runs every 5 minutes
const expression1: string = cronManager.time.every(5).minutes();

// Runs every Monday and Tuesday
const expression2: string = cronManager.time.onSpecificDays(['Tue', 2]);
```

###### Schedule a Periodic Task
To schedule tasks using a cron-expression, use the `schedule` method:

```ts
const task: ScheduledTask = cronManager.schedule('* * * * *', () => {
    console.log('A cron-job is running...');
}, {
    name: 'test_task',          // (Optional) The name of the task
    timezone: 'Asia/Jerusalem', // (Optional) The timezone the task will run at
    runOnInit: false            // (Optional) Set to "true" to run immediately
})
```

The `schedule` method returns a `ScheduledTask` type:
```ts
interface ScheduledTask {
    name: string;
    start: () => void;
    stop: () => void;
}
```

###### Schedule a One-Time Task
To schedule one-time tasks use the `scheduleTime` method. The method takes two arguments:
1. `time`: A timestamp `number`, an [ISO date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString), or a `Date` instance.
2. `task`: a `function`.
```ts
// Schedule a task to run after 10 minutes from now:
const tenMins = 10 * 60 * 1000;
const task: ScheduledTimedTask = cronManager.scheduleTime(Date.now() + tenMins, () => {
    console.log('Ten minutes has elapsed since the task was first scheduled')
})
```

The `scheduleTime` method returns a `ScheduledTimedTask` type:
```ts
interface ScheduledTimedTask {
    name: string;
    cancel: () => void;
    invoke: () => void;
}
```
___
## License
Please read the license from [here](https://github.com/nasriyasoftware/NasriyaCron?tab=License-1-ov-file).