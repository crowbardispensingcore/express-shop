class ObjectAlreadyExistsException extends Error {
    constructor(message) {
        super(message);
        this.name = 'ObjectAlreadyExistsException';
    }
}

module.exports = ObjectAlreadyExistsException;