/**
 * ActivityContentError indicates that an error occurred in the activity content
 * module.
 */
export class ActivityContentError extends Error {
  constructor(message: string) {
    super(`Activity Content Error: ${message}`)
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
