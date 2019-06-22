#!/usr/bin/env node

import {filterFn, foldFn, mapFn} from "@softwareventures/array";
import chain from "@softwareventures/chain";
import {fork} from "child_process";
import clc = require("cli-color");
import fs = require("fs");
import pAll from "p-all";
import pSeries from "p-series";
import path = require("path");
import {readArguments} from "./arguments";

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

function yarn(yarnPath: string, directoryName: string, command: ReadonlyArray<string>): Promise<Result> {
    console.log(clc.blueBright("Current yarn path: " + directoryName + path.sep + "package.json..."));

    return new Promise((resolve, reject) => {
        fork(yarnPath, command, {cwd: directoryName, stdio: "inherit"})
            .on("error", reject)
            .on("exit", (code) => resolve({
                directoryName,
                exitCode: code == null ? 1 : code
            }));
    });
}

function filterRoot(directoryName: string): boolean {
    return path.normalize(directoryName) !== path.normalize(process.cwd());
}

if (require.main === module) {
    const options = readArguments(process.argv.slice(2));

    const yarnPath = require.resolve("yarn/bin/yarn.js");

    chain(packageJsonLocations(process.cwd(), options.includeHidden))
        .map(filterFn(options.skipRoot ? filterRoot : () => true))
        .map(mapFn(directoryName => () => yarn(yarnPath, directoryName, options.command)))
        .map<Promise<Result[]>>(options.concurrent ? pAll : pSeries)
        .value
        .then(foldFn((code, result) => result.exitCode > code ? result.exitCode : code, 0))
        .then(exitCode => {
            console.log(clc.green("End of yarns"));

            if (options.deprecatedCmdOpt) {
                console.warn(clc.red("Warning: The --cmd and --opt options are deprecated and will be removed in a " +
                    "future release.\n" +
                    "         Any arguments not recognised by yarn-recursive are now passed through to yarn as is.\n" +
                    "         For example, instead of '--cmd install --opt --flat', you can now write just 'install " +
                    "--flat'."));
            }

            process.exit(exitCode);
        })
        .catch(reason => console.error(clc.red(reason)));
}
