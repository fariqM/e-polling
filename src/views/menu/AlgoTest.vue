<template>
	<div class="fullwindow">
		<div id="map" class="fullwindow"></div>
		<div class="control-panel d-flex flex-column justify-space-between">
			<div class="d-flex justify-space-around">
				<v-simple-table dense height="25vh" fixed-header style="width: 40%">
					<template v-slot:default>
						<thead>
							<tr>
								<th class="text-left">Ray Casting</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(time, n) in timeResult.rc" :key="n + 'rc'">
								<td>{{ String(time).substr(0, 13) }}</td>
							</tr>
						</tbody>
					</template>
				</v-simple-table>
				<v-simple-table dense height="25vh" fixed-header style="width: 40%">
					<template v-slot:default>
						<thead>
							<tr>
								<th class="text-left">Winding Number</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(time, n) in timeResult.wn" :key="n + 'wn'">
								<td>{{ String(time).substr(0, 13) }}</td>
							</tr>
						</tbody>
					</template>
				</v-simple-table>
			</div>
			<div class="">
				<div class="d-flex justify-space-around align-start mb-3">
					<v-btn
						small
						color="primary"
						:loading="btnLoading"
						@click="startRayCasting"
					>
						RC
					</v-btn>
					<v-btn small color="accent" @click="startWindingNumber"> WN </v-btn>
					<v-btn small color="error" @click="addRandomPoint">
						random point
					</v-btn>
				</div>
				<div class="d-flex justify-space-around">
					<v-btn small color="info" @click="clearResult"> Clear result </v-btn>
					<v-btn small color="info" @click="clearPoint"> Clear point </v-btn>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
// import { Geolocation } from "@capacitor/geolocation";
// import { AndroidPermissions } from "@awesome-cordova-plugins/android-permissions";
// import { LocationAccuracy } from "@awesome-cordova-plugins/location-accuracy";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
// import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MojosantrenPolygon from "../../data/mojosantren";
import OuterMojo from "../../data/outer_mojo";
import randomPosition from "random-position-in-polygon";
import polygon from "@/data/bayang";

export default {
	data() {
		return {
			platform: window.platform,
			token:
				"pk.eyJ1IjoiYm9yZXFvZnUiLCJhIjoiY2wwNnM5dzE5MDU3czNjbHZmbGhsbGZ2MCJ9.nNAbUcoqk9PpyZS8nz0T_A",
			maps: null,
			randomPositions: [],
			btnLoading: false,
			interval: null,
			seconds: 0,
			tens: 0,
			switch1: true,
			minText: "00",
			secText: "00",
			coords: [],
			result: [],
			markers: [],
			timeResult: {
				rc: [],
				wn: [],
			},
		};
	},
	mounted() {
		this.setMap();
	},
	methods: {
		addRandomPoint() {
			this.getRandomCoord(100).then((positions) => {
				this.randomPositions = positions;
				positions.forEach((position, i) => {
					this.markers.push(
						new mapboxgl.Marker().setLngLat(position).addTo(this.maps)
					);
					this.coords.push(position);
				});
			});
		},
		clearResult() {
			this.timeResult.rc = [];
			this.timeResult.wn = [];
		},
		clearPoint() {
			this.markers.forEach((element) => {
				element.remove();
			});
			this.markers = [];
			this.coords = [];
		},
		windingNumber(point, vs) {
			function isLeft(P0, P1, P2) {
				let res =
					(P1[0] - P0[0]) * (P2[1] - P0[1]) - (P2[0] - P0[0]) * (P1[1] - P0[1]);
				return res;
			}

			// var vs = polyg[0];
			const x = point[0],
				y = point[1];
			let wn = 0;

			for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
				let xi = vs[i][0],
					yi = vs[i][1];
				let xj = vs[j][0],
					yj = vs[j][1];

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
		},
		rayCasting(point, polyg) {
			var polygon = polyg[0];
			//A point is in a polygon if a line from the point to infinity crosses the polygon an odd number of times
			let odd = false;
			//For each edge (In this case for each point of the polygon and the previous one)
			for (let i = 0, j = polygon.length - 1; i < polygon.length; i++) {
				//If a line from the point into infinity crosses this edge
				if (
					polygon[i][1] > point[1] !== polygon[j][1] > point[1] && // One point needs to be above, one below our y coordinate
					// ...and the edge doesn't cross our Y corrdinate before our x coordinate (but between our x coordinate and infinity)
					point[0] <
						((polygon[j][0] - polygon[i][0]) * (point[1] - polygon[i][1])) /
							(polygon[j][1] - polygon[i][1]) +
							polygon[i][0]
				) {
					// Invert odd
					odd = !odd;
				}
				j = i;
			}
			return odd;
		},

		PNPoly(point, vs) {
			var x = point[0],
				y = point[1];
			var inside = false;

			for (let i = 0, j = vs.length - 1; i < vs.length; i++) {
				var xi = vs[i][0],
					yi = vs[i][1];
				var xj = vs[j][0],
					yj = vs[j][1];

				var intersect =
					yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

				if (intersect) {
					inside = !inside;
				}
				j = i;
			}
			return inside;
		},

		changeColor() {
			const coloring = (index, isTrue) => {
				const lngLat = this.markers[index].getLngLat();
				const coord = [lngLat.lng, lngLat.lat];
				this.markers[index].remove();
				this.markers[index] = new mapboxgl.Marker({
					color: isTrue ? "green" : "red",
				})
					.setLngLat(coord)
					.addTo(this.maps);
			};

			if (this.markers.length !== 0) {
				this.result.forEach((isInside, idx) => {
					coloring(idx, isInside);
				});
			} else {
				alert("marker = 0");
			}
		},
		removeMarker() {
			if (this.markers.length !== 0) {
				const lastIndex = this.markers.length - 1;
				this.markers[lastIndex].remove();
				this.coords.pop();
				this.markers.pop();
			}
		},

		newRayCasting(test_point, boundary) {
			let p0 = boundary[boundary.length - 1];
			let ctr = 0;
			boundary.forEach((p1, i) => {
				// skip the vertex that lies on X positif of ray
				if (p1[1] === test_point[1]) {
					return;
				}
				// ignore collinear
				// and edge must be cross y of test_point
				// var xPositif = p0[0] >= test_point[0] && p1[0] >= test_point;
				if (
					p0[1] > test_point[1] !== p1[1] > test_point[1] &&
					p0[1] !== p1[1]
					// && xPositif
				) {
					let interp = (test_point[1] - p0[1]) / (p1[1] - p0[1]);
					// Must crosY
					if (interp >= 0 && interp < 1) {
						ctr++;
						let long = interp * p1[0] + (1 - interp) * p0[0];
						var LinerInterp =
							p0[0] +
							((p1[0] - p0[0]) / (p1[0] - p0[0])) * (test_point[0] - p0[0]);

						console.log("long", long);
						console.log("LinerInterp", LinerInterp);

						// check for -X
						if (long > test_point[0]) {
							ctr++;
						}
					}
				}
				p0 = p1;
			});
			return ctr % 2 === 0 ? false : true;
		},

		algo7(R, boundary) {
			let P0 = boundary[0];
			if (P0[1] == R[1] && P0[0] == R[0]) {
				return true;
			}
			let w = 0;
			for (let i = 0; i < boundary.length; i++) {
				let P1 = boundary[i];
				const detI =
					(P0[0] - R[0]) * (P1[1] - R[1]) - (P1[0] - R[0]) * (P0[1] - R[1]);
				const right_crossing = detI > 0 == P1[1] > P0[1];

				if (P1[1] == R[1]) {
					if (P1[0] == R[0]) {
						return true;
					} else {
						if (P0[1] == R[1] && P1[0] > R[0] == P0[0] < R[0]) {
							continue;
						}
					}
				}
				if (P0[1] < R[1] !== P1[1] < R[1]) {
					if (P0[0] >= R[0]) {
						if (P1[0] > R[0]) {
							w = w + 2 * (P1[1] > P0[1]) - 1;
						} else {
							if (right_crossing) {
								w = w + 2 * (P1[1] > P0[1]) - 1;
							}
						}
					} else {
						if (P1[0] > R[0]) {
							if (right_crossing) {
								w = w + 2 * (P1[1] > P0[1]) - 1;
							}
						}
					}
				}
				P0 = P1;
			}
			return w == 0 ? false : true;
		},

		algo6(R, boundary) {
			// Return det i = (Px i −Rx ) ∗ (Py i+1 −Ry )−(Px i+1 −Rx ) ∗ (Py i −Ry )
			// crossing: (Pyi < Ry ) != (Pyi+1 < Ry ),
			// modify_ω: ω = ω + 2 ∗ (Pyi+1 > Pyi ) − 1.
			// right_crossing: (det (i) > 0) = (Pyi+1 > Pyi ),
			let P0 = boundary[0];
			let w = 0;
			for (let i = 0; i < boundary.length; i++) {
				const P1 = boundary[i];
				const detI =
					(P0[0] - R[0]) * (P1[1] - R[1]) - (P1[0] - R[0]) * (P0[1] - R[1]);
				const right_crossing = detI > 0 == P1[1] > P0[1];
				if (P0[1] < R[1] != P1[1] < R[1]) {
					if (P0[0] >= R[0]) {
						if (P1[0] > R[0]) {
							w = w + 2 * (P1[1] > P0[1]) - 1;
						} else {
							if (right_crossing) {
								w = w + 2 * (P1[1] > P0[1]) - 1;
							}
						}
					} else {
						if (P1[0] > R[0]) {
							if (right_crossing) {
								w = w + 2 * (P1[1] > P0[1]) - 1;
							}
						}
					}
				}

				P0 = P1;
			}
			return w == 0 ? false : true;
		},

		classicRay(tp, boundary) {
			let rc = 0,
				n = boundary.length,
				x = tp[0],
				y = tp[1],
				x0 = boundary[n - 1][0],
				y0 = boundary[n - 1][1],
				x1,
				y1;

			for (let i = 0; i < n; i++) {
				x1 = boundary[i][0];
				y1 = boundary[i][1];
				if (y <= y0 === y > y1) {
					if (x - x0 - ((y - y0) * (x1 - x0)) / (y1 - y0) < 0) {
						rc++;
					}
				}
				x0 = x1;
				y0 = y1;
			}
			return rc % 2 === 0 ? false : true;
		},

		startRayCasting() {
			// console.log(`calculatin ${this.coords.length} point`);
			if (this.coords.length != 0) {
				const newArray = [];
				let timeResult = 0;

				// start calculating performance
				var startTime = performance.now();
				this.coords.forEach((position) => {
					newArray.push(this.classicRay(position, MojosantrenPolygon[0]));
					// newArray.push(this.PNPoly(position, MojosantrenPolygon[0]));
					// this.windingNumber(position, MojosantrenPolygon[0]);
				});
				var endTime = performance.now();
				// end calculating performance

				this.timeResult.rc.push(endTime - startTime);

				this.result = newArray;
				this.changeColor();
			} else {
				alert("marker = 0");
			}
		},
		startWindingNumber() {
			// console.log(`calculatin ${this.coords.length} point`);

			if (this.coords.length != 0) {
				const newArray = [];
				let timeResult = 0;

				// start calculating performance
				var windingStart = performance.now();
				this.coords.forEach((position) => {
					// newArray.push(this.windingNumber(position, MojosantrenPolygon));
					newArray.push(this.windingNumber(position, MojosantrenPolygon[0]));
					// this.algo7(position, MojosantrenPolygon[0]);
				});
				var windingEnd = performance.now();
				// end calculating performance

				this.timeResult.wn.push(windingEnd - windingStart);

				this.result = newArray;
				this.changeColor();
			} else {
				alert("marker = 0");
			}
		},

		getRandomCoord(point = 0) {
			return new Promise((resolve, reject) => {
				let coordinates = [];

				const polygon = {
					type: "Feature",
					properties: {},
					geometry: {
						type: "Polygon",
						coordinates: OuterMojo,
					},
				};
				for (let index = 0; index < point; index++) {
					coordinates.push(randomPosition(polygon));
				}
				resolve(coordinates);
			});
		},
		setMap() {
			mapboxgl.accessToken = this.token;

			this.maps = new mapboxgl.Map({
				container: "map",
				style: "mapbox://styles/mapbox/streets-v11",
				// mojo
				center: [112.59022972070082, -7.404347711911719],
				zoom: 14,
			});

			this.maps.on("click", (e) => {
				this.markers.push(
					new mapboxgl.Marker()
						.setLngLat([e.lngLat.lng, e.lngLat.lat])
						.addTo(this.maps)
				);
				this.coords.push([e.lngLat.lng, e.lngLat.lat]);
			});

			this.maps.on("load", () => {
				// outer polygon
				// this.maps.addSource("outer", {
				// 	type: "geojson",
				// 	data: {
				// 		type: "Feature",
				// 		geometry: {
				// 			type: "Polygon",
				// 			// These coordinates outline Maine.
				// 			// coordinates: PonokawanPolygon,
				// 			coordinates: OuterMojo,
				// 		},
				// 	},
				// });

				// this.maps.addLayer({
				// 	id: "outer",
				// 	type: "fill",
				// 	source: "outer", // reference the data source
				// 	layout: {},
				// 	paint: {
				// 		"fill-color": "#FF4242", // blue color fill
				// 		"fill-opacity": 0.5,
				// 	},
				// });

				// // Add a black outline around the polygon.
				// this.maps.addLayer({
				// 	id: "outer_mojo",
				// 	type: "line",
				// 	source: "outer",
				// 	layout: {},
				// 	paint: {
				// 		"line-color": "#FF0000",
				// 		"line-width": 1,
				// 	},
				// });

				///////////////////////

				this.maps.addSource("maine", {
					type: "geojson",
					data: {
						type: "Feature",
						geometry: {
							type: "Polygon",
							// These coordinates outline Maine.
							// coordinates: PonokawanPolygon,
							coordinates: MojosantrenPolygon,
						},
					},
				});

				// Add a new layer to visualize the polygon.
				this.maps.addLayer({
					id: "maine",
					type: "fill",
					source: "maine", // reference the data source
					layout: {},
					paint: {
						"fill-color": "#b7d6f4", // blue color fill
						"fill-opacity": 0.5,
					},
				});

				// Add a black outline around the polygon.
				this.maps.addLayer({
					id: "outline",
					type: "line",
					source: "maine",
					layout: {},
					paint: {
						"line-color": "#036dc1",
						"line-width": 1,
					},
				});
			});
		},
	},
};
</script>

<style>
.fullwindow {
	height: 100%;
	width: 100%;
}
.control-panel {
	position: absolute;
	z-index: 999;
	height: 40vh;
	width: 100%;
	bottom: 45px;
	padding: 10px;
	background: #9d9d9d;
}
.timer {
	font-size: 1.5rem;
}
</style>