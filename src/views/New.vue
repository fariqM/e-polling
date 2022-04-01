<template>
	<div style="height: 100%; width: 100%" id="newPol">
		<v-speed-dial :top="false" :bottom="true" :right="true" :left="false">
			<template v-slot:activator>
				<v-btn color="prim-grad" dark fab @click="savePoll">
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
		<v-main>
			<v-container fluid>
				<v-row class="mt-10">
					<!-- question section -->
					<v-col cols="10" md="10" class="py-2">
						<v-text-field
							color="primary"
							placeholder="Question"
							dense
							:hide-details="true"
							solo-inverted
							v-model="question.title"
							style="border-radius: 0px"
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
						<v-menu offset-y v-else>
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
							placeholder="Description"
							dense
							:hide-details="true"
							solo-inverted
							style="border-radius: 0px"
							v-model="question.description"
						></v-text-field>
					</v-col>

					<v-col cols="12" md="12" class="py-2">
						<v-divider dark style="border-color: #f0f8ff59" />
					</v-col>
					<!-- end question section -->

					<!-- answer section -->
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

							<v-menu offset-y v-else>
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
										v-for="(item, i) in imgMenu"
										:key="i"
										@click="imgClicked(i, 'answer')"
									>
										<v-list-item-title>{{ item.title }}</v-list-item-title>
									</v-list-item>
								</v-list>
							</v-menu>
						</v-col>
					</template>
					<!-- end answer section -->

					<v-col cols="12" md="12" class="py-2">
						<v-btn tile small class="pl-2 prim-grad" block @click="addAnswer">
							<v-icon>mdi-plus</v-icon>
							Add Answer
						</v-btn>
					</v-col>

					<v-col cols="12" md="12" class="py-2">
						<v-divider dark style="border-color: #f0f8ff59" />
					</v-col>
				</v-row>

				<v-subheader
					class="pa-0"
					style="font-size: 1.2rem; font-weight: 500; color: #f0f8ff"
					>Option</v-subheader
				>

				<v-row>
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
								<v-btn text color="primary" @click="saveDate()"> OK </v-btn>
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

					<v-col cols="10" md="10" class="pt-3 pb-0">
						Protect poll with password
					</v-col>

					<v-col
						cols="2"
						md="10"
						class="pa-0 pt-3 d-flex justify-center align-center"
					>
						<v-switch
							v-model="protectPassword"
							class="pr-2 ma-0 pa-0"
							:hide-details="true"
						></v-switch>
					</v-col>

					<v-col cols="12" md="12" class="py-2" v-if="protectPassword">
						<v-text-field
							placeholder="Polling Password"
							dense
							:hide-details="true"
							solo-inverted
							style="border-radius: 0px"
							v-model="question.description"
						></v-text-field>
					</v-col>

					<v-col cols="10" md="10" class="pt-3 pb-0">
						Use area restriction
						<v-icon class="ml-1" small>mdi-help-circle-outline</v-icon>
					</v-col>

					<v-col
						cols="2"
						md="10"
						class="pa-0 pt-3 d-flex justify-center align-center"
					>
						<v-switch class="pr-2 ma-0 pa-0" :hide-details="true"></v-switch>
					</v-col>

					<v-col cols="10" md="10" class="pt-3 pb-0">
						Use device restriction
						<v-icon class="ml-1" small>mdi-help-circle-outline</v-icon>
					</v-col>

					<v-col
						cols="2"
						md="10"
						class="pa-0 pt-3 d-flex justify-center align-center"
					>
						<v-switch class="pr-2 ma-0 pa-0" :hide-details="true"></v-switch>
					</v-col>

					<v-col cols="10" md="10" class="pt-3 pb-0">
						Required details from voter
						<v-icon class="ml-1" small>mdi-help-circle-outline</v-icon>
					</v-col>

					<v-col
						cols="2"
						md="10"
						class="pa-0 pt-2 d-flex justify-center align-center"
					>
						<v-btn
							icon
							tile
							class="pa-0 ma-0"
							:to="{ name: 'req.details', params: { details: details } }"
						>
							<v-icon size="30">mdi-arrow-right-box</v-icon>
						</v-btn>
					</v-col>
				</v-row>
			</v-container>
		</v-main>
	</div>
</template>

<script>
import { Camera, CameraResultType } from "@capacitor/camera";

export default {
	data() {
		return {
			answers: [],
			protectPassword: false,
			deadline: "",
			deadlineValue: "",
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
				img_type: null,
			},
			details: null,
		};
	},
	beforeRouteEnter(to, from, next) {
		next((vm) => {
			if (from.name !== 'req.details') {
				vm.$store.commit('setReqName', false)
				vm.$store.commit('setReqEmail', false)
			}
		});
	},
	mounted() {
		this.answers = [
			{
				text: "",
				img: null,
				img_type: null,
			},
		];
	},
	watch: {
		fileInput(newVal) {
			console.log(newVal);
		},
	},
	methods: {
		prependIconCallback(idx) {
			this.answers.splice(idx, 1);
		},
		addImage(idx) {
			console.log(idx);
		},
		pickImg(idx = null, type) {
			if (type === "question") {
				this.openImg()
					.then((result) => {
						// console.log(result);
						this.question.img = result.webPath;
						this.question.img_type = result.format;
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
						// console.log(this.answers);
					})
					.catch((e) => {
						console.log(e);
					});
			}
		},
		imgClicked(menu, type, idx = null) {
			if (type === "question") {
				if (menu === 0) {
					this.question.img = null;
				} else {
					this.pickImg(idx, type);
				}
			} else {
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
				img_type: null,
			};

			this.answers.push(question);
		},
		navigation_back() {
			this.$router.push({ name: "my.poll" });
		},
		savePoll() {
			let bodyFormData = new FormData();
			// console.log(this.question);
			// // console.log();
			// this.fetchImg(
			// 	this.question.img,
			// 	`quest_img.${this.question.img_type}`,
			// 	`image/${this.question.img_type}`
			// ).then((quest_img) => {
			// 	console.log(quest_img);
			// 	bodyFormData.append("question_img", quest_img);
			// 	bodyFormData.append("img2", this.fileInput);

			// 	axios
			// 		.post("http://192.168.1.3:8888/api/testing", bodyFormData)
			// 		.then((response) => {
			// 			console.log(response);
			// 		})
			// 		.catch((e) => {
			// 			console.log(e);
			// 		});
			// });

			axios
				.post("http://192.168.1.3:8888/api/testing", bodyFormData)
				.then((response) => {
					console.log(response.data);
				})
				.catch((e) => {
					console.log(e);
				});

			// bodyFormData.append("path", this.question.img);
			// bodyFormData.append("title", this.question.title);
			// bodyFormData.append("desc", this.question.description);

			// this.$router.back();
		},
		saveDate() {
			this.$refs.dialog.save(this.date);
			// console.log(this.formatDateValue(this.date));
			this.deadline = this.formatDate(this.date);
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