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
			this.markers.forEach(element => {
				element.remove()
			});
			this.markers = [];
			this.coords = [];
		},
		windingNumber(point, polyg) {
			function isLeft(P0, P1, P2) {
				let res =
					(P1[0] - P0[0]) * (P2[1] - P0[1]) - (P2[0] - P0[0]) * (P1[1] - P0[1]);
				return res;
			}

			var vs = polyg[0];
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
			//If the number of crossings was odd, the point is in the polygon
			return odd;

			// var n = polygon.length,
			// 	is_in = false,
			// 	x = point[0],
			// 	y = point[1],
			// 	x1,
			// 	x2,
			// 	y1,
			// 	y2;
			// // console.log("length n => " + n);
			// for (var i = 0; i < n - 1; ++i) {
			// 	x1 = polygon[i][0];
			// 	x2 = polygon[i + 1][0];
			// 	y1 = polygon[i][1];
			// 	y2 = polygon[i + 1][1];
			// 	// console.log("processing...");
			// 	if (y < y1 != y < y2 && x < ((x2 - x1) * (y - y1)) / (y2 - y1) + x1) {
			// 		is_in = !is_in;
			// 	}
			// }

			// return is_in;
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

		startRayCasting() {
			console.log(`calculatin ${this.coords.length} point`);
			if (this.coords.length != 0) {
				const newArray = [];
				let timeResult = 0;

				// start calculating performance
				var startTime = performance.now();
				this.coords.forEach((position) => {
					newArray.push(this.rayCasting(position, MojosantrenPolygon));
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
			console.log(`calculatin ${this.coords.length} point`);

			if (this.coords.length != 0) {
				const newArray = [];
				let timeResult = 0;

				// start calculating performance
				var windingStart = performance.now();
				this.coords.forEach((position) => {
					newArray.push(this.windingNumber(position, MojosantrenPolygon));
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