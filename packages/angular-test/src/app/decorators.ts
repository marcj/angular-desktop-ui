
export const RegisteredDocComponents: {[name: string]: any} = {};

export function Doc(name) {
    return function(target) {
        RegisteredDocComponents[name] = target;
    };
}
