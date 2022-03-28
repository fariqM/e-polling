<template>
	<v-main>
		<v-row
			justify="center"
			align="center"
			no-gutters
			class="mt-2"
			style="width: 100%"
		>
			<div style="width: 100%">
				<div style="width: 100%">
					<div style="height: 70vh; width: 100%" id="map"></div>
				</div>

				<!-- <div class="info" style="width: 100%">
					
				</div> -->
				<div
					class="ml-4"
					style="position: absolute; top: 1.2rem; max-width: 90vw"
				>
					<div>
						<v-autocomplete
							:loading="loading"
							:items="items"
							:search-input.sync="search"
							class="pa-0"
							flat
							hide-no-data
							hide-details
							label="Cari Alamat"
							no-filter
							v-click-outside="notFocus"
							item-value="id"
							filled
							clearable
							:autofocus="false"
							v-model="select"
						>
							<template v-slot:item="data">
								<template>
									<v-list-item-content
										:key="data.item.id"
										@click="moveToSomewhere(data.item)"
									>
										<v-list-item-title>
											{{ data.item.text }}
										</v-list-item-title>
										<v-list-item-subtitle>
											{{ data.item.place_name }}
										</v-list-item-subtitle>
									</v-list-item-content>
								</template>
							</template>
						</v-autocomplete>
					</div>
				</div>
			</div>
		</v-row>
		<v-row justify="start" align="center" no-gutters class="mt-2">
			<v-subheader>
				My Device is => <b>{{ platform }}</b></v-subheader
			>
			<v-subheader>
				My Coords => .. <b>{{ myCoord }}</b></v-subheader
			>
		</v-row>
		<div class="d-flex justify-space-around">
			<v-btn @click="PolyTest" class="warning" :loading="btnLoading">
				{{ btnText }}
			</v-btn>
			<v-btn @click="PolyTest2" class="primary" :loading="btnLoading2">
				{{ btnText2 }}
			</v-btn>
		</div>
	</v-main>
</template>

<script>
import { Capacitor } from "@capacitor/core";
import { Geolocation } from "@awesome-cordova-plugins/geolocation";
import { AndroidPermissions } from "@awesome-cordova-plugins/android-permissions";
import { LocationAccuracy } from "@awesome-cordova-plugins/location-accuracy";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

// polygon data
// import KrianPolygon from "../data/krian";
// import PonokawanPolygon from "../data/ponokawan";
// import MojosantrenPolygon from "../data/mojosantren";
import UinsaPolygon from "../data/uinsa";
import BayangPolygon from "../data/bayang";
import SinfPolygon from "../data/sinf"

export default {
	data() {
		return {
			platform: "",
			token:
				"pk.eyJ1IjoiYm9yZXFvZnUiLCJhIjoiY2wwNnM5dzE5MDU3czNjbHZmbGhsbGZ2MCJ9.nNAbUcoqk9PpyZS8nz0T_A",
			loading: false,
			items2: [
				{ text: "krian", place_name: "Group 1" },
				{ text: "Krian", place_name: "Group 1" },
			],
			items: [],
			search: null,
			select: null,
			states: [],
			geo_coords: {},
			val: "",
			teks: "",
			maps: {},
			findLocMarker: null,
			btnText: "Testing sinf",
			btnText2: "Testing uin",
			btnLoading: false,
			btnLoading2: false,
			myCoord: [],
		};
	},

	beforeRouteEnter(to, from, next) {
		next((vm) => {
			vm.startChecking();
			next();
			// access to component instance via `vm`
		});
	},
	watch: {
		search(val) {
			val && val !== this.select && this.querySelections(val);
		},
	},

	mounted() {
		this.platform = Capacitor.getPlatform();
		// console.log(MojosantrenPolygon);

		this.setMap();

		// console.log(this.items.length);
		this.items2.unshift({ header: "Group 1" });
		this.items2.unshift({ header: "Group 2" });
	},

	methods: {
		ray_casting(point, polygon) {
			console.log("start calculating");
			var n = polygon.length,
				is_in = false,
				x = point[0],
				y = point[1],
				x1,
				x2,
				y1,
				y2;
			console.log("length n => " + n);
			for (var i = 0; i < n - 1; ++i) {
				x1 = polygon[i][0];
				x2 = polygon[i + 1][0];
				y1 = polygon[i][1];
				y2 = polygon[i + 1][1];
				console.log("processing...");
				if (y < y1 != y < y2 && x < ((x2 - x1) * (y - y1)) / (y2 - y1) + x1) {
					is_in = !is_in;
				}
			}
			console.log("result ... => " + is_in);
			return is_in;
		},
		moveToSomewhere(value) {
			console.log(this.findLocMarker);
			if (this.findLocMarker !== null) {
				this.findLocMarker.remove();
			}
			this.findLocMarker = new mapboxgl.Marker({ color: "black", rotation: 45 })
				.setLngLat(value.center)
				.addTo(this.maps);
			this.maps.flyTo({
				center: value.center,
				zoom: 15,
				essential: true, // this animation is considered essential with respect to prefers-reduced-motion
			});
		},
		PolyTest() {
			this.btnLoading = true;
			let point = [];
			this.getLocation()
				.then((result) => {
					point[0] = result.coords.longitude;
					point[1] = result.coords.latitude;
					// console.log(KrianPolygon[0]);
					// console.log(this.ray_casting(point, PonokawanPolygon[0]));
					const polygonTest = this.ray_casting(point, SinfPolygon[0]);
					this.btnLoading = false;
					if (polygonTest) {
						this.btnText = "Inside";
					} else {
						this.btnText = "Outside";
					}
				})
				.catch((e) => {
					console.log(e);
					this.btnLoading = false;
					this.btnText = "Result Error";
				});
		},
		PolyTest2() {
			this.btnLoading2 = true;
			// this.platform= ''
			let point = [];
			this.getLocation()
				.then((result) => {
					point[0] = result.coords.longitude;
					point[1] = result.coords.latitude;
					// console.log(KrianPolygon[0]);
					// console.log(this.ray_casting(point, PonokawanPolygon[0]));
					const polygonTest = this.ray_casting(point, UinsaPolygon[0]);
					this.btnLoading2 = false;
					if (polygonTest) {
						this.btnText2 = "Inside";
					} else {
						this.btnText2 = "Outside";
					}
				})
				.catch((e) => {
					console.log(e);
					this.btnLoading2 = false;
					this.btnText2 = "Result Error";
				});
		},
		notFocus() {
			this.items = [];
		},
		querySelections(v) {
			console.log(v);
			this.loading = true;

			axios
				.get(
					`https://api.mapbox.com/geocoding/v5/mapbox.places/${v}.json?country=id&proximity=ip&types=place%2Cpostcode%2Caddress%2Ccountry%2Cregion%2Cdistrict%2Clocality%2Cneighborhood%2Cpoi&access_token=pk.eyJ1IjoiYm9yZXFvZnUiLCJhIjoiY2wwNnM5dzE5MDU3czNjbHZmbGhsbGZ2MCJ9.nNAbUcoqk9PpyZS8nz0T_A`
				)
				.then((response) => {
					this.items = response.data.features;
					this.loading = false;
				});
		},
		setMap() {
			mapboxgl.accessToken = this.token;

			this.maps = new mapboxgl.Map({
				container: "map",
				style: "mapbox://styles/mapbox/streets-v11",
				// center: [-68.137343, 45.137451],
				// mojo
				// center: [112.59022972070082, -7.404347711911719],
				// ponokawan
				// center: [112.59364659438573, -7.397667849535032],
				// uinsa
				center: [112.73398445302192, -7.322578854199146],

				zoom: 14,
			});

			// const marker2 = new mapboxgl.Marker({ color: "black", rotation: 45 })
			// 	.setLngLat([112.59358882597787, -7.398429159679781])
			// 	.addTo(this.maps);

			// const marker1 = new mapboxgl.Marker({ color: "red", rotation: 45 })
			// 	.setLngLat([ 112.59218334860145, -7.397695032518761])
			// 	.addTo(this.maps);

			this.maps.on("load", () => {
				this.maps.addSource("maine", {
					type: "geojson",
					data: {
						type: "Feature",
						geometry: {
							type: "Polygon",
							// These coordinates outline Maine.
							coordinates: SinfPolygon,
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

			// this.maps.on("load", () => {
			// 	this.maps.addSource("mojosantren", {
			// 		type: "geojson",
			// 		data: {
			// 			type: "Feature",
			// 			geometry: {
			// 				type: "Polygon",
			// 				// These coordinates outline Maine.
			// 				coordinates: SinfPolygon,
			// 			},
			// 		},
			// 	});

			// 	// Add a new layer to visualize the polygon.
			// 	this.maps.addLayer({
			// 		id: "layermojosantren",
			// 		type: "fill",
			// 		source: "mojosantren", // reference the data source
			// 		layout: {},
			// 		paint: {
			// 			"fill-color": "#c3f170", // blue color fill
			// 			"fill-opacity": 0.5,
			// 		},
			// 	});

			// 	// Add a black outline around the polygon.
			// 	this.maps.addLayer({
			// 		id: "outline2",
			// 		type: "line",
			// 		source: "mojosantren",
			// 		layout: {},
			// 		paint: {
			// 			"line-color": "#97ea01",
			// 			"line-width": 1,
			// 		},
			// 	});
			// });

			this.maps.on("load", () => {
				this.maps.addSource("Uinsa", {
					type: "geojson",
					data: {
						type: "Feature",
						geometry: {
							type: "Polygon",
							// These coordinates outline Maine.
							coordinates: UinsaPolygon,
						},
					},
				});

				// Add a new layer to visualize the polygon.
				this.maps.addLayer({
					id: "layerUinsa",
					type: "fill",
					source: "Uinsa", // reference the data source
					layout: {},
					paint: {
						"fill-color": "#c3f170", // blue color fill
						"fill-opacity": 0.5,
					},
				});

				// Add a black outline around the polygon.
				this.maps.addLayer({
					id: "outline3",
					type: "line",
					source: "Uinsa",
					layout: {},
					paint: {
						"line-color": "#97ea01",
						"line-width": 1,
					},
				});
			});

			this.maps.addControl(
				new mapboxgl.GeolocateControl({
					positionOptions: {
						enableHighAccuracy: true,
					},
					// When active the map will receive updates to the device's location as it changes.
					trackUserLocation: true,
					// Draw an arrow next to the location dot to indicate which direction the device is heading.
					showUserHeading: true,
				})
			);

			// map.addControl(
			// 	new MapboxGeocoder({
			// 		accessToken: this.token,
			// 		mapboxgl: mapboxgl,
			// 	})
			// );
		},

		// check permission for mobile/web and ask to turn on if its mobile app
		checkGeo() {
			this.getLocation()
				.then((location) => {
					console.log(location.coords);
					this.text = JSON.stringify({
						latitude: location.coords.latitude,
						logintude: location.coords.logintude,
						accuracy: location.coords.accuracy,
					});
				})
				.catch((e) => {
					console.log(e);
				});
		},

		reverseGeoloc() {
			this.getLocation()
				.then((location) => {
					console.log(location.coords);
					this.text = JSON.stringify({
						latitude: location.coords.latitude,
						logintude: location.coords.logintude,
						accuracy: location.coords.accuracy,
					});
				})
				.catch((e) => {
					console.log(e);
				});
		},

		checkGPSPermission() {
			return new Promise((resolve, reject) => {
				AndroidPermissions.checkPermission(
					AndroidPermissions.PERMISSION.ACCESS_FINE_LOCATION
				)
					.then((result) => {
						resolve(result);
					})
					.catch((e) => {
						reject(e);
					});
				const platform = Capacitor.getPlatform();
			});
		},

		askAllowAccessGPS() {
			return new Promise((resolve, reject) => {
				AndroidPermissions.requestPermission(
					AndroidPermissions.PERMISSION.ACCESS_FINE_LOCATION
				)
					.then(
						(result) => {
							resolve(result);
						},
						(error) => {
							reject(error);
						}
					)
					.catch((e) => {
						reject(e);
					});
			});
		},

		askTurnOnGPS() {
			return new Promise((resolve, reject) => {
				LocationAccuracy.canRequest().then((canRequest) => {
					// check if user allowed application to access location
					if (canRequest) {
						// if true, ask user to turn on GPS if its off
						LocationAccuracy.request(
							LocationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY
						).then(
							(result) => {
								console.log("Turn on location success !!");
								console.log(result);
								console.log("masuk 2.2");
								this.getLocation()
									.then((location) => {
										console.log(location);
										this.myCoord[0] = location.coords.longitude;
										this.myCoord[1] = location.coords.latitude;
									})
									.catch((e) => {
										console.log(e);
									});
							},
							(error) => {
								console.log("Turn on location failed !!");
								console.log(error);
								alert("Yahh gamau nyalain lokasi pak!!");
							}
						);
					} else {
						reject("User doesnt allow application to access location.");
					}
				});
			});
		},

		getLocation() {
			return new Promise((resolve, reject) => {
				this.geo_coords = Geolocation.getCurrentPosition({
					enableHighAccuracy: true,
				})
					.then((location) => {
						resolve(location);
					})
					.catch((error) => {
						reject(error);
					});
			});
		},

		startChecking() {
			const platform = Capacitor.getPlatform();
			if (platform === "android" || platform === "ios") {
				this.checkGPSPermission().then((result) => {
					if (result.hasPermission) {
						console.log("masuk 1");
						this.askTurnOnGPS();
					} else {
						console.log("masuk 2");
						this.askAllowAccessGPS().then((result) => {
							if (result.hasPermission) {
								console.log("masuk 2.1");
								this.askTurnOnGPS();
							} else {
								alert("Yahh ga di izinin pak!!");
							}
						});
					}
				});
			} else {
				this.getLocation()
					.then((location) => {
						console.log(location.coords);
						this.myCoord[0] = location.coords.longitude;
						this.myCoord[1] = location.coords.latitude;
						console.log(this.myCoord);
					})
					.catch((e) => {
						console.log(e);
					});
			}
		},
	},
};
</script>

<style>
</style>