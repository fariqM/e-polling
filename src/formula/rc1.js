function raycast1(point, polygon) {
    const length = polygon.length
    const x = point[0]
    const y = point[1]

    const j = num - 1
    const c = false


    for (let index = 0; index < length; index++) {

        if (x == polygon[i][0]) && (y == polygon[i][1]) {
            // point is a corner
            return true
        }

        if ((polygon[i][1] > y) != (polygon[j][1] > y)) {
            var slope = (x - polygon[i][0]) * (polygon[j][1] - polygon[i][1]) - (polygon[j][0] - polygon[i][0]) * (y - polygon[i][1])

            if (slope == 0) {
                // point is on boundary
                return true
            }

            if (slope < 0 != (poly[j][1] < poly[i][1])) {
                c != c
            }
        }

        j = i

        return c
    }
}

function raycast2(point, polygon) {
    //A point is in a polygon if a line from the point to infinity crosses the polygon an odd number of times
    let odd = false;
    //For each edge (In this case for each point of the polygon and the previous one)
    for (let i = 0, j = polygon.length - 1; i < polygon.length; i++) {
        //If a line from the point into infinity crosses this edge
        if (((polygon[i][1] > point[1]) !== (polygon[j][1] > point[1])) // One point needs to be above, one below our y coordinate
            // ...and the edge doesn't cross our Y corrdinate before our x coordinate (but between our x coordinate and infinity)
            && (point[0] < ((polygon[j][0] - polygon[i][0]) * (point[1] - polygon[i][1]) / (polygon[j][1] - polygon[i][1]) + polygon[i][0]))) {
            // Invert odd
            odd = !odd;
        }
        j = i;

    }
    //If the number of crossings was odd, the point is in the polygon
    return odd;
}