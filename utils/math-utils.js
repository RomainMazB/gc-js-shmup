window.clamp = (num, min, max) => Math.min(Math.max(num, min), max);
Math.angleBetweenPoints = (pointA, pointB) => Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x)
Number.prototype.isBetween = function(a, b, including = true) {
    let min = Math.min(a, b),
        max = Math.max(a, b);

    return including ? this >= min && this <= max : this > min && this < max;
}
Number.prototype.clamp = (min, max) =>  Math.min(Math.max(this, min), max)

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
 * Return if rectA collides with rectB
 * @param rectA
 * @param rectB
 * @returns {boolean}
 */
window.aabb = (rectA, rectB) =>
    rectContainsPoint(rectA, {x: rectB.x, y: rectB.y}) ||
    rectContainsPoint(rectA, {x: rectB.x + rectB.width, y: rectB.y}) ||
    rectContainsPoint(rectA, {x: rectB.x, y: rectB.y + rectB.height}) ||
    rectContainsPoint(rectA, {x: rectB.x + rectB.width, y: rectB.y + rectB.height})

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

window.point = (x, y) => ({x, y})
window.rect = (x, y, width, height) => ({x, y, width, height})
window.circle = (center, size) => ({center, size})