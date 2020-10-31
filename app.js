const InMemoryStaticRepository = require("./inMemoryStaticRepository");
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

function run() {
    const statisticRepository = new InMemoryStaticRepository();

    runMultipleSimulations(100, "myCoolSimulation", {
        population: 100,
        minimumAgeOfReproduction: 28,
        maximumAgeOfReproduction: 30,
        averageAgeOfDeath: 30,
        childrenPerCouple: () => Math.floor(Math.random() * 3)
    }, world => statisticRepository.save(Statistics.fromPopulation(world)));

    const reducedByYear = [];

    for (const key of Object.keys(statisticRepository.findAll())) {
        const statsOfAYear = statisticRepository.findAll()[key]
        reducedByYear.push(reduceStatisticsOfOnePopulationToLifetimeStatistics(statsOfAYear));
    }

    console.log(analyseLifetimeStatistics(reducedByYear));
}

run();