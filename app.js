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
    const configuration = {
        population: 10000,
        minimumAgeOfReproduction: 18,
        maximumAgeOfReproduction: 30,
        averageAgeOfDeath: 80,
        childrenPerCouple: () => Math.floor(Math.random() * 3)
    };

    runMultipleSimulations(1, "myCoolSimulation", configuration, world => {
        process.stdout.write("\u001b[2J\u001b[0;0H");
        console.clear();
        console.log(configuration);
        console.log(Statistics.fromPopulation(world));
        statisticRepository.save(Statistics.fromPopulation(world))
    });

    const reducedByYear = [];

    for (const key of Object.keys(statisticRepository.findAll())) {
        const statsOfAYear = statisticRepository.findAll()[key]
        reducedByYear.push(reduceStatisticsOfOnePopulationToLifetimeStatistics(statsOfAYear));
    }

    console.log(analyseLifetimeStatistics(reducedByYear));
}

run();