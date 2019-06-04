# yarn-recursive

_Recursively run yarn in a folder_

Takes your tree and checks for package.json in every folder and runs `yarn` in every folder.

This is a fork of the [original project][1], with bug fixes, and performance and sanity patches.

## Arguments

You can add arguments when running the command

```
$ yarn-recursive --cmd upgrade
yarn upgrade v1.1.0
success All of your dependencies are up to date.
Done in 0.22s.

Current yarn path: YOUR_PATH/yarn-recursive/package.json...
End of yarns

```

```
$ yarn-recursive --cmd upgrade --opt <package-name>
```

## Skip root

If you want to skip the root directory of your project, add the `--skipRoot` option:

```
$ yarn-recursive --skipRoot --cmd test
```

This is useful if, for example, you want to run yarn-recursive from a script in your root
package.json, which would otherwise cause infinite recursion.

## Hidden Directories

By default, yarn-recursive will not search inside hidden directories (directories with names that
start with a dot, for example `.git`).

If you want to include hidden directories in the search, specify the `--includeHidden` option, for
example:

```
$ yarn-recursive --includeHidden
```


  [1]: https://github.com/nrigaudiere/yarn-recursive