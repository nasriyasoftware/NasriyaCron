export interface ScheduledTask {
    /** The name of the task */
    name: string;
    /** Start/resume the task */
    start: () => void;
    /** Pause the task */
    stop: () => void;
    /**
     * Destroy the task
     * @returns Promise<void>
     */
    destroy: () => Promise<void>;
}

export interface ScheduledTimedTask {
    /** The name of the task */
    name: string;
    /** Cancel the task */
    cancel: () => void;
    /** Invoke the task */
    invoke: () => void;
    /**
     * Destroy the task
     * @returns Promise<void>
     */
    destroy: () => Promise<void>;
}

export interface ScheduleOptions {
    scheduled?: boolean;
    timezone?: string;
    name?: string;
    runOnInit?: boolean;
}

export type Second = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59;
export type Second60 = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60;
export type Minute = Second;
export type Minute60 = Second60;
export type Hour = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23;
export type Hour24 = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24;
export type MonthDay = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31;
export type WeekdayAll = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 'Sun' | 'Sunday' | 'Mon' | 'Monday' | 'Tue' | 'Tuesday' | 'Wed' | 'Wednesday' | 'Thu' | 'Thursday' | 'Fri' | 'Friday' | 'Sat' | 'Saturday';
export type WeekdayIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Weekday = 'Sun' | 'Sunday' | 'Mon' | 'Monday' | 'Tue' | 'Tuesday' | 'Wed' | 'Wednesday' | 'Thu' | 'Thursday' | 'Fri' | 'Friday' | 'Sat' | 'Saturday';
export type WeekdayAbbrev = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
export type MonthAll = MonthAbbrev | MonthIndex | Month;
export type MonthAbbrev = 'Jan' | 'Feb' | 'Mar' | 'Apr' | 'May' | 'Jun' | 'Jul' | 'Aug' | 'Sep' | 'Oct' | 'Nov' | 'Dec';
export type MonthIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type Month = 'January' | 'February' | 'March' | 'April' | 'May' | 'June' | 'July' | 'August' | 'September' | 'October' | 'November' | 'December';
export type RecurranceUnit = 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year';