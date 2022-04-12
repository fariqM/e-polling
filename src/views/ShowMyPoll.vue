<template>
	<div style="height: 100%; width: 100%">
		<v-app-bar color="prim-grad" absolute dense>
			<v-btn icon @click="navigation_back">
				<v-icon>mdi-chevron-left</v-icon>
			</v-btn>
			<v-toolbar-title>Polling Details</v-toolbar-title>
			<v-spacer />
			<v-btn icon>
				<v-icon>mdi-circle-edit-outline</v-icon>
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
			<div
				v-if="pageReady"
				style="max-height: calc(100vh - 55px); margin-top: 48px"
				class="overflow-y-auto"
			>
				<v-img
					v-if="polling.q_img !== null"
					:src="`${serverUrl}storage/img/${polling.q_img}`"
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
					<div>
						{{ polling.description }}
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
					<div
						v-ripple
						class=""
						v-for="(answer, i) in polling.answers"
						:key="i"
					>
						<div class="d-flex justify-space-between align-center my-2">
							<div>
								<div
									class="answer-title"
									v-if="answer.text !== null || answer.text !== ''"
								>
									{{ answer.text }}
								</div>
								<div
									class="answer-title"
									v-if="answer.text === null || answer.text === ''"
								>
									(No-Text)
								</div>
								<div class="d-flex">
									<div>{{ answer.voters.length }} votes |</div>
									<div class="ml-1" v-if="totalVoters > 0">
										{{
											((answer.voters.length / totalVoters) * 100)
												.toString()
												.substring(0, 4)
										}}%
									</div>
									<div class="ml-1" v-else>0%</div>
								</div>
							</div>
							<v-avatar tile size="60" v-if="answer.a_img !== null">
								<v-img
									:src="`${serverUrl}storage/img/answers/${answer.a_img}`"
									:lazy-src="require('../assets/logo.png')"
								/>
							</v-avatar>
						</div>
						<v-divider class="ma-0" style="border-color: #f0f8ff59" />
					</div>
				</div>
			</div>
		</v-main>
	</div>
</template>

<script>
import { Clipboard } from "@capacitor/clipboard";
// import { Clipboard } from "@awesome-cordova-plugins/clipboard"

export default {
	data() {
		return {
			serverUrl: window.__BASE_URL__,
			polling_params: "",
			pageReady: false,
			notFound: false,
			link: null,
			alertCopy: false,
			polling: null,
			totalVoters: null,
		};
	},
	mounted() {
		// console.log(this.$router);
		const param = this.$router.history.current.params;
		this.polling_params = param;

		if (param.ownerId) {
			this.polling = param.polling;
			this.link = `https://polling-pol.site/p/${param.polling.dir}`;
			this.totalVoters = this.countVotes(param.polling.answers);
			// console.log(this.totalVoters);
			this.pageReady = true;
		} else {
			this.notFound = true;
		}
		// console.log(this.polling);
		// this.getPolling();
	},
	methods: {
		navigation_back() {
			this.$router.push({ name: "my.poll" });
		},
		async copyLink() {
			if (!this.alertCopy) {
				await Clipboard.write({
					string: this.link,
				});
				this.alertCopy = true;
				toast.info({
					message: "Link has been copied.",
					timeout: 1900,
				});
				setTimeout(() => {
					this.alertCopy = false;
				}, 2000);
			}
		},
		countVotes(answers) {
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
.answer-title {
	font-size: 1.4rem;
	font-weight: 500;
}
</style>