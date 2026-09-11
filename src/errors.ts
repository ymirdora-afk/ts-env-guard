export class MissingEnvError extends Error {
  readonly variableName: string;

  constructor(variableName: string) {
    super(`Missing required environment variable: "${variableName}"`);
    this.name = 'MissingEnvError';
    this.variableName = variableName;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InvalidEnvError extends Error {
  readonly variableName: string;
  readonly expectedType: string;
  readonly receivedValue: string;

  constructor(variableName: string, expectedType: string, receivedValue: string) {
    super(
      `Invalid environment variable "${variableName}": expected type "${expectedType}", received "${receivedValue}"`
    );
    this.name = 'InvalidEnvError';
    this.variableName = variableName;
    this.expectedType = expectedType;
    this.receivedValue = receivedValue;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
