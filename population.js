const Human = require("./human");

class Population {
    /**
     * @param {string|number} id
     * @param {number} minimumAgeOfReproduction
     * @param {number} maximumAgeOfReproduction
     * @param {number} averageAgeOfDeath
     * @param {number} amountChildren
     */
    constructor(id, minimumAgeOfReproduction, maximumAgeOfReproduction, averageAgeOfDeath, amountChildren) {
        this.id = id;
        this.minimumAgeOfReproduction = minimumAgeOfReproduction;
        this.maximumAgeOfReproduction = maximumAgeOfReproduction;
        this.avergageAgeOfDeath = averageAgeOfDeath;
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

module.exports = Population;
