import { WinstonLogger } from '../logger/WinstonLogger';

export class BaseError extends Error {
  public code: string;

  public category: string;


  get getMessage(): string {
    return this.message;
  }
  
  private error: any;

  get getError(): string {
    return this.error;
  }

  constructor(category: string) {
    super()
    this.category = category;
  }

  updateError(code: string, message: string, error?: any) {
    this.code = code;
    this.message = message;
    this.error = error;
    new WinstonLogger().error(`${this.category} | ${this.message}`, this.code,error);
    return this;
  }
}
