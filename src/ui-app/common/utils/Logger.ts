const Logger: any = function () {
};

Logger.prototype.debug = (msg: string): void => console.debug(msg);
Logger.prototype.info = (msg: string): void => console.info(msg);
Logger.prototype.warn = (msg: string): void => console.warn(msg);
Logger.prototype.error = (msg: string): void => console.error(msg);

export default new Logger();
