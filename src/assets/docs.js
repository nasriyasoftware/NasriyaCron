/**
 * @typedef {object} ScheduledTask
 * @prop {string} name The name of the task or a random name
 * @prop {() => void} start Start the scheduled task
 * @prop {() => void} stop Stop the scheduled task
 */

/**
 * @typedef {object} ScheduleOptions
 * @prop {boolean} [scheduled]  A boolean to set if the created task is scheduled. Defaults to `true`
 * @prop {string} [timezone] The timezone that is used for job scheduling. See [IANA time zone database](https://www.iana.org/time-zones) for valid values, such as `Asia/Jerusalem`, `Asia/Hebron`, `America/Gaza`.
 * @prop {string} [name] The schedule name
 * @prop {boolean} [runOnInit] Execute task immediately after creation. Defaults to `false`
 */

/**
 * @typedef {0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|
* 26|27|28|29|30|31|32|33|34|35|36|37|38|39|40|41|42|43|44|45|46|47|48|49|50
* |51|52|53|54|55|56|57|58|59} Second
*/

/**
* @typedef {1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|
* 26|27|28|29|30|31|32|33|34|35|36|37|38|39|40|41|42|43|44|45|46|47|48|49|50
* |51|52|53|54|55|56|57|58|59|60} Second60
*/

/**
 * @typedef {0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|
 * 26|27|28|29|30|31|32|33|34|35|36|37|38|39|40|41|42|43|44|45|46|47|48|49|50
 * |51|52|53|54|55|56|57|58|59} Minute
 */

/**
 * @typedef {1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|
 * 26|27|28|29|30|31|32|33|34|35|36|37|38|39|40|41|42|43|44|45|46|47|48|49|50
 * |51|52|53|54|55|56|57|58|59|60} Minute60
*/
/**@typedef {0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23} Hour */
/**@typedef {1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24} Hour24 */
/**@typedef {1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31} MonthDay */

/**@typedef {1|2|3|4|5|6|7|'Sun'|'Sunday'|'Mon'|'Monday'|'Tue'|'Tuesday'|'Wed'|'Wednesday'|'Thu'|'Thursday'|'Fri'|'Friday'|'Sat'|'Saturday'} WeekdayAll  */
/**@typedef {1|2|3|4|5|6|7} WeekdayIndex */
/**@typedef {'Sun'|'Sunday'|'Mon'|'Monday'|'Tue'|'Tuesday'|'Wed'|'Wednesday'|'Thu'|'Thursday'|'Fri'|'Friday'|'Sat'|'Saturday'} Weekday */
/**@typedef {'Sun'|'Mon'|'Tue'|'Wed'|'Thu'|'Fri'|'Sat'} WeekdayAbbrev  */

/**@typedef {MonthAbbrev|MonthIndex|Month} MonthAll */
/**@typedef {'Jan'|'Feb'|'Mar'|'Apr'|'May'|'Jun'|'Jul'|'Aug'|'Sep'|'Oct'|'Nov'|'Dec'} MonthAbbrev */
/**@typedef {1|2|3|4|5|6|7|8|9|10|11|12} MonthIndex */
/**@typedef {'January'|'February'|'March'|'April'|'May'|'June'|'July'|'August'|'September'|'October'|'November'|'December'} Month */
/**@typedef {'second'|'minute'|'hour'|'day'|'month'|'year'} RecurranceUnit */

module.exports = {}