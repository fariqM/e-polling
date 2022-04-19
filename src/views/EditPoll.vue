<template>
	<div style="height: 100%; width: 100%" id="newPol">
		<v-speed-dial :top="false" :bottom="true" :right="true" :left="false">
			<template v-slot:activator>
				<v-btn
					color="prim-grad"
					dark
					fab
					@click="savePoll"
					:loading="loadingBtn"
				>
					<v-icon> mdi-check </v-icon>
				</v-btn>
			</template>
		</v-speed-dial>

		<v-app-bar color="prim-grad" dense absolute>
			<v-btn icon @click="navigation_back">
				<v-icon>mdi-chevron-left</v-icon>
			</v-btn>
			<v-toolbar-title>Create New Poll</v-toolbar-title>
		</v-app-bar>
		<v-main style="height: 100%">
			<v-container
				fluid
				class="overflow-y-auto"
				:style="{
					'max-height': wHeight < 650 ? `${wHeight - 70}px` : '100%',
					height: wHeight < 650 ? `` : '100%',
				}"
			>
				<v-row class="mt-10">
					<!-- question section -->
					<v-col cols="10" md="10" class="py-2">
						<v-text-field
							color="primary"
							placeholder="Question*"
							dense
							hide-details="auto"
							solo-inverted
							v-model="question.title"
							style="border-radius: 0px"
							:error-messages="errors.question"
						></v-text-field>
					</v-col>

					<v-col
						cols="2"
						md="10"
						class="py-2"
						:class="question.img == null ? '' : 'd-flex justify-center'"
					>
						<v-btn
							icon
							tile
							@click="pickImg(0, 'question')"
							v-if="question.img == null"
						>
							<v-icon size="30">mdi-image-plus</v-icon>
						</v-btn>

						<v-sheet
							width="40"
							height="40"
							color="transparent"
							v-if="question.img_file == null && question.img !== null"
						>
							<div class="d-flex justify-center align-">
								<v-progress-circular
									indeterminate
									color="primary"
								></v-progress-circular>
							</div>
						</v-sheet>

						<v-menu
							offset-y
							v-if="question.img_file !== null && question.img !== null"
						>
							<template v-slot:activator="{ on, attrs }">
								<v-avatar size="40" tile class="pa-0" v-bind="attrs" v-on="on">
									<v-img :src="question.img"></v-img>
								</v-avatar>
							</template>
							<v-list light>
								<v-list-item
									v-for="(item, i) in imgMenu"
									:key="i"
									@click="imgClicked(i, 'question')"
								>
									<v-list-item-title>{{ item.title }}</v-list-item-title>
								</v-list-item>
							</v-list>
						</v-menu>
					</v-col>

					<v-col cols="12" md="12" class="py-2">
						<v-text-field
							placeholder="Description*"
							dense
							hide-details="auto"
							solo-inverted
							style="border-radius: 0px"
							v-model="question.description"
							:error-messages="errors.description"
						></v-text-field>
					</v-col>

					<v-col cols="12" md="12" class="py-0 pr-0">
						<v-subheader
							class="pa-0"
							style="font-size: 0.7rem !important; height: 1.1rem"
							>Input with * must be filled</v-subheader
						>
					</v-col>

					<v-col cols="12" md="12" class="py-2">
						<v-divider dark style="border-color: #f0f8ff59" />
					</v-col>

					<!-- end question section -->

					<!-- answer section -->
					<v-col cols="12" md="12" class="py-0 pr-0">
						<v-subheader
							class="pa-0"
							style="font-size: 0.7rem !important; height: 1.1rem"
							>Must have at least 2 answers</v-subheader
						>
					</v-col>

					<template v-for="(answer, i) in answers">
						<v-col cols="10" md="10" :key="i" class="py-2">
							<v-text-field
								placeholder="Answer"
								dense
								prepend-icon="mdi-minus"
								@click:prepend="prependIconCallback(i)"
								:hide-details="true"
								solo-inverted
								v-model="answer.text"
								style="border-radius: 0px"
							></v-text-field>
						</v-col>

						<v-col cols="2" md="10" :key="'img-' + i" class="py-2">
							<v-btn
								icon
								tile
								@click="pickImg(i, 'answer')"
								v-if="answer.img == null"
							>
								<v-icon size="30">mdi-image-plus</v-icon>
							</v-btn>
							<v-sheet
								width="40"
								height="40"
								color="transparent"
								v-if="answer.img_file == null && answer.img !== null"
							>
								<div class="d-flex justify-center align-">
									<v-progress-circular
										indeterminate
										color="primary"
									></v-progress-circular>
								</div>
							</v-sheet>
							<v-menu
								offset-y
								v-if="answer.img_file !== null && answer.img !== null"
							>
								<template v-slot:activator="{ on, attrs }">
									<v-avatar
										size="40"
										tile
										class="pa-0"
										v-bind="attrs"
										v-on="on"
									>
										<v-img :src="answer.img"></v-img>
									</v-avatar>
								</template>
								<v-list light>
									<v-list-item
										v-for="(item, menuIdx) in imgMenu"
										:key="menuIdx"
										@click="imgClicked(menuIdx, 'answer', i)"
									>
										<v-list-item-title>{{ item.title }}</v-list-item-title>
									</v-list-item>
								</v-list>
							</v-menu>
						</v-col>
					</template>
					<!-- end answer section -->

					<v-col cols="12" md="12" class="py-2">
						<v-btn tile class="pl-2 prim-grad" block @click="addAnswer">
							<v-icon>mdi-plus</v-icon>
							Add Answer
						</v-btn>
					</v-col>

					<v-col cols="12" md="12" class="py-2">
						<v-divider dark style="border-color: #f0f8ff59" />
					</v-col>

					<v-col cols="12" md="12" class="py-0">
						<v-alert
							dense
							type="info"
							color="info"
							class="mb-0"
							tile
							dark
							style="font-size: 0.7rem !important"
							dismissible
							colored-border
							border="left"
							v-model="alertOpt"
							transition="scale-transition"
						>
							You can add some option like poll deadline, restriction, and
							others.
						</v-alert>
						<!-- <v-btn block class="prim-grad" tile outlined>
							Option
							<v-spacer></v-spacer>
							<v-icon>mdi-chevron-right</v-icon>
						</v-btn> -->
					</v-col>

					<v-col cols="12" md="12">
						<v-btn
							block
							class="prim-grad pr-2"
							tile
							outlined
							@click="restricDialog = true"
						>
							Option
							<v-spacer></v-spacer>
							<v-icon>mdi-chevron-right</v-icon>
						</v-btn>
					</v-col>
				</v-row>
				<!-- <v-subheader class="pa-0 c-subheader">Option</v-subheader> -->
			</v-container>

			<!-- Option Modal -->
			<v-row>
				<v-dialog
					fullscreen
					hide-overlay
					transition="slide-x-transition"
					v-model="restricDialog"
				>
					<v-card>
						<v-toolbar dark color="prim-grad" dense>
							<v-btn icon dark @click="restricDialog = false">
								<v-icon>mdi-check</v-icon>
							</v-btn>
							<v-toolbar-title>Options</v-toolbar-title>
							<v-spacer></v-spacer>
							<v-toolbar-items>
								<v-btn icon dark>
									<v-icon>mdi-help-circle-outline</v-icon>
								</v-btn>
							</v-toolbar-items>
						</v-toolbar>

						<v-container fluid>
							<v-row class="">
								<v-col cols="10" md="10" class="pt-2 pb-1">
									<v-dialog
										ref="dialog"
										v-model="modal"
										:return-value.sync="date"
										width="290px"
									>
										<v-date-picker v-model="date" scrollable>
											<v-spacer></v-spacer>
											<v-btn text color="primary" @click="modal = false">
												Cancel
											</v-btn>
											<v-btn text color="primary" @click="saveDate()">
												OK
											</v-btn>
										</v-date-picker>
									</v-dialog>
									<!-- Voting Deadline -->
									<v-text-field
										color="primary"
										placeholder="Voting Deadline"
										dense
										:hide-details="true"
										solo-inverted
										readonly
										@click="modal = true"
										style="border-radius: 0px"
										v-model="deadline"
									></v-text-field>
								</v-col>

								<v-col cols="2" md="10" class="pt-2 pb-1">
									<v-btn icon tile @click="modal = true">
										<v-icon size="30">mdi-calendar-clock-outline</v-icon>
									</v-btn>
								</v-col>

								<v-col cols="12" md="12" class="">
									<v-divider dark style="border-color: #f0f8ff59" />
								</v-col>
							</v-row>

							<div class="d-flex">
								<v-subheader class="pa-0 c-subheader"
									>Required details from voter</v-subheader
								>
								<v-icon class="ml-2">mdi-help-circle-outline</v-icon>
							</div>

							<v-row>
								<v-col cols="10" md="10" class="pt-3 pb-0"> Email </v-col>

								<v-col
									cols="2"
									md="10"
									class="pa-0 pt-3 d-flex justify-center align-center"
								>
									<v-switch
										class="pr-2 ma-0 pa-0"
										:hide-details="true"
										v-model="req_email"
									></v-switch>
								</v-col>
								<v-col cols="10" md="10" class="pt-3 pb-0"> Name </v-col>

								<v-col
									cols="2"
									md="10"
									class="pa-0 pt-3 d-flex justify-center align-center"
								>
									<v-switch
										class="pr-2 ma-0 pa-0"
										:hide-details="true"
										v-model="req_name"
									></v-switch>
								</v-col>
								<v-col cols="12" md="12" class="">
									<v-divider dark style="border-color: #f0f8ff59" />
								</v-col>
							</v-row>

							<div class="d-flex">
								<v-subheader class="pa-0 c-subheader">Restrictions</v-subheader>
								<v-icon class="ml-2">mdi-help-circle-outline</v-icon>
							</div>

							<v-row class="pt-3">
								<v-col cols="10" md="10" class="py-0">
									{{ passwordLabel }}
								</v-col>

								<v-col
									cols="2"
									md="10"
									class="pa-0 d-flex justify-center align-center"
								>
									<v-switch
										v-model="protectPassword"
										class="pr-2 ma-0 pa-0"
										:hide-details="true"
									></v-switch>
								</v-col>

								<v-col cols="12" md="12" class="py-0" v-if="protectPassword">
									<v-text-field
										placeholder="Polling Password"
										dense
										:hide-details="true"
										solo-inverted
										style="border-radius: 0px"
										v-model="password"
									></v-text-field>
								</v-col>

								<v-col cols="10" md="10" class="pt-3 pb-0">
									Use area restriction
									<!-- <v-icon class="ml-1" small>mdi-help-circle-outline</v-icon> -->
								</v-col>

								<v-col
									cols="2"
									md="10"
									class="pa-0 pt-3 d-flex justify-center align-center"
								>
									<v-switch
										class="pr-2 ma-0 pa-0"
										:hide-details="true"
										v-model="areaRest"
									></v-switch>
								</v-col>

								<v-col cols="10" md="10" class="pt-3 pb-0">
									Use device restriction
									<!-- <v-icon class="ml-1" small>mdi-help-circle-outline</v-icon> -->
								</v-col>

								<v-col
									cols="2"
									md="10"
									class="pa-0 pt-3 d-flex justify-center align-center"
								>
									<v-switch
										class="pr-2 ma-0 pa-0"
										:hide-details="true"
										v-model="deviceRest"
									></v-switch>
								</v-col>
							</v-row>
						</v-container>
					</v-card>
				</v-dialog>
			</v-row>
		</v-main>
	</div>
</template>

<script>
import { Camera, CameraResultType } from "@capacitor/camera";
import { Device } from "@capacitor/device";

export default {
	data() {
		return {
			answers: [],
			passwordLabel: "Change poll password",
			protectPassword: false,
			password: null,
			areaRest: false,
			area: null,
			deviceRest: false,
			deadline: "",
			deadlineValue: null,
			description: "",
			date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
				.toISOString()
				.substr(0, 10),
			modal: false,
			imgMenu: [{ title: "Remove" }, { title: "Change" }],
			imgBlob: null,
			question: {
				title: "",
				description: "",
				img: null,
				img_file: null,
				img_type: null,
			},
			details: null,
			detailsDialog: false,
			restricDialog: false,
			alertOpt: false,
			loadingBtn: false,
			wHeight: window.innerHeight,
			errors: {
				description: [],
				question: [],
				password: [],
			},
			polling: null,
			serverUrl: window.__BASE_URL__,
			cacheKey: +new Date(),
			intervalImg: null,
		};
	},
	beforeRouteEnter(to, from, next) {
		next((vm) => {
			if (from.name !== "req.details") {
				vm.$store.commit("setReqName", false);
				vm.$store.commit("setReqEmail", false);
			}
		});
	},
	computed: {
		req_email: {
			get() {
				return this.$store.getters.getReqEmail;
			},
			set(value) {
				this.$store.commit("setReqEmail", value);
				return value;
			},
		},

		req_name: {
			get() {
				return this.$store.getters.getReqName;
			},
			set(value) {
				this.$store.commit("setReqName", value);
				return value;
			},
		},
	},
	mounted() {
		const param = this.$router.history.current.params;
		this.polling = param.polling;
		this.setModel();
		setTimeout(() => {
			this.alertOpt = true;
		}, 600);
	},
	watch: {
		fileInput(newVal) {
			console.log(newVal);
		},
	},
	methods: {
		setModel() {
			// created_at: "2022-04-18T08:13:10.000000Z";
			// deadline: null;
			// description: "Quisquam elit conse";
			// dir: "6715d";
			// id: 2;
			// owner_id: "ca1bf760-5024-4782-b53c-c07042951a87";
			// q_img: null;
			// question: "Quibusdam illum mai";
			// req_email: 0;
			// req_name: 0;
			// updated_at: "2022-04-18T08:13:10.000000Z";
			// with_area_res: 1;
			// with_device_res: 1;
			// with_password: 1;

			if (this.polling.q_img !== null) {
				// console.log(`${this.serverUrl}storage/img/${this.polling.q_img}`);
				this.question.img =
					`${this.serverUrl}storage/img/${this.polling.q_img}` +
					"?rnd=" +
					this.cacheKey;
				this.question.img_file = `${this.serverUrl}storage/img/${this.polling.q_img}`;
			}
			this.question.title = this.polling.question;
			this.question.description = this.polling.description;
			this.req_email = this.polling.req_email;
			this.req_name = this.polling.req_name;

			if (this.polling.with_password === 1) {
				this.passwordLabel = "Change poll password";
			} else {
				this.passwordLabel = "Protect poll with password";
			}
			// this.protectPassword = this.polling.with_password;
			this.areaRest = this.polling.with_area_res;
			this.deviceRest = this.polling.with_device_res;
			this.answers = this.polling.answers.map((answer) => ({
				...answer,
				img:
					answer.a_img !== null
						? `${this.serverUrl}storage/img/answers/${answer.a_img}` +
						  "?rnd=" +
						  this.cacheKey
						: null,
				img_file: answer.a_img !== null ? `old_file` : null,
				img_type: null,
			}));

			if (this.polling.deadline !== null) {
				this.date = this.polling.deadline;
				this.deadline = this.formatDate(this.polling.deadline);
				this.deadlineValue = this.polling.deadline;
			}

			// this.question.title = this.polling.question;
			// this.question.title = this.polling.question;
			// this.question.title = this.polling.question;
			// this.question.title = this.polling.question;
			// this.question.title = this.polling.question;
			// this.question.title = this.polling.question;
		},
		prependIconCallback(idx) {
			if (this.answers.length <= 2) {
				toast.warning({
					// title: "Att",
					message: "Must have at least 2 answers.",
					position: "topCenter",
					timeout: 4500,
					// ballon:true,
					transitionInMobile: "fadeInRight",
					transitionOutMobile: "fadeOutRight",
					displayMode: 2,
				});
			} else {
				this.answers.splice(idx, 1);
			}
		},
		addImage(idx) {
			console.log(idx);
		},
		pickImg(idx = null, type) {
			if (type === "question") {
				this.openImg()
					.then((result) => {
						this.question.img = result.webPath;
						this.question.img_type = result.format;
						this.fetchImg(
							result.webPath,
							`q_img.${result.format}`,
							`image/${result.format}`
						).then((file) => {
							this.question.img_file = file;
						});
					})
					.catch((e) => {
						console.log(e);
					});
			} else {
				// console.log(idx);
				this.openImg()
					.then((result) => {
						// console.log(result);
						this.answers[idx].img = result.webPath;
						this.answers[idx].img_type = result.format;
						this.fetchImg(
							result.webPath,
							`${idx}.${result.format}`,
							`image/${result.format}`
						).then((file) => {
							this.answers[idx].img_file = file;
						});
					})
					.catch((e) => {
						console.log(e);
					});
			}
		},
		imgClicked(menu, type, idx = null) {
			if (type === "question") {
				if (menu === 0) {
					this.question.img_file = null;
					this.question.img = null;
				} else {
					this.pickImg(idx, type);
				}
			} else {
				if (menu === 0) {
					this.answers[idx].img_file = null;
					this.answers[idx].img = null;
				} else {
					this.pickImg(idx, type);
				}
			}
		},
		openImg() {
			return new Promise((resolve, reject) => {
				Camera.getPhoto({
					quality: 90,
					allowEditing: false,
					resultType: CameraResultType.Uri,
				})
					.then((result) => {
						resolve(result);
					})
					.catch((e) => {
						reject(e);
					});
			});
		},
		addAnswer() {
			const question = {
				text: "",
				img: null,
				img_file: null,
				img_type: null,
			};

			this.answers.push(question);
		},
		navigation_back() {
			this.$router.push({ name: "my.poll" });
		},
		savePoll() {
			this.loadingBtn = true;
			this.resetErrors();
			this.getDeviceId().then((deviceId) => {
				let bodyFormData = new FormData();
				bodyFormData.append("_method", "PUT");

				bodyFormData.append("owner_id", deviceId.uuid);
				bodyFormData.append("question", this.question.title);
				bodyFormData.append("description", this.question.description);
				bodyFormData.append("q_img", this.question.img_file);

				if (this.deadlineValue !== null) {
					bodyFormData.append("deadline", this.deadlineValue);
				}

				bodyFormData.append(
					"with_password",
					this.parseBol(this.protectPassword)
				);
				if (this.protectPassword) {
					bodyFormData.append("password", this.password);
				}

				bodyFormData.append("with_area_res", this.parseBol(this.areaRest));
				if (this.protectArea) {
					bodyFormData.append("area", this.area);
				}
				bodyFormData.append("with_device_res", this.parseBol(this.deviceRest));

				bodyFormData.append(
					"req_email",
					this.parseBol(this.$store.getters.getReqEmail)
				);
				bodyFormData.append(
					"req_name",
					this.parseBol(this.$store.getters.getReqName)
				);

				bodyFormData.append("answers", JSON.stringify(this.answers));

				let a_file = [];
				this.answers.forEach((element, i) => {
					// console.log(element);
					bodyFormData.append("a_img[]", element.img_file);
				});
				axios
					.post(`p/${this.polling.dir}/update`, bodyFormData)
					.then((response) => {
						this.loadingBtn = false;
						console.log(response);
					})
					.catch((e) => {
						this.loadingBtn = false;
						// console.log(e);
						Object.assign(this.errors, e.response.data.errors);
						console.log(e.response);
					});
			});

			// this.$router.back();
		},
		saveDate() {
			this.$refs.dialog.save(this.date);
			// console.log(this.formatDateValue(this.date));
			this.deadline = this.formatDate(this.date);
			this.deadlineValue = this.date;
		},

		// helper function
		formatDate(date) {
			if (!date) return null;
			const monthList = [
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December",
			];
			const [year, month, day] = date.split("-");
			return `${day}-${monthList[month - 1]}-${year}`;
		},
		formatDateValue(date) {
			if (!date) return null;

			const [year, month, day] = date.split("-");
			return `${year}-${month}-${day}`;
		},
		blobToFile(theBlob, fileName, type) {
			let file = new File([theBlob], fileName, {
				lastModified: Date.now(),
				type: type,
			});

			return file;
		},
		fetchImg(url, fileName, type) {
			return new Promise((resolve) => {
				fetch(url).then((result) => {
					result.blob().then((blob) => {
						const quest_file = this.blobToFile(blob, fileName, type);
						// console.log(quest_file);
						resolve(quest_file);
					});
				});
			});
		},
		resetErrors() {
			this.errors.description = [];
			this.errors.question = [];
			this.errors.password = [];
		},
		parseBol(value) {
			if (value) {
				return 1;
			} else {
				return 0;
			}
		},
		async getDeviceId() {
			return await Device.getId();
		},
	},
};
</script>

<style>
#newPol .v-speed-dial {
	position: absolute;
}

#newPol .v-btn--floating {
	position: relative;
}
</style>