
export const RegisteredDocComponents: {[name: string]: any} = {};

export function Doc(name: string) {
    return function(target: any) {
        RegisteredDocComponents[name] = target;
    };
}
