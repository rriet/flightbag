/**  
 * eFlightBag - A complete electronic flight bag solution  
 * @author Ricardo Correa 
 * @date 2022-07-12
 **/

/**
* Rounds number to nearest hundred
* @param {number | null} inputNumber number to be rounded
* @returns {number} Number Rounded
*/
export function roundCent(inputNumber: number): number {
    return Math.round(inputNumber / 100) * 100;
}

/**
* Rounds ceil to nearest hundred
* @param {number | null} inputNumber number to be ceil
* @returns {number} Number ceil
*/
export function ceilCent(inputNumber: number): number {
    return Math.ceil(inputNumber / 100) * 100;
}

/**
* Rounds floor to nearest hundred
* @param {number | null} inputNumber number to be floored
* @returns {number} Number floored
*/
export function floorCent(inputNumber: number): number {
    return Math.floor(inputNumber / 100) * 100;
}