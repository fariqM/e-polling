<template>
	<v-container>
		<v-row class="text-center" align="center">
			<v-col cols="12" class="pa-0">
				<v-img
					:src="require('../../assets/poll.png')"
					class="my-3"
					contain
					height="250"
				/>
			</v-col>
			<v-col class="pa-0" cols="12">
				<div class="noselect" style="font-weight: 600; font-size: 2.3rem">
					<!-- Join poll
					<br /> -->
					(alpha test)
				</div>
				<!-- <div class="d-flex justify-space-around align-center">
					<v-btn :to="{ name: 'maps' }">Go to Map Testing</v-btn>
				</div> -->
			</v-col>
			<v-col cols="12" class="noselect">
				<v-text-field
					outlined
					clearable
					@click="inputFocus"
					style="border-radius: 0px"
					placeholder="Insert a link or polling code"
					label="Polling Address"
					v-model="pol_address"
					append-icon="mdi-content-paste"
					@click:append="pasteLink"
					:error-messages="err_msg"
				></v-text-field>
				<v-alert
					v-if="isFakeGps"
					dense
					outlined
					type="error"
					class="mt-3"
					transition="scale-transition"
				>
					Fake GPS detected! Please turn off gps faker application.
				</v-alert>
				<v-btn
					v-else
					tile
					@click="goToPoll"
					class="prim-grad mb-1"
					:loading="btnLoading"
					>Go Poll</v-btn
				>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { Clipboard } from "@capacitor/clipboard";
import {
	BackgroundGeolocation,
	BackgroundGeolocationEvents,
} from "@awesome-cordova-plugins/background-geolocation";

export default {
	data() {
		return {
			pol_address: "",
			err_msg: "",
			btnLoading: true,
			isFakeGps: false,
			config: {
				desiredAccuracy: 10,
				stationaryRadius: 20,
				distanceFilter: 30,
				startForeground: true,
				notificationText: "w pantau ni ye awas aja pake fake GPS!",
				debug: false, //  enable this hear sounds for background-geolocation life-cycle.
				stopOnTerminate: false, // enable this to clear background location settings when the app terminates
			},
		};
	},
	mounted() {
		BackgroundGeolocation.configure(this.config).then(() => {
			setInterval(() => {
				this.startTesting();
			}, 2000);
		});
	},
	methods: {
		async pasteLink() {
			const { type, value } = await Clipboard.read();
			if (type === "text/plain") {
				this.pol_address = value;
			}
		},
		startTesting() {
			BackgroundGeolocation.getCurrentLocation().then(
				(BackgroundGeolocationResponse) => {
					console.log(BackgroundGeolocationResponse);
					if (BackgroundGeolocationResponse.isFromMockProvider) {
						this.btnLoading = false;
						this.isFakeGps = true;
					} else {
						this.btnLoading = false;
						this.isFakeGps = false;
					}
				}
			);
		},
		goToPoll() {
			if (this.pol_address === "") {
				this.err_msg = "Please inser a polling url";
			} else {
				this.btnLoading = true;
				let link = "";
				if (this.pol_address.includes(".site")) {
					link = this.pol_address.split(".site/p/").pop();
				} else {
					link = this.pol_address;
				}
				setTimeout(() => {
					this.btnLoading = false;
					this.$router.push({
						name: "polling",
						params: { pollingUrl: link },
					});
				}, 1200);
			}
		},
		inputFocus() {
			this.err_msg = "";
		},
		yourCallBackFunction() {
			// console.log('wooops');
		},
	},
};
</script>
