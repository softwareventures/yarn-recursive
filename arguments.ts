export interface Options {
    readonly skipRoot: boolean;
    readonly includeHidden: boolean;
    readonly command: ReadonlyArray<string>;
}

export function readArguments(args: ReadonlyArray<string>): Options {
    let skipRoot = false;
    let includeHidden = false;
    let command: string[] = [];
    let mode: "bare" | "cmd" | "opt" | "passthrough" = "bare";

    for (const arg of args) {
        if (mode === "passthrough") {
            command.push(arg);
        } else if (mode === "cmd") {
            command = shell(arg).concat(command);
            mode = "bare";
        } else if (mode === "opt") {
            command = command.concat(shell(arg));
            mode = "bare";
        } else {
            const argument = readArgument(arg);
            if (argument === "--") {
                mode = "passthrough";
            } else if (typeof argument === "string") {
                command.push(argument);
            } else if (argument.name === "skipRoot") {
                skipRoot = !!argument.value;
            } else if (argument.name === "includeHidden") {
                includeHidden = !!argument.value;
            } else if (argument.name === "cmd") {
                if (typeof argument.value === "string") {
                    command = shell(argument.value).concat(command);
                } else if (argument.value) {
                    mode = "cmd";
                }
            } else if (argument.name === "opt") {
                if (typeof argument.value === "string") {
                    command = command.concat(shell(argument.value));
                } else if (argument.value) {
                    mode = "opt";
                }
            } else {
                command.push(arg);
            }
        }
    }

    return {skipRoot, includeHidden, command};
}

export function shell(arg: string): string[] {
    // FIXME
    return arg.split(" ");
}

export type Argument = Option | string;

export interface Option {
    readonly type: "option";
    readonly name: string;
    readonly value: string | boolean;
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