Date.prototype.toUaString = function (this: Date): string {    
    const curr_date = this.getDate();
    const curr_month = this.getMonth() + 1; //Months are zero based
    const curr_year = this.getFullYear();
    return (curr_date + "/" + curr_month + "/" + curr_year);
};