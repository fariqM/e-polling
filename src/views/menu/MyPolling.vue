<template>
	<div style="height: 100%">
		<v-progress-linear
			indeterminate
			absolute
			color="prim-grad"
			v-if="loading"
		></v-progress-linear>
		<div style="height: 100%" v-if="!deviceReady" class="d-flex justify-center">
			<v-icon size="70" color="primary" style="margin-top: 5rem"
				>mdi-reload</v-icon
			>
		</div>
		<v-container fluid v-else style="height: 100%">
			<div id="create" style="height: 100%; display: flex; flex-flow: column">
				<v-speed-dial
					v-if="deviceReady"
					:top="false"
					:bottom="true"
					:right="true"
					:left="false"
					class="mb-12"
				>
					<template v-slot:activator>
						<v-btn color="prim-grad" dark fab :to="{ name: 'new.poll' }">
							<v-icon> mdi-plus </v-icon>
						</v-btn>
					</template>
				</v-speed-dial>

				<div>
					<v-subheader class="pa-0 ma-0 c-subheader noselect"
						>My Polling List <template v-if="pollings.length > 0">({{ pollings.length }})</template></v-subheader
					>
					<v-alert
						dense
						type="error"
						color="error"
						class="mb-2"
						tile
						style="font-size: 0.9rem !important"
						dismissible
						colored-border
						border="left"
						transition="scale-transition"
						v-model="networkError"
					>
						Network error, please check your internet connection or try again
						later.
					</v-alert>
					<v-alert
						dense
						type="success"
						color="success"
						class="mb-2"
						tile
						style="font-size: 0.9rem !important"
						dismissible
						colored-border
						border="left"
						transition="scale-transition"
						v-model="deleteSuccess"
					>
						A poll has been deleted.
					</v-alert>
				</div>

				<div v-if="deviceReady && pollings.length > 0" style="height: 100%">
					<v-alert
						dense
						type="info"
						color="info"
						class="mb-2"
						tile
						style="font-size: 0.9rem !important"
						dismissible
						colored-border
						border="left"
						transition="scale-transition"
						v-model="alertOpt"
					>
						Tips! Press and hold to delete.
					</v-alert>
					<v-sheet
						class="overflow-y-auto"
						color="transparent"
						:max-height="`calc(100vh - ${contentHeight}px)`"
					>
						<v-card
							tile
							class="noselect mb-2"
							v-for="(polling, i) in pollings"
							:key="i"
							v-ripple
							@click="showPolling(polling)"
						>
							<v-touch
								style="color: #ffffff"
								tag="a"
								v-on:press="selectPoll($event, i)"
								v-bind:press-options="{ time: 1000 }"
							>
								<div class="d-flex justify-space-between align-center pa-2">
									<div style="max-width: 80%">
										<div
											style="
												font-size: 1.2rem;
												font-weight: 600;
												max-width: 100%;
											"
											class="ellipsis-text"
										>
											{{ polling.question }}
										</div>
										<div style="font-size: 0.9rem">
											{{ countTotalVoters(polling.answers) }} Vote
										</div>
									</div>
									<div>
										<v-avatar tile size="60" v-if="polling.q_img !== null">
											<v-img
												:lazy-src="require('../../assets/logo.png')"
												:src="
													`${serverUrl}storage/img/${polling.q_img}` +
													'?rnd=' +
													cacheKey
												"
											>
												<template v-slot:placeholder>
													<v-row
														class="fill-height ma-0"
														align="center"
														justify="center"
													>
														<v-progress-circular
															indeterminate
															color="grey lighten-5"
														></v-progress-circular>
													</v-row> </template
											></v-img>
										</v-avatar>
									</div>
								</div>
							</v-touch>
						</v-card>
					</v-sheet>
				</div>

				<div v-else style="flex: 1 1 auto">
					<div
						v-if="!networkError"
						class="d-flex align-center justify-center"
						style="height: 100%"
					>
						{{ text }}
					</div>
				</div>
			</div>
		</v-container>

		<div class="text-center">
			<v-dialog
				v-model="deleteDialog"
				v-if="deviceReady && pollings.length > 0"
				persistent
			>
				<div style="height: 10px; width: 100%" class="info"></div>
				<v-card tile>
					<v-card-title class="text-h5"> Alert ! </v-card-title>
					<v-card-text> Are you sure want to delete this poll? </v-card-text>
					<v-divider />
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="primary" @click="cancelSelect" outlined tile>
							No
						</v-btn>
						<v-btn tile text @click="deletePoll"> Yes </v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>

			<v-dialog v-model="deleteLoading" persistent>
				<v-card tile>
					<v-card-text>
						<!-- <v-card-text> Deleting... </v-card-text> -->
						<div
							style="
								font-size: 0.875rem;
								font-weight: 400;
								line-height: 1.375rem;
								letter-spacing: 0.0071428571em;
							"
							class="my-1"
						>
							Deleting...
						</div>
						<v-progress-linear
							indeterminate
							color="prim-grad"
							class="mb-0"
						></v-progress-linear>
					</v-card-text>
				</v-card>
			</v-dialog>
		</div>
	</div>
</template>

<script>
import { Device } from "@capacitor/device";
import { Storage } from "@capacitor/storage";
import Alert from "../components/Alert.vue";

export default {
	components: {
		Alert,
	},

	data() {
		return {
			pollings: [],
			deviceReady: false,
			serverUrl: window.__BASE_URL__,
			text: "You haven't created any poll yet",
			cacheKey: +new Date(),
			intervalImg: null,
			selectedPoll: null,
			indexSelectedPoll: null,
			deleteDialog: false,
			loading: false,
			deleteLoading: false,
			networkError: false,
			alertOpt: false,
			deleteSuccess: false,
			contentHeight: 109,
		};
	},
	mounted() {
		this.prepareData();
		setTimeout(() => {
			this.alertOpt = true;
		}, 600);
	},
	watch: {
		networkError: function (newVal) {
			if (newVal) {
				this.contentHeight += 48;
			} else {
				setTimeout(() => {
					this.contentHeight -= 48;
				}, 350);
			}
		},
		deleteSuccess: function (newVal) {
			if (newVal) {
				this.contentHeight += 48;
			} else {
				setTimeout(() => {
					this.contentHeight -= 48;
				}, 350);
			}
		},
		alertOpt: function (newVal) {
			if (newVal) {
				this.contentHeight += 48;
			} else {
				setTimeout(() => {
					this.contentHeight -= 48;
				}, 350);
			}
		},
	},
	computed: {
		myPoll: {
			get() {
				return this.$store.getters.getMyPoll;
			},
			set(value) {
				this.$store.commit("setMyPoll", value);
				return value;
			},
		},
	},
	methods: {
		calcHeight() {
			let alertHeight = 0;
			let navbarHeight = 52;
			let headerHeight = 60;

			if (this.networkError) {
				alertHeight += 45;
			}
			if (this.alertOpt) {
				alertHeight += 45;
			}
			if (this.deleteSuccess) {
				alertHeight += 45;
			}

			return alertHeight + navbarHeight + headerHeight;
		},
		deletePoll() {
			// this.pollings.splice(this.indexSelectedPoll, 1);
			// return
			if (this.indexSelectedPoll !== null) {
				const selected = this.pollings[this.indexSelectedPoll];
				this.deleteDialog = false;
				this.deleteLoading = true;
				axios
					.delete(`p/${selected.dir}/${selected.owner_id}/delete`)
					.then((response) => {
						this.pollings.splice(this.indexSelectedPoll, 1);
						this.indexSelectedPoll = null;
						this.deleteLoading = false;
						this.deleteSuccess = true;
						this.cancelSelect();
						this.prepareData(true);
						console.log("response", response);
					})
					.catch((e) => {
						this.networkError = true;
						this.indexSelectedPoll = null;
						this.deleteLoading = false;
						console.log("error delete poll", e);
						if (e.response) {
							console.log("error response delete poll", e.response);
						}
					});
			} else {
			}
		},
		cancelSelect() {
			this.selectedPoll.classList.remove("selected-poll");
			this.deleteDialog = false;

			// this.selectedPoll = null;
			// this.selectedPollValue = null;
		},
		selectPoll(domElement, value) {
			this.selectedPoll = domElement.target.parentNode.parentNode;
			this.indexSelectedPoll = value;
			// console.log(value);
			this.selectedPoll.classList.add("selected-poll");
			this.deleteDialog = true;
		},
		showPolling(polling) {
			this.$router.push({
				name: "show.poll",
				params: {
					ownerId: polling.owner_id,
					pollingUrl: polling.dir,
					polling: polling,
				},
			});
			// console.log(polling);
		},
		async checkStorage() {
			const { value } = await Storage.get({ key: "myPoll" });
			return value;
		},

		async getDeviceId() {
			return await Device.getId();
		},

		async setPoll(myPoll) {
			await Storage.set({
				key: "myPoll",
				value: myPoll,
			});
		},

		fetchPollData(deviceId) {
			return new Promise((resolve, reject) => {
				axios
					.get(`my-poll/${deviceId.uuid}`)
					.then((response) => {
						resolve(response);
					})
					.catch((e) => {
						this.networkError = true;
						console.log(e);
						if (e.response) {
							console.log(e.response);
						}
						reject(e);
					});
			});
		},
		countTotalVoters(answers) {
			let totalVoters = 0;
			answers.forEach((element) => {
				totalVoters += element.voters.length;
			});
			return totalVoters;
		},
		prepareData(fresh = false) {
			this.loading = true;
			this.checkStorage().then((result) => {
				if (result === null || result == undefined || fresh) {
					this.getDeviceId().then((deviceId) => {
						this.fetchPollData(deviceId)
							.then((response) => {
								const data = response.data.data.slice();
								this.setPoll(JSON.stringify(data));
								this.pollings = data;
								this.deviceReady = true;
								this.myPoll = data;
								this.loading = false;
							})
							.catch((e) => {
								this.loading = false;
								this.deviceReady = true;
								if (e.response) {
									this.text = e.response.data.message;
								} else {
									this.text = "Connection error, please check your internet.";
								}
							});
					});
				} else {
					const pollStorage = JSON.parse(result);
					this.pollings = pollStorage.slice();
					this.deviceReady = true;
					this.getDeviceId().then((deviceId) => {
						// console.log(deviceId);
						this.fetchPollData(deviceId)
							.then((response) => {
								this.loading = false;
								const data = response.data.data.slice();
								this.setPoll(JSON.stringify(data));
								this.pollings = data;
								this.myPoll = data;
							})
							.catch((e) => {
								this.loading = false;
								console.log(e);
							});
					});
				}
			});
		},
	},
};
</script>

<style>
#create .v-speed-dial {
	position: absolute;
}

#create .v-btn--floating {
	position: relative;
}
.selected-poll {
	background-color: #0069b373 !important;
}
</style>