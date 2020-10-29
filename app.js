class Human {
    constructor(age, sex, ageOfReproduction, maxAgeOfReproduction, ageOfDeath, maxChildren) {
        this.age = age;
        this.sex = sex;
        this.minAgeOfReproduction = ageOfReproduction;
        this.maxAgeOfReproduction = maxAgeOfReproduction;
        this.ageOfDeath = ageOfDeath;
        this.childrenCounter = 0;
        this.maxChildren = maxChildren;
    }

    birthday() {
        this.age++;
    }

    static withRandomSex(age, ageOfReproduction, maxAgeOfReproduction, ageOfDeath, maxChildren) {
        if (age !== 0) {
            age = Math.floor(Math.random() * 100 + 1)
        }
        return new Human(age, Math.random() < 0.5 ? "men" : "woman", ageOfReproduction, maxAgeOfReproduction, ageOfDeath, maxChildren)
    }

    /**
     * @param {Human} partner
     * @returns {Human}
     */
    reproduce(partner) {
        this.childrenCounter++;
        return Human.withRandomSex(0, this.minAgeOfReproduction, this.maxAgeOfReproduction, this.ageOfDeath, this.maxChildren)
    }

    canGetAChildren() {
        return this.age >= this.minAgeOfReproduction && this.age < this.maxAgeOfReproduction && !this.gaveBirth;
    }

    /**
     * @return boolean
     * @param {Human} possiblePartner
     */
    canReproduceWith(possiblePartner) {
        return this.sex !== possiblePartner.sex && this.canGetAChildren() && possiblePartner.canGetAChildren()
    }

    isDead() {
        return this.age >= this.ageOfDeath;
    }

    get gaveBirth() {
        return this.childrenCounter >= this.maxChildren;
    }
}

class Population {
    constructor(id, minimumAgeOfReproduction, maximumAgeOfReproduction, avergageAgeOfDeath, amountChildren) {
        this.id = id;
        this.minimumAgeOfReproduction = minimumAgeOfReproduction;
        this.maximumAgeOfReproduction = maximumAgeOfReproduction;
        this.avergageAgeOfDeath = avergageAgeOfDeath;
        this.howManyChildrenCanACoupleGet = amountChildren;
        this.yearsPassed = 0;

        /**
         * @type {Human[]}
         */
        this.population = [];
    }

    addHuman() {
        this.population.push(
            Human.withRandomSex(
                null,
                this.minimumAgeOfReproduction,
                this.maximumAgeOfReproduction,
                this.avergageAgeOfDeath,
                this.howManyChildrenCanACoupleGet()
            )
        )
    }

    addHumans(amount) {
        for (let i = 0; i < amount; i++) {
            this.addHuman()
        }
    }

    /**
     * @param {Human} human
     * @returns {Human|null}
     */
    findReproductionPartner(human) {
        let foundPartner = null;
        for (const potentialPartner of this.population) {
            if (human.canReproduceWith(potentialPartner)) {
                if (!foundPartner || foundPartner.age > potentialPartner.age) {
                    foundPartner = potentialPartner;
                }
            }
        }

        return foundPartner;
    }

    passOneYear() {
        this.yearsPassed++;
        for (let x = 0; x <= this.population.length - 1; x++) {
            const human = this.population[x];
            human.birthday();

            if (human.canGetAChildren()) {
                const partner = this.findReproductionPartner(human);

                if (partner) {
                    const children = human.reproduce(partner);
                    children.maxChildren = this.howManyChildrenCanACoupleGet()
                    this.population.push(children);
                }
            }

            if (human.isDead()) {
                this.population.splice(x, 1);
                x--;
            }
        }

        return this.population;
    }

    isDistinct() {
        return this.population.length <= 0;
    }
}


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
    stats: new Map(),
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

