export function twoDigits(num: number): string {
    return num.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false})
}

Date.prototype.toUaString = function (this: Date): string {
    const currDate = twoDigits(this.getDate());
    const curMonth = twoDigits(this.getMonth() + 1); //Months are zero based
    const currYear = this.getFullYear();
    return (currDate + "/" + curMonth + "/" + currYear);
};

Date.prototype.toUaTimeString = function (this: Date): string {
    return this.toUaString() + " " + twoDigits(this.getHours()) + ":" + twoDigits(this.getMinutes());
}

Date.prototype.getDateOnly = function (this: Date): Date {
    return new Date(this.getFullYear(), this.getMonth(), this.getDate());
}

function formatDate(this: string | Date): Date {
    if (typeof this !== "string") {
        return this;
    }

    let raw = this;
    if (!raw.endsWith("Z")) {
        raw += "Z";
    }
    return new Date(raw);
}

Date.prototype.formatDate = formatDate;
String.prototype.formatDate = formatDate;