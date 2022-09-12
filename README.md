enterprise-cli
==============

Official GreenFrame CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/enterprise-cli.svg)](https://npmjs.org/package/enterprise-cli)
[![Downloads/week](https://img.shields.io/npm/dw/enterprise-cli.svg)](https://npmjs.org/package/enterprise-cli)
[![License](https://img.shields.io/npm/l/enterprise-cli.svg)](https://github.com/Clebiez/enterprise-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g enterprise-cli
$ greenframe COMMAND
running command...
$ greenframe (--version|-v)
enterprise-cli/1.2.0 linux-x64 node-v16.3.0
$ greenframe --help [COMMAND]
USAGE
  $ greenframe COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`greenframe analyze [SCENARIO] [BASEURL]`](#greenframe-analyze-scenario-baseurl)
* [`greenframe open [SCENARIO] [BASEURL]`](#greenframe-open-scenario-baseurl)
* [`greenframe update [CHANNEL]`](#greenframe-update-channel)

## `greenframe analyze [SCENARIO] [BASEURL]`

Create an analysis on GreenFrame server.

```
USAGE
  $ greenframe analyze [SCENARIO] [BASEURL] [-C <value>] [-t <value>] [-p <value>] [-c <value>] [--commitId
    <value>] [-b <value>] [-s <value>] [-d] [-a]

ARGUMENTS
  SCENARIO  Path to your GreenFrame scenario
  BASEURL   Your baseURL website

FLAGS
  -C, --configFile=<value>     Path to config file
  -a, --useAdblock             Use an adblocker during analysis
  -b, --branchName=<value>     Pass branch name manually
  -c, --commitMessage=<value>  Pass commit message manually
  -d, --distant                Run a distant analysis on GreenFrame Server instead of locally
  -p, --projectName=<value>    Project name
  -s, --samples=<value>        Number of runs done for the score computation
  -t, --threshold=<value>      Consumption threshold
  --commitId=<value>           Pass commit id manually

DESCRIPTION
  Create an analysis on GreenFrame server.
```

_See code: [src/commands/analyze.js](https://github.com/marmelab/greenframe/blob/v1.2.0/src/commands/analyze.js)_

## `greenframe open [SCENARIO] [BASEURL]`

Open browser to develop your GreenFrame scenario

```
USAGE
  $ greenframe open [SCENARIO] [BASEURL] [-C <value>] [-a]

ARGUMENTS
  SCENARIO  Path to your GreenFrame scenario
  BASEURL   Your baseURL website

FLAGS
  -C, --configFile=<value>  Path to config file
  -a, --useAdblock          Use an adblocker during analysis

DESCRIPTION
  Open browser to develop your GreenFrame scenario

  ...

  greenframe analyze ./yourScenario.js https://greenframe.io
```

_See code: [src/commands/open.js](https://github.com/marmelab/greenframe/blob/v1.2.0/src/commands/open.js)_

## `greenframe update [CHANNEL]`

Update GreenFrame to the latest version

```
USAGE
  $ greenframe update [CHANNEL]

ARGUMENTS
  CHANNEL  Release channel

DESCRIPTION
  Update GreenFrame to the latest version

  ...

  greenframe update
```

_See code: [src/commands/update.js](https://github.com/marmelab/greenframe/blob/v1.2.0/src/commands/update.js)_
<!-- commandsstop -->
