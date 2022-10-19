// #region ESLint Rules
/* eslint-disable no-shadow, class-methods-use-this */
// #endregion

// #region Developer Information
/*
 ********************************************
    Author: Andrew Laychak
    Email: ALaychak@harriscomputer.com

    Created At: 04-05-2022 10:25:52 PM
    Last Modified: 10-18-2022 04:28:48 PM
    Last Updated By: Andrew Laychak

    Description: Global logger that handles logging data for various sources in the web browser

    References:
      - Console => https://developer.mozilla.org/en-US/docs/Web/API/console#using_string_substitutions
      - Colors => https://www.w3.org/wiki/CSS/Properties/color/keywords
      - https://dev.to/denicmarko/use-console-log-like-a-pro-3h6o
      - https://dev.to/ackshaey/level-up-your-javascript-browser-logs-with-these-console-log-tips-55o2

    ToDo:
      - [ ] Add support for logging to a file (https://web.dev/file-system-access/)
 ********************************************
*/
// #endregion

// #region Imports
import util from 'util';
// #endregion

// #region Log Level
const logLevel = [
  'EMERGENCY',
  'ALERT',
  'CRITICAL',
  'ERROR',
  'WARNING',
  'NOTICE',
  'INFO',
  'DEBUG',
] as const;
type LogLevel = typeof logLevel[number];
// #endregion

// #region Log Level Colors
interface LogColors {
  EMERGENCY: string;
  ALERT: string;
  CRITICAL: string;
  ERROR: string;
  WARNING: string;
  NOTICE: string;
  INFO: string;
  DEBUG: string;
}
// #endregion

// #region Log Styles
interface LogStyles {
  EMERGENCY: string[];
  ALERT: string[];
  CRITICAL: string[];
  ERROR: string[];
  WARNING: string[];
  NOTICE: string[];
  INFO: string[];
  DEBUG: string[];
}
// #endregion

// #region Logger
class LogManagerBrowser {
  #logColors: LogColors;
  #logStyles: LogStyles;

  constructor() {
    this.#logColors = {
      EMERGENCY: 'red',
      ALERT: 'red',
      CRITICAL: 'red',
      ERROR: 'orangered',
      WARNING: 'gold',
      NOTICE: 'gold',
      INFO: 'deepskyblue',
      DEBUG: 'blueviolet',
    };

    this.#logStyles = {
      EMERGENCY: [
        'font-weight: bold',
        'border: 2px solid',
        'padding: 2px 15px;',
      ],
      ALERT: ['font-weight: bold', 'border: 2px solid', 'padding: 2px 15px;'],
      CRITICAL: [
        'font-weight: bold',
        'border: 2px solid',
        'padding: 2px 15px;',
      ],
      ERROR: ['font-weight: bold', 'border: 2px solid', 'padding: 2px 15px;'],
      WARNING: ['font-weight: bold', 'border: 2px solid', 'padding: 2px 15px;'],
      NOTICE: ['font-weight: bold', 'border: 2px solid', 'padding: 2px 15px;'],
      INFO: ['font-weight: bold', 'border: 2px solid', 'padding: 2px 15px;'],
      DEBUG: ['font-weight: bold', 'border: 2px solid', 'padding: 2px 15px;'],
    };
  }

  setColors(colors: Partial<LogColors>): void {
    this.#logColors = { ...this.#logColors, ...colors };
  }

  setStyles(styles: Partial<LogStyles>): void {
    this.#logStyles = { ...this.#logStyles, ...styles };
  }

  // #region Timer
  start(isProfile = false, name: string = 'default') {
    if (isProfile) {
      console.profile(name);
    } else {
      console.time(name);
    }
  }

  stop(isProfile = false, name: string = 'default') {
    if (isProfile) {
      console.profileEnd(name);
    } else {
      console.timeEnd(name);
    }
  }

  elapsedTime(name: string = 'default') {
    console.timeLog(name);
  }
  // #endregion

  #getFinalStyle(logStyles: string[], level: LogLevel) {
    const tempLogStyles = [...logStyles];
    tempLogStyles.push(...this.#logStyles[level]);
    tempLogStyles.unshift(`color: ${this.#logColors[level]}`);

    return tempLogStyles.join('; ');
  }

  #updateOptionalParamsValues(
    finalMessage: string | undefined,
    optionalParamsValues: unknown[],
    logStyles: string[],
    level: LogLevel
  ) {
    if (finalMessage) {
      const finalStyles = this.#getFinalStyle(logStyles, level);
      optionalParamsValues.unshift(finalStyles);
    }

    return optionalParamsValues;
  }

  #logMessage(level: LogLevel, message?: string, ...optionalParams: unknown[]) {
    const logStyles: string[] = [];
    const optionalParamsKeys: string[] = [];
    let optionalParamsValues: unknown[] = [];
    optionalParams.forEach((param) => {
      switch (typeof param) {
        case 'object':
          optionalParamsKeys.push('%o');
          break;
        case 'string':
          optionalParamsKeys.push('%s');
          break;
        case 'number':
        case 'bigint':
          optionalParamsKeys.push('%d');
          break;
        default:
          break;
      }

      optionalParamsValues.push(param);
    });

    let extraMessage = '';

    if (optionalParamsKeys.length > 0) {
      extraMessage = optionalParamsKeys.join(' ');
    }

    const finalMessage = message ? `%c${message}` : undefined;

    optionalParamsValues = this.#updateOptionalParamsValues(
      finalMessage,
      optionalParamsValues,
      logStyles,
      level
    );

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
        console.info(finalMessage, ...optionalParamsValues);
        break;
      case 'DEBUG':
        console.debug(`${message}${extraMessage}`);
        break;
      default:
        console.log(`${message}${extraMessage}`);
        break;
    }
  }

  trace() {
    console.trace();
  }

  debug(message: string, ...optionalParams: unknown[]): void {
    this.#logMessage('DEBUG', message, ...optionalParams);
  }

  info(message?: string, ...optionalParams: unknown[]): void {
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

// #region Global Variables
const logManagerBrowser = new LogManagerBrowser();
// #endregion

// #region Exports
export default logManagerBrowser;
// #endregion
