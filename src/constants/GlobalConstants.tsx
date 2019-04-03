// 时间转换
export function dateToString(date: Date) {
    var res = date.getFullYear() + "-";
    if (date.getMonth() + 1 < 10) {
        res = res + "0";
    }
    res = res + (date.getMonth() + 1) + "-";

    if (date.getDate() < 10) {
        res = res + "0";
    }
    res = res + date.getDate() + " ";

    if (date.getHours() < 10) {
        res = res + "0";
    }
    res = res + date.getHours() + ":";

    if (date.getMinutes() < 10) {
        res = res + "0";
    }
    res = res + date.getMinutes() + ":";

    if (date.getSeconds() < 10) {
        res = res + "0";
    }
    res = res + date.getSeconds() + "";
    return res;
}