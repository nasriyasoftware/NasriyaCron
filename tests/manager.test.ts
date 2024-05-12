import cron from '../src/manager';

describe(`Testing package`, () => {

    describe('Testing the time module', () => {
        test('Every 5 minites:', () => {
            expect(cron.time.every(5).minutes()).toBe('*/5 * * * *')
        })

        test('Every month on the first day, at 3:00 PM', () => {
            expect(cron.time.everyMonthOn(1, 15)).toBe('0 15 1 * *')
        })

        test('Every Friday at 12:00 AM', () => {
            expect(cron.time.everyFridayAt(0)).toBe('0 0 * * 5')
        })
    })

    describe('Testing scheduling cron jobs: cron.schedule()', () => {
        const result = cron.schedule('*/5 * * * *', () => { }, { name: 'testJob' })

        test('Check if NOT providing an expression throws an error', () => {
            // @ts-ignore
            expect(() => cron.schedule()).toThrow('The cronExpression argument must be a valid cron-expression. Instead received undefined');
        })

        test('Check if invalid expressions will throw an error', () => {
            const cronExpression = 'InvalidExpression';
            // @ts-ignore
            expect(() => cron.schedule(cronExpression)).toThrow(`(${cronExpression}) is not a valid cron-expression. You can use the expression builder if you need to.`);
        })

        test('Not providing a task or an invalid value (not a function) will throw an error', () => {
            // @ts-ignore
            expect(() => cron.schedule('*/5 * * * *', undefined)).toThrow(`Expected a callback function as the task value, but instead got undefined`);
        })

        test('Providing an invalid type for "scheduled" in options will throw an error', () => {
            const options = { scheduled: 'yes' }
            // @ts-ignore
            expect(() => cron.schedule('*/5 * * * *', () => { }, options)).toThrow(`The scheduled option only accepts a boolean value, instead got ${typeof options.scheduled}`)
        })

        test('Providing an invalid type for "timezone" in options will throw an error', () => {
            const options = { timezone: 5 }
            // @ts-ignore
            expect(() => cron.schedule('*/5 * * * *', () => { }, options)).toThrow(`The timezone is expected to be a string, but instead got ${typeof options.timezone}`)
        })

        test('Providing an invalid "timezone" in options will throw an error', () => {
            const options = { timezone: 'Beit Jala' }
            // @ts-ignore
            expect(() => cron.schedule('*/5 * * * *', () => { }, options)).toThrow(`(${options.timezone}) is not a valid timezone`)
        })

        test('Providing an invalid type for "name" will throw an error', () => {
            const options = { name: 0 }
            // @ts-ignore
            expect(() => cron.schedule('*/5 * * * *', () => { }, options)).toThrow(`The name property is expected to be a valid string value, instead got ${typeof options.name}`)
        })

        test('Providing an invalid type for "runOnInit" will throw an error', () => {
            const options = { runOnInit: 0 }
            // @ts-ignore
            expect(() => cron.schedule('*/5 * * * *', () => { }, options)).toThrow(`The runOnInit option only accepts a boolean value, instead got ${typeof options.runOnInit}`)
        })

        test('Check the schema of the returned value', () => {
            expect(result).toHaveProperty('name');
            expect(result).toHaveProperty('start');
            expect(result).toHaveProperty('stop');
        });

        test('Check if the name is registered correctly', () => {
            expect(result.name).toBe('testJob');
        })

        test('Check if the returned "start" property is a function', () => {
            expect(typeof result.start).toBe('function')
        })

        test('Check if the returned "stop" property is a function', () => {
            expect(typeof result.stop).toBe('function')
        });

        result.stop();
    })

    describe('Testing time-scheduled jobs: cron.scheduleTime()', () => {
        const result = cron.scheduleTime(new Date(Date.now() + 60 * 1000), () => { });

        test('Check the schema of the returned value', () => {
            expect(result).toHaveProperty('name');
            expect(result).toHaveProperty('cancel');
            expect(result).toHaveProperty('invoke');
        });

        test('Check if the returned value of "name" is a string', () => {
            expect(typeof result.name).toBe('string');
        })

        test('Check if the returned value of "name" is the right value', () => {
            expect(result.name.startsWith('cron_time_task_')).toBe(true);
        })

        test('Check if the returned "cancel" property is a function', () => {
            expect(typeof result.cancel).toBe('function')
        })

        test('Check if the returned "invoke" property is a function', () => {
            expect(typeof result.invoke).toBe('function')
        });

        test('Check if valid ISO string dates pass', () => {
            const time = new Date(Date.now() + 50 * 1000).toISOString();
            const res = cron.scheduleTime(time, () => { });
            expect(res).toHaveProperty('name');
            res.cancel();
        })

        test('Check if valid timestamps dates pass', () => {
            const time = new Date(Date.now() + 50 * 1000).getTime();
            const res = cron.scheduleTime(time, () => { });
            expect(res).toHaveProperty('name');
            res.cancel();
        })

        test('Check if invalid string dates get cought', () => {
            const time = 'someTime';
            expect(() => cron.scheduleTime(time, () => { })).toThrow(`Task Time Schedule Error: The "time" argument that you passed (${time}) is not a valid ISO date string`);
        })

        test('Check if invalid timestamps dates get cought', () => {
            const time = -5;
            expect(() => cron.scheduleTime(time, () => { })).toThrow(`Task Time Schedule Error: The "time" argument that you passed (${time}) is not a valid timestamp number`)
        })

        test('Check if invalid type of a given date get cought: Test #1', () => {
            const time = true;
            // @ts-ignore
            expect(() => cron.scheduleTime(time, () => { })).toThrow(`Task Time Schedule Error: The "time" parameter expects a Date instance, string, or number values, but instead got ${typeof time}`)
        })

        test('Check if invalid type of a given date get cought: Test #2', () => {
            const time = [true];
            // @ts-ignore
            expect(() => cron.scheduleTime(time, () => { })).toThrow(`Task Time Schedule Error: The "time" parameter expects a Date instance, string, or number values, but instead got ${typeof time}`)
        })

        test('Check if invalid type of a given date get cought: Test #3', () => {
            const time = { name: 'D' };
            // @ts-ignore
            expect(() => cron.scheduleTime(time, () => { })).toThrow(`Task Time Schedule Error: The "time" parameter expects a Date instance, string, or number values, but instead got ${typeof time}`)
        })

        test('Check if past dates are rejected', () => {
            const time = Date.now() - 1;
            expect(() => cron.scheduleTime(time, () => { })).toThrow('Task Time Schedule Error: You cannot schedule time in the past')
        })

        test('Check if the second argumnet is not a function', () => {
            const time = Date.now() + 30 * 1000, task = false;
            // @ts-ignore
            expect(() => cron.scheduleTime(time, task)).toThrow(`Task Time Schedule Error: Expected a callback function as the task value, but instead got ${typeof task}`)
        })

        result.cancel();
    })

    describe('Testing getTask() method', () => {
        test('Only accept string "name" arguments', () => {
            // @ts-ignore
            expect(() => cron.getTask(5)).toThrow(`The task name that you passed to the getTask method is number, expected a string value`);
            // @ts-ignore
            expect(() => cron.getTask(true)).toThrow(`The task name that you passed to the getTask method is boolean, expected a string value`);
            // @ts-ignore
            expect(() => cron.getTask(undefined)).toThrow(`The task name that you passed to the getTask method is undefined, expected a string value`);
            // @ts-ignore
            expect(() => cron.getTask(null)).toThrow(`The task name that you passed to the getTask method is object, expected a string value`);
            // @ts-ignore
            expect(() => cron.getTask({})).toThrow(`The task name that you passed to the getTask method is object, expected a string value`);
        })

        test('Check if searching for a non-existing task will return "null"', () => {
            const result = cron.getTask('Random');
            expect(result).toBeNull();
        })

        describe('Check if a "Recursive" type task return the correct value', () => {
            const task = cron.schedule(cron.time.everyDay(), () => { });
            const result = cron.getTask(task.name);

            test('Calling cron.getTask(task.name) returns a result', () => {
                expect(result).not.toBeNull();
                expect(result).not.toBeUndefined();
                expect(result).toBeTruthy();
            })

            test('Check the returned object has all properties', () => {
                expect(result).toHaveProperty('name');
                expect(result).toHaveProperty('start');
                expect(result).toHaveProperty('stop');
            })

            test('The returned object has the right "type" of values', () => {
                expect(typeof result?.name).toBe('string');
                // @ts-ignore
                expect(typeof result?.start).toBe('function');
                // @ts-ignore
                expect(typeof result?.stop).toBe('function');
            })

            task.stop();
        })

        describe('Check if a "SpecificTime" type task return the correct value', () => {
            const task = cron.scheduleTime(new Date().getTime() + 30 * 1000, () => { });
            const result = cron.getTask(task.name);

            test('Calling cron.getTask(task.name) returns a result', () => {
                expect(result).not.toBeNull();
                expect(result).not.toBeUndefined();
                expect(result).toBeTruthy();
            })

            test('Check the returned object has all properties', () => {
                expect(result).toHaveProperty('name');
                expect(result).toHaveProperty('cancel');
                expect(result).toHaveProperty('invoke');
            })

            test('The returned object has the right "type" of values', () => {
                expect(typeof result?.name).toBe('string');
                // @ts-ignore
                expect(typeof result?.cancel).toBe('function');
                // @ts-ignore
                expect(typeof result?.invoke).toBe('function');
            })

            task.cancel();
        })
    })

    describe('Testing the "tasks" getter', () => {
        const task = cron.schedule(cron.time.everyDay(), () => { });

        test('Accessing the getter returns an object', () => {
            expect(typeof cron.tasks).toBe('object');
        })

        test('The getter returns the right number of tasks', () => {
            expect(Object.keys(cron.tasks).length).toBe(8);
        })

        const timedTask = cron.scheduleTime(Date.now() + 30 * 1000, () => { });
        
        test('The returned object contains the tasks', () => {
            expect(cron.tasks).toHaveProperty(task.name);
            expect(cron.tasks).toHaveProperty(timedTask.name);
        })

        task.stop();
        timedTask.cancel();
    })
})