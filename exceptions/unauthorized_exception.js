class UnauthorizedException extends Error {
    constructor(message) {
        super(message);
        this.name = 'UnauthorizedException';
    }
}

module.exports = UnauthorizedException;