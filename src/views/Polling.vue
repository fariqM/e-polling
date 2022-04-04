<template>
	<div style="height: 100%; width: 100%">
		<!-- <v-app-bar color="primary" dense absolute>
			<v-btn icon @click="navigation_back">
				<v-icon>mdi-chevron-left</v-icon>
			</v-btn>
			<v-toolbar-title>Polling Title</v-toolbar-title>
		</v-app-bar> -->
		<v-main style="height: 100%; width: 100%">
			<div
				class="d-flex justify-center align-center"
				style="height: 80%"
				v-if="pageReady"
			>
				<div class="text-center">
					<div v-if="notFound">
						<div style="font-size: 5rem; font-weight: 600">404</div>
						<div style="font-size: 1.2rem" class="mt-2">
							Oops your polling is not found or expired.
						</div>
						<!-- <v-btn></v-btn> -->
					</div>
					<v-icon size="70" color="primary" v-else>mdi-reload</v-icon>
				</div>
			</div>
			<div style=" width: 100%">
				<v-img
					height="100%"
					width="100%"
					src="https://cdn.vuetifyjs.com/images/cards/server-room.jpg"
				>
					<div style="height:100%" class="d-flex justify-start align-end">asdasd</div>
				</v-img>
			</div>
		</v-main>
	</div>
</template>

<script>
export default {
	data() {
		return {
			polling_params: "",
			pageReady: false,
			notFound: false,
		};
	},
	mounted() {
		this.polling_params = this.$router.history.current.params.pollingUrl;
		this.getPolling();
	},
	methods: {
		navigation_back() {
			this.$router.push({ name: "home" });
		},
		getPolling() {
			// console.log(this.$router.history.current.params.pollingUrl);
			setTimeout(() => {
				// console.log(this.polling_params);
			}, 1000);
			axios
				.get(`p/${this.polling_params}`)
				.then((response) => {
					console.log(response);
				})
				.catch((e) => {
					if (e.response.status) {
						this.notFound = true;
					}
				});
		},
	},
};
</script>

<style>
</style>