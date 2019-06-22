export interface Options {
    readonly skipRoot: boolean;
    readonly includeHidden: boolean;
    readonly concurrent: boolean;
    readonly command: ReadonlyArray<string>;
    readonly deprecatedCmdOpt: boolean;
}

export function readArguments(args: ReadonlyArray<string>): Options {
    let skipRoot = false;
    let includeHidden = false;
    let concurrent = false;
    let command: string[] = [];
    let deprecatedCmdOpt = false;
    let mode: "bare" | "cmd" | "opt" | "passthrough" = "bare";

    for (const arg of args) {
        if (mode === "passthrough") {
            command.push(arg);
        } else if (mode === "cmd") {
            command = arg.split(" ").concat(command);
            mode = "bare";
        } else if (mode === "opt") {
            command = command.concat(arg.split(" "));
            mode = "bare";
        } else {
            const argument = readArgument(arg);
            if (argument === "--") {
                mode = "passthrough";
            } else if (typeof argument === "string") {
                command.push(argument);
            } else if (argument.name === "skip-root") {
                skipRoot = !!argument.value;
            } else if (argument.name === "include-hidden") {
                includeHidden = !!argument.value;
            } else if (argument.name === "concurrent") {
                concurrent = !!argument.value;
            } else if (argument.name === "cmd") {
                deprecatedCmdOpt = true;
                if (typeof argument.value === "string") {
                    command = argument.value.split(" ").concat(command);
                } else if (argument.value) {
                    mode = "cmd";
                }
            } else if (argument.name === "opt") {
                deprecatedCmdOpt = true;
                if (typeof argument.value === "string") {
                    command = command.concat(argument.value.split(" "));
                } else if (argument.value) {
                    mode = "opt";
                }
            } else {
                command.push(arg);
            }
        }
    }

    return {skipRoot, includeHidden, concurrent, command, deprecatedCmdOpt};
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
        let name = matches[1].replace(/[A-Z]/g, s => "-" + s.toLowerCase());
        let value = matches[2] == null
            ? true
            : matches[2];

        if (value === true && name.match(/^no-[a-z]/)) {
            name = name.replace(/^no-[a-z]/, s => s.charAt(3));
            value = false;
        }

        return {type: "option", name, value};
    } else {
        return arg;
    }
}