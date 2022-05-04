/**
 * Maths
 */

/**
 * Clamp a number between a minimum and a maximum and return it
 * @param num
 * @param min
 * @param max
 * @returns {number}
 */
window.clamp = (min, num, max) => Math.min(Math.max(min, num), max);

/**
 * Return the radian angle between two points
 * @param pointA
 * @param pointB
 * @returns {number}
 */
window.angleBetweenPoints = (pointA, pointB) => Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x)

/**
 * Generate a random number between a minimum and a maximum
 * @param min
 * @param max
 * @returns {*}
 */
Math.randomNumber = function (min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)

    return Math.floor(Math.random() * (max - min +1)) + min
}



/**
 * Geometry
 */

/**
 * Return whether a point is inside the rectangle or not
 * @returns {boolean}
 * @param rect
 * @param point
 */
window.rectContainsPoint = (rect, point) =>
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height

/**
 * Return whether a point is inside the circle or not
 * @returns {boolean}
 * @param circle
 * @param point
 */
window.circleContainsPoint = (circle, point) =>
    Math.abs(Math.hypot(point.x - circle.center.x, point.y - circle.center.y)) <= circle.size



/**
 * Collisions
 */

/**
 * Return if rectA collides with rectB
 * @param rectA
 * @param rectB
 * @returns {boolean}
 */
window.aabb = (rectA, rectB) =>
    !(rectA.x > rectB.x + rectB.width   ||
    rectA.x + rectA.width < rectB.x     ||
    rectA.y > rectB.y + rectB.height    ||
    rectA.y + rectA.height < rectB.y)

window.segmentProjection = (pointA, pointB, pointC) =>
{
    let ACx = pointC.x-pointA.x;
    let ACy = pointC.y-pointA.y;
    let ABx = pointB.x-pointA.x;
    let ABy = pointB.y-pointA.y;
    let BCx = pointC.x-pointB.x;
    let BCy = pointC.y-pointB.y;
    let s1 = (ACx*ABx) + (ACy*ABy);
    let s2 = (BCx*ABx) + (BCy*ABy);
    return s1*s2>0
}


/**
 * Geometry helpers
 */

/**
 * Generates a 2D point
 * @param x
 * @param y
 * @returns {{x, y}}
 */
window.point = (x, y) => ({x, y})

/**
 * Generates a rectangle
 * @param x
 * @param y
 * @param width
 * @param height
 * @returns {{x, width, y, height}}
 */
window.rect = (x, y, width, height) => ({x, y, width, height})

/**
 * Generates a circle
 * @param center
 * @param size
 * @returns {{size, center}}
 */
window.circle = (center, size) => ({center, size})



/**
 * Number class helpers
 */

/**
 * Return whether the current Number is between min and max
 * @param a
 * @param b
 * @param including
 * @returns {boolean}
 */
Number.prototype.isBetween = function(a, b, including = true) {
    let min = Math.min(a, b),
        max = Math.max(a, b);

    return including ? this >= min && this <= max : this > min && this < max;
}

/**
 * Clamp the current Number between a minimum and a maximum and return it
 * @param min
 * @param max
 * @returns {number}
 */
Number.prototype.clamp = function (min, max) { return Math.min(Math.max(this, min), max) }


/**
 * Boolean class helpers
 */

/**
 * Return a random boolean
 * @param _
 * @returns {boolean}
 */
Boolean.random = _ => Math.random() < .5


/**
 * PROJECT-SPECIFIC HELPERS
 */
window.worldScaleForY = y => y / (435 + 150)
window.worldYProjection = y => y / (435 + 150)