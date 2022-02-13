class BasicError extends Error {
    constructor(message, error) {
        super(message);
        this.message = message;
        if (error !== '' && error instanceof Error)
            this.stack = error.stack;
        else if (typeof error === 'string' || error instanceof String)
            this.stack = error + '\n' + this.stack;
        else if (!isNaN(error))
            this.stack = error;
        console.info(this.stack);
    }
}

module.exports = BasicError;