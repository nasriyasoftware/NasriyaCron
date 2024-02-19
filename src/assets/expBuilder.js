const Docs = require('./docs');
const { validate, Months, WeekDays } = require('../helpers');

/**
 * Cron Expression Builder
 */
class CronExpBuilder {
    /**
     * The type that will be used to generate the expression
     * @type {'Unix'|'Quartz'}
     */
    #expressionType = 'Unix';

    #recurrance = {
        year: {
            /**@type {'any'|'specific'|'every'|'between'} */
            type: 'any',
            between: { start: 0, end: 83 },
            every: { num: 1, start: 0 },
            specific: [0],
        },
        month: {
            /**@type {'any'|'specific'|'every'|'between'} */
            type: 'any',
            every: { num: 1, start: 1 },
            specific: [1, 2],
            between: { start: 1, end: 12 },
        },
        day: {
            /**
             * `any` means every day
             * @type {'any'|'weekDay'|'monthDay'}
            */
            type: 'any',
            weekDay: {
                /**@type {'every'|'specific'|'last'} */
                type: null,
                /**Every `n` day(s) starting on `nDay` day.
                 * 
                 * Example: Every `2` days starting from `Friday`.*/
                every: { n: 1, nDay: 1 },
                /**Specific day of the week (choose one or many).  */
                specific: ['SAT'],
                /**On the last weekday(Thursday/`5`) of the month */
                last: 1,
            },
            monthDay: {
                /**@type {'every'|'specific'|'lastDay'|'lastWeekday'|'lastNumOfDays'|'nearestWeekdayOf'|'onTheNthSpecificWeekday'} */
                type: null,
                /**Every `n` day(s) starting on the `nth` of the month */
                every: { n: 1, nth: 1 },
                /**Specific day of month (choose one or many) from 1-31 */
                specific: [1, 2],
                /**On the last day of the month */
                lastDay: false,
                /**On the last weekday of the month */
                lastWeekday: false,
                /**On the last `n` number of days day(s) before the end of the month */
                lastNumOfDays: 0,
                /**Nearest weekday (Monday to Friday) to the `nth` of the month */
                nearestWeekdayOf: 0,
                /**On the `nth` `weekDay` of the month. Max. `nth = 5` */
                onTheNthSpecificWeekday: { weekDay: 1, nth: 1 }
            }
        },
        hours: {
            /**
             * `any` means Every hour 
             * @type {'any'|'every'|'specific'|'between'}
            */
            type: 'any',
            /**Every `num` hour(s) starting at `hr` hour. | `num` from 1-24, 'hr` from 0-23 */
            every: { num: 1, hr: 1 },
            /**Specific hour (choose one or many). From 0-23 */
            specific: [0],
            /**Every hour between hour `start` and hour `end */
            between: { start: 0, end: 23 }
        },
        minutes: {
            /**
             * `any` means Every minute 
             *  @type {'any'|'every'|'specific'|'between'}
             * */
            type: 'any',
            /**Every `num` minute(s) starting at `min` minute. | `num` from 1-60, 'min` from 0-59 */
            every: { num: 1, min: 1 },
            /**Specific minute(s) (choose one or many). From 0-59 */
            specific: [0],
            /**Every hour between minute `start` and minute `end */
            between: { start: 0, end: 59 }
        },
        seconds: {
            /**
             * `any` means Every seconds 
             *  @type {'any'|'every'|'specific'|'between'}
             * */
            type: 'any',
            /**Every `num` seconds(s) starting at `sec` seconds. | `num` from 1-60, 'min` from 0-59 */
            every: { num: 1, sec: 1 },
            /**Specific seconds(s) (choose one or many). From 0-59 */
            specific: [0],
            /**Every hour between seconds `start` and seconds `end */
            between: { start: 0, end: 59 }
        }
    }

    get expression() {
        let year, month, monthDay, weekDay, hours, minutes, seconds;
        switch (this.#recurrance.year.type) {
            case 'between':
                year = `${this.#recurrance.year.between.start}-${this.#recurrance.year.between.end}`;
                break;
            case 'specific':
                year = this.#recurrance.year.specific.join(',');
                break;
            case 'every':
                year = `${this.#recurrance.year.every.start}/${this.#recurrance.year.every.num}`;
                break;
            default:
                year = '*';
        }

        switch (this.#recurrance.month.type) {
            case 'every':
                if (this.#expressionType === 'Unix') {
                    month = this.#recurrance.month.num;
                } else {
                    month = `${this.#recurrance.month.start}/${this.#recurrance.month.num}`;
                }
                break;
            case 'specific':
                month = this.#recurrance.month.specific.join(',');
                break;
            case 'between':
                month = `${this.#recurrance.month.between.start}-${this.#recurrance.month.between.end}`;
                break;
            default:
                month = '*'
        }

        if (this.#recurrance.day.type === 'any') {
            weekDay = '*';
            monthDay = '?';
        } else {
            if (this.#recurrance.day.type === 'weekDay') {
                monthDay = '?';
                switch (this.#recurrance.day.weekDay.type) {
                    case 'every':
                        weekDay = `${this.#recurrance.day.weekDay.every.nDay}/${this.#recurrance.day.weekDay.every.n}`;
                        break;
                    case 'specific':
                        weekDay = this.#recurrance.day.weekDay.specific.join(',');
                        break;
                    case 'last':
                        weekDay = `${this.#recurrance.day.weekDay.last}L`;
                        break;
                    case 'onNthWeekDay':
                        weekDay = `${this.#recurrance.day.weekDay.onNthweekDay.weekDay}#${this.#recurrance.day.weekDay.onNthweekDay.nth}`;
                        break;
                    default:
                        weekDay = '*';
                        break;
                }
            }

            if (this.#recurrance.day.type === 'monthDay') {
                weekDay = '?';
                switch (this.#recurrance.day.monthDay.type) {
                    case 'every':
                        monthDay = `${this.#recurrance.day.monthDay.every.nth}/${this.#recurrance.day.monthDay.every.n}`;
                        break;
                    case 'specific':
                        monthDay = this.#recurrance.day.monthDay.specific.join(',');
                        break;
                    case 'lastDay':
                        monthDay = 'L';
                        break;
                    case 'lastWeekday':
                        monthDay = 'LW';
                        break;
                    case 'lastNumOfDays':
                        monthDay = `L-${this.#recurrance.day.monthDay.lastNumOfDays}`;
                        break;
                    case 'nearestWeekdayOf':
                        monthDay = `${this.#recurrance.day.monthDay.nearestWeekdayOf}W`;
                        break;
                    default:
                        monthDay = '?'
                        break;
                }
            }
        }

        switch (this.#recurrance.hours.type) {
            case 'every':
                hours = `${this.#recurrance.hours.every.hr}/${this.#recurrance.hours.every.num}`;
                break;
            case 'specific':
                hours = this.#recurrance.hours.specific.join(',');
                break;
            case 'between':
                hours = `${this.#recurrance.hours.between.start}-${this.#recurrance.hours.between.end}`;
                break;
            default:
                hours = '*';
                break;
        }

        switch (this.#recurrance.minutes.type) {
            case 'every':
                minutes = `${this.#recurrance.minutes.every.min || '*'}/${this.#recurrance.minutes.every.num}`;
                break;
            case 'specific':
                minutes = this.#recurrance.minutes.specific.join(',');
                break;
            case 'between':
                minutes = `${this.#recurrance.minutes.between.start}-${this.#recurrance.minutes.between.end}`;
                break;
            default:
                minutes = '*';
                break;
        }

        switch (this.#recurrance.seconds.type) {
            case 'every':
                seconds = `${this.#recurrance.seconds.every.sec || '*'}/${this.#recurrance.seconds.every.num}`;
                break;
            case 'specific':
                seconds = this.#recurrance.seconds.specific.join(',');
                break;
            case 'between':
                seconds = `${this.#recurrance.seconds.between.start}-${this.#recurrance.seconds.between.end}`;
                break;
            default:
                seconds = '*';
                break;
        }

        console.log({
            year, month, monthDay, weekDay, hours, minutes, seconds
        })
        let exp = `${hours} ${monthDay} ${month} ${weekDay}`;
        if (seconds !== '*') { exp = `${seconds} ${exp}` }
        if (minutes !== '*') { exp = `${minutes} ${exp}` }

        if (this.#expressionType === 'Unix') {
            return exp.replace('?', '*')
        } else {
            return year !== '*' ? `${exp} ${year}` : exp;
        }
    }

    get every() {
        return Object.freeze({
            second: () => {
                this.#recurrance.year.type = 'any';
                this.#recurrance.month.type = 'any';
                this.#recurrance.day.type = 'any';
                this.#recurrance.hours.type = 'any';
                this.#recurrance.minutes.type = 'any';
                this.#recurrance.seconds.type = 'any';
                return this;
            },
            /**@param {Docs.Minute60} min Every `x` minutes */
            minute: (min) => {
                this.#recurrance.year.type = 'any';
                this.#recurrance.month.type = 'any';
                this.#recurrance.day.type = 'any';
                this.#recurrance.hours.type = 'any';
                this.#recurrance.seconds.type = 'specific';

                if (typeof min === 'number' && min > 1) {
                    this.#recurrance.minutes.type = 'every';
                    this.#recurrance.minutes.every.num = min;
                    this.#recurrance.minutes.every.min = 0;
                } else {
                    this.#recurrance.minutes.type = 'any';
                    this.#recurrance.seconds.specific = [0];
                }                
                
                return this;
            }
        })
    }

    /**
     * Use the `year` APIs to set the job to run in annual-related times
     * @deprecated Feel free to use the `year` APIs to generate `quartz-cron`
     * expressions, but keep in mind that `node-cron` does not support years
     * in its expressions, and an error will be thrown if you use `CronJobManager.schedule()`
     * with an expression that defines years.
     * @requires quartz-cron
     */
    get year() {
        return Object.freeze({
            /**
             * Set the job to run in any year
             * @returns {this}
            */
            any: () => {
                this.#recurrance.year.type = 'any';
                return this;
            },
            /**
             * Set the job to run from year `x` to year `y`.
             * @example
             * // Run every year from 2024 until 2030
             * expBuilder.year.between(2024).and(2030);
             * @param {number} start The starting year
             */
            between: (start) => {
                validate.year.between.start(start);
                return Object.freeze({
                    /**@param {number} end The ending year */
                    and: (end) => {
                        validate.year.between.end(end, start);
                        this.#recurrance.year.type = 'between';
                        this.#recurrance.year.between.start = start;
                        this.#recurrance.year.between.end = end;
                        return this;
                    }
                })
            },
            /**
             * Set the job to run in specific year(s).
             * @example
             * // Run in 2030
             * expBuilder.year.specific(2030);
             * @example
             * // Run in 2025 and 2026
             * expBuilder.year.specific([2025, 2026])
             * @param {number|number[]} years The year(s) you want the job to run on
             * @returns {this}
             */
            specific: (years) => {
                validate.year.specific(years);
                if (typeof years === 'number') { years = [years] }
                this.#recurrance.year.type = 'specific';
                this.#recurrance.year.specific = [...new Set(years)];
                return this;
            },
            /**
             * Set the job to run `every(x)` years starting from a particular year.
             * @example
             * // Run every 2 years starting in 2025
             *  expBuilder.year.every(2).startingIn(2025)
             * @param {number} num The number of years this job will run on
             */
            every: (num) => {
                if (typeof num !== 'number') { throw new TypeError(`The number of years (num) in the expBuilder.year.every(num) should be a number, instead got ${typeof num}`) }
                if (num < 1) { throw new RangeError(`The number of years (num) in the expBuilder.year.every(num) should be bigger than 1. You passed ${num}`) }
                return Object.freeze({
                    /**@param {number} year The year you want your job to start in */
                    startingIn: (year) => {
                        if (typeof year !== 'number') { throw new TypeError(`The starting year in expBuilder.year.every(${num}).startingIn(year) should be a number, instead got ${typeof year}`) }
                        const currentYear = new Date().getFullYear();
                        if (year < currentYear) { throw new RangeError(`The starting year in expBuilder.year.every(${num}).startingIn(${year}) cannot be in the past.`) }

                        this.#recurrance.year.type = 'every';
                        this.#recurrance.year.every.num = num;
                        this.#recurrance.year.every.start = year;
                        return this;
                    }
                })
            }
        })
    }

    /**Use the `month` APIs to set the job to run in monthly-related times */
    get month() {
        return Object.freeze({
            /**
             * Set the job to run on any month
             * @returns {this}
             */
            any: () => {
                this.#recurrance.month.type = 'any';
                return this;
            },
            /**
             * Set the job to run every month from month `x` to month `y`.
             * @example
             * // Run every month from 'Jan' to 'June'
             * expBuilder.month.between('jan').and('june');
             * @example
             * // Run from sep to nov
             * expBuilder.month.between(9).and(11);
             * @param {number} start The starting month
             */
            between: (start) => {
                validate.month.between.start(start);
                return Object.freeze({
                    /**@param {string|number} end The ending month*/
                    and: (end) => {
                        validate.month.between.end(end, start);
                        this.#recurrance.month.type = 'between';
                        this.#recurrance.month.between.start = Months.indexOf(start);
                        this.#recurrance.month.between.end = Months.indexOf(end);
                        return this;
                    }
                })
            },
            /**
             * Set the job to run in specific months(s).
             * @example
             * // Run in January and February
             * expBuilder.month.specific([1, 'feb']);
             * @param {number|number[], string|string[]} years The months(s) you want the job to run on
             * @returns {this}
             */
            specific: (months) => {
                validate.month.specific(months);
                if (typeof months === 'number' || typeof months === 'string') { months = [months] }
                this.#recurrance.month.type = 'specific';
                const finalMonths = [...new Set(months)];
                this.#recurrance.month.specific = finalMonths.map(month => Months.abbrvOf(month, 'upperCase'));
                return this;
            },
            /**
             * Set the job to run `every(x)` month starting from a particular month
             * @example
             * // Run every 3 months starting from April
             * expBuilder.month.every(3).startingIn('April');
             * @param {number} num The number of months this code will run at
             */
            every: (num) => {
                if (typeof num !== 'number') { throw new TypeError(`The number of months (num) in the expBuilder.month.every(num) should be a number, instead got ${typeof num}`) }
                if (num < 1 || num > 12) { throw new RangeError(`The number of months (num) in the expBuilder.month.every(num) should be between 1 and 12. You passed ${num}`) }
                return Object.freeze({
                    /**@param {MonthAll} month */
                    startingIn: (month) => {
                        Months.validate(month);
                        this.#recurrance.month.type = 'every';
                        this.#recurrance.month.every.num = num;
                        this.#recurrance.month.every.start = Months.indexOf(month);
                        return this;
                    }
                })
            }
        })
    }

    /**Use the `day` APIs to set the job to run on monthly or weekly days. */
    get day() {
        return Object.freeze({
            /**
             * Set the job to run `every(x)` days starting from a particular weekday or monthday
             * @example
             * // Run every 6 days starting at the 7th of each month
             * expBuilder.day.every(2).startingOnMonthday(7);
             * @example
             * // Run every 2 days starting on Monday
             * expBuilder.day.every(2).startingOnWeekday('Mon');
             * // OR
             * expBuilder.day.every(2).startingOnWeekday('Monday');
             * // OR
             * expBuilder.day.every(2).startingOnWeekday(2);
             * @param {monthDay|Docs.WeekdayIndex} num The number of days this will run on
             * @returns {Readonly<{startingOnWeekday?: (day: Docs.WeekdayAll) => CronExpBuilder; startingOnMonthday: (monthDay: Docs.MonthDay) => CronExpBuilder;}>}}
             */
            every: (num) => {
                if (typeof num !== 'number') { throw new TypeError(`The number of days (num) in the expBuilder.day.every(num) should be a number, instead got ${typeof num}`) }
                if (num < 1 || num > 31) { throw new RangeError(`The number of days (num) in the expBuilder.day.every(num) should be between 1 and 31. You passed ${num}`) }

                /**
                 * Choose which day the job will start on.
                 * 
                 * **Note:** This method will be undefined if the chosen number is more than 7
                 * @example
                 * // Run every 3 weekdays starting on Sunday
                 * expBuilder.day.every(3).startingOnWeekday(1);
                 * // OR
                 * expBuilder.day.every(3).startingOnWeekday('Sun');
                 * // OR
                 * expBuilder.day.every(3).startingOnWeekday('Sunday');
                 * @param {Docs.WeekdayAll} day The day the job will start on
                 */
                const startingOnWeekday = (day) => {
                    validate.day.weekDay.specific(day);
                    this.#recurrance.day.type = 'weekDay';
                    this.#recurrance.day.weekDay.type = 'every';
                    this.#recurrance.day.weekDay.every.n = num;
                    this.#recurrance.day.weekDay.every.nDay = WeekDays.indexOf(day);
                    return this;
                }

                const obj = {
                    /**
                     * Choose which day the job will start on.
                     * @example
                     * // Run every 5 days starting on 3rd of the month
                     * expBuilder.day.every(5).startingOnMonthday(3);
                     * @param {Docs.MonthDay} monthDay 
                     */
                    startingOnMonthday: (monthDay) => {
                        validate.day.monthDay.specific(monthDay);
                        this.#recurrance.day.type = 'monthDay';
                        this.#recurrance.day.monthDay.type = 'every';
                        this.#recurrance.day.monthDay.every.n = num;
                        this.#recurrance.day.monthDay.every.nth = monthDay;
                        return this;
                    }
                }

                if (num <= 7) {
                    obj.startingOnWeekday = startingOnWeekday
                }

                return Object.freeze(obj);
            },
            /**Run the jon at specific weekday or month day */
            specific: {
                /**
                 * Set the job to run at specific weekdays
                 * @example
                 * // Run every Wednesday
                 * expBuilder.day.specific.weekDays('Wednesday');
                 * @example
                 * // Run every Sunday, Tuesday, and Friday
                 * expBuilder.day.specific.weekDays(['Sun', 'Tuesday', 6]);
                 * @param {Docs.WeekdayAll|Docs.WeekdayAll[]} days The day(s) you want the job to run on
                 */
                weekDays: (days) => {
                    validate.day.weekDay.specific(days);
                    this.#recurrance.day.type = 'weekDay';
                    this.#recurrance.day.weekDay.type = 'specific';
                    this.#recurrance.day.weekDay.specific = [...new Set(days.map(i => WeekDays.abbrvOf(i)))]
                    return this;
                },
                /**
                 * Set the job to run at specific month days
                 * @example
                 * // Run every 10th, 17th, and 31st of each month
                 * expBuilder.day.specific.monthDays([10, 17, 31]);
                 * @example
                 * // Run every 2nd of each month
                 * expBuilder.day.specific.monthDays(2);
                 * @param {Docs.MonthDay|Docs.MonthDay[]} days The day(s) you want the job to run on
                 */
                monthDays: (days) => {
                    validate.day.monthDay.specific(days);
                    this.#recurrance.day.type = 'monthDay';
                    this.#recurrance.day.monthDay.type = 'specific';
                    this.#recurrance.day.monthDay.specific = [...new Set(days)];
                    return this;
                }
            },
            /**
             * Runds on the last weekday of each month
             * @example
             * // Run on the last Friday of the month
             * expBuilder.day.lastSpecificWeekday('Friday');
             * // OR
             * expBuilder.day.lastSpecificWeekday(6);
             * @param {Docs.WeekdayAll} weekday The weekday to run on
             */
            lastSpecificWeekday: (weekday) => {
                validate.day.weekDay.last(weekday);
                this.#recurrance.day.type = 'weekDay';
                this.#recurrance.day.weekDay.type = 'last';
                this.#recurrance.day.weekDay.last = WeekDays.indexOf(weekday);
                return this;
            },
            /**
             * Set the job to run on the `num` day(s) before the end of the month
             * @example
             * // Run the job every day of the last 3 days of the month
             * expBuilder.day.lastNumOfDays(3);
             * 
             * // If the above example is used in a particular monthIn, e.g. February,
             * // this will run on 26th, 27th, and 28th
             * @param {Docs.MonthDay} num The last number of days to run on
             */
            lastNumOfDays: (num) => {
                Months.validateMonthDay(num);
                this.#recurrance.day.type = 'monthDay';
                this.#recurrance.day.monthDay.type = 'lastNumOfDays';
                this.#recurrance.day.monthDay.lastNumOfDays = num;
            },
            /**
             * Set the job to run on the last day of the month
             * @example
             * expBuilder.day.lastDay();
             */
            lastDay: () => {
                this.#recurrance.day.type = 'monthDay';
                this.#recurrance.day.monthDay.type = 'lastDay';
                this.#recurrance.day.monthDay.lastDay = true;
                return this;
            },
            /**
             * Set the job to run on the last weekday of the month.
             * 
             * **Example**:
             * 
             * If the month (February) ends on Saturday, using the below code will
             * make it run on Friday, since weekdays are from (Mon-Fri).
             * @example
             * expBuilder.day.lastWeekday();
             */
            lastWeekday: () => {
                this.#recurrance.day.type = 'monthDay';
                this.#recurrance.day.monthDay.type = 'lastWeekday';
                this.#recurrance.day.monthDay.lastWeekday = true;
                return this;
            },
            /**
             * Run the job on the nearest weekday (Monday to Friday) to the `nth` day of the month
             * @example
             * // Run the job on the nearest weekday to the 1st of the month
             * expBuilder.day.nearestWeekdayOf(1);
             * @param {Docs.MonthDay} nth a `Docs.MonthDay` value. From `1`-`31`.
             */
            nearestWeekdayOf: (nth) => {
                Months.validateMonthDay(nth);
                this.#recurrance.day.type = 'monthDay';
                this.#recurrance.day.monthDay.type = 'nearestWeekdayOf';
                this.#recurrance.day.monthDay.nearestWeekdayOf = nth;
                return this;
            },
            /**
             * On the `nth` `weekDay` of the month. Max. `nth = 5`;
             * @example
             * // Run on the 2nd Tuesday of a given month
             * expBuilder.day.onTheNthSpecificWeekday(2, 'Tue');
             * @param {1|2|3|4|5} nth The 1st, 2nd, 3rd, 4th, and 5th weekday
             * @param {2|3|4|5|6|'Mon'|'Tue'|'Wed'|'Thu'|'Fri'|'Monday'|'Tuesday'|'Wednesday'|'Thursday'|'Friday'} weekDay A non-weekend day (Mon-Fri)
             */
            onTheNthSpecificWeekday: (nth, weekDay) => {
                if (typeof nth !== 'number') { throw new TypeError(`The "nth" argument in onTheNthSpecificWeekday is expected to be a number, instead, it got ${typeof nth}`) }
                if (nth < 1 || nth > 5) { throw new RangeError(`The "nth" argument in onTheNthSpecificWeekday is expected to be a number between 1 and 5, you passed ${nth}`) }

                WeekDays.validate(weekDay);
                const index = WeekDays.indexOf(weekDay);

                if (!(index >= 2 && index <= 2)) {
                    const abbrv = WeekDays.abbrvOf(weekDay, 'original');
                    throw new RangeError(`The "weekday" parameter in onTheNthSpecificWeekday is expecting a weekday from (Mon-Fri)/(2-6), but instead got ${weekDay} (${abbrv})`)
                }

                this.#recurrance.day.type = 'monthDay';
                this.#recurrance.day.monthDay.type = 'onTheNthSpecificWeekday';
                this.#recurrance.day.monthDay.onTheNthSpecificWeekday.nth = nth;
                this.#recurrance.day.monthDay.onTheNthSpecificWeekday.weekDay = index;
                return this;
            }
        })
    }

    /**Use the `hours` APIs to set the job to run on an hourly basis. */
    get hours() {
        return Object.freeze({
            /**
             * Set the job to run on any (every) hour
             * @returns {this}
             */
            any: () => {
                this.#recurrance.hours.type = 'any';
                return this;
            },
            /**
             * Set the job to run from hour `x` until hour `y`.
             * @example
             * // Run every hour from 8am until 3pm.
             * expBuilder.hours.between(8).and(15);
             * @example
             * // Run every hour from 6pm until 11pm.
             * expBuilder.hours.between(18).and(23);
             * @param {Hour} start The starting hour. From `0` to `23`
             */
            between: (start) => {
                validate.hours.between.start(start);
                return Object.freeze({
                    /**@param {Hour} end The ending hour */
                    and: (end) => {
                        validate.hours.between.end(end, start);
                        this.#recurrance.hours.type = 'between';
                        this.#recurrance.hours.between.start = start;
                        this.#recurrance.hours.between.end = end;
                        return this;
                    }
                })
            },
            /**
             * Run the job on specific hour(s) in a day.
             * @example
             * // Run on midnight (12 AM);
             * expBuilder.hours.specific(12);
             * @example
             * // Run on 8AM and 3PM
             * expBuilder.hours.specific([8, 15]);
             * @param {Hour|Hour[]} hours The specific hour(s) you want the job to run on
             */
            specific: (hours) => {
                validate.hours.specific(hours);
                if (typeof hours === 'number') { hours = [hours] }
                this.#recurrance.hours.type = 'specific';
                this.#recurrance.hours.specific = [...new Set(hours)];
                return this;
            },
            /**
             * Set the job to run `every(num)` of hours.
             * @example
             * // Run every 6 hours starting at midnight
             * expBuilder.hours.every(6).startingAt(0);
             * @example
             * // Run every hour starting from 8am
             * expBuilder.hours.every(1).startingAt(8);
             * @param {Hour24} num The number of hours to run on. From `1` to `24`
             */
            every: (num) => {
                if (typeof num !== 'number') { throw new TypeError(`The expBuilder.hours.every(num) expects a number as the "num" argument, but instead got ${typeof num}`) }
                if (num < 1 || num > 24) { throw new RangeError(`The expBuilder.hours.every(num) expects a number of hours between 1 and 24, but instead got ${num}`) }
                return Object.freeze({
                    /**@param {Hour} hour The starting hour */
                    startingAt: (hour) => {
                        validate.hours.specific(hour);
                        this.#recurrance.hours.type = 'every';
                        this.#recurrance.hours.every.num = num;
                        this.#recurrance.hours.every.hr = hour;
                        return this;
                    }
                })
            }
        })
    }

    /**Use the `minutes` APIs to set the job to run on an minutes basis. */
    get minutes() {
        return Object.freeze({
            /**
             * Set the job to run on any (every) minute
             * @returns {this}
             */
            any: () => {
                this.#recurrance.minutes.type = 'any';
                return this;
            },
            /**
             * Set the job to run from minute `x` until minute `y`.
             * @example
             * // Run every minute from 30 until 59.
             * expBuilder.minutes.between(30).and(59);
             * @param {Docs.Minute} start The starting minute. From `0` to `59`
             */
            between: (start) => {
                validate.minutes.between.start(start);
                return Object.freeze({
                    /**@param {Docs.Minute} end The ending minute */
                    and: (end) => {
                        validate.minutes.between.end(end, start);
                        this.#recurrance.minutes.type = 'between';
                        this.#recurrance.minutes.between.start = start;
                        this.#recurrance.minutes.between.end = end;
                        return this;
                    }
                })
            },
            /**
             * Run the job on specific minute(s).
             * @example
             * // Run on first and last minutes;
             * expBuilder.minutes.specific([1, 59]);
             * @example
             * // Run on the minute 30
             * expBuilder.minutes.specific(30);
             * @param {Docs.Minute|Docs.Minute[]} minutes The specific minute(s) you want the job to run on
             */
            specific: (minutes) => {
                validate.minutes.specific(minutes);
                if (typeof minutes === 'number') { minutes = [minutes] }
                this.#recurrance.minutes.type = 'specific';
                this.#recurrance.minutes.specific = [...new Set(minutes)];
                return this;
            },
            /**
             * Set the job to run `every(num)` of minutes.
             * @example
             * // Run every 6 minutes starting at minute 5
             * expBuilder.hours.every(6).startingAtMinute(5);
             * @param {Docs.Minute60} num The number of hours to run on. From `1` to `24`
             */
            every: (num) => {
                if (typeof num !== 'number') { throw new TypeError(`The expBuilder.minutes.every(num) expects a number as the "num" argument, but instead got ${typeof num}`) }
                if (num < 1 || num > 60) { throw new RangeError(`The expBuilder.minutes.every(num) expects a number of hours between 1 and 60, but instead got ${num}`) }
                return Object.freeze({
                    /**@param {Docs.Minute} minute The starting minute */
                    startingAtMinute: (minute) => {
                        validate.minutes.specific(minute);
                        this.#recurrance.minutes.type = 'every';
                        this.#recurrance.minutes.every.num = num;
                        this.#recurrance.minutes.every.min = minute;
                        return this;
                    }
                })
            }
        })
    }

    /**Use the `seconds` APIs to set the job to run on an seconds basis. */
    get seconds() {
        return Object.freeze({
            /**
             * Set the job to run on any (every) second
             * @returns {this}
             */
            any: () => {
                this.#recurrance.seconds.type = 'any';
                return this;
            },
            /**
             * Set the job to run from second `x` until second `y`.
             * @example
             * // Run every second from 30 until 59.
             * expBuilder.seconds.between(30).and(59);
             * @param {Docs.Second} start The starting second. From `0` to `59`
             */
            between: (start) => {
                validate.seconds.between.start(start);
                return Object.freeze({
                    /**@param {Docs.Second} end The ending second */
                    and: (end) => {
                        validate.seconds.between.end(end, start);
                        this.#recurrance.seconds.type = 'between';
                        this.#recurrance.seconds.between.start = start;
                        this.#recurrance.seconds.between.end = end;
                        return this;
                    }
                })
            },
            /**
             * Run the job on specific second(s).
             * @example
             * // Run on first and last seconds;
             * expBuilder.seconds.specific([1, 59]);
             * @example
             * // Run on the second 30
             * expBuilder.seconds.specific(30);
             * @param {Docs.Second|Docs.Second[]} seconds The specific second(s) you want the job to run on
             */
            specific: (seconds) => {
                validate.seconds.specific(seconds);
                if (typeof seconds === 'number') { seconds = [seconds] }
                this.#recurrance.seconds.type = 'specific';
                this.#recurrance.seconds.specific = [...new Set(seconds)];
                return this;
            },
            /**
             * Set the job to run `every(num)` of seconds.
             * @example
             * // Run every 6 seconds starting at second 5
             * expBuilder.seconds.every(6).startingAtSecond(5);
             * @param {Docs.Second60} num The number of seconds to run on. From `1` to `60`
             */
            every: (num) => {
                if (typeof num !== 'number') { throw new TypeError(`The expBuilder.seconds.every(num) expects a number as the "num" argument, but instead got ${typeof num}`) }
                if (num < 1 || num > 60) { throw new RangeError(`The expBuilder.seconds.every(num) expects a number of hours between 1 and 60, but instead got ${num}`) }
                return Object.freeze({
                    /**@param {Docs.Second} second The starting second */
                    startingAtSecond: (second) => {
                        validate.seconds.specific(second);
                        this.#recurrance.seconds.type = 'every';
                        this.#recurrance.seconds.every.num = num;
                        this.#recurrance.seconds.every.sec = second;
                        return this;
                    }
                })
            }
        })
    }
}

module.exports = CronExpBuilder;