class InMemoryStaticRepository {
    _stats = [];

    findAll() {
        return this._stats;
    }

    save(s) {
        if (!this._stats[s.populationId]) {
            this._stats[s.populationId] = [];
        }

        this._stats[s.populationId].push(s);
    }
}

module.exports = InMemoryStaticRepository