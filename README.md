# yarn-recursive

_Recursively run yarn in a folder_

Takes your tree and checks for package.json in every folder and runs `yarn` in every folder.

This is a fork of the [original project][1], with bug fixes, and performance and sanity patches.


## Usage

```
$ yarn-recursive [options] [--] [command] [yarn-options]
```

Recursively runs yarn in the current working directory.

Arguments for `yarn-recursive` and `yarn` may be freely mixed on the command line. Any argument not handled by
`yarn-recursive` will be passed through to `yarn` as-is.

For example:

```bash
$ yarn-recursive install
```

Recursively runs `yarn install` in every subdirectory that contains a `package.json`, including the current directory.

You can also specify a `--` argument on its own to let `yarn-recursive` know that it should not attempt to process the
subsequent arguments. If there are any arguments after the `--` argument, then they will be passed through to `yarn`
as-is. This is useful in case in the future `yarn` gains options that have the same name as options handled by
`yarn-recursive`. In this way you can force `yarn-recursive` to pass through the option.

For example:

```
$ yarn-recursive --skip-root -- install --include-hidden
```

Recursively runs `yarn install --include-hidden` in every subdirectory that contains a `package.json`, excluding the
current directory. The `include-hidden` option is passed through to `yarn` even though it would normally be handled by
`yarn-recursive`. (But note that `yarn` doesn't have an option called `--include-hidden`, so this will fail.)


## Skip root

If you want to skip the root directory of your project, add the `--skip-root` option:

```
$ yarn-recursive --skip-root test
```

Runs `yarn test` in every subdirectory that contains a `package.json`, excluding the current directory.

This is useful if, for example, you want to run yarn-recursive from a script in your root
package.json, which would otherwise cause infinite recursion.


## Hidden Directories

By default, yarn-recursive will not search inside hidden directories (directories with names that
start with a dot, for example `.git`).

If you want to include hidden directories in the search, specify the `--include-hidden` option, for
example:

```
$ yarn-recursive --include-hidden
```


## Concurrency

By default, yarn-recursive will run yarn for each project sequentially.

To run yarn for all projects concurrently, specify the `--concurrent` option, for example:

```
$ yarn-recursive --concurrent start
```

This is particularly useful for commands like `yarn start` which may not exit until the user stops them.

This feature is not recommended for general build tasks such as `yarn install`, since output from each concurrent
process will be interleaved in the console and likely be difficult to read.

This feature is experimental and will be improved in future releases.


  [1]: https://github.com/nrigaudiere/yarn-recursive