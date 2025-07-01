import cron from '../src/manager';

describe('CronJobManager', () => {
    afterAll(async () => {
        await cron.destroy();
    })

    describe('schedule()', () => {
        it('registers a periodic task with custom name', () => {
            const task = cron.schedule('* * * * * *', () => { }, { name: 'my_task' });
            expect(task.name).toBe('my_task');

            const fetched = cron.getTask('my_task');
            expect(fetched?.name).toBe('my_task');
        });

        it('throws if cron expression is invalid', () => {
            expect(() => {
                cron.schedule('invalid expression', () => { }, { name: 'bad_task' });
            }).toThrow(/not a valid cron-expression/);
        });

        it('throws if task is not a function', () => {
            expect(() => {
                cron.schedule('* * * * * *', 'not-a-function' as any);
            }).toThrow(/Expected a callback function/);
        });

        it('throws if scheduled is not a boolean', () => {
            expect(() => {
                cron.schedule('* * * * * *', () => { }, { scheduled: 'yes' as any });
            }).toThrow(/scheduled option only accepts a boolean/);
        });

        it('throws if runOnInit is not a boolean', () => {
            expect(() => {
                cron.schedule('* * * * * *', () => { }, { runOnInit: 'immediate' as any });
            }).toThrow(/runOnInit option only accepts a boolean/);
        });

        it('throws if timezone is invalid', () => {
            expect(() => {
                cron.schedule('* * * * * *', () => { }, { timezone: 'Nowhere/Imaginary' });
            }).toThrow(/is not a valid timezone/);
        });

        it('throws if name is already taken', () => {
            cron.schedule('* * * * * *', () => { }, { name: 'duplicate' });
            expect(() => {
                cron.schedule('* * * * * *', () => { }, { name: 'duplicate' });
            }).toThrow(/already exists/);
        });

        it('removes task on destroy()', async () => {
            const task = cron.schedule('* * * * * *', () => { }, { name: 'destroyable' });
            await task.destroy();

            expect(cron.getTask('destroyable')).toBeNull();
        });
    });

    describe('scheduleTime()', () => {
        it('schedules a one-time task in the future', () => {
            const time = Date.now() + 10_000;
            const task = cron.scheduleTime(time, () => { });
            expect(task.name).toMatch(/^cron_time_task_/);

            const retrieved = cron.getTask(task.name);
            expect(retrieved?.name).toBe(task.name);
        });

        it('throws if time is in the past', () => {
            const past = Date.now() - 5_000;
            expect(() => {
                cron.scheduleTime(past, () => { });
            }).toThrow(/in the past/);
        });

        it('throws for invalid ISO date string', () => {
            expect(() => {
                cron.scheduleTime('not-a-date', () => { });
            }).toThrow(/not a valid ISO date string/);
        });

        it('throws for non-date, non-string, non-number', () => {
            expect(() => {
                cron.scheduleTime({} as any, () => { });
            }).toThrow(/expects a Date instance, string, or number/);
        });

        it('removes time task on destroy()', async () => {
            const task = cron.scheduleTime(Date.now() + 10_000, () => { });
            await task.destroy();

            expect(cron.getTask(task.name)).toBeNull();
        });
    });

    describe('getTask()', () => {
        it('throws if name is not a string', () => {
            expect(() => {
                cron.getTask(123 as any);
            }).toThrow(/expected a string value/);
        });

        it('returns null if task is not found', () => {
            expect(cron.getTask('missing_task')).toBeNull();
        });
    });

    describe('tasks getter', () => {
        it('returns both periodic and one-time tasks', () => {
            const t1 = cron.schedule('* * * * * *', () => { }, { name: 'list_periodic' });
            const t2 = cron.scheduleTime(Date.now() + 10_000, () => { });

            const all = cron.tasks;

            expect(all.periodic.find(t => t.name === t1.name)).toBeDefined();
            expect(all.scheduled.find(t => t.name === t2.name)).toBeDefined();
        });
    });

    describe('cron.time (CronTime API)', () => {
        it('generates valid cron expression', () => {
            const expr = cron.time.every(5).minutes();
            expect(typeof expr).toBe('string');
            expect(expr).toMatch(/\*/);
        });
    });
});
