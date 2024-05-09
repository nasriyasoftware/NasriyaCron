import { CronTime } from 'cron-time-generator';
import { ScheduleOptions, ScheduledTask, ScheduledTimedTask } from './docs/docs';
declare class CronJobManager {
    private readonly _names;
    private _tasks;
    private _timeTasks;
    /**
     * Schedule a task
     * @param {string} cronExpression Cron expression
     * @param {Function} task Task to be executed
     * @param {ScheduleOptions} options Optional configuration for job scheduling
     * @returns {ScheduledTask}
     */
    schedule(cronExpression: string, task: Function, options?: ScheduleOptions): ScheduledTask;
    /**
     * Schedule tasks on specific times.
     * @param {Date|string|number} time A `Date` instance, [ISO date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) string, or a [timestamp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now) number
     * @param {Function} task Task to be executed
     */
    scheduleTime(time: Date | string | number, task: Function): ScheduledTimedTask;
    /**
     * Get a scheduled task
     * @param {string} name The name of the task
     * @returns {ScheduledTask|null}
     */
    getTask(name: string): ScheduledTask | ScheduledTimedTask | null;
    /**View the scheduled tasks */
    get tasks(): Object;
    /**Generate cron expressions */
    get time(): typeof CronTime;
}
declare const _default: CronJobManager;
export default _default;
