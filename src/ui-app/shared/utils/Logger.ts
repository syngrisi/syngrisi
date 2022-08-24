/* eslint-disable no-console */
const Logger: any = function Logger() {
};

Logger.prototype.debug = (...msg: any): void => console.debug(...msg);
Logger.prototype.info = (...msg: any): void => console.info(...msg);
Logger.prototype.warn = (...msg: any): void => console.warn(...msg);
Logger.prototype.error = (...msg: any): void => console.error(...msg);

const log = new Logger();
export { log };
export default log;
