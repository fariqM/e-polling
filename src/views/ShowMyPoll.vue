<template>
	<div style="height: 100%; width: 100%">
		<v-app-bar color="prim-grad" absolute dense>
			<v-btn icon @click="navigation_back">
				<v-icon>mdi-chevron-left</v-icon>
			</v-btn>
			<v-toolbar-title>Polling Details</v-toolbar-title>
			<v-spacer />
			<v-btn icon @click="goToEdit" v-if="pageReady">
				<v-icon>mdi-circle-edit-outline</v-icon>
			</v-btn>
		</v-app-bar>
		<v-main style="width: 100%">
			<page-error v-if="fetchError"/>
			<div
				class="d-flex justify-center align-center"
				style="height: 80%"
				v-if="!pageReady && !fetchError"
			>
				<div class="text-center" v-if="!fetchError">
					<div v-if="notFound">
						<div style="font-size: 5rem; font-weight: 600">404</div>
						<div style="font-size: 1.2rem" class="mt-2">
							Oops your polling is not found or expired.
						</div>
						<!-- <v-btn></v-btn> -->
					</div>
					<v-icon size="70" color="primary" v-else style="margin-top: 5rem"
						>mdi-reload</v-icon
					>
				</div>
			</div>
			<div
				v-if="pageReady"
				style="max-height: calc(100vh - 55px); margin-top: 48px"
				class="overflow-y-auto"
			>
				<v-img
					v-if="polling.q_img !== null"
					:src="`${serverUrl}storage/img/${polling.q_img}` + '?rnd=' + cacheKey"
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
									:src="
										`${serverUrl}storage/img/answers/${answer.a_img}` +
										'?rnd=' +
										cacheKey
									"
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
import PageError from "./components/E500.vue"

export default {
	components: {
		PageError
	},

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
			cacheKey: +new Date(),
			intervalImg: null,
			fetchError: false,
		};
	},
	mounted() {
		const param = this.$router.history.current.params;
		this.polling_params = param;
		if (param.ownerId) {
			this.getPolling(param.ownerId, param.pollingUrl);
		} else {
			this.notFound = true;
		}
	},
	methods: {
		getPolling(ownerId, dir) {
			axios
				.get(`my-poll/${ownerId}/${dir}`)
				.then((response) => {
					// console.log(response);
					this.link = `https://polling-pol.site/p/${dir}`;
					this.polling = response.data.data;
					this.totalVoters = this.countVotes(this.polling.answers);
					this.pageReady = true;
				})
				.catch((e) => {
					console.log(e);
					if (e.response) {
						console.log(e.response);
						if (e.response.status === 404) {
							this.pageReady = true;
							this.notFound = true;
						} else {
							this.fetchError = true;
						}
					} else {
						this.fetchError = true;
					}
				});
		},
		goToEdit() {
			// console.log(this.polling);
			this.$router.replace({
				name: "edit.poll",
				params: {
					ownerId: this.polling.owner_id,
					pollingUrl: this.polling.dir,
					polling: this.polling,
				},
			});
		},
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
</style>