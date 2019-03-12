/**
 * @file Initiates all logger instances.
 * @see module:loggers */

/** @module loggers */

import debug from 'debug';

/**
 * This is the main logger from which other logger instances will extend.
 * It uses the namespace 'ShopInc' and logs to process.stdout.
 */
const mainLogger = debug('ShopInc');
mainLogger.log = console.log.bind(console);

/**
 * This is the error logger which extends main logger.
 * It uses the namespace 'ShopInc:Error' and logs to process.stderr.
 * Used to log errors that are caught but have no specific namespace to log with.
 */
export const errorLogger = mainLogger.extend('Error');
errorLogger.log = console.error.bind(console);

/**
 * This is the warning logger which extends main logger.
 * It uses the namespace 'ShopInc:Warning' and logs to process.stderr.
 * Used to log warnings that have no specific namespace to log with.
 */
export const warningLogger = mainLogger.extend('Warning');
warningLogger.log = console.warn.bind(console);

/**
 * Logs all and any information to do with the server after it has started listening.
 * It uses the namespace 'ShopInc:Server' and logs to process.stdout.
 */
export const serverLogger = mainLogger.extend('Server');

/**
 * Exports the {@link module:loggers~mainLogger mainLogger}.
 */
export default mainLogger;
