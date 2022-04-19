<template>
	<div style="height: 100%; width: 100%">
		<v-app-bar color="prim-grad" dense absolute>
			<v-btn icon @click="navigation_back">
				<v-icon>mdi-chevron-left</v-icon>
			</v-btn>
			<v-toolbar-title>
				<template v-if="totalSteppers.length !== 0">
					Polling Requirements
				</template>
				<template v-else> Polling </template>
			</v-toolbar-title>
			<v-spacer />
			<v-btn icon>
				<v-icon>mdi-help-circle-outline</v-icon>
			</v-btn>
		</v-app-bar>
		<v-progress-linear
			indeterminate
			absolute
			color="primary"
			v-if="loadingBar"
		></v-progress-linear>

		<v-main style="width: 100%; height: 100%">
			<div
				v-if="pageReady"
				class="overflow-y-auto"
				style="width: 100%; max-height: calc(100vh - 100px); margin-top: 48px"
			>
				<!-- stepper -->
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
										tile
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
										tile
										color="primary"
										@click="nextStep()"
									>
										Next
									</v-btn>
									<v-btn v-if="error_CheckDevice" outlined color="primary" tile>
										Back
									</v-btn>
									<v-btn
										v-if="!error_CheckDevice"
										small
										class="mt-4"
										color="primary"
										text
										><u>See Why ?</u></v-btn
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
										<maps v-on:nextStep="nextStep()" :routeLeave="routeLeave" />
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
											type="email"
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
									<v-btn
										outlined
										color="primary"
										@click="nextStep(true)"
										tile
										:loading="loadingBtn"
									>
										Next
									</v-btn>
								</div>
								<!-- end step others req -->
							</v-stepper-content>
						</template>
					</v-stepper-items>
				</v-stepper>
				<!-- stepper -->

				<div v-if="reqReady || totalSteppers.length == 0">
					<v-img
						v-if="polling.q_img !== null"
						width="100%"
						:src="`${serverUrl}storage/img/${polling.q_img}`  + '?rnd=' + cacheKey"
						:lazy-src="require('../assets/logo.png')"
						contain
					>
						<template v-slot:placeholder>
							<v-row class="fill-height ma-0" align="center" justify="center">
								<v-progress-circular
									indeterminate
									color="grey lighten-5"
								></v-progress-circular>
							</v-row>
						</template>
					</v-img>
					<div class="poll-container">
						<div style="font-size: 1.6rem; font-weight: 600">
							{{ polling.question }}
						</div>
						<div class="mb-2">
							{{ polling.description }}
						</div>
						<v-divider class="ma-0 mb-2" style="border-color: #f0f8ff59" />
						<div style="font-size: 1rem; font-weight: 600">
							*Choose one of the options below :
						</div>
						<div v-for="(answer, i) in polling.answers" :key="i">
							<div class="d-flex justify-space-between align-center my-8">
								<input
									type="radio"
									:id="`control_0` + i"
									name="select"
									:value="answer"
									v-model="selectedAnswer"
								/>
								<label
									:for="`control_0` + i"
									class="d-flex justify-space-between align-center c-label pa-2"
								>
									<div class="noselect answer-title">
										<template v-if="answer.text !== null || answer.text !== ''">
											{{ answer.text }}
										</template>
										<template v-if="answer.text === null || answer.text === ''">
											(No-Text)
										</template>
									</div>
									<v-avatar tile size="60" v-if="answer.a_img !== null">
										<v-img
											:src="`${serverUrl}storage/img/answers/${answer.a_img}`  + '?rnd=' + cacheKey"
											:lazy-src="require('../assets/logo.png')"
										/>
									</v-avatar>
								</label>
							</div>
						</div>
					</div>
					<div
						class="submit-btn d-flex justify-space-between align-center px-3"
					>
						<v-btn text outlined tile color="info">
							<v-icon>mdi-star-circle</v-icon>
							Rate Us
						</v-btn>
						<v-btn class="prim-grad" tile disabled v-if="deviceHasPolling">
							<v-icon>mdi-check</v-icon>
							Submitted
						</v-btn>
						<v-btn
							class="prim-grad"
							tile
							:disabled="submitDisabled"
							@click="submitPoll"
							:loading="loadingSubmit"
							v-if="!deviceHasPolling"
							>Submit</v-btn
						>
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
			serverUrl: window.__BASE_URL__,
			polling_params: "",
			pageReady: false,
			notFound: false,
			loadingBtn: false,
			loadingBar: false,
			loadingSubmit: false,
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
			routeLeave: false,
			wHeight: window.innerHeight,
			selectedAnswer: null,
			submitDisabled: true,
			cacheKey: +new Date(),

		};
	},
	watch: {
		selectedAnswer: function (newVal) {
			if (newVal !== null) {
				this.submitDisabled = false;
			} else {
				this.submitDisabled = true;
			}
		},
	},
	beforeRouteLeave(to, from, next) {
		console.log("route leave");
		this.routeLeave = true;
		this.loadingBar = true;
		setTimeout(() => {
			this.loadingBar = false;
			next();
		}, 1000);
	},
	mounted() {
		const dir = this.$router.history.current.params.pollingUrl;
		// console.log(this.$router.history.current.params);
		this.loadingBar = true;
		this.polling_params = dir;
		this.link = `https://polling-pol.site/p/${dir}`;
		this.getPolling();
	},
	methods: {
		submitPoll() {
			// console.log(this.deviceId);
			// return;
			if (this.selectedAnswer !== null) {
				this.loadingSubmit = true;
				// ${this.selectedAnswer.id}
				axios
					.post(`polling/submit/${this.selectedAnswer.id}`, {
						name: this.other_forms.name,
						email: this.other_forms.email,
						device_id: this.deviceId,
						is_verified: 1,
					})
					.then((response) => {
						setTimeout(() => {
							this.$router.replace({ name: "home" });
						}, 5000);
						toast.success({
							title: "Successfully submitted!",
							message: "you will be redirected to the home page in 5 seconds.",
							position: "topCenter",
							timeout: 5000,
							// ballon:true,
							transitionInMobile: "fadeInRight",
							transitionOutMobile: "fadeOutRight",
							displayMode: 2,
						});
						this.deviceHasPolling = true;
						this.loadingSubmit = false;
						console.log(response);
					})
					.catch((e) => {
						this.loadingSubmit = false;
						console.log(e);
						if (e.response) {
							if (e.response.status === 404) {
								toast.error({
									title: "Something went wrong",
									message: "Poll not found or has expired.",
									position: "topCenter",
									timeout: 2500,
									// ballon:true,
									transitionInMobile: "fadeInRight",
									transitionOutMobile: "fadeOutRight",
									displayMode: 2,
								});
							} else {
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

							console.log(e.response);
						} else {
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
					});
			}
		},
		checkOtherForms() {
			const isEmail = String(this.other_forms.email)
				.toLowerCase()
				.match(
					/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
				);

			let result = true;
			if (this.polling.req_email === 1) {
				if (this.other_forms.email == "") {
					this.formErrors.email = ["The email field is required"];
					result = false;
				} else if (!isEmail) {
					this.formErrors.email = ["Must be an email"];
					result = false;
				} else {
					result = true;
				}
			}

			if (this.polling.req_name === 1) {
				console.log("cek req name");
				if (this.other_forms.name == "") {
					this.formErrors.name = ["The name field is required"];
					result = false;
				} else {
					result = true;
				}
			}

			return result;
		},
		nextStep(other_forms = false) {
			if (this.e1 !== this.totalSteppers.length) {
				this.e1 += 1;
			} else {
				this.loadingBtn = true;
				if (other_forms) {
					// console.log("cek");
					this.resetErrors();
					if (this.polling.with_password) {
						axios
							.post(
								`p/verify-password/${this.polling_params}`,
								this.other_forms
							)
							.then(() => {
								console.log(this.checkOtherForms());
								if (this.checkOtherForms()) {
									this.totalSteppers = [];
									console.log(this.other_forms);
								}
								this.loadingBtn = false;
							})
							.catch((e) => {
								this.loadingBtn = false;
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
						this.loadingBtn = false;
					}
				} else {
					this.totalSteppers = [];
				}
			}
		},
		checkArea(value) {
			this.checkBtn = false;
			this.deviceArea = value;
			console.log("cek area  result device => " + value);
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
					this.loadingBar = false;
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
									console.log(
										"checking device id",
										this.checkIsDeviceHasPol(res.data.data)
									);
									let checkState = null;

									if (this.checkIsDeviceHasPol(res.data.data)) {
										checkState = true;
									} else {
										checkState = false;
									}
									setTimeout(() => {
										this.deviceHasPolling = checkState;
									}, 1000);

									// this.checkIsDeviceHasPol(res.data.data).then((hasPoll) => {
									// 	setTimeout(() => {
									// 		// console.log(hasPoll);
									// 		if (hasPoll) {
									// 			this.deviceHasPolling = true;
									// 		} else {
									// 			this.deviceHasPolling = false;
									// 		}
									// 	}, 1000);
									// });
								})
								.catch((e) => {
									console.log(e);
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
			// console.log("this.devId", this.deviceId);
			let result = false;
			value.forEach((poll) => {
				poll.answers.forEach((answer) => {
					if (answer.voters.length > 0) {
						result = true;
					}
				});
			});
			return result;
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
.c-label {
	width: 100%;
	height: 100%;
	border: 2px solid #108ddf;
	/* box-shadow: 0px 3px 10px -2px hsla(150, 5%, 65%, 0.5); */
	position: relative;
}
.submit-btn {
	position: absolute;
	bottom: 0;
	width: 100%;
	min-height: 50px;
	box-shadow: rgba(255, 255, 255, 0.2) 0px 0px 15px,
		rgba(255, 255, 255, 0.15) 0px 0px 3px 1px;
}
</style>

<style lang="scss">
input[type="radio"] {
	display: none;
	&:not(:disabled) ~ label {
		cursor: pointer;
	}
	&:disabled ~ label {
		color: hsla(150, 5%, 75%, 1);
		border-color: hsla(150, 5%, 75%, 1);
		box-shadow: none;
		cursor: not-allowed;
	}
}

input[type="radio"]:checked + label {
	background: linear-gradient(
		145deg,
		rgba(16, 141, 223, 1) 0%,
		rgba(8, 115, 191, 1) 41%,
		rgba(12, 59, 102, 1) 100%
	);
	&::after {
		color: rgb(61, 63, 67);
		content: "\F0E1E";
		font: normal normal normal 24px/1 "Material Design Icons";
		border: 2px solid #63b6ee;
		font-size: 24px;
		position: absolute;
		top: -25px;
		left: 50%;
		transform: translateX(-50%);
		height: 50px;
		width: 50px;
		line-height: 50px;
		text-align: center;
		border-radius: 50%;
		background: white;
		box-shadow: 0px 2px 5px -2px hsla(0, 0%, 0%, 0.25);
	}
}
</style>