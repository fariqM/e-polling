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
					<v-stepper-header
						:class="{ 'd-flex justify-center': totalSteppers.length === 1 }"
					>
						<template v-for="(step, i) in totalSteppers">
							<v-stepper-step
								:complete="e1 > i + 1"
								:step="i + 1"
								:key="`${i}-steps`"
							>
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
								<!-- step device chek -->
								<div v-if="step.steppers == 'device'">
									<div class="c-subheader mb-2">Device Checking</div>
									<div
										class="d-flex align-center justify-center"
										style="height: 200px"
									>
										<v-progress-circular
											:width="3"
											color="primary"
											indeterminate
											v-if="
												deviceHasPolling === null && error_CheckDevice === false
											"
										></v-progress-circular>
										<div
											v-if="
												deviceHasPolling === true && error_CheckDevice === false
											"
										>
											<v-icon large>mdi-close-circle-outline</v-icon>
											Your device already submitted an answer
										</div>
										<div
											v-if="
												deviceHasPolling === false &&
												error_CheckDevice === false
											"
										>
											<v-icon large>mdi-check-circle-outline</v-icon>
											Your device is allowed
										</div>
										<div v-if="error_CheckDevice">
											<v-icon large>mdi-alert-circleoutline</v-icon>
											Connection error, please check your internet.
										</div>
									</div>
									<div
										v-if="
											deviceHasPolling === null && error_CheckDevice === false
										"
									>
										Checking your device-id
									</div>
									<v-btn
										v-if="
											deviceHasPolling === true && error_CheckDevice === false
										"
										outlined
										color="primary"
										@click="navigation_back"
									>
										Back
									</v-btn>
									<v-btn
										v-if="
											deviceHasPolling === false && error_CheckDevice === false
										"
										outlined
										color="primary"
										@click="nextStep()"
									>
										Next
									</v-btn>
									<v-btn v-if="error_CheckDevice" outlined color="primary">
										Back
									</v-btn>
									<v-btn
										v-if="!error_CheckDevice"
										small
										class="mt-4"
										color="primary"
										text
										><u>See Why ? {{ deviceId }}</u></v-btn
									>
								</div>
								<!-- end step device chek -->

								<!-- step area chek -->
								<div v-if="step.steppers == 'area'">
									<div class="c-subheader mb-2">Location Checking</div>
									<div
										class="d-flex align-center justify-center"
										style="max-height: 300px"
									>
										<maps v-on:nextStep="nextStep()" />
									</div>

									<v-btn small class="mt-3" color="primary" text
										><u>Help</u></v-btn
									>
								</div>
								<!-- end step area chek -->

								<!-- step others req -->
								<div v-if="step.steppers == 'others'">
									<div class="c-subheader mb-2">Other Requirements</div>
									<div class="other-forms mb-2">
										<v-text-field
											placeholder="Name*"
											dense
											hide-details="auto"
											solo-inverted
											style="border-radius: 0px"
											v-if="polling.req_name === 1"
											v-model="other_forms.name"
											:error-messages="formErrors.name"
										></v-text-field>
										<v-text-field
											placeholder="Email*"
											dense
											hide-details="auto"
											solo-inverted
											style="border-radius: 0px"
											v-if="polling.req_email === 1"
											v-model="other_forms.email"
											:error-messages="formErrors.email"
										></v-text-field>
										<v-text-field
											placeholder="Poll Password*"
											dense
											hide-details="auto"
											solo-inverted
											style="border-radius: 0px"
											v-if="polling.with_password === 1"
											v-model="other_forms.password"
											:error-messages="formErrors.password"
										></v-text-field>
									</div>
									<v-btn outlined color="primary" @click="nextStep(true)">
										Next
									</v-btn>
								</div>
								<!-- end step others req -->
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
import Maps from "./Maps.vue";

export default {
	components: {
		Maps,
	},
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
			deviceArea: null,
			error_CheckDevice: false,
			error_Maps: false,
			errors: {},
			checkBtn: false,
			other_forms: {
				name: "",
				email: "",
				password: "",
			},
			formErrors: {
				name: [],
				email: [],
				password: [],
			},
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
		checkOtherForms() {
			const isEmail = String(this.other_forms.email)
				.toLowerCase()
				.match(
					/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
				);
			if (this.polling.req_email === 1) {
				if (this.other_forms.email == "") {
					this.formErrors.email = ["The email field is required"];
					return false;
				} else if (!isEmail) {
					this.formErrors.email = ["Must be an email"];
					return false;
				} else {
					return true;
				}
			}

			if (this.polling.req_name === 1) {
				if (this.other_forms.name == "") {
					this.formErrors.email = ["The name field is required"];
					return false;
				} else {
					return true;
				}
			}
		},
		nextStep(other_forms = false) {
			if (this.e1 !== this.totalSteppers.length) {
				this.e1 += 1;
			} else {
				if (other_forms) {
					this.resetErrors();
					if (this.polling.with_password) {
						axios
							.post(
								`p/verify-password/${this.polling_params}`,
								this.other_forms
							)
							.then((response) => {
								if (this.checkOtherForms()) {
									this.totalSteppers = [];
								}
							})
							.catch((e) => {
								if (e.response) {
									console.log(e.response);
									if (e.response.status === 422) {
										Object.assign(this.formErrors, e.response.data.errors);
									} else if (e.response.status === 403) {
										Object.assign(this.formErrors, e.response.data.errors);
									} else {
										this.formErrors.password = "Something went wrong.";
										toast.error({
											title: "Something went wrong",
											message: "Something went wrong, please try again later.",
											position: "topCenter",
											timeout: 2500,
											// ballon:true,
											transitionInMobile: "fadeInRight",
											transitionOutMobile: "fadeOutRight",
											displayMode: 2,
										});
									}
								}
							});
					} else {
						if (this.checkOtherForms()) {
							this.totalSteppers = [];
						}
					}
				} else {
					this.totalSteppers = [];
					console.log("gausa");
				}
			}
		},
		checkArea(value) {
			this.checkBtn = false;
			this.deviceArea = value;
			console.log("cek area  result device => " + value);
		},
		checkAreaAgain() {
			this.checkBtn = true;
			this.mapsError = false;
		},
		mapsError(errors) {
			this.mapsError = true;
			this.errors = errors;
			console.log("maps error. code => " + JSON.stringify(errors));
		},
		navigation_back() {
			this.$router.push({ name: "home" });
		},
		getPolling() {
			// setTimeout(() => {}, 1000);
			console.log("fetching polling");
			axios
				.get(`p/${this.polling_params}`)
				.then((response) => {
					this.polling = response.data.data;
					this.pageReady = true;
					this.checkReq();
					// console.log(this.totalSteppers);
					if (this.polling.with_device_res === 1) {
						this.checkDevice().then((result) => {
							this.deviceId = result.uuid;
							axios
								.get(`p/${this.polling_params}/${result.uuid}`)
								.then((res) => {
									console.log("checking device id");
									this.checkIsDeviceHasPol(res.data.data).then((hasPoll) => {
										setTimeout(() => {
											// console.log(hasPoll);
											if (hasPoll) {
												this.deviceHasPolling = true;
											} else {
												this.deviceHasPolling = false;
											}
										}, 1000);
									});
								})
								.catch((e) => {
									this.error_CheckDevice = true;
								});
						});
					}
				})
				.catch((e) => {
					console.log(e.response);
					console.log(e);
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
					resolve(result);
				});
			});
		},
		resetErrors() {
			this.formErrors.password = [];
			this.formErrors.name = [];
			this.formErrors.email = [];
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
.other-forms {
	display: grid;
	max-height: 100%;
	grid-template-columns: auto;
	gap: 0.7rem;
}
</style>