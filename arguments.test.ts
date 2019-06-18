import test from "ava";
import {readArgument} from "./arguments";

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