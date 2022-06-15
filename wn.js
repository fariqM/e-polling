//JavaScript implementation of winding number algorithm to determine whether a point is inside a polygon
//Based on C++ implementation of wn_PnPoly() published on http://geomalgorithms.com/a03-_inclusion.html

// mySquare = [[-1,1], [1,1], [1,-1], [-1,-1]];

// pointA = [0.5,0.5];
// pointB = [2,2]

function pointInPolygon(point, vs) {
    const x = point[0], y = point[1];
    let wn = 0;

    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        let xi = vs[i][0], yi = vs[i][1];
        let xj = vs[j][0], yj = vs[j][1];

        if (yj <= y) {
            if (yi > y) {
                if (isLeft([xj, yj], [xi, yi], [x, y]) > 0) {
                    wn++;
                }
            }
        } else {
            if (yi <= y) {
                if (isLeft([xj, yj], [xi, yi], [x, y]) < 0) {
                    wn--;
                }
            }
        }
    }
    return wn != 0;
};

function isLeft(P0, P1, P2) {
    let res = ((P1[0] - P0[0]) * (P2[1] - P0[1])
        - (P2[0] - P0[0]) * (P1[1] - P0[1]));
    return res;
}