/**
 * Test if a ploy line defined by y[] intersects with box. 
 */
function polyLineIntersectsBox(y, p1, p2) {
  const start = Math.max(1, Math.floor(p1.x));
  const end = Math.min(y.length, Math.ceil(p2.x));

  for (let x = start; x < end; x++) {
    if (lineSegmentIntersectsBox(x, y[x-1], x+1, y[x], p1, p2)) {
      return true;
    }
  }
  return false;
}

function lineSegmentIntersectsBox(x1, y1, x2, y2, p1, p2) {
  const a = y2 - y1, b = x1 - x2, c = x2 * y1 - x1 * y2;

  const f1 = a * p1.x + b * p2.y + c;
  const f2 = a * p2.x + b * p2.y + c;
  const f3 = a * p2.x + b * p1.y + c;
  const f4 = a * p1.x + b * p1.y + c;
  if ((f1 > 0 && f2 > 0 && f3 > 0 && f4 > 0) || (f1 < 0 && f2 < 0 && f3 < 0 && f4 < 0)) {
    return false;
  }

  if ((x1 > p2.x && x2 > p2.x) || (x1 < p1.x && x2 < p1.x)
      || (y1 > p1.y && y2 > p1.y) || (y1 < p2.y && y2 < p2.y)) {
    return false;
  }

  return true;
}

export default {
  polyLineIntersectsBox
}