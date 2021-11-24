/**
 * ActivityContentError is a base class for other errors in the Activity Content package. All errors thrown
 * extending this class can be assumed to have originated in the Activity Content package, not
 * in any underlying adapters or higher level client code.
 */
export class ActivityContentError extends Error {
  constructor(message: string) {
    super(`Activity Content Error: ${message}`);
    this.name = this.constructor.name;
  }
}

/**
 * InvalidActivityContentError indicates that an activity content object failed
 * to pass validation.
 */
export class InvalidActivityContentError extends ActivityContentError {
  constructor(message?: string) {
    super("Invalid ActivityContent: " + (message || "unknown error"));
  }
}
