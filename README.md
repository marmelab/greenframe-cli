enterprise-cli
==============

Official GreenFrame CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g greenframe-cli
$ greenframe COMMAND
running command...
$ greenframe (--version|-v)
greenframe-cli/1.3.7 linux-x64 node-v18.4.0
$ greenframe --help [COMMAND]
USAGE
  $ greenframe COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`greenframe analyze [SCENARIO] [BASEURL]`](#greenframe-analyze-scenario-baseurl)
* [`greenframe kube-config`](#greenframe-kube-config)
* [`greenframe open [SCENARIO] [BASEURL]`](#greenframe-open-scenario-baseurl)
* [`greenframe update [CHANNEL]`](#greenframe-update-channel)

## `greenframe analyze [SCENARIO] [BASEURL]`

Create an analysis on GreenFrame server.

```
USAGE
  $ greenframe analyze [SCENARIO] [BASEURL] [-C <value>] [-K <value>] [-t <value>] [-p <value>] [-c <value>]
    [--commitId <value>] [-b <value>] [-s <value>] [-d] [-f] [-a]

ARGUMENTS
  SCENARIO  Path to your GreenFrame scenario
  BASEURL   Your baseURL website

FLAGS
  -C, --configFile=<value>     Path to config file
  -K, --kubeConfig=<value>     Path to kubernetes client config file
  -a, --useAdblock             Use an adblocker during analysis
  -b, --branchName=<value>     Pass branch name manually
  -c, --commitMessage=<value>  Pass commit message manually
  -d, --distant                Run a distant analysis on GreenFrame Server instead of locally
  -f, --free                   Run an analysis without sending results to GreenFrame Server
  -p, --projectName=<value>    Project name
  -s, --samples=<value>        Number of runs done for the score computation
  -t, --threshold=<value>      Consumption threshold
  --commitId=<value>           Pass commit id manually

DESCRIPTION
  Create an analysis on GreenFrame server.
```

_See code: [dist/commands/analyze.ts](https://github.com/marmelab/greenframe/blob/v1.3.7/dist/commands/analyze.ts)_

## `greenframe kube-config`

Configure kubernetes cluster to collect greenframe metrics

```
USAGE
  $ greenframe kube-config [-C <value>] [-K <value>] [-D]

FLAGS
  -C, --configFile=<value>  Path to config file
  -D, --delete              Delete daemonset and namespace from kubernetes cluster
  -K, --kubeConfig=<value>  Path to kubernetes client config file

DESCRIPTION
  Configure kubernetes cluster to collect greenframe metrics

  ...

  greenframe kube-config
```

_See code: [dist/commands/kube-config.ts](https://github.com/marmelab/greenframe/blob/v1.3.7/dist/commands/kube-config.ts)_

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

_See code: [dist/commands/open.ts](https://github.com/marmelab/greenframe/blob/v1.3.7/dist/commands/open.ts)_

## `greenframe update [CHANNEL]`

Update GreenFrame to the latest version

```
USAGE
  $ greenframe update [CHANNEL]

ARGUMENTS
  CHANNEL  [default: stable] Release channel

DESCRIPTION
  Update GreenFrame to the latest version

  ...

  greenframe update
```

_See code: [dist/commands/update.ts](https://github.com/marmelab/greenframe/blob/v1.3.7/dist/commands/update.ts)_
<!-- commandsstop -->
