/**  
 * eFlightBag - A complete electronic flight bag solution  
 * @author Ricardo Correa 
 * @date 2022
 **/

/**
* Calculate local time
* @param {time | null} time UTC time in minutes from midnight
* @param {timeZone | null} timeZone timezone in minutes
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

/**
* Add Times
* @param {first | null} first time to add
* @param {second | null} second time to add
* @returns {number | null} Added time
*/
export function addTimes(first: number | null, second: number | null): number | null {
    if (first !== null && second !== null) {
        if (first + second < (24 * 60)) {
            return first + second;
        }
        return first + second - (24 * 60);
    }
    return null;
}

/**
* Subtract Times
* @param {first | null} first Time to be subtracted (Minuend)
* @param {second | null} second Amount beeing taken (Subtrahend)
* @returns {number | null} Subtracted time
*/
export function subtractTimes(first: number | null, second: number | null): number | null {
    if (first !== null && second !== null) {
        if (first - second < (24 * 60)) {
            return first - second;
        }
        if (first - second < 0) {
            return first - second + (24 * 60);
        }
        return first - second - (24 * 60);
    }
    return null;
}