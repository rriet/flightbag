/**  
 * eFlightBag - A complete electronic flight bag solution  
 * @author Ricardo Correa 
 * @date 2022
 **/

/**
* Calculate local time
* @param {time | null} inputNumber UTC time in minutes from midnight
* @param {timeZone | null} inputNumber timezone in minutes
* @returns {number | null} Local time in minutes from midnight
*/
export function getLocalTime(time: number | null, timeZone: number | null): number | null {
    if (time !== null && timeZone !== null) {
        let localTime = time + timeZone;
        if (localTime > (24 * 60)) {
            return localTime - (24 * 60);
        } else if (localTime < 0) {
            return localTime + (24 * 60);
        } else {
            return localTime;
        }
    }
    return null;
}

/**
* Minutes UTC
* @returns {number | null} Minutes now from midnight UTC
*/
export function minNowUTC(): number {
    var date = new Date(new Date());
    return date.getUTCHours() * 60 + date.getUTCMinutes();
}