<template>
	<div style="height: 100%; width: 100%">
		<v-app-bar color="prim-grad" dense>
			<v-btn icon @click="navigation_back">
				<v-icon>mdi-chevron-left</v-icon>
			</v-btn>
			<v-toolbar-title>Polling Requirements</v-toolbar-title>
			<v-spacer />
			<v-btn icon>
				<v-icon>mdi-help-circle-outline</v-icon>
			</v-btn>
		</v-app-bar>
		<v-main style="width: 100%">
			<div v-if="pageReady">
				<v-stepper v-model="e1" v-if="!reqReady && totalSteppers.length > 0">
					<v-stepper-header>
						<template v-for="(step, i) in totalSteppers">
							<v-stepper-step
								:complete="e1 > i + 1"
								:step="i + 1"
								:key="`${i}-steps`"
							>
								Name of step 1
							</v-stepper-step>
							<v-divider
								:key="`${i}-step`"
								v-if="i !== totalSteppers.length - 1"
							></v-divider>
						</template>
					</v-stepper-header>

					<v-stepper-items>
						<template v-for="(step, i) in totalSteppers">
							<v-stepper-content
								:step="i + 1"
								class="text-center"
								:key="`${i}-steps`"
							>
								<div v-if="step.steppers == 'device'">
									<div
										class="d-flex align-center justify-center"
										style="height: 200px"
									>
										<v-progress-circular
											:width="3"
											color="primary"
											indeterminate
											v-if="deviceHasPolling === null"
										></v-progress-circular>
										<div v-if="deviceHasPolling === true">
											<v-icon large>mdi-close-circle-outline</v-icon>
											Your device already submitted an answer
										</div>
										<div v-if="deviceHasPolling === false">
											<v-icon large>mdi-check-circle-outline</v-icon>
											Your device is allowed
										</div>
									</div>
									<div v-if="deviceHasPolling === null">Checking your device-id</div>
									<v-btn v-if="deviceHasPolling === true" outlined color="primary" @click="navigation_back">
										Back
									</v-btn>
									<v-btn v-if="deviceHasPolling === false" outlined color="primary" @click="e1 = 2">
										Next
									</v-btn>
									<v-btn small class="mt-4" color="primary" text
										><u>See Why ? {{ deviceId }}</u></v-btn
									>
								</div>

								<div v-if="step.steppers == 'area'">
									<div
										class="d-flex align-center justify-center"
										style="height: 200px"
									>
										<v-progress-circular
											:width="3"
											color="primary"
											indeterminate
										></v-progress-circular>
									</div>
									<div>Checking your device-id</div>
									<v-btn @click="e1 = 2" small class="mt-4" color="primary" text
										><u>See Why ? {{ deviceId }}</u></v-btn
									>
								</div>
								<div v-if="step.steppers == 'others'">
									<div
										class="d-flex align-center justify-center"
										style="height: 200px"
									>
										<v-progress-circular
											:width="3"
											color="primary"
											indeterminate
										></v-progress-circular>
									</div>
									<div>Checking your device-id</div>
									<v-btn @click="e1 = 2" small class="mt-4" color="primary" text
										><u>See Why ? {{ deviceId }}</u></v-btn
									>
								</div>
							</v-stepper-content>
						</template>
					</v-stepper-items>
				</v-stepper>
				<div v-if="reqReady || totalSteppers.length == 0">
					<v-img
						width="100%"
						src="https://cdn.vuetifyjs.com/images/cards/server-room.jpg"
					>
					</v-img>
					<div class="pa-2">
						<div style="font-size: 1.6rem; font-weight: 600">
							Lorem ipsum dolor sit amet, consectetur adipiscing .
						</div>
						<div>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
							eiusmod tempor incididunt ut labore et dolore magna aliqua.
						</div>
						<v-divider class="my-2" style="border-color: #f0f8ff59" />
					</div>
				</div>
			</div>
			<div
				class="d-flex justify-center align-center"
				style="height: 100%"
				v-if="!pageReady"
			>
				<div v-if="notFound">
					<div style="font-size: 5rem; font-weight: 600">404</div>
					<div style="font-size: 1.2rem" class="mt-2">
						Oops your polling is not found or expired.
					</div>
				</div>
				<v-icon size="70" color="primary" v-else>mdi-reload</v-icon>
			</div>
		</v-main>
	</div>
</template>

<script>
import { Device } from "@capacitor/device";

export default {
	data() {
		return {
			polling_params: "",
			pageReady: false,
			notFound: false,
			link: null,
			alertCopy: false,
			e1: 1,
			reqReady: false,
			totalSteppers: [],
			polling: null,
			deviceHasPolling: null,
			deviceId: null,
		};
	},
	mounted() {
		const dir = this.$router.history.current.params.pollingUrl;
		// console.log(this.$router.history.current.params);
		this.polling_params = dir;
		this.link = `https://polling-pol.site/p/${dir}`;
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
					this.polling = response.data.data;
					this.pageReady = true;
					this.checkReq();
					// console.log(response);
					// console.log(this.totalSteppers);
					this.checkDevice().then((result) => {
						this.deviceId = result.uuid;
						axios
							.get(`p/${this.polling_params}/${result.uuid}`)
							.then((res) => {
								this.checkIsDeviceHasPol(res.data.data).then((hasPoll) => {
									setTimeout(() => {
										console.log(hasPoll);
										if (hasPoll) {
											this.deviceHasPolling = true;
										} else {
											this.deviceHasPolling = false;
										}
									}, 1000);
								});
							})
							.catch((e) => {});
					});
				})
				.catch((e) => {
					if (e.response) {
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
		async checkDevice() {
			return await Device.getId();
		},
		checkIsDeviceHasPol(value) {
			return new Promise((resolve) => {
				value.forEach((poll) => {
					let result = null;
					poll.answers.forEach((answer) => {
						if (answer.voters.length > 0) {
							result = true;
						} else {
							result = false;
						}
					});
					resolve(result)
				});
			});
		},
		checkReq() {
			if (this.polling.with_device_res === 1) {
				this.totalSteppers.push({
					header: "Device-id restriction",
					steppers: "device",
				});
			}

			if (this.polling.with_area_res === 1) {
				this.totalSteppers.push({
					header: "Area restriction",
					steppers: "area",
				});
			}

			if (
				this.polling.with_password === 1 ||
				this.polling.req_email === 1 ||
				this.polling.req_name === 1
			) {
				this.totalSteppers.push({ header: "Others", steppers: "others" });
			}
		},
	},
};
</script>

<style>
</style>