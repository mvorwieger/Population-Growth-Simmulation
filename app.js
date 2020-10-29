const Population = require("./population.js");

function runSimulation(id, {population, minimumAgeOfReproduction, maximumAgeOfReproduction, averageAgeOfDeath, childrenPerCouple}, afterOneYear) {
    const world = new Population(id, minimumAgeOfReproduction, maximumAgeOfReproduction, averageAgeOfDeath, childrenPerCouple);
    world.addHumans(population);

    while (!world.isDistinct()) {
        world.passOneYear();
        afterOneYear(world);
    }
}

class Statistics {
    year;
    population;
    age;
    reproduction;

    /**
     * @param {Population} population
     * @return {Statistics}
     */
    static fromPopulation(population) {
        const stats = new Statistics();
        stats.populationId = population.id;
        stats.year = population.yearsPassed
        const men = population.population.filter(h => h.sex === "men");
        const woman = population.population.filter(h => h.sex === "woman");
        stats.population = {
            men: men.length,
            woman: woman.length,
            total: population.population.length
        };
        stats.age = {
            men: men.reduce((acc, h) => h.age + acc, 0) / men.length,
            woman: woman.reduce((acc, h) => h.age + acc, 0) / woman.length,
            total: population.population.reduce((acc, h) => h.age + acc, 0) / population.population.length
        }
        stats.reproduction = {
            men: men.filter(h => h.canGetAChildren()).length,
            woman: woman.filter(h => h.canGetAChildren()).length
        }

        return stats;
    }
}

const statisticRepository = {
    stats: [],
    save: function (s) {
        if (!this.stats[s.populationId]) {
            this.stats[s.populationId] = [];
        }

        this.stats[s.populationId].push(s);
    }
}

runSimulation("myCoolSimmulation_v1", {
    population: 100,
    minimumAgeOfReproduction: 28,
    maximumAgeOfReproduction: 30,
    averageAgeOfDeath: 30,
    childrenPerCouple: () => Math.floor(Math.random() * 3)
}, world => statisticRepository.save(Statistics.fromPopulation(world)));

console.dir(statisticRepository.stats, {depth: null});

