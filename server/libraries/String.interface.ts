const padString = function(s,length =  2) {
    while (s.toString().length < length) {
        s = '0' + s;
    }
    return s;
}

export class StringInterface {

    public static padZero(s: string, length: number = 2) {
        padString(s,length)
    }

    public static makeTimeFormat(schedule,prop){
        return padString(schedule[prop+'Hour']) + ':'  + padString(schedule[prop+'Min']);
    }
}
