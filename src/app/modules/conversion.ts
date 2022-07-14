/**
* Convert Latitude Number to Human readable String.
* @param {number | null} lat latitude in degrees
* @returns {string} Human readable string (Positive = North)
*/
export function latToStr(lat: number | null = 0): string {
    if (lat !== null) {
        let prefix = (lat >= 0) ? "N" : "S";

        lat = Math.abs(lat);

        let deg: string = String(Math.floor(lat)).padStart(2, '0');

        let min: string = String(Math.round(lat % 1 * 60 * 10) / 10).padStart(4, '0');

        return prefix + deg + ' ' + min;
    }
    return '';
}

/**
* Convert Longitude Number to Human readable String.
* @param {number | null} lon Longitude in degrees
* @returns {string} Human readable string (Positive = East)
*/
export function lonToStr(lon: number | null = 0): string {
    if (lon !== null) {
        let prefix = (lon >= 0) ? "E" : "W";

        lon = Math.abs(lon);

        let deg: string = String(Math.floor(lon)).padStart(3, '0');

        let min: string = String(Math.round(lon % 1 * 60 * 10) / 10).padStart(4, '0');

        return prefix + deg + ' ' + min;
    }
    return '';
}

/**
* Convert minutes to HH:MM 24hs
* @param {number | null} setMinutes Minutes since midnight
* @returns {string} Human readable string HH:MM
*/
export function minToStr(setMinutes: number | null = 0): string {
    if (setMinutes !== null) {
        let dateObj: Date = new Date(setMinutes * 60000);
        let hours: number = dateObj.getUTCHours();
        let minutes: number = dateObj.getUTCMinutes();
        return hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');
    }
    return '00:00';
}

/**
* Convert number to string with Positive sign 
/* surounded by brackets 
/* ie.; -1 => (-1), 2 => (+2), 0 => '', null => ''
* @param {number | null} num number
* @returns {string} number value with signal
*/
export function numDiff(num: number | null = 0): string {
    if (num !== null && num !== 0) {
        return '(' + (num < 0 ? "-" : "+") + String(Math.abs(num)).padStart(1, '0') + ')';
    }
    return '';
}

/**
* Convert number to string Tons
/* ie.; 10000 => 10.0 , 2300 => 2.3, 0 => 0.0, 100 => 0.1 null => 0
* @param {number | null} num number
* @returns {string} String representing Tons
*/
export function numToTons(num: number | null = 0): string {
    if (num !== null) {
        let cent: string = String(Math.round(Math.abs(num / 100)));
        return (num < 0 ? "-" : "") + cent.slice(0, -1).padStart(1, '0') + '.' + cent.slice(cent.length - 1);
    }
    return '0.0';
}

/**
* Convert number to string Tons with plus sign in brackets
/* ie.; 10000 => (+10.0) , 2300 => (+2.3), -1200 => (-1.2), 0 => '', null => '', -1
* @param {number | null} num number
* @returns {string} String representing Tons
*/
export function nunToTonsDiff(num: number | null = 0): string {
    if (numToTons(num) !== '0.0' && num !== null) {
        return '(' + (num < 0 ? "" : "+") + numToTons(num) + ')';
    }
    return '';
}