[![N|Solid](https://static.wixstatic.com/media/72ffe6_da8d2142d49c42b29c96ba80c8a91a6c~mv2.png)](https://nasriya.net)

# NasriyaCron.
[![NPM License](https://img.shields.io/npm/l/%40nasriya%2Fcron?color=lightgreen)](https://github.com/nasriyasoftware/NasriyaCron?tab=License-1-ov-file) ![NPM Version](https://img.shields.io/npm/v/%40nasriya%2Fcron) ![NPM Unpacked Size](https://img.shields.io/npm/unpacked-size/%40nasriya%2Fcron) ![Last Commit](https://img.shields.io/github/last-commit/nasriyasoftware/NasriyaCron.svg) [![Status](https://img.shields.io/badge/Status-Stable-lightgreen.svg)](link-to-your-status-page)

##### Visit us at [www.nasriya.net](https://nasriya.net).

Made with ❤️ in **Palestine** 🇵🇸
___
#### Overview
NasriyaCron is a fast, reliable, and efficient file system watcher built with TypeScript. It supports flexible filtering using globs and regexes, making it ideal for scalable, cross-platform file monitoring with minimal resource usage.

> [!IMPORTANT]
> 
> 🌟 **Support Our Open-Source Development!** 🌟
> We need your support to keep our projects going! If you find our work valuable, please consider contributing. Your support helps us continue to develop and maintain these tools.
> 
> **[Click here to support us!](https://fund.nasriya.net/)**
> 
> Every contribution, big or small, makes a difference. Thank you for your generosity and support!
___
### Installation
```shell
npm i @nasriya/cron
```

### Importing
Import in **ES6** module
```ts
import cron from '@nasriya/cron';
```

Import in **CommonJS (CJS)**
```js
const cron = require('@nasriya/cron').default;
```
___

## Usage
###### Generate Time Expressions
Use the `time` module on the cron manager to easily generate cron-expressions.

```ts
// Runs every 5 minutes
const expression1: string = cron.time.every(5).minutes();

// Runs every Monday and Tuesday
const expression2: string = cron.time.onSpecificDays(['Tue', 2]);
```

###### Schedule a Periodic Task
To schedule tasks using a cron-expression, use the `schedule` method:

```ts
const task: ScheduledTask = cron.schedule('* * * * *', () => {
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
const task: ScheduledTimedTask = cron.scheduleTime(Date.now() + tenMins, () => {
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
This software is licensed under the **Nasriya Open License (NOL)**, version 1.0.
Please read the license from [here](https://github.com/nasriyasoftware/NasriyaCron?tab=License-1-ov-file).