class Human {
    /**
     * @param {number} age
     * @param {"men"|"woman"}sex
     * @param {number} ageOfReproduction
     * @param {number} maxAgeOfReproduction
     * @param {number} ageOfDeath
     * @param {number} maxChildren
     */
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

    /**
     * @param age
     * @param ageOfReproduction
     * @param maxAgeOfReproduction
     * @param ageOfDeath
     * @param maxChildren
     * @returns {Human}
     */
    static withRandomSex(age, ageOfReproduction, maxAgeOfReproduction, ageOfDeath, maxChildren) {
        if (age !== 0) {
            age = Math.floor(Math.random() * 100 + 1)
        }
        return new Human(age, Math.random() < 0.5 ? "men" : "woman", ageOfReproduction, maxAgeOfReproduction, ageOfDeath, maxChildren)
    }

    /**
     * @param {Human} partner
     * @returns {Human} child
     */
    reproduce(partner) {
        this.childrenCounter++;
        return Human.withRandomSex(0, this.minAgeOfReproduction, this.maxAgeOfReproduction, this.ageOfDeath, this.maxChildren)
    }

    /**
     * @returns {boolean}
     */
    canGetAChildren() {
        return this.age >= this.minAgeOfReproduction && this.age < this.maxAgeOfReproduction && !this.gaveBirth;
    }

    /**
     * @param {Human} possiblePartner
     * @return boolean
     */
    canReproduceWith(possiblePartner) {
        return this.sex !== possiblePartner.sex && this.canGetAChildren() && possiblePartner.canGetAChildren()
    }

    /**
     * @returns {boolean}
     */
    isDead() {
        return this.age >= this.ageOfDeath;
    }

    /**
     * @returns {boolean}
     */
    get gaveBirth() {
        return this.childrenCounter >= this.maxChildren;
    }
}

module.exports = Human;
