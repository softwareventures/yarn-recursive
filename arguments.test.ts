import test from "ava";
import {readArgument, readArguments} from "./arguments";

test("readArgument", t => {
    t.deepEqual(readArgument("--skip-root"), {type: "option", name: "skipRoot", value: true});
    t.deepEqual(readArgument("--no-skip-root"), {type: "option", name: "skipRoot", value: false});
    t.deepEqual(readArgument("--skipRoot"), {type: "option", name: "skipRoot", value: true});
    t.deepEqual(readArgument("--noSkip-root"), {type: "option", name: "skipRoot", value: false});
    t.deepEqual(readArgument("--noSkipRoot"), {type: "option", name: "skipRoot", value: false});
    t.deepEqual(readArgument("--cmd=install"), {type: "option", name: "cmd", value: "install"});
    t.deepEqual(readArgument("--no-cmd=install"), {type: "option", name: "noCmd", value: "install"});
    t.deepEqual(readArgument("--cmd"), {type: "option", name: "cmd", value: true});
    t.deepEqual(readArgument("--no-cmd"), {type: "option", name: "cmd", value: false});
    t.deepEqual(readArgument("install"), "install");
    t.deepEqual(readArgument("--"), "--");
});

test("readArguments", t => {
    t.deepEqual(readArguments(
        [
            "--skip-root", "--no-skip-root", "--skipRoot", "--noSkip-root", "--noSkipRoot",
            "--cmd=install", "--no-cmd=install", "--cmd", "--no-cmd", "install", "--"
        ]),
        [
            {type: "option", name: "skipRoot", value: true},
            {type: "option", name: "skipRoot", value: false},
            {type: "option", name: "skipRoot", value: true},
            {type: "option", name: "skipRoot", value: false},
            {type: "option", name: "skipRoot", value: false},
            {type: "option", name: "cmd", value: "install"},
            {type: "option", name: "noCmd", value: "install"},
            {type: "option", name: "cmd", value: true},
            {type: "option", name: "cmd", value: false},
            "install",
            "--"
        ]);
});