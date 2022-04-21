<template>
	<div class="d-flex align-center justify-center" style="height: 70%">
		<v-touch tag="a" v-on:press="ngetes" v-bind:press-options="{ time: 1000 }">
			
		</v-touch>

		<span>{{ color }}</span>
	</div>
</template>

<script>
export default {
	data() {
		return {
			color: "green",
			interval: false,
			count: 0,
		};
	},
	methods: {
		ngetes(value) {
			console.log("oke", value);
		},
		clickingMouse() {
			console.log("oke");
		},
		start() {
			if (!this.interval) {
				this.interval = setInterval(() => this.count++, 30);
			}
		},
		stop() {
			clearInterval(this.interval);
			this.interval = false;
		},
	},
};
</script>

<style>
</style>