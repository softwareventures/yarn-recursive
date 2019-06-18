export type Argument = Option | string;

export interface Option {
    readonly type: "option";
    readonly name: string;
    readonly value: string | boolean;
}

export function readArguments(argv: ReadonlyArray<string>): ReadonlyArray<Argument> {
    return argv.map(readArgument);
}

export function readArgument(arg: string): Argument {
    if (arg === "--") {
        return arg;
    }

    const matches = /^--([^=]*)(?:=(.*))?$/.exec(arg);

    if (matches) {
        let name = matches[1].replace(/-./g, s => s.charAt(1).toUpperCase());
        let value = matches[2] == null
            ? true
            : matches[2];

        if (value === true && name.match(/^no[A-Z]/)) {
            name = name.replace(/^no[A-Z]/, s => s.charAt(2).toLowerCase());
            value = false;
        }

        return {type: "option", name, value};
    } else {
        return arg;
    }
}