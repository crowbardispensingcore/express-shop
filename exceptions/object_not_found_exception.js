class ObjectNotFoundException extends Error {
    constructor(message) {
        super(message);
        this.name = 'ObjectNotFoundException';
    }
}

module.exports = ObjectNotFoundException;