const util = require("util");
const InMemoryStatisticsRepository = require("./inMemoryStatisticsRepository");
const Statistics = require("./statistics");
const Population = require("./population");

function runSimulation(id, {population, minimumAgeOfReproduction, maximumAgeOfReproduction, averageAgeOfDeath, childrenPerCouple}, afterOneYear) {
    const world = new Population(id, minimumAgeOfReproduction, maximumAgeOfReproduction, averageAgeOfDeath, childrenPerCouple);
    world.addHumans(population);

    while (!world.isDistinct()) {
        world.passOneYear();
        afterOneYear(world);
    }
}

function runMultipleSimulations(times, prefixId, configuration, afterOneYear) {
    for (let i = 0; i < times; i++) {
        runSimulation(`${prefixId}_${i}`, configuration, afterOneYear);
    }
}

function analyseLifetimeStatistics(lifeTimesStatistics) {
    const averageLifetime = lifeTimesStatistics.reduce((acc, current) => acc + current.lifetime, 0) / lifeTimesStatistics.length;

    return {
        averageLifetime
    }
}

function reduceStatisticsOfOnePopulationToLifetimeStatistics(statistics) {
    const last = statistics[statistics.length - 1];

    return {
        lifetime: last.year
    };
}

/**
 * @param {Statistics} statistics
 */
function printStatistics(statistics) {
    console.clear();
    console.log(statistics);
}

function run() {
    const statisticRepository = new InMemoryStatisticsRepository();
    const configuration = {
        population: 10000,
        minimumAgeOfReproduction: 18,
        maximumAgeOfReproduction: 30,
        averageAgeOfDeath: 80,
        childrenPerCouple: () => Math.floor(Math.random() * 3)
    };

    runMultipleSimulations(1, "myCoolSimulation", configuration, world => {
        printStatistics(Statistics.fromPopulation(world));
        statisticRepository.save(Statistics.fromPopulation(world));
    });

    const reducedByYear = [];

    for (const key of Object.keys(statisticRepository.findAll())) {
        const statsOfAYear = statisticRepository.findAll()[key]
        reducedByYear.push(reduceStatisticsOfOnePopulationToLifetimeStatistics(statsOfAYear));
    }

    console.log(analyseLifetimeStatistics(reducedByYear));
}

run();
