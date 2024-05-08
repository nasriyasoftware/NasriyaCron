import { CronTime } from 'cron-time-generator';
import { ScheduleOptions, ScheduledTask, ScheduledTimedTask } from './docs/docs';

/**Manages cron jobs and scheduling tasks. */
declare class CronJobManager {  
    /**
     * Schedule a task.
     * @param {string} cronExpression Cron expression.
     * @param {Function} task Task to be executed.
     * @param {ScheduleOptions} options Optional configuration for job scheduling.
     * @returns {ScheduledTask} The scheduled task.
     */
    schedule(cronExpression: string, task: Function, options?: ScheduleOptions): ScheduledTask;

    /**
     * Schedule tasks on specific times.
     * @param {Date|string|number} time A `Date` instance, ISO date string, or a timestamp number.
     * @param {Function} task Task to be executed.
     * @returns {ScheduledTimedTask} The scheduled timed task.
     */
    scheduleTime(time: Date | string | number, task: Function): ScheduledTimedTask;

    /**
     * Get a scheduled task.
     * @param {string} name The name of the task.
     * @returns {ScheduledTask | ScheduledTimedTask | null} The scheduled task or null if not found.
     */
    getTask(name: string): ScheduledTask | ScheduledTimedTask | null;

    /** View the scheduled tasks. */
    get tasks(): Object;

    /** Generate cron expressions. */
    get time(): typeof CronTime;
}

export default CronJobManager;