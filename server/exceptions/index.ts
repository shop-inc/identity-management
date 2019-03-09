class CustomException extends Error {
  constructor() {
    super();
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class VariableNotFound extends CustomException {
  constructor(variable: string) {
    super();
    this.message = `${variable} is required as an environment variable but it was not found!`;
  }
}

// tslint:disable-next-line: max-classes-per-file
export class InvalidIdToken extends CustomException {
  constructor() {
    super();
    this.message = `The id token provided is invalid!`;
  }
}

export default CustomException;
