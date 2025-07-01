import * as nodeCron from 'node-cron';
import nodeSchedule from 'node-schedule';
import { CronTime } from 'cron-time-generator';
import { ScheduleOptions, ScheduledTask, ScheduledTimedTask } from './docs/docs';
import fs from 'fs';
import path from 'path';

export type { ScheduleOptions, ScheduledTask, ScheduledTimedTask } from './docs/docs';

const tz = JSON.parse(fs.readFileSync(path.join(__dirname, './assets/tzNames.json'), { encoding: 'utf-8' })) as string[];

class CronJobManager {
    readonly #_tasks: Map<string, { task: nodeCron.ScheduledTask, api: ScheduledTask }> = new Map();
    readonly #_timeTasks: Map<string, { task: nodeSchedule.Job, api: ScheduledTimedTask }> = new Map();
    readonly #_helpers = {
        getTaskAPIItem: (cronTask: nodeCron.ScheduledTask): ScheduledTask => {
            return {
                name: cronTask.name!,
                start: () => cronTask.start(),
                stop: () => cronTask.stop(),
                destroy: async () => {
                    cronTask.stop();
                    cronTask.destroy();
                    this.#_tasks.delete(cronTask.name!);
                }
            };
        },

        getTimeTaskAPIItem: (timeTask: nodeSchedule.Job): ScheduledTimedTask => {
            return {
                name: timeTask.name,
                cancel: () => timeTask.cancel(),
                invoke: () => timeTask.invoke(),
                destroy: async () => {
                    timeTask.cancel();
                    this.#_timeTasks.delete(timeTask.name);
                }
            }
        },

        hasName: (name: string): boolean => {
            return this.#_tasks.has(name) || this.#_timeTasks.has(name);
        }
    }

    /**
     * Schedules a periodic task using a cron expression.
     * 
     * @param {string} cronExpression - A valid cron expression string to define the task schedule.
     * @param {Function} task - The task to execute, provided as a function.
     * @param {ScheduleOptions} [options={}] - Optional scheduling options:
     *   - `scheduled`: Boolean indicating whether the task is scheduled to run automatically.
     *   - `timezone`: String specifying the timezone for the task execution.
     *   - `name`: A unique name for the task.
     *   - `runOnInit`: Boolean indicating if the task should run immediately upon scheduling.
     * 
     * @returns {ScheduledTask} - An object containing methods to manage the scheduled task.
     * 
     * @throws {TypeError} - Throws if `cronExpression` is not a string or invalid, if `task` is not a function,
     *                       or if any option has an incorrect type.
     * @throws {Error} - Throws if a task with the same name already exists.
     * @since v1.1.0
     */
    schedule(cronExpression: string, task: Function, options: ScheduleOptions = {}): ScheduledTask {
        try {
            // validate expression
            if (typeof cronExpression !== 'string') { throw new TypeError(`The cronExpression argument must be a valid cron-expression. Instead received ${typeof cronExpression}`) }
            if (!nodeCron.validate(cronExpression)) { throw `(${cronExpression}) is not a valid cron-expression. You can use the expression builder if you need to.` }

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

            if (this.#_helpers.hasName(finalOptions.name!)) { throw new Error(`A task with the name ${finalOptions.name} already exists`) }

            const cronTask = nodeCron.schedule(cronExpression, task as any, finalOptions);
            const api = this.#_helpers.getTaskAPIItem(cronTask);
            this.#_tasks.set(finalOptions.name!, { task: cronTask, api });

            return Object.freeze(api);
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
     * Schedule a one-time task to run at a specified time.
     * @param {Date | string | number} time - The time at which the task should run. If a string, it must be a valid ISO date string. If a number, it must be a valid timestamp number.
     * @param {Function} task - The function to run when the task is triggered.
     * @returns {ScheduledTimedTask} - The ScheduledTimedTask API.
     * @throws {TypeError} - If the time argument is not a Date instance, string, or number value.
     * @throws {SyntaxError} - If the time argument is in the past.
     * @throws {TypeError} - If the task argument is not a function.
     * @throws {Error} - If a task with the same name already exists.
     * @since v1.1.0
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
            const api = this.#_helpers.getTimeTaskAPIItem(cronTask);
            this.#_timeTasks.set(taskName, { task: cronTask, api });

            return Object.freeze(api);
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
     * @since v1.1.0
     */
    getTask(name: string): ScheduledTask | ScheduledTimedTask | null {
        if (typeof name !== 'string') { throw new TypeError(`The task name that you passed to the getTask method is ${typeof name}, expected a string value`) }
        const task = this.#_tasks.get(name);
        if (task) { return Object.freeze(task.api) }

        const timeTask = this.#_timeTasks.get(name);
        if (timeTask) { return Object.freeze(timeTask.api) }

        return null;
    }

    /**
     * Retrieves all scheduled tasks.
     *
     * @returns An object containing two arrays:
     *   - `periodic`: An array of `ScheduledTask` objects representing
     *     the periodic tasks.
     *   - `scheduled`: An array of `ScheduledTimedTask` objects representing
     *     the one-time scheduled tasks.
     * @since v1.1.0
     */
    get tasks() {
        return {
            periodic: Array.from(this.#_tasks.values()).map(i => Object.freeze(i.api)),
            scheduled: Array.from(this.#_timeTasks.values()).map(i => Object.freeze(i.api))
        }
    }

    /**
     * Generate cron expressions
     * @since v1.1.0
     */
    get time(): typeof CronTime { return CronTime }

    /**
     * Destroys all scheduled tasks, both periodic and one-time.
     * This method is idempotent, it will not throw if called multiple times.
     * @returns {Promise<void>}
     * @since v1.1.0
     */
    async destroy(): Promise<void> {
        const promises = [];
        for (const [_, task] of this.#_tasks) {
            promises.push(task.api.destroy())
        }

        for (const [_, task] of this.#_timeTasks) {
            promises.push(task.api.destroy())
        }

        await Promise.all(promises);
    }
}

const cron = new CronJobManager();
export default cron;