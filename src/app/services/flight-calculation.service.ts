import { Injectable } from '@angular/core';
import { numberSafeCompareFunction } from 'ol/array';

@Injectable({
    providedIn: 'root'
})
export class FlightCalculationService {

    isDay(latitude: number, longitude: number, JD: number, timeNow: number): boolean {

        var riseMinutesGMT = this.calcSunriseUTC(JD, latitude, longitude);
        var setMinutesGMT = this.calcSunsetUTC(JD, latitude, longitude);

        if (riseMinutesGMT < 0) {
            riseMinutesGMT += 1440;
        }
        if (riseMinutesGMT > 1440) {
            riseMinutesGMT -= 1440;
        }
        if (setMinutesGMT < 0) {
            setMinutesGMT += 1440;
        }
        if (setMinutesGMT > 1440) {
            setMinutesGMT -= 1440;
        }

        // Check if is night or day
        if (riseMinutesGMT < setMinutesGMT) {
            if (timeNow < riseMinutesGMT) {
                return false;
            } else if (timeNow < setMinutesGMT) {
                return true;
            } else {
                return false;
            }
        } else {
            if (timeNow < setMinutesGMT) {
                return true;
            } else if (timeNow < riseMinutesGMT) {
                return false;
            } else {
                return true;
            }
        }
    }

    getRiseSetTime(lat1: number, lon1: number, time1: number, lat2: number, lon2: number, time2: number, JD: number): { time: number, lat: number, lon: number, isDay: boolean } | null {

        // Flight time between the 2 waypoints
        let flightTime = time2 - time1;

        if (time1 > (60 * 24)) time1 = time1 - (60 * 24);
        if (time2 > (60 * 24)) time2 = time2 - (60 * 24);

        // distance
        let distance = this.flightDistance(lat1, lon1, lat2, lon2);

        // flight speed in NM/MIN
        let speed = distance / flightTime;

        let today = new Date();
        let jd = this.calcJD(today.getFullYear(), today.getMonth() + 1, today.getDate());

        let nextPosition = {lat: lat1, lon: lon1};

        let wasDay: boolean | null = null;

        // for every minute of the flight time.....
        for (let i = 0; i <= flightTime; i++) {
            let isDay = this.isDay(nextPosition.lat, nextPosition.lon, jd, time1);

            let bearing = this.flightBearing(lat1, lon1, lat2, lon2);
            nextPosition = this.flightNextWaypoint(lat1, lon1, bearing, speed);

            // add one minute to time.
            time1++;

            // after wasDay is set, if it's different than the previous ===  sunrise/sunset
            if (wasDay === null && wasDay != isDay ) {
                return { time: time1, lat: nextPosition.lat, lon: nextPosition.lon, isDay: isDay};
            }
            wasDay = isDay;

            // move to next coordinates
            lat1 = nextPosition.lat;
            lon1 = nextPosition.lon;
        }
        return null;
    }

    // isLeapYear returns 1 if the 4-digit yr is a leap year, 0 if it is not
    isLeapYear(yr: number) {
        return ((yr % 4 == 0 && yr % 100 != 0) || yr % 400 == 0);
    }

    //***********************************************************************/
    //* Name:    calcSunriseUTC								*/
    //* Type:    Function									*/
    //* Purpose: calculate the Universal Coordinated Time (UTC) of sunrise	*/
    //*			for the given day at the given location on earth	*/
    //* Arguments:										*/
    //*   JD  : julian day									*/
    //*   latitude : latitude of observer in degrees				*/
    //*   longitude : longitude of observer in degrees				*/
    //* Return value:										*/
    //*   time in minutes from zero Z							*/
    //***********************************************************************/

    calcSunriseUTC(JD: number, latitude: number, longitude: number): number {

        longitude = -1 * longitude;

        var t = this.calcTimeJulianCent(JD);

        // *** Find the time of solar noon at the location, and use
        //     that declination. This is better than start of the
        //     Julian day

        var noonmin = this.calcSolNoonUTC(t, longitude);
        var tnoon = this.calcTimeJulianCent(JD + noonmin / 1440.0);

        // *** First pass to approximate sunrise (using solar noon)

        var eqTime = this.calcEquationOfTime(tnoon);
        var solarDec = this.calcSunDeclination(tnoon);
        var hourAngle = this.calcHourAngleSunrise(latitude, solarDec);

        var delta = longitude - this.radToDeg(hourAngle);
        var timeDiff = 4 * delta;
        // in minutes of time
        var timeUTC = 720 + timeDiff - eqTime;
        // in minutes

        // *** Second pass includes fractional jday in gamma calc

        var newt = this.calcTimeJulianCent(this.calcJDFromJulianCent(t) + timeUTC / 1440.0);
        eqTime = this.calcEquationOfTime(newt);
        solarDec = this.calcSunDeclination(newt);
        hourAngle = this.calcHourAngleSunrise(latitude, solarDec);
        delta = longitude - this.radToDeg(hourAngle);
        timeDiff = 4 * delta;
        timeUTC = 720 + timeDiff - eqTime;
        // in minutes

        return timeUTC;
    }

    //***********************************************************************/
    //* Name:    calcSunsetUTC								*/
    //* Type:    Function									*/
    //* Purpose: calculate the Universal Coordinated Time (UTC) of sunset	*/
    //*			for the given day at the given location on earth	*/
    //* Arguments:										*/
    //*   JD  : julian day									*/
    //*   latitude : latitude of observer in degrees				*/
    //*   longitude : longitude of observer in degrees				*/
    //* Return value:										*/
    //*   time in minutes from zero Z							*/
    //***********************************************************************/

    calcSunsetUTC(JD: number, latitude: number, longitude: number): number {

        longitude = -1 * longitude;

        var t = this.calcTimeJulianCent(JD);

        // *** Find the time of solar noon at the location, and use
        //     that declination. This is better than start of the
        //     Julian day

        var noonmin = this.calcSolNoonUTC(t, longitude);
        var tnoon = this.calcTimeJulianCent(JD + noonmin / 1440.0);

        // First calculates sunrise and approx length of day

        var eqTime = this.calcEquationOfTime(tnoon);
        var solarDec = this.calcSunDeclination(tnoon);
        var hourAngle = this.calcHourAngleSunset(latitude, solarDec);

        var delta = longitude - this.radToDeg(hourAngle);
        var timeDiff = 4 * delta;
        var timeUTC = 720 + timeDiff - eqTime;

        // first pass used to include fractional day in gamma calc

        var newt = this.calcTimeJulianCent(this.calcJDFromJulianCent(t) + timeUTC / 1440.0);
        eqTime = this.calcEquationOfTime(newt);
        solarDec = this.calcSunDeclination(newt);
        hourAngle = this.calcHourAngleSunset(latitude, solarDec);

        delta = longitude - this.radToDeg(hourAngle);
        timeDiff = 4 * delta;
        timeUTC = 720 + timeDiff - eqTime;
        // in minutes

        return timeUTC;
    }

    //***********************************************************************/
    //***********************************************************************/
    //*												                        */
    //*This section contains subroutines used in calculating solar position */
    //*												                        */
    //***********************************************************************/
    //***********************************************************************/

    // Convert radian angle to degrees
    radToDeg(angleRad: number) {
        return (180.0 * angleRad / Math.PI);
    }

    //*********************************************************************/

    // Convert degree angle to radians
    degToRad(angleDeg: number) {
        return (Math.PI * angleDeg / 180.0);
    }

    //*********************************************************************/

    //***********************************************************************/
    //* Name:    calcDayOfYear							                	*/
    //* Type:    Function							                		*/
    //* Purpose: Finds numerical day-of-year from mn, day and lp year info  */
    //* Arguments:							                    			*/
    //*   month: January = 1			                					*/
    //*   day  : 1 - 31					                    				*/
    //*   lpyr : 1 if leap year, 0 if not	            					*/
    //* Return value:						                				*/
    //*   The numerical day of year			                				*/
    //***********************************************************************/

    calcDayOfYear(mn: number, dy: number, lpyr: boolean) {
        var k = (lpyr ? 1 : 2);
        var doy = Math.floor((275 * mn) / 9) - k * Math.floor((mn + 9) / 12) + dy - 30;
        return doy;
    }

    //***********************************************************************/
    //* Name:    calcJD							                    		*/
    //* Type:    Function							                		*/
    //* Purpose: Julian day from calendar day		        				*/
    //* Arguments:								                    		*/
    //*   year : 4 digit year				                				*/
    //*   month: January = 1				                				*/
    //*   day  : 1 - 31					                    				*/
    //* Return value:								                		*/
    //*   The Julian day corresponding to the date	        				*/
    //* Note:										                    	*/
    //*   Number is returned for start of day.  Fractional days should be	*/
    //*   added later.						                    			*/
    //***********************************************************************/

    calcJD(year: number, month: number, day: number) {
        if (month <= 2) {
            year -= 1;
            month += 12;
        }
        var A = Math.floor(year / 100);
        var B = 2 - A + Math.floor(A / 4);

        var JD = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
        return JD;
    }

    //***********************************************************************/
    //* Name:    calcDateFromJD				                				*/
    //* Type:    Function						                			*/
    //* Purpose: Calendar date from Julian Day	            				*/
    //* Arguments:								                    		*/
    //*   jd   : Julian Day					                				*/
    //* Return value:						                				*/
    //*   String date in the form DD-MONTHNAME-YYYY	        				*/
    //* Note:									                    		*/
    //***********************************************************************/

    calcDateFromJD(jd: number) {
        var z = Math.floor(jd + 0.5);
        var f = (jd + 0.5) - z;

        if (z < 2299161) {
            var A = z;
        } else {
            let alpha = Math.floor((z - 1867216.25) / 36524.25);
            var A = z + 1 + alpha - Math.floor(alpha / 4);
        }

        var B = A + 1524;
        var C = Math.floor((B - 122.1) / 365.25);
        var D = Math.floor(365.25 * C);
        var E = Math.floor((B - D) / 30.6001);

        var day = B - D - Math.floor(30.6001 * E) + f;
        var month = (E < 14) ? E - 1 : E - 13;
        var year = (month > 2) ? C - 4716 : C - 4715;

        // alert ("date: " + day + "-" + monthList[month-1].name + "-" + year);
        return (day + "-" + month + "-" + year);
    }

    //***********************************************************************/
    //* Name:    calcTimeJulianCent		                					*/
    //* Type:    Function				                					*/
    //* Purpose: convert Julian Day to centuries since J2000.0.		       	*/
    //* Arguments:									                    	*/
    //*   jd : the Julian Day to convert		            				*/
    //* Return value:						                				*/
    //*   the T value corresponding to the Julian Day		        		*/
    //***********************************************************************/

    calcTimeJulianCent(jd: number) {
        var T = (jd - 2451545.0) / 36525.0;
        return T;
    }

    //***********************************************************************/
    //* Name:    calcJDFromJulianCent			            				*/
    //* Type:    Function					                				*/
    //* Purpose: convert centuries since J2000.0 to Julian Day.	    		*/
    //* Arguments:									                    	*/
    //*   t : number of Julian centuries since J2000.0	        			*/
    //* Return value:								                		*/
    //*   the Julian Day corresponding to the t value	        			*/
    //***********************************************************************/

    calcJDFromJulianCent(t: number) {
        var JD = t * 36525.0 + 2451545.0;
        return JD;
    }

    //***********************************************************************/
    //* Name:    calGeomMeanLongSun							*/
    //* Type:    Function									*/
    //* Purpose: calculate the Geometric Mean Longitude of the Sun		*/
    //* Arguments:										*/
    //*   t : number of Julian centuries since J2000.0				*/
    //* Return value:										*/
    //*   the Geometric Mean Longitude of the Sun in degrees			*/
    //***********************************************************************/

    calcGeomMeanLongSun(t: number) {
        var L0 = 280.46646 + t * (36000.76983 + 0.0003032 * t);
        while (L0 > 360.0) {
            L0 -= 360.0;
        }
        while (L0 < 0.0) {
            L0 += 360.0;
        }
        return L0; // in degrees
    }

    //***********************************************************************/
    //* Name:    calGeomAnomalySun							*/
    //* Type:    Function									*/
    //* Purpose: calculate the Geometric Mean Anomaly of the Sun		*/
    //* Arguments:										*/
    //*   t : number of Julian centuries since J2000.0				*/
    //* Return value:										*/
    //*   the Geometric Mean Anomaly of the Sun in degrees			*/
    //***********************************************************************/

    calcGeomMeanAnomalySun(t: number) {
        var M = 357.52911 + t * (35999.05029 - 0.0001537 * t);
        return M; // in degrees
    }

    //***********************************************************************/
    //* Name:    calcEccentricityEarthOrbit						*/
    //* Type:    Function									*/
    //* Purpose: calculate the eccentricity of earth's orbit			*/
    //* Arguments:										*/
    //*   t : number of Julian centuries since J2000.0				*/
    //* Return value:										*/
    //*   the unitless eccentricity							*/
    //***********************************************************************/

    calcEccentricityEarthOrbit(t: number) {
        var e = 0.016708634 - t * (0.000042037 + 0.0000001267 * t);
        return e;
    }

    //***********************************************************************/
    //* Name:    calcSunEqOfCenter							*/
    //* Type:    Function									*/
    //* Purpose: calculate the equation of center for the sun			*/
    //* Arguments:										*/
    //*   t : number of Julian centuries since J2000.0				*/
    //* Return value:										*/
    //*   in degrees										*/
    //***********************************************************************/

    calcSunEqOfCenter(t: number) {
        var m = this.calcGeomMeanAnomalySun(t);

        var mrad = this.degToRad(m);
        var sinm = Math.sin(mrad);
        var sin2m = Math.sin(mrad + mrad);
        var sin3m = Math.sin(mrad + mrad + mrad);

        var C = sinm * (1.914602 - t * (0.004817 + 0.000014 * t)) + sin2m * (0.019993 - 0.000101 * t) + sin3m * 0.000289;
        return C;
    }

    //***********************************************************************/
    //* Name:    calcSunTrueLong								*/
    //* Type:    Function									*/
    //* Purpose: calculate the true longitude of the sun				*/
    //* Arguments:										*/
    //*   t : number of Julian centuries since J2000.0				*/
    //* Return value:										*/
    //*   sun's true longitude in degrees						*/
    //***********************************************************************/

    calcSunTrueLong(t: number) {
        var l0 = this.calcGeomMeanLongSun(t);
        var c = this.calcSunEqOfCenter(t);

        var O = l0 + c;
        return O;
    }

    //***********************************************************************/
    //* Name:    calcSunTrueAnomaly							*/
    //* Type:    Function									*/
    //* Purpose: calculate the true anamoly of the sun				*/
    //* Arguments:										*/
    //*   t : number of Julian centuries since J2000.0				*/
    //* Return value:										*/
    //*   sun's true anamoly in degrees							*/
    //***********************************************************************/

    calcSunTrueAnomaly(t: number) {
        var m = this.calcGeomMeanAnomalySun(t);
        var c = this.calcSunEqOfCenter(t);

        var v = m + c;
        return v;
    }

    //***********************************************************************/
    //* Name:    calcSunRadVector								*/
    //* Type:    Function									*/
    //* Purpose: calculate the distance to the sun in AU				*/
    //* Arguments:										*/
    //*   t : number of Julian centuries since J2000.0				*/
    //* Return value:										*/
    //*   sun radius vector in AUs							*/
    //***********************************************************************/

    calcSunRadVector(t: number) {
        var v = this.calcSunTrueAnomaly(t);
        var e = this.calcEccentricityEarthOrbit(t);

        var R = (1.000001018 * (1 - e * e)) / (1 + e * Math.cos(this.degToRad(v)));
        return R;
        // in AUs
    }

    //***********************************************************************/
    //* Name:    calcSunApparentLong							*/
    //* Type:    Function									*/
    //* Purpose: calculate the apparent longitude of the sun			*/
    //* Arguments:										*/
    //*   t : number of Julian centuries since J2000.0				*/
    //* Return value:										*/
    //*   sun's apparent longitude in degrees						*/
    //***********************************************************************/

    calcSunApparentLong(t: number) {
        var o = this.calcSunTrueLong(t);

        var omega = 125.04 - 1934.136 * t;
        var lambda = o - 0.00569 - 0.00478 * Math.sin(this.degToRad(omega));
        return lambda;
        // in degrees
    }

    //***********************************************************************/
    //* Name:    calcMeanObliquityOfEcliptic						*/
    //* Type:    Function									*/
    //* Purpose: calculate the mean obliquity of the ecliptic			*/
    //* Arguments:										*/
    //*   t : number of Julian centuries since J2000.0				*/
    //* Return value:										*/
    //*   mean obliquity in degrees							*/
    //***********************************************************************/

    calcMeanObliquityOfEcliptic(t: number) {
        var seconds = 21.448 - t * (46.8150 + t * (0.00059 - t * (0.001813)));
        var e0 = 23.0 + (26.0 + (seconds / 60.0)) / 60.0;
        return e0;
        // in degrees
    }

    //***********************************************************************/
    //* Name:    calcObliquityCorrection						*/
    //* Type:    Function									*/
    //* Purpose: calculate the corrected obliquity of the ecliptic		*/
    //* Arguments:										*/
    //*   t : number of Julian centuries since J2000.0				*/
    //* Return value:										*/
    //*   corrected obliquity in degrees						*/
    //***********************************************************************/

    calcObliquityCorrection(t: number) {
        var e0 = this.calcMeanObliquityOfEcliptic(t);

        var omega = 125.04 - 1934.136 * t;
        var e = e0 + 0.00256 * Math.cos(this.degToRad(omega));
        return e;
        // in degrees
    }

    //***********************************************************************/
    //* Name:    calcSunRtAscension							*/
    //* Type:    Function									*/
    //* Purpose: calculate the right ascension of the sun				*/
    //* Arguments:										*/
    //*   t : number of Julian centuries since J2000.0				*/
    //* Return value:										*/
    //*   sun's right ascension in degrees						*/
    //***********************************************************************/

    calcSunRtAscension(t: number) {
        var e = this.calcObliquityCorrection(t);
        var lambda = this.calcSunApparentLong(t);

        var tananum = (Math.cos(this.degToRad(e)) * Math.sin(this.degToRad(lambda)));
        var tanadenom = (Math.cos(this.degToRad(lambda)));
        var alpha = this.radToDeg(Math.atan2(tananum, tanadenom));
        return alpha;
        // in degrees
    }

    //***********************************************************************/
    //* Name:    calcSunDeclination							*/
    //* Type:    Function									*/
    //* Purpose: calculate the declination of the sun				*/
    //* Arguments:										*/
    //*   t : number of Julian centuries since J2000.0				*/
    //* Return value:										*/
    //*   sun's declination in degrees							*/
    //***********************************************************************/

    calcSunDeclination(t: number) {
        var e = this.calcObliquityCorrection(t);
        var lambda = this.calcSunApparentLong(t);

        var sint = Math.sin(this.degToRad(e)) * Math.sin(this.degToRad(lambda));
        var theta = this.radToDeg(Math.asin(sint));
        return theta;
        // in degrees
    }

    //***********************************************************************/
    //* Name:    calcEquationOfTime							*/
    //* Type:    Function									*/
    //* Purpose: calculate the difference between true solar time and mean	*/
    //*		solar time									*/
    //* Arguments:										*/
    //*   t : number of Julian centuries since J2000.0				*/
    //* Return value:										*/
    //*   equation of time in minutes of time						*/
    //***********************************************************************/

    calcEquationOfTime(t: number) {
        var epsilon = this.calcObliquityCorrection(t);
        var l0 = this.calcGeomMeanLongSun(t);
        var e = this.calcEccentricityEarthOrbit(t);
        var m = this.calcGeomMeanAnomalySun(t);

        var y = Math.tan(this.degToRad(epsilon) / 2.0);
        y *= y;

        var sin2l0 = Math.sin(2.0 * this.degToRad(l0));
        var sinm = Math.sin(this.degToRad(m));
        var cos2l0 = Math.cos(2.0 * this.degToRad(l0));
        var sin4l0 = Math.sin(4.0 * this.degToRad(l0));
        var sin2m = Math.sin(2.0 * this.degToRad(m));

        var Etime = y * sin2l0 - 2.0 * e * sinm + 4.0 * e * y * sinm * cos2l0 - 0.5 * y * y * sin4l0 - 1.25 * e * e * sin2m;

        return this.radToDeg(Etime) * 4.0;
        // in minutes of time
    }

    //***********************************************************************/
    //* Name:    calcHourAngleSunrise							*/
    //* Type:    Function									*/
    //* Purpose: calculate the hour angle of the sun at sunrise for the	*/
    //*			latitude								*/
    //* Arguments:										*/
    //*   lat : latitude of observer in degrees					*/
    //*	solarDec : declination angle of sun in degrees				*/
    //* Return value:										*/
    //*   hour angle of sunrise in radians						*/
    //***********************************************************************/
    calcHourAngleSunrise(lat: number, solarDec: number) {
        var latRad = this.degToRad(lat);
        var sdRad = this.degToRad(solarDec)

        var HAarg = (Math.cos(this.degToRad(90.833)) / (Math.cos(latRad) * Math.cos(sdRad)) - Math.tan(latRad) * Math.tan(sdRad));

        var HA = (Math.acos(Math.cos(this.degToRad(90.833)) / (Math.cos(latRad) * Math.cos(sdRad)) - Math.tan(latRad) * Math.tan(sdRad)));

        return HA;
        // in radians
    }

    //***********************************************************************/
    //* Name:    calcHourAngleSunset							*/
    //* Type:    Function									*/
    //* Purpose: calculate the hour angle of the sun at sunset for the	*/
    //*			latitude								*/
    //* Arguments:										*/
    //*   lat : latitude of observer in degrees					*/
    //*	solarDec : declination angle of sun in degrees				*/
    //* Return value:										*/
    //*   hour angle of sunset in radians						*/
    //***********************************************************************/

    calcHourAngleSunset(lat: number, solarDec: number) {
        var latRad = this.degToRad(lat);
        var sdRad = this.degToRad(solarDec)

        var HAarg = (Math.cos(this.degToRad(90.833)) / (Math.cos(latRad) * Math.cos(sdRad)) - Math.tan(latRad) * Math.tan(sdRad));

        var HA = (Math.acos(Math.cos(this.degToRad(90.833)) / (Math.cos(latRad) * Math.cos(sdRad)) - Math.tan(latRad) * Math.tan(sdRad)));

        return -HA;
        // in radians
    }

    //***********************************************************************/
    //* Name:    calcSolNoonUTC						                		*/
    //* Type:    Function						                			*/
    //* Purpose: calculate the Universal Coordinated Time (UTC) of solar	*/
    //*		noon for the given day at the given location on earth	    	*/
    //* Arguments:									                    	*/
    //*   t : number of Julian centuries since J2000.0	        			*/
    //*   longitude : longitude of observer in degrees	        			*/
    //* Return value:								                		*/
    //*   time in minutes from zero Z				            			*/
    //***********************************************************************/

    calcSolNoonUTC(t: number, longitude: number) {
        // First pass uses approximate solar noon to calculate eqtime
        var tnoon = this.calcTimeJulianCent(this.calcJDFromJulianCent(t) + longitude / 360.0);
        var eqTime = this.calcEquationOfTime(tnoon);
        var solNoonUTC = 720 + (longitude * 4) - eqTime;
        // min

        var newt = this.calcTimeJulianCent(this.calcJDFromJulianCent(t) - 0.5 + solNoonUTC / 1440.0);

        eqTime = this.calcEquationOfTime(newt);
        // var solarNoonDec = calcSunDeclination(newt);
        solNoonUTC = 720 + (longitude * 4) - eqTime;
        // min

        return solNoonUTC;
    }

    //***********************************************************************/
    //***********************************************************************/
    //*												                        */
    //*This section contains navigation calculations                        */
    //*												                        */
    //***********************************************************************/
    //***********************************************************************/


    flightDistance(latDep: number, longDep: number, latArr: number, longArr: number) {
        //form["result"].value = longArr;
        var dLat = this.degToRad((latArr - latDep));
        var dLon = this.degToRad((longArr - longDep));
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.degToRad(latDep)) * Math.cos(this.degToRad(latArr)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.asin(Math.sqrt(a));
        return 3443.89849 * c;
    }

    flightBearing(latDep: number, longDep: number, latArr: number, longArr: number) {
        var latDepR = this.degToRad(latDep);
        var longDepR = this.degToRad(longDep);
        var latArrR = this.degToRad(latArr);
        var longArrR = this.degToRad(longArr);
        var y = Math.sin(longArrR - longDepR) * Math.cos(latArrR);
        var x = Math.cos(latDepR) * Math.sin(latArrR) - Math.sin(latDepR) * Math.cos(latArrR) * Math.cos(longArrR - longDepR);
        var bearing = this.radToDeg((Math.atan2(y, x)));
        if (bearing < 0) {
            bearing = 360 + bearing;
        }
        return bearing;
    }

    flightNextWaypoint(latDep: number, longDep: number, bearing: number, distance: number): { lat: number, lon: number } {

        var latDepR = this.degToRad(latDep);
        var longDepR = this.degToRad(longDep);
        var bearingR = this.degToRad(bearing);

        var R = 3443.89849;
        var latNext = Math.asin(Math.sin(latDepR) * Math.cos(distance / R) + Math.cos(latDepR) * Math.sin(distance / R) * Math.cos(bearingR));
        var longNext = longDepR + Math.atan2(Math.sin(bearingR) * Math.sin(distance / R) * Math.cos(latDepR), Math.cos(distance / R) - Math.sin(latDepR) * Math.sin(latNext));
        latNext = this.radToDeg(latNext);
        longNext = this.radToDeg(longNext);

        if (longNext > 180) {
            longNext -= 360;
        }
        if (longNext < -180) {
            longNext += 360;
        }

        return { lat: latNext, lon: longNext }
    }

    flightLineOfSight(altitude: number) {
        return 1.23 * Math.sqrt(altitude);
    }

    // timenow = MINUTES today since 00:00 UTC
    calcSunAzimute(JD: number, timenow: number, latitude: number, longitude: number) {

        // Reverse Longitude
        var longitude = -longitude;

        var timenow = timenow / 60;

        // var dow = this.calcDayOfWeek(JD);

        var T = this.calcTimeJulianCent(JD + timenow / 24.0);

        var solarDec = this.calcSunDeclination(T);
        var eqTime = this.calcEquationOfTime(T);

        var solarTimeFix = eqTime - 4.0 * longitude;

        var trueSolarTime = timenow * 60.0 + solarTimeFix;
        // in minutes

        while (trueSolarTime > 1440) {
            trueSolarTime -= 1440;
        }

        var hourAngle = trueSolarTime / 4.0 - 180.0;

        if (hourAngle < -180) {
            hourAngle += 360.0;
        }

        var haRad = this.degToRad(hourAngle);

        var csz = Math.sin(this.degToRad(latitude)) * Math.sin(this.degToRad(solarDec)) + Math.cos(this.degToRad(latitude)) * Math.cos(this.degToRad(solarDec)) * Math.cos(haRad);

        if (csz > 1.0) {
            csz = 1.0;
        } else if (csz < -1.0) {
            csz = -1.0;
        }

        var zenith = this.radToDeg(Math.acos(csz));

        var azDenom = (Math.cos(this.degToRad(latitude)) * Math.sin(this.degToRad(zenith)));

        if (Math.abs(azDenom) > 0.001) {
            let azRad = ((Math.sin(this.degToRad(latitude)) * Math.cos(this.degToRad(zenith))) - Math.sin(this.degToRad(solarDec))) / azDenom;

            if (Math.abs(azRad) > 1.0) {
                if (azRad < 0) {
                    azRad = -1.0;
                } else {
                    azRad = 1.0;
                }
            }

            var azimuth = 180.0 - this.radToDeg(Math.acos(azRad));

            if (hourAngle > 0.0) {
                azimuth = -azimuth;
            }
        } else {
            if (latitude > 0.0) {
                azimuth = 180.0;
            } else {
                azimuth = 0.0;
            }
        }
        if (azimuth < 0.0) {
            azimuth += 360.0;
        }
        azimuth = (Math.floor(100 * azimuth)) / 100;
        return azimuth;
    }
}