class Human {
    constructor(age, sex, ageOfReproduction, maxAgeOfReproduction, ageOfDeath) {
        this.age = age;
        this.sex = sex;
        this.minAgeOfReproduction = ageOfReproduction;
        this.maxAgeOfReproduction = maxAgeOfReproduction;
        this.ageOfDeath = ageOfDeath;
        this.childrenCounter = 0;
    }

    birthday() {
        this.age++;
    }

    static withRandomSex(age, ...extra) {
        if (!age) {
            age = Math.floor(Math.random() * 100 + 1)
        }
        return new Human(age, Math.random() < 0.5 ? "men" : "woman", ...extra)
    }

    /**
     * @param {Human} partner
     * @returns {Human}
     */
    reproduce(partner) {
        this.childrenCounter++;
        return Human.withRandomSex(0)
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
        return this.childrenCounter >= 2;
    }
}

class Population {
    constructor(minimumAgeOfReproduction, maximumAgeOfReproduction, avergageAgeOfDeath) {
        this.minimumAgeOfReproduction = minimumAgeOfReproduction;
        this.maximumAgeOfReproduction = maximumAgeOfReproduction;
        this.avergageAgeOfDeath = avergageAgeOfDeath;

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
                this.avergageAgeOfDeath
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
        for (let x = 0; x <= this.population.length - 1; x++) {
            const human = this.population[x];
            human.birthday();

            if (human.canGetAChildren()) {
                const partner = this.findReproductionPartner(human);

                if (partner) {
                    const children = human.reproduce(partner);
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


function runSimmulation(population, miniumAgeOfReproduction, maximumAgeOfReproduction, averageAgeOfDeath) {
    const world = new Population(miniumAgeOfReproduction, maximumAgeOfReproduction, averageAgeOfDeath);
    world.addHumans(population);
    const populationSnapshots = [];


    while (!world.isDistinct()) {
        const snapshot = world.passOneYear();
        const averageAge = snapshot.reduce((a, b) => a + b.age, 0) / snapshot.length;
        console.log(averageAge);
    }

    return populationSnapshots;
}


const result = runSimmulation(1000, 12, 51, 82);
console.log(result);

