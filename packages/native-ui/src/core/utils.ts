import {Observable} from "rxjs";

const electron = (window as any).electron || ((window as any).require ? (window as any).require('electron') : undefined);

export class Electron {
    public static getRemote(): any {
        if (!electron) {
            throw new Error('No Electron available.');
        }

        return electron.remote;
    }

    public static isAvailable(): any {
        return !!electron;
    }

    public static getRemoteOrUndefined(): any {
        return electron ? electron.remote : undefined;
    }

    public static getProcess() {
        return Electron.getRemote().process;
    }
}

/**
 * Checks if `target` is children of `parent` or if `target` is `parent`.
 */
export function isTargetChildOf(target: HTMLElement | EventTarget | null, parent: HTMLElement): boolean {
    if (!target) return false;

    if (target === parent) return true;

    if (target instanceof HTMLElement) {
        let targetElement: HTMLElement = target;
        while (targetElement.parentElement) {
            if (targetElement.parentElement === parent) {
                return true;
            }
            targetElement = targetElement.parentElement;
        }
    }

    return false;
}

export function triggerResize() {
    requestAnimationFrame(() => {
        window.dispatchEvent(new Event('resize'));
    });
}

export function focusWatcher(target: HTMLElement, allowedFocuses: HTMLElement[] = []): Observable<void> {
    return new Observable<void>((observer) => {
        target.focus();
        let currentlyFocused: HTMLElement | null = target;

        function isFocusAllowed() {
            if (!currentlyFocused) {
                return false;
            }

            if (isTargetChildOf(currentlyFocused, target)) {
                return true;
            }

            for (const focus of allowedFocuses) {
                if (isTargetChildOf(currentlyFocused, focus)) {
                    return true;
                }
            }

            return false;
        }

        function check() {
            if (!isFocusAllowed()) {
                observer.next();
                observer.complete();
            }
        }

        function onFocusOut() {
            currentlyFocused = null;
            requestAnimationFrame(check);
        }

        function onFocusIn(event: FocusEvent) {
            currentlyFocused = event.target as any;
            requestAnimationFrame(check);
        }

        window.addEventListener('focusin', onFocusIn as any);
        window.addEventListener('focusout', onFocusOut as any);

        function unsubscribe(): void {
            window.removeEventListener('focusin', onFocusIn as any);
            window.removeEventListener('focusout', onFocusOut as any);
        }

        return {unsubscribe: unsubscribe};
    });
}
