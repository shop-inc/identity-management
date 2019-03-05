class CustomException extends Error {
    constructor() {
        super();
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class VariableNotFound extends CustomException {
    constructor(variable) {
        super();
        this.message = `${variable} is required as an environment variable but it was not found!`;
    }
}



export default CustomException;
