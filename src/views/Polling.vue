<template>
	<div style="height: 100%; width: 100%">
		<v-app-bar color="prim-grad" dense>
			<v-btn icon @click="navigation_back">
				<v-icon>mdi-chevron-left</v-icon>
			</v-btn>
			<v-toolbar-title>Polling Details</v-toolbar-title>
			<v-spacer />
			<v-btn icon>
				<v-icon>mdi-dots-vertical</v-icon>
			</v-btn>
		</v-app-bar>
		<v-main style="width: 100%">
			<div
				class="d-flex justify-center align-center"
				style="height: 80%"
				v-if="!pageReady"
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
			<div v-else>
				<v-img
					width="100%"
					src="https://cdn.vuetifyjs.com/images/cards/server-room.jpg"
				>
					<!-- <div style="height:100%" class="d-flex justify-start align-end ">
						<div class="prim-grad-2 pa-2">
							Lorem ipsum dolor sit amet, consectetur adipiscing . 
						</div>
					</div> -->
				</v-img>
				<div class="pa-2">
					<div style="font-size: 1.6rem; font-weight: 600">
						Lorem ipsum dolor sit amet, consectetur adipiscing .
					</div>
					<div>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
						eiusmod tempor incididunt ut labore et dolore magna aliqua.
					</div>
					<div class="my-3">
						<!-- <b>Poll Link : </b> -->
						<v-text-field
							@click="copyLink"
							v-model="link"
							label="Link"
							persistent-placeholder
							outlined
							style="border-radius: 0px"
							dense
							readonly
							hide-details=""
							color="primary"
							append-icon="mdi-content-copy"
							@click:append="copyLink"
						></v-text-field>
					</div>
					<div class="d-flex mb-3">
						<v-btn
							class="mr-2"
							elevation="0"
							color="primary"
							rounded
							outlined
							small
						>
							<v-icon small class="mr-1">mdi-poll</v-icon>
							Result
						</v-btn>
						<v-btn elevation="0" color="primary" rounded outlined small>
							<v-icon small class="mr-1">mdi-download-outline</v-icon>
							Export
						</v-btn>
					</div>
					<v-divider class="ma-0" style="border-color: #f0f8ff59" />
				</div>
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
			link: "https://polling-pol.site/p/1e531",
			alertCopy: false,
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
			// setTimeout(() => {}, 1000);
			axios
				.get(`p/${this.polling_params}`)
				.then((response) => {
					this.pageReady = true
				})
				.catch((e) => {
					if (e.response.status) {
						this.notFound = true;
					}
				});
		},
		copyLink() {
			if (!this.alertCopy) {
				this.alertCopy = true;
				toast.info({
					message: "The link has been copied.",
					timeout: 1900,
				});
				setTimeout(() => {
					this.alertCopy = false;
				}, 2000);
			}
		},
	},
};
</script>

<style>
</style>