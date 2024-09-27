import * as path from "path";
import { Injectable, LoggerService, Scope } from "@nestjs/common";
import  {winston}  from "./winston";
import { BaseError } from "../errors/base-error";

@Injectable({ scope: Scope.TRANSIENT })
export class WinstonLogger implements LoggerService {
  protected context;
  public static DEFAULT_SCOPE = "app";

  private static parsePathToScope(filepath: string): string {
    if (filepath.indexOf(path.sep) >= 0) {
      filepath = filepath
        .replace(process.cwd(), "")
        .replace(`src${path.sep}`, "")
        .replace(`dist${path.sep}`, "")
        .replace(".ts", "")
        .replace(".js", "")
        .replace(path.sep, "");
    }
    return filepath;
  }

  private scope: string;

  constructor() {
    this.setScope();
    this.setContext();
  }

  public setContext(context?: string): WinstonLogger {
    this.context = context || undefined;
    return this;
  }

  public setScope(scope?: string): void {
    this.scope = WinstonLogger.parsePathToScope(
      scope ? scope : WinstonLogger.DEFAULT_SCOPE
    );
  }

  public log(message: string, context: string = this.context): void {
    this.write("info", `[${context}] : ${message}`);
  }

  public debug(message: string, ...args: any[]): void {
    this.write("debug", message, args);
  }

  public info(message: string, ...args: any[]): void {
    this.write("info", message, args);
  }

  public warn(
    message: string,
    context: string = this.context,
    ...args: any[]
  ): void {
    this.write("warn", `[${context}] : ${message}`, args);
  }

  public error(
    message: string,
    context: string = this.context,
    trace?: string,
  ): void {
    this.write("error", `[${context}] : ${message} \n ${trace ? trace : ''}`);
  }

  private write(level: string, message: string, args?: any[]): void {
    if (winston) {
      const formattedMessage = message.replace(/\s{4}|\n+/gm, "");
      winston[level](`${this.formatScope()} ${formattedMessage}`, args);
    }
  }

  public logAndReturnError(error: BaseError) {
    const message = JSON.stringify(error);
    this.write("error", `[${error.code}] : ${message} \n ${error.category}`);
    return error;
  }

  public logAndReturnMessage(error: BaseError) {
    this.write(
      "error",
      `[${error.code}] : ${error.getMessage} \n ${error.category}`
    );
    return error;
  }

  private formatScope(): string {
    return `[${this.scope}]`;
  }
}
