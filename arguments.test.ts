import test from "ava";
import {readArgument, readArguments} from "./arguments";

test("readArgument", t => {
    t.deepEqual(readArgument("--skip-root"), {type: "option", name: "skip-root", value: true});
    t.deepEqual(readArgument("--no-skip-root"), {type: "option", name: "skip-root", value: false});
    t.deepEqual(readArgument("--skipRoot"), {type: "option", name: "skip-root", value: true});
    t.deepEqual(readArgument("--noSkip-root"), {type: "option", name: "skip-root", value: false});
    t.deepEqual(readArgument("--noSkipRoot"), {type: "option", name: "skip-root", value: false});
    t.deepEqual(readArgument("--cmd=install"), {type: "option", name: "cmd", value: "install"});
    t.deepEqual(readArgument("--no-cmd=install"), {type: "option", name: "no-cmd", value: "install"});
    t.deepEqual(readArgument("--noCmd=install"), {type: "option", name: "no-cmd", value: "install"});
    t.deepEqual(readArgument("--cmd"), {type: "option", name: "cmd", value: true});
    t.deepEqual(readArgument("--no-cmd"), {type: "option", name: "cmd", value: false});
    t.deepEqual(readArgument("install"), "install");
    t.deepEqual(readArgument("--"), "--");
});

test("readArguments", t => {
    t.deepEqual(readArguments([]),
        {skipRoot: false, includeHidden: false, command: [], deprecatedCmdOpt: false});
    t.deepEqual(readArguments(["--skip-root"]),
        {skipRoot: true, includeHidden: false, command: [], deprecatedCmdOpt: false});
    t.deepEqual(readArguments(["--skip-root", "--no-skip-root"]),
        {skipRoot: false, includeHidden: false, command: [], deprecatedCmdOpt: false});
    t.deepEqual(readArguments(["--no-skip-root", "--skipRoot"]),
        {skipRoot: true, includeHidden: false, command: [], deprecatedCmdOpt: false});
    t.deepEqual(readArguments(["install"]),
        {skipRoot: false, includeHidden: false, command: ["install"], deprecatedCmdOpt: false});
    t.deepEqual(readArguments(["install", "--flat"]),
        {skipRoot: false, includeHidden: false, command: ["install", "--flat"], deprecatedCmdOpt: false});
    t.deepEqual(readArguments(["--", "install", "--skip-root"]),
        {skipRoot: false, includeHidden: false, command: ["install", "--skip-root"], deprecatedCmdOpt: false});
    t.deepEqual(readArguments(["--skip-root", "--include-hidden", "--", "install", "--flat"]),
        {skipRoot: true, includeHidden: true, command: ["install", "--flat"], deprecatedCmdOpt: false});
    t.deepEqual(readArguments(["--include-hidden", "--opt", "--flat", "--cmd", "install"]),
        {skipRoot: false, includeHidden: true, command: ["install", "--flat"], deprecatedCmdOpt: true});
    t.deepEqual(readArguments(["--opt", "--check-files --flat", "--skip-root", "--cmd", "install"]),
        {
            skipRoot: true,
            includeHidden: false,
            command: ["install", "--check-files", "--flat"],
            deprecatedCmdOpt: true
        });
    t.deepEqual(readArguments(["--cmd", "install --flat"]),
        {skipRoot: false, includeHidden: false, command: ["install", "--flat"], deprecatedCmdOpt: true});
});