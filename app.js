const Statistics = require("./statistics");
const Population = require("./population.js");

function runSimulation(id, {population, minimumAgeOfReproduction, maximumAgeOfReproduction, averageAgeOfDeath, childrenPerCouple}, afterOneYear) {
    const world = new Population(id, minimumAgeOfReproduction, maximumAgeOfReproduction, averageAgeOfDeath, childrenPerCouple);
    world.addHumans(population);

    while (!world.isDistinct()) {
        world.passOneYear();
        afterOneYear(world);
    }
}

const statisticRepository = {
    _stats: [],
    findAll: function () {
        return this._stats;
    },
    save: function (s) {
        if (!this._stats[s.populationId]) {
            this._stats[s.populationId] = [];
        }

        this._stats[s.populationId].push(s);
    }
}

runSimulation("myCoolSimmulation_v1", {
    population: 100,
    minimumAgeOfReproduction: 28,
    maximumAgeOfReproduction: 30,
    averageAgeOfDeath: 30,
    childrenPerCouple: () => Math.floor(Math.random() * 3)
}, world => statisticRepository.save(Statistics.fromPopulation(world)));

console.dir(statisticRepository.findAll(), {depth: null});

