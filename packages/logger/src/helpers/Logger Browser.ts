// #region ESLint Rules
/* eslint-disable no-shadow, class-methods-use-this */
// #endregion

// #region Developer Information
/*
 ********************************************
    Author: Andrew Laychak
    Email: ALaychak@harriscomputer.com

    Created At: 04-05-2022 10:25:52 PM
    Last Modified: 04-05-2022 10:38:26 PM
    Last Updated By: Andrew Laychak

    Description: Global logger that handles logging data for various sources in the web browser

    References:
      - https://dev.to/denicmarko/use-console-log-like-a-pro-3h6o
      - https://dev.to/ackshaey/level-up-your-javascript-browser-logs-with-these-console-log-tips-55o2
 ********************************************
*/
// #endregion

// #region Imports
import { format as dformat } from 'date-fns';
import { boolean } from 'boolean';
import util from 'util';
import { logLevels } from '../enums/Log Level';
// #endregion

// #region Logger
class LogManagerBrowser {
  #logColors: { [key: string]: string };

  constructor() {
    this.#logColors = {
      EMERGENCY: 'red',
      ALERT: 'red',
      CRITICAL: 'red',
      ERROR: 'red',
      WARNING: 'yellow',
      NOTICE: 'yellow',
      INFO: 'cyan',
      DEBUG: 'magenta',
    };
  }

  #logMessage(level: string, message: string, ...optionalParams: unknown[]) {
    let extraMessage = '';
    optionalParams.forEach((op) => {
      if (typeof op === 'object') {
        extraMessage += util.inspect(op, { depth: null });
      } else {
        extraMessage += op;
      }
    });

    switch (level) {
      case 'EMERGENCY':
      case 'ALERT':
      case 'CRITICAL':
      case 'ERROR':
        console.error(
          `%c ${message}${extraMessage}`,
          `color: ${this.#logColors[level]}`
        );
        break;
      case 'WARNING':
      case 'NOTICE':
        console.warn(`${message}${extraMessage}`);
        break;
      case 'INFO':
        console.info(`${message}${extraMessage}`);
        break;
      case 'DEBUG':
        console.debug(`${message}${extraMessage}`);
        break;
      default:
        console.log(`${message}${extraMessage}`);
        break;
    }
  }

  debug(message: string, ...optionalParams: unknown[]): void {
    this.#logMessage('DEBUG', message, ...optionalParams);
  }

  info(message: string, ...optionalParams: unknown[]): void {
    this.#logMessage('INFO', message, ...optionalParams);
  }

  notice(message: string, ...optionalParams: unknown[]): void {
    this.#logMessage('NOTICE', message, ...optionalParams);
  }

  warning(message: string, ...optionalParams: unknown[]): void {
    this.#logMessage('WARNING', message, ...optionalParams);
  }

  error(message: string, ...optionalParams: unknown[]): void {
    this.#logMessage('ERROR', message, ...optionalParams);
  }

  critical(message: string, ...optionalParams: unknown[]): void {
    this.#logMessage('CRITICAL', message, ...optionalParams);
  }

  alert(message: string, ...optionalParams: unknown[]): void {
    this.#logMessage('ALERT', message, ...optionalParams);
  }

  emergency(message: string, ...optionalParams: unknown[]): void {
    this.#logMessage('EMERGENCY', message, ...optionalParams);
  }
}
// #endregion

const logManagerBrowser = new LogManagerBrowser();

// #region Exports
export default logManagerBrowser;
// #endregion
