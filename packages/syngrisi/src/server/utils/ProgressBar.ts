import { Response } from 'express';

export class ProgressBar {
    length: number;
    percentLenght: number;
    prevPercent: number;
    currentPercent: number;
    progressString: string;

    constructor(length: number) {
        this.length = length;
        this.percentLenght = parseFloat((length / 100).toString());
        this.prevPercent = 0;
        this.currentPercent = 0;
        this.progressString = '';
    }

    isChange(current: number): boolean {
        this.currentPercent = parseInt((current / this.percentLenght).toString(), 10);
        if (this.prevPercent === this.currentPercent) {
            return false;
        }
        this.prevPercent = this.currentPercent;
        this.progressString += '#';
        return true;
    }

    writeIfChange(index: number, count: number, fn: (message: string, res: Response) => void, res: Response): void {
        if (this.isChange(index)) {
            const placeholderString = Array.from(new Array(99 - this.currentPercent))
                .reduce((accum) => accum += '.', '');
            fn(`[${this.progressString}${placeholderString}](${index}/${count})`, res);
        }
    }
}
