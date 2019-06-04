#!/usr/bin/env node

import clc = require("cli-color");
import fs = require("fs");
import path = require("path");
import shell = require("shelljs");
import {argv} from "yargs";

function packageJsonLocations(dirname: string, includeHidden: boolean): string[] {
    let filenames = fs.readdirSync(dirname)
        .filter(filename => filename !== "node_modules");

    if (!includeHidden) {
        filenames = filenames.filter(filename => !filename.match(/^\./));
    }

    let result: string[] = [];

    for (const filename of filenames) {
        const pathname = path.resolve(dirname, filename);
        const stat = fs.statSync(pathname);

        if (stat.isFile() && filename === "package.json") {
            result.push(dirname);
        } else if (stat.isDirectory()) {
            result = result.concat(packageJsonLocations(pathname, includeHidden));
        }
    }

    return result;
}

interface Result {
    directoryName: string;
    exitCode: number;
}

function yarn(directoryName: string): Result {
    let command = "yarn";

    if (argv.cmd) {
        command += " " + argv.cmd;
    }

    if (argv.opt) {
        command += " " + argv.opt;
    }

    console.log(clc.blueBright("Current yarn path: " + directoryName + "/package.json..."));

    shell.cd(directoryName);
    const result = shell.exec(command);

    return {
        directoryName,
        exitCode: result.code
    };
}

function filterRoot(directoryName: string): boolean {
    return path.normalize(directoryName) !== path.normalize(process.cwd());
}

if (require.main === module) {
    const exitCode = packageJsonLocations(process.cwd(), !!argv.includeHidden)
        .filter(argv.skipRoot ? filterRoot : filtered => filtered)
        .map(yarn)
        .reduce((code, result) => result.exitCode > code ? result.exitCode : code, 0);

    console.log(clc.green("End of yarns"));
    process.exit(exitCode);
}
