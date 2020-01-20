
export const RegisteredDocComponents: {[name: string]: any} = {};

export function RegisterDocu(name: string) {
    return function(target: any) {
        RegisteredDocComponents[name] = target;
    };
}
