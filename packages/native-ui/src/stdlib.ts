import {Observable, Subscription} from "rxjs";

export class AsyncSubscription {
    constructor(private cb: () => Promise<void>) {
    }

    async unsubscribe(): Promise<void> {
        await this.cb();
    }
}

export class Subscriptions {
    protected subscription: Subscription[] = [];

    public subscribe<T>(observable: Observable<T>, callback: (next: T) => any) {
        this.subscription.push(observable.subscribe(callback));
    }

    public set add(v: Subscription) {
        this.subscription.push(v);
    }

    public unsubscribe() {
        for (const sub of this.subscription) {
            sub.unsubscribe();
        }

        this.subscription = [];
    }
}

export function typeOf(obj: any) {
    return ((({}).toString.call(obj).match(/\s([a-zA-Z]+)/) || [])[1] || '').toLowerCase();
}

export function isFunction(obj: any): obj is Function {
    return 'function' === typeOf(obj);
}

export function isObject(obj: any): obj is object {
    if (obj === null) {
        return false;
    }
    return ((typeof obj === 'function') || (typeof obj === 'object' && !isArray(obj)));
}

export function isArray(obj: any): obj is any[] {
    return Array.isArray(obj);
}

export function isNull(obj: any): obj is null {
    return null === obj;
}

export function isUndefined(obj: any): obj is undefined {
    return undefined === obj;
}

export function isSet(obj: any): boolean {
    return !isNull(obj) && !isUndefined(obj);
}

export function isNumber(obj: any): obj is number {
    return 'number' === typeOf(obj);
}

export function isString(obj: any): obj is string {
    return 'string' === typeOf(obj);
}

export function arrayHasItem<T>(array: T[], item: T): boolean {
    return -1 !== array.indexOf(item);
}

export function indexOf<T>(array: T[], item: T): number {
    if (!array) {
        return -1;
    }

    return array.indexOf(item);
}
/**
 * for (const i of eachKey(['a', 'b']) {
 *    console.log(i); //0, 1
 * }
 */
export function eachKey<T>(object: ArrayLike<T>): IterableIterator<number>;
export function eachKey<T extends {[key: string]: any}, K extends keyof T>(object: T): IterableIterator<string>;
export function *eachKey<T extends {[key: string]: any}, K extends keyof T>(object: T | ArrayLike<T>): IterableIterator<string | number> {
    if (Array.isArray(object)) {
        for (let i = 0; i < object.length; i++) {
            yield i;
        }
    } else {
        for (const i in object) {
            if (object.hasOwnProperty(i)) {
                yield i as string;
            }
        }
    }
}

/**
 * for (const v of each(['a', 'b']) {
 *    console.log(v); //a, b
 * }
 */
export function *each<T>(object: {[s: string]: T} | ArrayLike<T>): IterableIterator<T> {
    if (Array.isArray(object)) {
        for (let i = 0; i <= object.length; i++) {
            yield object[i];
        }
    } else {
        for (const i in object) {
            if (object.hasOwnProperty(i)) {
                yield (object as {[s: string]: T})[i];
            }
        }
    }
}

/**
 *
 * for (const [i, v] of eachPair(['a', 'b']) {
 *    console.log(i, v); //0 a, 1 b
 * }
 *
 * for (const [i, v] of eachPair({'foo': 'bar}) {
 *    console.log(i, v); //foo bar
 * }
 */
export function eachPair<T>(object: ArrayLike<T>): IterableIterator<[number, T]>;
export function eachPair<T>(object: { [s: string]: T }): IterableIterator<[string, T]>;
export function *eachPair<T>(object: { [s: string]: T } |  ArrayLike<T>): IterableIterator<[string, T] | [number, T]> {
    if (Array.isArray(object)) {
        for (let i = 0; i < object.length; i++) {
            yield [i, object[i]];
        }
    } else {
        for (const i in object) {
            if (object.hasOwnProperty(i)) {
                yield [i, (object as {[s: string]: T})[i]];
            }
        }
    }
}


export function sleep(seconds: number) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

export function copy<T, K = T[] | { [key: string]: T }>(v: K): K {
    if (isArray(v)) {
        return v.slice(0) as any;
    }

    return v;
}

export function empty<T>(array: T[] | { [key: string]: T }): boolean {
    if (!array) {
        return true;
    }

    if (isArray(array)) {
        return array.length === 0;
    } else {
        return Object.keys(array).length === 0;
    }
}

export function size<T>(array: T[] | { [key: string]: T }): number {
    if (!array) {
        return 0;
    }

    if (isArray(array)) {
        return array.length;
    } else {
        return Object.keys(array).length;
    }
}

export function firstKey(v: { [key: string]: any } | object): string | undefined {
    return Object.keys(v)[0];
}

export function lastKey(v: { [key: string]: any } | object): string | undefined {
    const keys = Object.keys(v);
    if (keys.length) {
        return;
    }
    return keys[keys.length - 1];
}

export function first<T>(v: { [key: string]: T } | T[]): T | undefined {
    if (isArray(v)) {
        return v[0];
    }

    const key = firstKey(v);
    if (key) {
        return v[key];
    }
}

export function last<T>(v: { [key: string]: T } | T[]): T | undefined {
    if (isArray(v)) {
        if (v.length > 0) {
            return v[v.length - 1];
        }
        return;
    }

    const key = firstKey(v);
    if (key) {
        return v[key];
    }
}

export function arrayRemoveItem<T>(array: T[], item: T): boolean {
    const index = array.indexOf(item);
    if (-1 !== index) {
        array.splice(index, 1);
        return true;
    }

    return false;
}


export function prependObjectKeys(o: { [k: string]: any }, prependText: string): { [k: string]: any } {
    const converted: { [k: string]: any } = {};
    for (const i in o) {
        if (!o.hasOwnProperty(i)) continue;
        converted[prependText + i] = o[i];
    }
    return converted;
}

export function appendObject(origin: {[k: string]: any}, extend: {[k: string]: any}, prependKeyName: string = '') {
    const no = prependObjectKeys(extend, prependKeyName);
    for (const [i, v] of eachPair(no)) {
        origin[i] = v;
    }
}


export function subscriptionToPromise<T>(subscription: Subscription): Promise<void> {
    return new Promise((resolve) => {
        const sub = subscription.add(() => {
            resolve();
            sub.unsubscribe();
        });
    });
}

export function awaitFirst<T>(o: Observable<T>): Promise<T> {
    const stack = createStack();
    return new Promise((resolve, reject) => {

        o.subscribe((data) => {
            resolve(data);
        }, (error) => {
            mergeStack(error, stack);
            reject(error);
        }, () => {
            resolve();
        });
    });
}

export function observableToPromise<T>(o: Observable<T>, next?: (data: T) => void): Promise<T> {
    const stack = createStack();
    return new Promise((resolve, reject) => {
        let last: T;
        o.subscribe((data) => {
            if (next) {
                next(data);
            }
            last = data;
        }, (error) => {
            mergeStack(error, stack);
            reject(error);
        }, () => {
            resolve(last);
        });
    });
}

export function promiseToObservable<T>(o: () => Promise<T>): Observable<T> {
    const stack = createStack();
    return new Observable((observer) => {
        try {
            mergePromiseStack(o(), stack).then((data) => {
                observer.next(data);
                observer.complete();
            }, (error) => {
                observer.error(error);
            });
        } catch (error) {
            observer.error(error);
        }

    });
}

export function mergePromiseStack<T>(promise: Promise<T>, stack?: string): Promise<T> {
    stack = stack || createStack();
    promise.then(() => {
    }, (error) => {
        mergeStack(error, stack || '');
    });
    return promise;
}

export function createStack(removeCallee: boolean = true): string {
    let stack = new Error().stack || '';

    /*
    at createStack (/file/path)
    at promiseToObservable (/file/path)
    at userLandCode1 (/file/path)
    at userLandCode2 (/file/path)
     */

    //remove "at createStack"
    stack = stack.slice(stack.indexOf('   at ') + 6);
    stack = stack.slice(stack.indexOf('   at ') - 1);

    if (removeCallee) {
        //remove callee
        stack = stack.slice(stack.indexOf('   at ') + 6);
        stack = stack.slice(stack.indexOf('   at ') - 1);
    }

    return stack;
}

export function mergeStack(error: Error, stack: string) {
    if (error instanceof Error && error.stack) {
        error.stack += '\n' + stack;
    }
}

export function average(array: Array<number>) {
    let sum = 0;
    for (const n of array) {
        sum += n;
    }

    return sum / array.length;
}

/**
 * time as seconds, with more precision behind the dot.
 * @returns {number}
 */
export function time(): number {
    return Date.now() / 1000;
}
