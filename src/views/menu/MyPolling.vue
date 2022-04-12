<template>
	<div style="height: 100%">
		<div style="height: 100%" v-if="!deviceReady" class="d-flex justify-center">
			<v-icon size="70" color="primary">mdi-reload</v-icon>
		</div>
		<v-container fluid v-else style="height: 100%">
			<div id="create" style="height: 100%">
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

				<div v-if="deviceReady && pollings.length > 0" style="height: 100%">
					<v-subheader class="pa-0 ma-0 c-subheader noselect"
						>My Polling List</v-subheader
					>

					<v-sheet
						class="overflow-y-auto"
						color="transparent"
						max-height="81.7vh"
					>
						<v-card
							tile
							class="pa-2 noselect mb-2"
							v-for="(polling, i) in pollings"
							:key="i"
							v-ripple
							@click="showPolling(polling)"
						>
							<div class="d-flex justify-space-between align-center">
								<div style="max-width: 80%">
									<div
										style="font-size: 1.2rem; font-weight: 600; max-width: 100%"
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
											:src="`${serverUrl}storage/img/${polling.q_img}`"
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
						</v-card>
					</v-sheet>
				</div>

				<div
					v-else
					class="d-flex align-center justify-center"
					style="height: 100%"
				>
					{{ text }}
				</div>
			</div>
		</v-container>
	</div>
</template>

<script>
import { Device } from "@capacitor/device";
import { Storage } from "@capacitor/storage";

export default {
	data() {
		return {
			pollings: [],
			deviceReady: false,
			serverUrl: window.__BASE_URL__,
			text: "You haven't created any poll yet",
		};
	},
	mounted() {
		this.checkStorage().then((result) => {
			if (result === null || result == undefined) {
				this.getDeviceId().then((deviceId) => {
					this.fetchPollData(deviceId)
						.then((response) => {
							const data = response.data.data.slice();
							this.setPoll(JSON.stringify(data));
							this.pollings = data;
							this.deviceReady = true;
							this.myPoll = data;
						})
						.catch((e) => {
							this.deviceReady = true;
							if (e.response) {
								this.text = e.response.data.message;
							} else {
								this.text = "Connection error, please check your internet.";
							}
						});
				});
			} else {
				// console.log("storage exist");
				const pollStorage = JSON.parse(result);
				this.pollings = pollStorage.slice();
				this.deviceReady = true;
				this.getDeviceId().then((deviceId) => {
					// console.log(deviceId);
					this.fetchPollData(deviceId)
						.then((response) => {
							const data = response.data.data.slice();
							this.setPoll(JSON.stringify(data));
							this.pollings = data;
							this.myPoll = data;
						})
						.catch((e) => {
							console.log(e);
						});
				});
			}
		});
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
</style>