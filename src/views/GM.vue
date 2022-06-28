<template>
	<div style="width: 100%; height: 100%; background: #000" id="container"></div>
</template>

<script>
import { CapacitorGoogleMaps } from "@capacitor-community/google-maps";
import MojosantrenPolygon from "../data/mojosantren";
import MojoPolyline from "../data/mojopolyline";

export default {
	data() {
		return {
			mapId: null,
		};
	},
	mounted() {
		this.setMap().then(() => {
			this.setPolygon();
			this.setPolyline();
			this.setCircle();
		});
	},
	destroyed() {
		CapacitorGoogleMaps.removeMap({ mapId: this.mapId });
	},
	methods: {
		async setCircle() {
			await CapacitorGoogleMaps.addCircle({
				mapId: this.mapId,
				center: {
					latitude: -7.404347711911719,
					longitude: 112.59022972070082,
				},
				radius: 200,
				visibility: true,
				strokeWidth: 10,
				zIndex: 1,
			});
		},
		async setPolyline() {
			await CapacitorGoogleMaps.addPolyline({
				mapId: this.mapId,
				points: MojoPolyline,
				width: 40,
				visibility: true,
				zIndex: 0,
			});
		},
		async setPolygon() {
			await CapacitorGoogleMaps.addPolygon({
				mapId: this.mapId,
				points: MojosantrenPolygon,
				visibility: true,
				strokeWidth: 1,
				zIndex: 1,
			});
		},
		async setMap() {
			await CapacitorGoogleMaps.initialize({
				key: "AIzaSyDRias0c4AXt-1T7idbhm4uTVg0bwe6u_k",
				devicePixelRatio: window.devicePixelRatio, // this line is very important
			});

			// then get the element you want to attach the Maps instance to:
			const element = document.getElementById("container");

			// afterwards get its boundaries like so:
			const boundingRect = element.getBoundingClientRect();

			// we can now create the map using the boundaries of #container
			try {
				const result = await CapacitorGoogleMaps.createMap({
					boundingRect: {
						width: Math.round(boundingRect.width),
						height: Math.round(boundingRect.height),
						x: Math.round(boundingRect.x),
						y: Math.round(boundingRect.y),
					},
					cameraPosition: {
						target: {
							latitude: -7.404347711911719,
							longitude: 112.59022972070082,
						},
						zoom: 14,
					},
				});

				// remove background, so map can be seen
				// (you can read more about this in the "Setting up the WebView" guide)
				element.style.background = "";

				// finally set `data-maps-id` attribute for delegating touch events
				element.setAttribute("data-maps-id", result.googleMap.mapId);
				this.mapId = result.googleMap.mapId;
			} catch (e) {
				alert("Map failed to load");
			}
		},
	},
};
</script>

<style>
</style>