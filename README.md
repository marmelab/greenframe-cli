# GreenFrame CLI

Estimate the carbon footprint of a user scenario on a web application. Full-stack analysis (browser, screen, network, server).

Can be used standalone, in a CI/CD pipeline, and in conjunction with the [greenframe.io](https://greenframe.io) service.

-   [In A Nutshell](#in-a-nutshell)
-   [Installation](#installation)
-   [Usage](#usage)
-   [How Does GreenFrame Work?](#how-does-greenframe-work)
-   [Which Factors Influence The Carbon Footprint?](#which-factors-influence-the-carbon-footprint)
-   [Commands](#commands)

# In A Nutshell

The share of digital technologies in global greenhouse gas emissions has passed air transport, and will soon pass car transport ([source](https://theshiftproject.org/wp-content/uploads/2019/03/Executive-Summary_Lean-ICT-Report_EN_lowdef.pdf)). At 4% of total emissions, and with a growth rate of 9% per year, the digital sector is a major contributor to global warming.

How do developers adapt their practices to build less energy intensive web applications?

GreenFrame is a command-line tool that estimates the carbon footprint of web apps at every stage of the development process. Put it in your Continuous Integration workflow to get warned about "carbon leaks", and force a threshold of maximum emissions.

For instance, to estimate the energy consumption and carbon emissions of a visit to a public web page, call `greenframe analyze`:

```
$ greenframe analyze https://marmelab.com
✅ main scenario completed
The estimated footprint is 0.038 g eq. co2 ± 1.3% (0.085 Wh).
```

# Installation

To install GreenFrame CLI, type the following command in your favorite terminal:

```
curl https://assets.greenframe.io/install.sh | bash
```

To verify that GreenFrame CLI has correctly been installed, type:

```
$ greenframe -v
enterprise-cli/1.5.0 linux-x64 node-v16.14.0
```

# Usage

By default, GreenFrame runs a "visit" scenario on a public web page and computes the energy consumption of the browser, the screen, and the public network. But it can go further.

## Custom Scenario

You can run a custom scenario instead of the "visit" scenario by passing a scenario file to the `analyze` command:

```
$ greenframe analyze https://marmelab.com ./my-scenario.js
```

GreenFrame uses [PlayWright](https://playwright.dev/) to run scenarios. A custom PlayWright scenario looks like the following:

```js
// in my-scenario.js
const scenario = async (page) => {
    await page.goto('', { waitUntil: 'networkidle' }); // Go to the baseUrl
    await page.waitForTimeout(3000); // Wait for 3 seconds
    await page.scrollToElement('footer'); // Scroll to the footer (if present)
    await page.waitForNetworkIdle(); // Wait every request has been answered as a normal user.
};

module.exports = scenario;
```

Check [the PlayWright documentation on writing tests](https://playwright.dev/docs/writing-tests) for more information.

You can test your scenario using the `greenframe open` command. It uses the local Chrome browser to run the scenario:

```
$ greenframe open https://marmelab.com ./my-scenario.js
```

You can write scenarios by hand, or use [the PlayWright Test Generator](https://playwright.dev/docs/codegen) to generate a scenario based on a user session.

## Full-Stack Analysis

You can monitor the energy consumption of other docker containers while running the scenario. This allows spawning an entire infrastructure and monitoring the energy consumption of the whole stack.

For instance, if you start a set of docker containers using `docker-compose`, containing the following services:

```
$ docker ps
CONTAINER ID   IMAGE        COMMAND                  CREATED         STATUS        PORTS                   NAMES
d94f1c458c19   node:16      "docker-entrypoint.s…"   7 seconds ago   Up 7 seconds  0.0.0.0:3003->3000/tcp  enterprise_app
f024c10e666b   node:16      "docker-entrypoint.s…"   7 seconds ago   Up 7 seconds  0.0.0.0:3006->3006/tcp  enterprise_api
b6b5f8eb9a6d   postgres:13  "docker-entrypoint.s…"   8 seconds ago   Up 8 seconds  0.0.0.0:5434->5432/tcp  enterprise_db
```

You can run an analysis on the full stack (the browser + the 3 server containers) by passing the `--containers` and `--databaseContainers` option:

```sh
$ greenframe analyze https://localhost:3000/ ./my-scenario.js --containers="enterprise_app,enterprise_api" --databaseContainers="enterprise_db"
```

GreenFrame needs to identify database containers because it computes the impact of network I/O differently between the client and the server, and within the server infrastructure.

## Using An Ad Blocker

Third-party tags can be a significant source of energy consumption. When you use the `--useAdblock` option, GreenFrame uses an Ad Blocker to let you estimate that cost.

Run two analyses, a normal one then an ad-blocked one, and compare the results:

```sh
$ greenframe analyze https://adweek.com
The estimated footprint is 0.049 g eq. co2 ± 1% (0.112 Wh).
$ greenframe analyze https://adweek.com --useAdblock
The estimated footprint is 0.028 g eq. co2 ± 1.1% (0.063 Wh).
```

In this example, the cost of ads and analytics is 0.049g - 0.028g = 0.021g eq. co2 (42% of the total footprint).

## Defining A Threshold

The `greenframe` CLI was designed to be used in a CI/CD pipeline. You can define a threshold in `g eq. co2` to fail the build if the carbon footprint is too high:

```sh
$ greenframe analyze https://cnn.com --threshold=0.045
❌ main scenario failed
The estimated footprint at 0.05 g eq. co2 ± 1.3% (0.114 Wh) passes the limit configured at 0.045 g eq. co2.
```

In case of failed analysis, the CLI exits with exit code 1.

## Syncing With GreenFrame.io

If you want to get more insights about your carbon footprint, you can sync your analysis with [GreenFrame.io](https://greenframe.io). This service provides:

-   A dashboard to monitor your carbon footprint over time
-   A detailed analysis of your carbon footprint, with a breakdown by scenario, container, scenario step, and component
-   A comparison with previous analyses on the `main` branch (for Pull Request analysis)

![image](https://user-images.githubusercontent.com/99944/193788309-447a3006-4f05-4330-aa13-ab27d3cd8522.png)

To get started, [subscribe to GreenFrame.io](https://greenframe.io/#pricing) and create a new project. Then, get your token from the greenframe project page. Pass this token to each greenframe command using the `GREENFRAME_SECRET_TOKEN` environment variable:

```
$ GREENFRAME_SECRET_TOKEN=your-token-here greenframe analyze https://marmelab.com
✅ main scenario completed
The estimated footprint is 0.038 g eq. co2 ± 9.6% (0.086 Wh).
Check the details of your analysis at https://app.greenframe.io/analyses/7d7b7777-600c-4399-842f-b70db9408f53
```

When using a greenframe.io token, the `greenframe analyze` command generates an online report with much more details than the estimated footprint, and outputs its URL on the console.

Alternately, you can export this environment variable in your shell configuration file (`.bashrc`, `.zshrc`, etc.).

```
export GREENFRAME_SECRET_TOKEN=your-token-here
```

## Benchmarking Against Other Sites

How does the carbon footprint of your site compare to other sites?

GreenFrame.io runs a "visit" scenario over many websites in several categories. This allows you to compare your site to other sites in the same category.

If you're using a custom scenario, run the same scenario over another URL to compare the results.

The problem is that a given "scenario" may need adaptations to run on another site. For instance, the "add to cart" scenario may need to click on a different button to add an item to the cart. So the hard part of benchmarking is to define a scenario for each site.

## Diffing Against Previous Analyses

If you're using GreenFrame.io, you can compare your analysis with the previous one on the `main` branch. This allows you to monitor the evolution of your carbon footprint over time.

The greenframe CLI will automatically detect that you're in a git checkout, and store the commit hash in the analysis metadata. When run on a branch, it will also look for the latest analysis on the main branch, and compare the two. The results are visible on the analysis page on GreenFrame.io.

**Tip**: You can customize the name of the main branch using the `.greenframe.yml` config file.

## Using a Config File

Instead of passing all options on the command line, you can use a `.greenframe.yml` file to configure the CLI. This file must be located in the same directory as the one where you run the `greenframe` CLI.

```yaml
baseURL: YOUR_APP_BASE_URL
scenarios:
    - path: PATH_TO_YOUR_SCENARIO_FILE
      name: My first scenario
      threshold: 0.1
projectName: YOUR_PROJECT_NAME
samples: 3
//distant: "This option has been deprecated due to security issues"
useAdblock: true
ignoreHTTPSErrors: true
locale: 'fr-FR',
timezoneId: 'Europe/Paris',
containers:
    - 'CONTAINER_NAME'
    - 'ANOTHER_CONTAINER_NAME'
databaseContainers:
    - 'DATABASE_CONTAINER_NAME',
envFile: PATH_TO_YOUR_ENVIRONMENT_VAR_FILE
envVar:
    - envVarA: 'An environment variable needed for the scenario (ie : a secret-key)',
    - envVarB: 'Another environment variable needed'
```

## More Information / Troubleshooting

Check the docs at greenframe.io:

[https://docs.greenframe.io/](https://docs.greenframe.io/)

# How Does GreenFrame Work?

GreenFrame relies on a [scientific model](./src/model/README.md) of the energy consumption of a digital system built in collaboration with computer scientists at [Loria](https://www.loria.fr/en/).

While running the scenario, GreenFrame uses `docker stats` to collect system metrics (CPU, memory, network and disk I/O, scenario duration) every second from the browser and containers.

It then uses the GreenFrame Model to convert each of these metrics into energy consumption in Watt.hours. GreenFrame sums up the energy of all containers over time, taking into account a theoretical datacenter PUE (set to 1.4, and configurable) for server containers. This energy consumption is then converted into CO2 emissions using a configurable "carbon cost of energy" parameter (set to 442g/kWh by default).

GreenFrame repeats the scenario 3 times and computes the average energy consumption and CO2 emissions. It also computes the standard deviation of energy consumption and CO2 emissions to provide a confidence interval.

For more details about the GreenFrame Model, check this article on the Marmelab blog:

[GreenFrame.io: What is the carbon footprint of a web page?](https://marmelab.com/blog/2021/04/08/greenframe-io-website-carbon.html).

# Which Factors Influence The Carbon Footprint?

Based on our research, the carbon footprint of a web page depends on:

-   The duration of the scenario
-   The size of the page (HTML, CSS, JS, images, fonts, etc.)
-   The amount of JS executed on the browser
-   The number of third-party tags (ads, analytics, etc.)
-   The complexity of the page (number of DOM elements, number of layout changes, etc.)

Server containers have a low impact on the carbon footprint (around 5% in most cases).

This means that the lowest hanging fruit for optimizing the emissions of a web page is to use [Web Performance Optimization (WPO) techniques](https://developer.mozilla.org/en-US/docs/Web/Performance).

# Commands

<!-- commands -->
* [`greenframe analyze [BASEURL] [SCENARIO]`](#greenframe-analyze-baseurl-scenario)
* [`greenframe kube-config`](#greenframe-kube-config)
* [`greenframe open [BASEURL] [SCENARIO]`](#greenframe-open-baseurl-scenario)
* [`greenframe update [CHANNEL]`](#greenframe-update-channel)

## `greenframe analyze [BASEURL] [SCENARIO]`

Create an analysis on GreenFrame server.

```
USAGE
  $ greenframe analyze [BASEURL] [SCENARIO] [-C <value>] [-K <value>] [-t <value>] [-p <value>] [-c <value>]
    [--commitId <value>] [-b <value>] [-s <value>] [-a] [-i] [--locale] [--timezoneId] [-e <value>] [-E <value>]
    [--dockerdHost <value>] [--dockerdPort <value>] [--containers <value>] [--databaseContainers <value>]
    [--kubeContainers <value>] [--kubeDatabaseContainers <value>]

ARGUMENTS
  BASEURL   Your baseURL website
  SCENARIO  Path to your GreenFrame scenario

FLAGS
  -C, --configFile=<value>          Path to config file
  -E, --envFile=<value>             File of environment vars
  -K, --kubeConfig=<value>          Path to kubernetes client config file
  -a, --useAdblock                  Use an adblocker during analysis
  -b, --branchName=<value>          Pass branch name manually
  -c, --commitMessage=<value>       Pass commit message manually
  -e, --envVar=<value>...           List of environment vars to read in the scenarios
  -i, --ignoreHTTPSErrors           Ignore HTTPS errors during analysis
  -p, --projectName=<value>         Project name
  -s, --samples=<value>             Number of runs done for the score computation
  -t, --threshold=<value>           Consumption threshold
  --commitId=<value>                Pass commit id manually
  --containers=<value>              Pass containers manually
  --databaseContainers=<value>      Pass database containers manually
  --dockerdHost=<value>             Docker daemon host
  --dockerdPort=<value>             Docker daemon port
  --kubeContainers=<value>          Pass kubebernetes containers manually
  --kubeDatabaseContainers=<value>  Pass kubebernetes database containers manually
  --locale                          Set greenframe browser locale
  --timezoneId                      Set greenframe browser timezoneId

DESCRIPTION
  Create an analysis on GreenFrame server.
```

_See code: [dist/commands/analyze.ts](https://github.com/marmelab/greenframe-cli/blob/v1.7.0/dist/commands/analyze.ts)_

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

_See code: [dist/commands/kube-config.ts](https://github.com/marmelab/greenframe-cli/blob/v1.7.0/dist/commands/kube-config.ts)_

## `greenframe open [BASEURL] [SCENARIO]`

Open browser to develop your GreenFrame scenario

```
USAGE
  $ greenframe open [BASEURL] [SCENARIO] [-C <value>] [-a] [--ignoreHTTPSErrors] [--locale] [--timezoneId]

ARGUMENTS
  BASEURL   Your baseURL website
  SCENARIO  Path to your GreenFrame scenario

FLAGS
  -C, --configFile=<value>  Path to config file
  -a, --useAdblock          Use an adblocker during analysis
  --ignoreHTTPSErrors       Ignore HTTPS errors during analysis
  --locale                  Set greenframe browser locale
  --timezoneId              Set greenframe browser timezoneId

DESCRIPTION
  Open browser to develop your GreenFrame scenario
  ...
  greenframe analyze ./yourScenario.js https://greenframe.io
```

_See code: [dist/commands/open.ts](https://github.com/marmelab/greenframe-cli/blob/v1.7.0/dist/commands/open.ts)_

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

_See code: [dist/commands/update.ts](https://github.com/marmelab/greenframe-cli/blob/v1.7.0/dist/commands/update.ts)_
<!-- commandsstop -->

## Development

The GreenFrame CLI is written in Node.js. Install depencencies with:

```sh
yarn
```

To run the CLI locally, you must compile the TypeScript files with:

```sh
$ yarn build
```

Then you can run the CLI:

```sh
$ ./bin/run analyze https://greenframe.io ./src/examples/visit.js
```

While developing, instead of running `yarn build` each time you make a change, you can watch for changes and automatically recompile with:

```sh
$ yarn watch
```

## License

GreenFrame is licensed under the [Elastic License v2.0](https://www.elastic.co/licensing/elastic-license).

This means you can use GreenFrame for free both in open-source projects and commercial projects. You can run GreenFrame in your CI, whether your project is open-source or commercial.

But you cannot build a competitor to [greenframe.io](https://greenframe.io), i.e. a paid service that runs the GreenFrame CLI on demand.
