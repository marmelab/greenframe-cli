# GreenFrame Model

Converting system metrics collected by `docker stats` metrics into W.h.

## Requirements

- node
- yarn

## Installation

```sh
make build
```

## Description of the model

The GreenFrame model computes an energy consumption (Wh) from:

- collected metrics (cpu time, network traffic, etc.) on one or more usage scenarios.
- knowledge of the infrastructure (number of servers, network traffic), users (number of requests).

A global consumption is deduced from commonly accepted models and from the
energy consumed by each of the components/usages.

### From collected metrics to Measures used to calculate consumption in Wh

Using a tools such as Docker or Prometheus, we can collect technical metrics. These metrics are converted into a generic format that can be used by the GreenFrame model. Each metric of the generic format contains the following information:

- `date`: date of the collected
- `availableSystemCpuUsage`: corresponds to the time elapsed in seconds since previous collected metric
- `cpu.currentUsageInUserMode` and `cpu.currentUsageInKernelMode`: time consumed by the cpu
- `io.currentBytes`: bytes read or written in the disk
- `network.currentReceived` and `network.currentTransmitted`: expressed in GB
- `memory.usage`: max memory usage expressed in GB

Given theses data when can we can compute cumulative data (`cpu.totalUsageInUserMode`, `cpu.totalUsageInKernelMode`, `io.totalBytes`, `network.totalReceived`, and `network.totalTransmitted`) as well as the time elapsed since the application was launched:

- `time`: is based on the differences of `date` values and corresponds to the time elapsed in seconds since the application was launched. It is real time (_i.e._ our time)
- `userTime`: is based on the differences of `date` values but taking into account only the periods which correspond to a test activity of the usage scenario. This data is a duration expressed in seconds. It is real time, without the periods corresponding to the test setup (it does not include the chrome loading times for example).
  To compute `userTime` we need to know the intervals during which the application is performing test activity. This list of interval is called a Timeline.

### Formulas to convert times or volumes in Wh

- cpuWh = `pue` * avg(`cpu.totalUsageInUserMode` + `cpu.totalUsageInKernelMode`) * `config.CPU` / 3600
- memWh = `pue` * avg(`memory.usage`) * `config.MEM` * `totalTime` / 3600
- diskWh = `pue` * avg(`io.totalByte`) * `config.DISK`
- networkWh = avg(`network.totalReceived` + `network.totalTransmitted`) * `config.NETWORK` / 2
- screenWh = avg(`userTime`) * `config.SCREEN` / 3600

When several measurements are made, the average of the measurements is used.

The `networkWh` value corresponds to half of the exchanges for not counting a same exchange twice (for example: output from A to B + input from B to A). This measure should be multiplied by two if a system is not analyzed in its entirety (e.g. greenframe.io site which only measures the front end)

Note that this model is generic, meaning that the calculated values depend on an energy profile:

- CPU: processor power expressed in W. This could be refined by taking the values corresponding to idle, load and peak modes
- MEM: power consumed by the memory to supply 1GB of ram
- DISK: disk consumption expressed in Wh/GB
- NETWORK: network consumption expressed in Wh/GB
- SCREEN: power consumed by the screen expressed in W

### Values used to instanciate this _generic_ model

To use this model, you need to specify an energy-profile.
By default we use the one described below.

```js
const energyProfile = {
    CPU: 45,            // W, for Core-i7
    MEM: 10 / 128,      // Wh/GB
    DISK: 1.52 / 1000,  // Wh/GB, for SSD
    NETWORK: 11,        // Wh/GB
    PUE: 1.4,
    SCREEN: 14,         // W, for a 14" screen
};
```

These values were choses based on the scientific litterature. Here are the sources we considered for that model:

* https://codeascraft.com/2020/04/23/cloud-jewels-estimating-kwh-in-the-cloud/
* https://onlinelibrary.wiley.com/doi/epdf/10.1111/jiec.12630
* https://www.mdpi.com/2071-1050/10/7/2494/pdf"
* https://ark.intel.com/content/www/fr/fr/ark/products/67355/intel-core-i5-3210m-processor-3m-cache-up-to-3-10-ghz-rpga.html
* http://www.kompulsa.com/much-power-computers-consume/
* https://ark.intel.com/content/www/fr/fr/ark/products/191045/intel-core-i7-9750h-processor-12m-cache-up-to-4-50-ghz.html
* https://ark.intel.com/content/www/fr/fr/ark/products/122589/intel-core-i7-8550u-processor-8m-cache-up-to-4-00-ghz.html
* http://energyusecalculator.com/electricity_lcdleddisplay.htm
* https://www.researchgate.net/publication/257768333_Efficiency_improvement_opportunities_for_personal_computer_monitors_Implications_for_market_transformation_programs
* https://iswitch.com.sg/how-much-electricity-computer-consume/
* http://energyusecalculator.com/electricity_wifirouter.htm
* https://mydataball.com/wp-content/uploads/2018/10/DAMON17-MemPower.pdf
* https://web.eecs.umich.edu/~zmao/Papers/RRC4G_mobisys2012.pdf
* https://www.zora.uzh.ch/id/eprint/110005/
* https://aws.amazon.com/fr/about-aws/sustainability/
* https://www.google.com/about/datacenters/efficiency/

An important value is the consumption (expressed in Wh/GB) for the `NETWORK`. Unfortunately there is not a unique value in the literature.
This value ranges from 136000 Wh/GB to 6 Wh/GB. We have chosen a value which, according to several articles, appears to be realistic: 11 Wh/GB.

### Impacts of the host machine load on the measured metrics

`memWh` and `screenWh` depend on `userTime` which varies according to the load of the machine performing the measurements.

Moreover, experience showed us that `userTime` also varies according to the load. To have representative measurements it is thus necessary to perform the measurements on a machine not loaded

## FAQ

### This Model Is Wrong!

You're right, it's easy to find one study that contradicts the parameters we've chosen for this model. And for one good reason: there is currently no scientific consensus over the energy consumption of a digital system. 

So we had to make a choice. We hired a researcher from French CNRS to look for scientific publications that would be compatible with each other, and would result in a full-stack model. This is the result of his work.

So again, our model is probably wrong - all models are. But we believe that our model is *less wrong than the others*, because we built it with a scientific approach.

And besides, the result of a single measurement is not very relevant - see next question.

### Is The Score for Website XXX Good or Bad?

The Greenframe model estimates the energy consumtion of a user scenario on a given web system. Is the result good or bad? There is no answer to this question, because there is no large-scale benchmark of energy consumption of web systems, and because there is currently no regulation about it.

So don't pay too much attention to the absolute value of the score. What matters is the comparison between two systems, or the comparison between two runs. We could verify experimentally that variations in the Greenframe score are correlated with variations in the energy consumption of the system.

So even though GreenFrame's model is wrong, you can use it today to:

- see how your website compares to competitors
- see how a change in the code affects the energy consumption
- test a good practice for reducing energy consumption

## Using the library

### Create computed stats from Docker metrics

```js
const meta = { container: containerName, sample: 1 };
const computedStats = readDockerStats(filename, meta);
```

with

```js
const readStats = (filename: string, meta: Meta): ComputedStatWithMeta[] => {
    const rawdata = fs.readFileSync(filename, "utf8");
    const {
        stats,
        intervals,
    }: { stats: DockerStatsJSON[]; intervals: IntervalJSON[] } = JSON.parse(rawdata);
    const timeframes = intervals.map(({ started, ended, title }) => ({
        start: new Date(started),
        end: new Date(ended),
        title,
    }));
    const computedStats = computeStats({
        stats: computeGenericStats(stats),
        timeframes,
        meta,
    });
    return computedStats;
};
```

We assume that `filename` is a JSON file containing `{stats:[...], intervals:[...]}`, as generated by greenframe-cli.

`computeGenericStats` transforms collected metrics (from Docker or any other tool) into a generic format.
`computedStats` transforms this generic format into cumulated and filtered
data. In particular, data which do not correspond to a user-scenario (i.e. not
in an interval of the timeline) are removed from our computed metrics.

### Create a store from computed stats

```js
const store = createStatStore(computedStats);
```

`store` is an internal data-stucture used to compute energy consumption.

### Get energy consumption for an energy profile

```js
const consumption = {
    HDD: 0.89,
    SSD: 1.52,
    NETWORK: 11,
    CORE_I7: 45,
    SCREEN_27: 30,
    SCREEN_14: 14,
    MEM_128: 10,
};
const energyProfile = {
    CPU: consumption.CORE_I7,         // W
    MEM: consumption.MEM_128 / 128,   // Wh/GB
    DISK: consumption.SSD / 1000,     // Wh/GB
    NETWORK: consumption.NETWORK,     // Wh/GB
    PUE: 1.4,
    SCREEN: consumption.SCREEN_14,    // W
};

const revisionWh = getRevisionWh(store, energyProfile);
const containerWh = revisionWh[containerName];
```
