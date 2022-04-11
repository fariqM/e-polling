<template>
	<div style="width: 100%">
		<div style="width: 100%">
			<div style="height: 200px; width: 100%" id="map"></div>
		</div>
		<div v-if="!error_Maps">
			<div class="mt-4" v-if="deviceArea === null">Checking your area...</div>
			<div v-if="!insideLocation">
				<div class="mt-4" v-if="!loading">Your location is not allowed</div>
				<div class="d-flex justify-space-around">
					<v-btn outlined class="mt-2" color="primary" v-if="!loading"> Back </v-btn>
					<v-btn
						outlined
						class="mt-2"
						color="primary"
						@click="recasting_area()"
						:loading="loading"
					>
						<v-icon>mdi-reload</v-icon>Retry
					</v-btn>
				</div>
			</div>
			<div v-if="insideLocation" class="mt-4">
				<div class="mt-4">You are in allowed location</div>
				<v-btn outlined class="mt-2" color="info" @click="$emit('nextStep')"> Next </v-btn>
			</div>
		</div>
		<div v-if="error_Maps" class="mt-2">
			<div>
				<v-alert
					dense
					type="error"
					color="error"
					tile
					style="font-size: 0.7rem !important"
					dismissible
					colored-border
					border="left"
					transition="scale-transition"
				>
					{{ errors.user_msg }}
				</v-alert>
			</div>
			<v-btn
				outlined
				color="primary"
				@click="recasting_area()"
				:loading="loading"
			>
				<v-icon>mdi-reload</v-icon>Retry
			</v-btn>
		</div>
	</div>
</template>

<script>
import { Geolocation } from "@awesome-cordova-plugins/geolocation";
import { AndroidPermissions } from "@awesome-cordova-plugins/android-permissions";
import { LocationAccuracy } from "@awesome-cordova-plugins/location-accuracy";
import mapboxgl from "mapbox-gl";
// import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

// polygon data
// import KrianPolygon from "../data/krian";
import PonokawanPolygon from "../data/ponokawan";
import MojosantrenPolygon from "../data/mojosantren";
// import UinsaPolygon from "../data/uinsa";
// import BayangPolygon from "../data/bayang";
// import SinfPolygon from "../data/sinf";

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
			geo_coords: {},
			val: "",
			teks: "",
			maps: {},
			findLocMarker: null,
			myCoord: [],
			error_Maps: false,
			insideLocation: false,
			errors: {},
			deviceArea: null,
			checkBtn: false,
		};
	},
	watch: {
		search(val) {
			val && val !== this.select && this.querySelections(val);
		},
		checkBtn(newVal) {
			if (newVal) {
				this.recasting_area();
			}
		},
	},

	mounted() {
		this.platform = window.platform;
		// console.log(MojosantrenPolygon);
		this.setMap();
		this.recasting_area();
		// console.log(this.items.length);
		this.items2.unshift({ header: "Group 1" });
		this.items2.unshift({ header: "Group 2" });
	},

	methods: {
		callbackMapsError(value) {
			this.error_Maps = true;
			this.errors = value;
			this.loading = false;
			// this.$emit("mapsError", value);
		},
		moveToSomewhere(value) {
			// console.log(this.findLocMarker);
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
		recasting_area() {
			this.loading = true;
			this.error_Maps = false;
			this.startChecking().then(() => {
				this.PolyTest()
					.then((result) => {
						this.loading = false;
						this.deviceArea = "updated";
						this.insideLocation = result;
					})
					.catch((e) => {
						this.loading = false;
						console.log(e);
						alert("Something went wrong when trying to get location.");
						this.callbackMapsError({
							code: 9,
							msg: "Unknown Error",
							user_msg:
								"Please go to home page and retry to enter polling address",
							on: "askAllowAccessGPS",
						});
					});
			});
		},
		ray_casting(point, polygon) {
			// console.log("start calculating");
			var n = polygon.length,
				is_in = false,
				x = point[0],
				y = point[1],
				x1,
				x2,
				y1,
				y2;
			// console.log("length n => " + n);
			for (var i = 0; i < n - 1; ++i) {
				x1 = polygon[i][0];
				x2 = polygon[i + 1][0];
				y1 = polygon[i][1];
				y2 = polygon[i + 1][1];
				// console.log("processing...");
				if (y < y1 != y < y2 && x < ((x2 - x1) * (y - y1)) / (y2 - y1) + x1) {
					is_in = !is_in;
				}
			}
			// console.log("result ... => " + is_in);
			if (is_in) {
			} else {
				alert("Please go to the appropriate location.");
				this.callbackMapsError({
					code: 3,
					msg: "user is outside location.",
					user_msg: "Please go to the appropriate location.",
					on: "ray_casting",
				});
			}
			return is_in;
		},
		PolyTest() {
			return new Promise((resolve, reject) => {
				let point = [];
				this.getLocation()
					.then((result) => {
						point[0] = result.coords.longitude;
						point[1] = result.coords.latitude;

						// begin test
						const polygonTest = this.ray_casting(point, MojosantrenPolygon[0]);
						// console.log(polygonTest);
						resolve(polygonTest);
					})
					.catch((e) => {
						console.log(e);
						reject("error");
					});
			});
		},
		notFocus() {
			this.items = [];
		},
		querySelections(v) {
			console.log(v);
			axios
				.get(
					`https://api.mapbox.com/geocoding/v5/mapbox.places/${v}.json?country=id&proximity=ip&types=place%2Cpostcode%2Caddress%2Ccountry%2Cregion%2Cdistrict%2Clocality%2Cneighborhood%2Cpoi&access_token=pk.eyJ1IjoiYm9yZXFvZnUiLCJhIjoiY2wwNnM5dzE5MDU3czNjbHZmbGhsbGZ2MCJ9.nNAbUcoqk9PpyZS8nz0T_A`
				)
				.then((response) => {
					this.items = response.data.features;
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
				center: [112.59364659438573, -7.397667849535032],
				// uinsa
				// center: [112.73398445302192, -7.322578854199146],

				zoom: 13,
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

			// this.maps.on("load", () => {
			// 	this.maps.addSource("Uinsa", {
			// 		type: "geojson",
			// 		data: {
			// 			type: "Feature",
			// 			geometry: {
			// 				type: "Polygon",
			// 				// These coordinates outline Maine.
			// 				coordinates: UinsaPolygon,
			// 			},
			// 		},
			// 	});

			// 	// Add a new layer to visualize the polygon.
			// 	this.maps.addLayer({
			// 		id: "layerUinsa",
			// 		type: "fill",
			// 		source: "Uinsa", // reference the data source
			// 		layout: {},
			// 		paint: {
			// 			"fill-color": "#c3f170", // blue color fill
			// 			"fill-opacity": 0.5,
			// 		},
			// 	});

			// 	// Add a black outline around the polygon.
			// 	this.maps.addLayer({
			// 		id: "outline3",
			// 		type: "line",
			// 		source: "Uinsa",
			// 		layout: {},
			// 		paint: {
			// 			"line-color": "#97ea01",
			// 			"line-width": 1,
			// 		},
			// 	});
			// });

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
			});
		},

		askAllowAccessGPS() {
			return new Promise((resolve, reject) => {
				AndroidPermissions.requestPermission(
					AndroidPermissions.PERMISSION.ACCESS_FINE_LOCATION
				)
					.then(
						(result) => {
							if (!result.hasPermission) {
								alert("Please allow the app to access the location.");
								this.callbackMapsError({
									code: 1,
									msg: "App not allowed to access location",
									user_msg: "Please turn on location permission.",
									on: "askAllowAccessGPS",
								});
							}
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
				console.log("checkLocationPermission");
				LocationAccuracy.canRequest().then((canRequest) => {
					// check if user allowed application to access location
					if (canRequest) {
						// if true, ask user to turn on GPS if its off
						console.log("askTurnOnGPS");
						LocationAccuracy.request(
							LocationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY
						).then(
							(result) => {
								console.log("askTurnOnGPS -> result");
								console.log(result);
								this.getLocation()
									.then((location) => {
										console.log(location);
										let newArraty = [];
										newArraty[0] = location.coords.longitude;
										newArraty[1] = location.coords.longitude;
										this.myCoord = newArraty.slice();
										resolve(newArraty);
									})
									.catch((e) => {
										console.log(e);
									});
							},
							(error) => {
								this.callbackMapsError({
									code: 2,
									msg: "user does not allow app to turn on location",
									user_msg: "Please turn on location.",
									on: "askTurnOnGPS",
								});
								console.log("Turn on location failed !!");
								console.log(error);
								alert("Please turn on location.");
							}
						);
					} else {
						console.log("masuk sini");
						alert("Please allow the app to access the location.");
						this.callbackMapsError({
							code: 1,
							msg: "App not allowed to access location",
							user_msg: "Please turn on location permission.",
							on: "askTurnOnGPS",
						});
						reject("User doesnt allow application to access location.");
					}
				});
			});
		},

		getLocation() {
			console.log("getGeolocation");
			return new Promise((resolve, reject) => {
				this.geo_coords = Geolocation.getCurrentPosition({
					enableHighAccuracy: true,
				})
					.then((location) => {
						console.log("getGeolocation -> resolved");
						resolve(location);
					})
					.catch((error) => {
						if (this.platform === "android" || this.platform === "ios") {
							alert("Something went wrong when trying to get location.");
							this.callbackMapsError({
								code: 9,
								msg: "Unknown Error",
								user_msg:
									"Please go to home page and retry to enter polling address",
								on: "getLocation",
							});
						} else {
							alert("Please turn on location.");
							this.callbackMapsError({
								code: 2,
								msg: "user does not allow app to turn on location",
								user_msg: "Please turn on location.",
								on: "askTurnOnGPS",
							});
						}
						console.log("getGeolocation -> reject");
						reject(error);
					});
			});
		},

		startChecking() {
			return new Promise((resolve, reject) => {
				if (this.platform === "android" || this.platform === "ios") {
					console.log("checkGPSPermission");
					this.checkGPSPermission().then((result) => {
						console.log("checkGPSPermission -> result :");
						console.log(result);
						if (result.hasPermission) {
							this.askTurnOnGPS()
								.then((done) => {
									resolve(true);
								})
								.catch((e) => {
									reject(false);
								});
						} else {
							console.log("askAllowAccessGPS");
							this.askAllowAccessGPS()
								.then((result) => {
									console.log("askAllowAccessGPS -> result :");
									console.log(result);
									if (result.hasPermission) {
										this.askTurnOnGPS()
											.then((done) => {
												resolve(true);
											})
											.catch((e) => {
												reject(false);
											});
									}
								})
								.catch((e) => {
									alert("Something went wrong when trying to get location.");
									this.callbackMapsError({
										code: 9,
										msg: "Unknown Error",
										user_msg:
											"Please go to home page and retry to enter polling address",
										on: "askAllowAccessGPS",
									});
								});
						}
					});
				} else {
					this.getLocation()
						.then((location) => {
							let newArraty = [];
							newArraty[0] = location.coords.longitude;
							newArraty[1] = location.coords.longitude;
							this.myCoord = newArraty.slice();
						})
						.catch((e) => {
							console.log(e);
						});
				}
			});
		},
	},
};
</script>

<style>
</style>