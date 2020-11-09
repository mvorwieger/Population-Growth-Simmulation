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
            total: population.population.length,
            deaths: population.deadHumans.length
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

module.exports = Statistics;