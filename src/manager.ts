import cron from 'node-cron';
import { CronTime } from 'cron-time-generator';
import nodeSchedule from 'node-schedule';
import { ScheduleOptions, ScheduledTask, ScheduledTimedTask } from './docs/docs';
import tz from './assets/tzNames.json';

class CronJobManager {
    private readonly _names: { name: string, type: 'Recursive' | 'SpecificTime' }[] = [];
    private _tasks: Record<string, cron.ScheduledTask> = {};
    private _timeTasks: Record<string, nodeSchedule.Job> = {};

    /**
     * Schedule a task
     * @param {string} cronExpression Cron expression
     * @param {Function} task Task to be executed 
     * @param {ScheduleOptions} options Optional configuration for job scheduling
     * @returns {ScheduledTask}
     */
    schedule(cronExpression: string, task: Function, options: ScheduleOptions = {}): ScheduledTask {
        try {
            // validate expression
            if (typeof cronExpression !== 'string') { throw new TypeError(`The cronExpression argument must be a valid cron-expression. Instead received ${typeof cronExpression}`) }
            if (!cron.validate(cronExpression)) { throw `(${cronExpression}) is not a valid cron-expression. You can use the expression builder if you need to.` }

            // Validate task
            if (typeof task !== 'function') { throw new TypeError(`Expected a callback function as the task value, but instead got ${typeof task}`) }

            /**
             * An object to collect valid options in
             * @type {ScheduleOptions} 
             */
            const finalOptions: ScheduleOptions = {
                scheduled: true,
                runOnInit: false,
                name: `cron_task_${Math.floor(Math.random() * 1e10)}`
            };

            // validate the scheduled value
            if ('scheduled' in options) {
                if (typeof options.scheduled !== 'boolean') { throw new TypeError(`The scheduled option only accepts a boolean value, instead got ${typeof options.scheduled}`) }
                finalOptions.scheduled = options.scheduled;
            }

            // Validate timezone
            if ('timezone' in options) {
                if (typeof options.timezone !== 'string') { throw new TypeError(`The timezone is expected to be a string, but instead got ${typeof options.timezone}`) }
                const timezone = (tz as string[]).find(i => i.toLowerCase() === options.timezone?.toLowerCase());
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

            const cronTask = cron.schedule(cronExpression, task as any, finalOptions);
            this._tasks[finalOptions.name as string] = cronTask;
            this._names.push({ name: finalOptions.name as string, type: 'Recursive' });

            return Object.freeze({
                name: finalOptions.name as string,
                start: () => cronTask.start(),
                stop: () => cronTask.stop()
            });
        } catch (error) {
            if (typeof error === 'string') { throw new Error(`Task Schedule Error: ${error}`) }
            if (error instanceof Error) {
                const err = new Error(`Task Schedule Error: ${error.message}`);
                err.stack = error.stack;
                throw err;
            }

            console.error(error);
            throw error;
        }
    }

    /**
     * Schedule tasks on specific times.
     * @param {Date|string|number} time A `Date` instance, [ISO date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) string, or a [timestamp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now) number
     * @param {Function} task Task to be executed 
     */
    scheduleTime(time: Date | string | number, task: Function): ScheduledTimedTask {
        try {
            const now = Date.now();
            // Validate time
            if (!(time instanceof Date)) {
                if (typeof time === 'string') {
                    const t = new Date(time);
                    if (isNaN(t.getTime())) { throw new TypeError(`The "time" argument that you passed (${time}) is not a valid ISO date string`) }
                    time = t;
                } else if (typeof time === 'number') {
                    const t = new Date(time);
                    if (isNaN(t.getTime()) || t.getTime() <= 0) { throw new TypeError(`The "time" argument that you passed (${time}) is not a valid timestamp number`) }
                    time = t;
                } else {
                    throw new TypeError(`The "time" parameter expects a Date instance, string, or number values, but instead got ${typeof time}`)
                }
            }

            if (time.getTime() < now + 5000) { throw new SyntaxError(`You cannot schedule time in the past`) }

            // Validate task
            if (typeof task !== 'function') { throw new TypeError(`Expected a callback function as the task value, but instead got ${typeof task}`) }

            const taskName = `cron_time_task_${Math.floor(Math.random() * 1e10)}`
            const cronTask = nodeSchedule.scheduleJob(taskName, time, task as any);
            this._timeTasks[taskName] = cronTask;
            this._names.push({ name: taskName, type: 'SpecificTime' });

            return Object.freeze({
                name: cronTask.name,
                cancel: () => cronTask.cancel(),
                invoke: () => cronTask.invoke()
            });
        } catch (error) {
            if (typeof error === 'string') { throw new Error(`Task Time Schedule Error: ${error}`) }
            if (error instanceof Error) {
                const err = new Error(`Task Time Schedule Error: ${error.message}`);
                err.stack = error.stack;
                throw err;
            }

            console.error(error);
            throw error;
        }
    }

    /**
     * Get a scheduled task
     * @param {string} name The name of the task
     * @returns {ScheduledTask|null}
     */
    getTask(name: string): ScheduledTask | ScheduledTimedTask | null {
        if (typeof name !== 'string') { throw new TypeError(`The task name that you passed to the getTask method is ${typeof name}, expected a string value`) }
        const taskRecord = this._names.find(task => task.name === name);
        if (!taskRecord) { return null }

        if (taskRecord.type === 'Recursive') {
            const cronTask = this._tasks[name];
            return Object.freeze({
                name: name,
                start: () => cronTask.start(),
                stop: () => cronTask.stop()
            });
        } else if (taskRecord.type === 'SpecificTime') {
            const cronTask = this._timeTasks[name];
            return Object.freeze({
                name: cronTask.name,
                cancel: () => cronTask.cancel(),
                invoke: () => cronTask.invoke()
            });
        } else {
            return null;
        }
    }

    /**View the scheduled tasks */
    get tasks(): Object { return Object.freeze({ ...this._tasks, ...this._timeTasks }) }
    /**Generate cron expressions */
    get time(): typeof CronTime { return CronTime }
}

export default new CronJobManager();