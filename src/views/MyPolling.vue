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

				<div v-if="deviceReady" style="height: 100%">
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
						>
							<div class="d-flex justify-space-between align-center">
								<div style="max-width: 80%">
									<div
										style="font-size: 1.2rem; font-weight: 600; max-width: 100%"
										class="ellipsis-text"
									>
										{{ polling.title }}
									</div>
									<div style="font-size: 0.9rem">{{ polling.total }} Vote</div>
								</div>
								<div>
									<v-avatar tile size="60">
										<v-img src="https://picsum.photos/id/11/500/300"></v-img>
									</v-avatar>
								</div>
							</div>
						</v-card>
					</v-sheet>
				</div>
			</div>
		</v-container>
	</div>
</template>

<script>
import { Device } from "@capacitor/device";
import { mapGetters } from "vuex";

export default {
	data() {
		return {
			pollings: [
				{
					title: "Polling Title Example",
					total: 4,
				},
				{
					title:
						"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
					total: 4,
				},
				{
					title:
						"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,",
					total: 4,
				},
				{
					title: "Polling Title Example",
					total: 4,
				},
				{
					title:
						"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
					total: 4,
				},
				{
					title:
						"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,",
					total: 4,
				},
				{
					title: "Polling Title Example",
					total: 4,
				},
				{
					title:
						"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
					total: 4,
				},
				{
					title:
						"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,",
					total: 4,
				},
			],
			deviceReady: true,
		};
	},
	mounted() {
		this.getMyPolling();
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
		getMyPolling() {
			this.getDeviceId().then((deviceId) => {
				axios
					.get(`my-poll/${deviceId.uuid}`)
					.then((response) => {
						// this.loading = false
						// console.log(response);
					})
					.catch((e) => {
						console.log(e);
					});
			});
		},
		prepareData() {},
		async getDeviceId() {
			return await Device.getId();
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