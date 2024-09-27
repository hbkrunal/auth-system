import { BaseError } from "./base-error";


export class NotFoundWarnError extends BaseError {
  constructor(message: string, error: any, code: string, category: string) {
    // set Error Category
    super(category);
    // update the Error
    this.updateError(code, message, error);
  }
}
