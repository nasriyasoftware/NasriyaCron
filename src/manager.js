const cron = require('node-cron');
const { CronTime } = require('cron-time-generator');
const nodeSchedule = require('node-schedule');
const Docs = require('./assets/docs');
const tz = require('./tzNames.json');

class CronJobManager {
    #tasks = {}
    #timeTasks = {}

    /**
     * Schedule a task
     * @param {string} cronExpression Cron expression
     * @param {Function} task Task to be executed 
     * @param {Docs.ScheduleOptions} options Optional configuration for job scheduling
     * @returns {Docs.ScheduledTask}
     */
    schedule(cronExpression, task, options = {}) {
        try {
            // validate expression
            if (typeof cronExpression !== 'string') { throw new TypeError(`The cronExpression argument must be a valid cron-expression. Instead recieved ${typeof cronExpression}`) }
            if (!cron.validate(cronExpression)) { throw `(${cronExpression}) is not a valid cron-expression. You can use the expression builder if you need to.` }

            // Validate task
            if (typeof task !== 'function') { throw new TypeError(`Expected a callback function as the task value, but instead got ${typeof task}`) }

            /**
             * An object to collect valid options in
             * @type {Docs.ScheduleOptions} 
            */
            const finalOptions = {
                scheduled: true,
                runOnInit: false,
                name: `cron-task_${Math.floor(Math.random() * 1e50)}`
            }

            // validate the scheduled value
            if ('scheduled' in options) {
                if (typeof options.scheduled !== 'boolean') { throw new TypeError(`The scheduled option only accepts a boolean value, instead got ${typeof options.scheduled}`) }
                finalOptions.scheduled = options.scheduled;
            }

            // Validate timezone
            if ('timezone' in options) {
                if (typeof options.timezone !== 'string') { throw new TypeError(`The timezone is expecetd to be a string, but instead got ${typeof options.timezone}`) }
                const timezone = tz.find(i => i.toLowerCase() === options.timezone.toLowerCase())
                if (!timezone) { throw `(${options.timezone}) is not a valid timezone` }
                finalOptions.timezone = timezone;
            }

            // Validate the task name value
            if ('name' in options) {
                if (typeof options.name !== 'string') { throw new TypeError(`The name property is expected to be a valid string value, instead got ${typeof options.name}`) }
                if (options.name.length > 0) { finalOptions.name = options.name }
            }

            // validate runOnInit
            if ('runOnInit' in options) {
                if (typeof options.runOnInit !== 'boolean') { throw new TypeError(`The runOnInit option only accepts a boolean value, instead got ${typeof options.runOnInit}`) }
                finalOptions.runOnInit = options.runOnInit;
            }

            const cronTask = cron.schedule(cronExpression, task, finalOptions);
            this.#tasks[finalOptions.name] = cronTask;

            return Object.freeze({
                name: finalOptions.name,
                start: () => cronTask.start(),
                stop: () => cronTask.stop()
            })
        } catch (error) {
            if (typeof error === 'string') { error = `Task Schedule Error: ${error}` }
            if (typeof error?.message === 'string') { error.message = `Task Schedule Error: ${error.message}` }

            console.error(error);
            throw error;
        }
    }

    /**
     * 
     * @param {Date|string|number} time A `Date` instance, [ISO date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) string, or a [timestamp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now) number
     * @param {Function} task Task to be executed 
     */
    scheduleTime(time, task) {
        try {
            // Validate time
            if (!(time instanceof Date)) {
                if (typeof time === 'string') {
                    try {
                        const t = new Date(time);
                        time = t;
                    } catch (error) {
                        throw new TypeError(`The "time" argument that you passed (${time}) is not a valid ISO date string`)
                    }
                } else if (typeof time === 'number') {
                    try {
                        const t = new Date(time);
                        time = t;
                    } catch (error) {
                        throw new TypeError(`The "time" argument that you passed (${time}) is not a valid timestamp number`)
                    }
                } else {
                    throw new TypeError(`The "time" parameter expects a Date instance, string, or number values, but instead got ${typeof time}`)
                }
            }

            // Validate task
            if (typeof task !== 'function') { throw new TypeError(`Expected a callback function as the task value, but instead got ${typeof task}`) }

            const taskName = `cron-time-task_${Math.floor(Math.random() * 1e50)}`
            const cronTask = nodeSchedule.scheduleJob(time, task);
            this.#timeTasks[taskName] = cronTask;

            return Object.freeze({
                name: cronTask.name,
                cancel: () => cronTask.cancel(),
                invoke: () => cronTask.invoke()
            })
        } catch (error) {
            if (typeof error === 'string') { error = `Task Time Schedule Error: ${error}` }
            if (typeof error?.message === 'string') { error.message = `Task Time Schedule Error: ${error.message}` }

            console.error(error);
            throw error;
        }
    }

    /**
     * Get a scheduled task
     * @param {string} name The name of the task
     * @returns {Docs.ScheduledTask|null}
     */
    getTask(name) {
        if (typeof name !== 'string') { throw new TypeError(`The task name that you passed to the getTask method is ${typeof name}, expected a string value`) }
        const names = Object.keys(this.#tasks);
        const index = names.map(i => i.toLowerCase()).indexOf(name.toLowerCase());
        return index > -1 ? this.#tasks[`${names[index]}`] : null;
    }

    /**View the scheduled tasks */
    get tasks() { return Object.freeze(...this.#tasks, ...this.#timeTasks) }
    /**Generate cron expressions */
    get time() { return CronTime }
}

module.exports = new CronJobManager();