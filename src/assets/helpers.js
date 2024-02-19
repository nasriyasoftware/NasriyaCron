

class WeekDays {
    static #data = [
        { index: 1, abbrv: 'Sun', full: 'Sunday' },
        { index: 2, abbrv: 'Mon', full: 'Monday' },
        { index: 3, abbrv: 'Tue', full: 'Tuesday' },
        { index: 4, abbrv: 'Wed', full: 'Wednesday' },
        { index: 5, abbrv: 'Thu', full: 'Thursday' },
        { index: 6, abbrv: 'Fri', full: 'Friday' },
        { index: 7, abbrv: 'Sat', full: 'Saturday' }
    ];

    /**
     * 
     * @param {WeekdayAll} weekday A week day
     * @param {'original'|'lowerCase'|'upperCase'} [letterCase] The case of the value
     * @returns {string}
     */
    static abbrvOf(weekday, letterCase = 'original') {
        if (typeof weekday === 'string') { weekday = WeekDays.toLowerCase() }
        const data = WeekDays.#data.find(i => i.abbrv.toLowerCase() === weekday || i.full.toLowerCase() === weekday || i.index === weekday);
        if (data) {
            if (letterCase === 'lowerCase') {
                return data.abbrv.toLowerCase();
            } else if (letterCase === 'upperCase') {
                return data.abbrv.toUpperCase();
            } else if (letterCase === 'original') {
                return data.abbrv;
            }
        }

        return null;
    }

    /**
     * 
     * @param {WeekdayAll} weekday 
     * @returns {1|2|3|4|5|6|7|0}
     */
    static indexOf(weekday) {
        if (typeof weekday === 'string') { weekday = WeekDays.toLowerCase() }
        const data = WeekDays.#data.find(i => i.abbrv.toLowerCase() === weekday || i.full.toLowerCase() === weekday || i.index === weekday);
        if (data) {
            return data.index;
        }

        return 0;
    }

    /**
     * 
     * @param {WeekdayAll} weekday 
     */
    static validate(weekday) {
        if (typeof weekday === 'number') {
            if (weekday < 1 || weekday > 7) { throw new RangeError(`You passed an invalid weekday number (${weekday}). Weekdays start from Sunday (1) until Saturday (7)`) }
        } else if (typeof weekday === 'string') {
            const index = WeekDays.indexOf(weekday);
            if (index === 0) {
                throw new RangeError(`You passed an invalid weekday string (${weekday}). Only literal weekdays' values are allowed for strings. Tue, Wednesday, fri, etc.`)
            }
        } else {
            throw new TypeError(`Weekdays can either strings or numbers, you passed ${typeof weekday}`)
        }
    }
}

class Months {
    static #data = [
        { index: 1, abbrv: 'Jan', full: 'January' },
        { index: 2, abbrv: 'Feb', full: 'February' },
        { index: 3, abbrv: 'Mar', full: 'March' },
        { index: 4, abbrv: 'Apr', full: 'April' },
        { index: 5, abbrv: 'May', full: 'May' },
        { index: 6, abbrv: 'Jun', full: 'June' },
        { index: 7, abbrv: 'Jul', full: 'July' },
        { index: 8, abbrv: 'Aug', full: 'August' },
        { index: 9, abbrv: 'Sep', full: 'September' },
        { index: 10, abbrv: 'Oct', full: 'October' },
        { index: 11, abbrv: 'Nov', full: 'November' },
        { index: 12, abbrv: 'Dec', full: 'December' }
    ];

    /**
     * Get the month index
     * @param {string} month 
     * @returns {number}
     */
    static indexOf(month) {
        if (typeof month === 'string') { month = month.toLowerCase() }
        const data = Months.#data.find(i => i.abbrv.toLowerCase() === month || i.full.toLowerCase() === month || i.index === month);
        return data ? data.index : 0;
    }

    /**
     * 
     * @param {*} month 
     * @param {'original'|'lowerCase'|'upperCase'} [letterCase] The case of the value
     * @returns 
     */
    static abbrvOf(month, letterCase = 'original') {
        const index = Months.indexOf(month);
        if (index > 0) {
            const month = Months.#data.find(i => i.index === index);
            if (letterCase === "original") {
                return month.abbrv;
            } else if (letterCase === 'lowerCase') {
                return month.abbrv.toLowerCase();
            } else if (letterCase === 'upperCase') {
                return month.abbrv.toUpperCase();
            }
        }

        return null
    }

    /**
     * 
     * @param {string|number} month 
     */
    static validate(month) {
        if (typeof month === 'number') {
            if (month < 1 || month > 12) { throw new RangeError(`Months can only be between 1 and 12. You passed: ${month}`) }
        } else if (typeof month === 'string') {
            const index = Months.indexOf(month);
            if (index === 0) {
                throw new RangeError(`Months should be either literal (JAN, January, etc.) or numeric (1, 2, etc.) but instead got ${month}`)
            }
        } else {
            throw new TypeError(`A month can only be of type string or number, instead got ${typeof month}`)
        }
    }

    static validateMonthDay(value) {
        if (typeof value !== 'number') { throw new TypeError(`Month days must be of type number, instead got ${typeof value}`) }
        if (value < 1 || value > 31) { throw new RangeError(`Month days can only be between 1 and 31. You passed ${value}`) }
    }
}

function isValidHour(value) {
    if (typeof value !== 'number') { throw new TypeError(`Hours can only be numbers. You passed ${typeof value}`) }
    if (value < 0 || value > 23) { throw new RangeError(`Hours can only be between 0 and 23, where 0 is 12:00 AM and 23 is 11:00 PM. You passed ${value}`) }
}

function isMinute(value) {
    if (typeof value !== 'number') { throw new TypeError(`Minutes can only be numbers. You passed ${typeof value}`) }
    if (value < 0 || value > 59) { throw new RangeError(`Minutes can only be between 0 and 59. You passed ${value}`) }
}

function isSecond(value) {
    if (typeof value !== 'number') { throw new TypeError(`Seconds can only be numbers. You passed ${typeof value}`) }
    if (value < 0 || value > 59) { throw new RangeError(`Seconds can only be between 0 and 59. You passed ${value}`) }
}

const validate = {
    year: {
        between: {
            start: (start) => {
                if (typeof start !== 'number') { throw new TypeError(`The CronTime.between method expected a 'number' argument for the "start" parameter, but instead got ${typeof start}`) }
                const currentYear = new Date().getFullYear();
                if (start < currentYear) { throw new RangeError(`Starting year (${start}) cannot be in the past`) }
            },
            end: (end, start) => {
                if (typeof end !== 'number') { throw new TypeError(`The CronTime.between method expected a 'number' argument for the "end" parameter, but instead got ${typeof end}`) }
                if (end > start) { throw new RangeError(`Ending year (${end}) cannot be before the starting year (${start})`) }
            }
        },
        specific: (years) => {
            if (typeof years === 'number') { years = [years] }
            if (!Array.isArray(years)) { throw new TypeError(`The years.specific method expected year of type "number", or an array of years, but instead got ${typeof years}`) }

            const currentYear = new Date().getFullYear();
            for (const year of years) {
                if (typeof year !== 'number') { throw new TypeError(`One of the passed years (${year}) is not a valid year. Expected a number value but got ${typeof year}`) }
                if (year < currentYear) { throw new RangeError(`One of the passed years (${year}) is in the past. You cannot set a year in the past`) }
            }
        }
    },
    month: {
        between: {
            start: (start) => {
                Months.validate(start);
            },
            end: (end, start) => {
                Months.validate(end);
                if (end < start) { throw new RangeError(`The ending month cannot be before the starting month`) }
            }
        },
        specific: (months) => {
            if (typeof months === 'string' || typeof months === 'number') { months = [months] }
            if (!Array.isArray(months)) { throw new TypeError(`The months.specific method expected month of type "number" or "string", or an array of months, but instead got ${typeof months}`) }

            for (const month of months) {
                const index = Months.indexOf(month);
                if (index === 0) {
                    throw new RangeError(`The months.specific method has recieved an invalid month value: ${month}`)
                }
            }
        }
    },
    day: {
        weekDay: {
            /**@param {string|string[]|1|2|3|4|5|6|7|(1|2|3|4|5|6|7)[]} days */
            specific: (days) => {
                if (typeof days === 'string' || typeof days === 'number') { days = [days] }
                for (const weekday of days) {
                    WeekDays.validate(weekday)
                }
            },
            /**@param {string|1|2|3|4|5|6|7} weekday */
            last: (weekday) => {
                WeekDays.validate(weekday)
            }
        },
        monthDay: {
            /**@param {monthDay|monthDay[]} */
            specific: (days) => {
                if (typeof days === 'number') { days = [days] }
                if (!Array.isArray(days)) { throw new TypeError(`The day.montDay.specific expected a day (e.g. 25) or an array of month days ([1, 7, 31]) but instead got ${typeof days}`) }

                for (const monthDay of days) {
                    Months.validateMonthDay(monthDay)
                }
            },
            /**@param {monthDay} num */
            lastNumDays: (num) => {
                if (typeof num !== 'number') { throw new TypeError(`day.monthDay.lastNumDays only accepts numbers. You passed ${typeof num}`) }
                if (num < 1) { throw new RangeError(`The last number of days in a month must be at least 1`) }
                if (num > 31) { throw new RangeError(`The last number of days in a month cannot exceed the maximum number of days in a particular month`) }
            },
            /**@param {monthDay} num */
            nearestWeekday: (num) => {
                if (typeof num !== 'number') { throw new TypeError(`day.monthDay.nearestWeekday only accepts numbers. You passed ${typeof num}`) }
                if (num < 1 || num > 31) { throw new RangeError(`The day.monthDay.nearestWeekday takes a day number between 1 and 31. You passed ${num}`) }
            },
        }
    },
    hours: {
        between: {
            start: (start) => {
                isValidHour(start);
            },
            end: (end, start) => {
                isValidHour(end);
                if (end < start) { throw new RangeError(`The ending hours cannot be before the starting hours.`) }
            }
        },
        /**@param {number|number[]} hours */
        specific: (hours) => {
            if (typeof hours === 'number') { hours = [hours] }
            if (!Array.isArray(hours)) { throw new RangeError(`Hours can be a number or an array of hours`) }

            for (const hour of hours) {
                isValidHour(hour);
            }
        }
    },
    minutes: {
        between: {
            start: (start) => {
                isMinute(start);
            },
            end: (end, start) => {
                isMinute(end);
                if (end < start) { throw new RangeError(`The ending minutes cannot be before the starting minutes.`) }
            }
        },
        /**@param {number|number[]} minutes */
        specific: (minutes) => {
            if (typeof minutes === 'number') { minutes = [minutes] }
            if (!Array.isArray(minutes)) { throw new RangeError(`Minutes can be a number or an array of minutes`) }

            for (const minute of minutes) {
                isMinute(minute);
            }
        }
    },
    seconds: {
        between: {
            start: (start) => {
                isSecond(start);
            },
            end: (end, start) => {
                isSecond(end);
                if (end < start) { throw new RangeError(`The ending seconds cannot be before the starting seconds.`) }
            }
        },
        /**@param {number|number[]} seconds */
        specific: (seconds) => {
            if (typeof seconds === 'number') { seconds = [seconds] }
            if (!Array.isArray(seconds)) { throw new RangeError(`Seconds can be a number or an array of seconds`) }

            for (const second of seconds) {
                isSecond(second);
            }
        }
    }
}

module.exports = {
    validate,
    Months,
    WeekDays,
    isValidHour,
    isMinute,
    isSecond
}

/**@typedef {1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31} monthDay */

/**@typedef {1|2|3|4|5|6|7|'Sun'|'Sunday'|'Mon'|'Monday'|'Tue'|'Tuesday'|'Wed'|'Wednesday'|'Thu'|'Thursday'|'Fri'|'Friday'|'Sat'|'Saturday'} WeekdayAll  */
/**@typedef {1|2|3|4|5|6|7|} WeekdayIndex */
/**@typedef {'Sun'|'Sunday'|'Mon'|'Monday'|'Tue'|'Tuesday'|'Wed'|'Wednesday'|'Thu'|'Thursday'|'Fri'|'Friday'|'Sat'|'Saturday'} Weekday */
/**@typedef {'Sun'|'Mon'|'Tue'|'Wed'|'Thu'|'Fri'|'Sat'} WeekdayAbbrev  */