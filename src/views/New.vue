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
				<!-- <v-subheader
					class="pa-0"
					style="font-size: 1.2rem; font-weight: 500; color: #f0f8ff"
					></v-subheader
				> -->
				<v-row class="mt-10">
					<v-col cols="10" md="10" sm="10" class="py-2">
						<v-text-field
							color="primary"
							placeholder="Question"
							dense
							:hide-details="true"
							solo-inverted
							v-model="question"
							style="border-radius: 0px"
						></v-text-field>
					</v-col>

					<v-col cols="2" md="10" sm="10" class="py-2">
						<v-menu offset-y>
							<template v-slot:activator="{ on, attrs }">
								<v-btn icon tile v-bind="attrs" v-on="on">
									<v-icon size="30">mdi-image-plus</v-icon>
								</v-btn>
							</template>
							<v-list light>
								<v-list-item
									v-for="(item, i) in imgMenu"
									:key="i"
									@click="openImg(i)"
								>
									<v-list-item-title>{{ item.title }}</v-list-item-title>
								</v-list-item>
							</v-list>
						</v-menu>

						<!-- <v-btn icon tile>
							<v-icon size="30">mdi-image-plus</v-icon>
						</v-btn> -->
					</v-col>

					<v-col cols="12" md="12" sm="12" class="py-2">
						<v-text-field
							placeholder="Description"
							dense
							:hide-details="true"
							solo-inverted
							style="border-radius: 0px"
							v-model="description"
						></v-text-field>
					</v-col>

					<v-col cols="12" md="12" sm="12" class="py-2">
						<v-divider dark style="border-color: #f0f8ff59" />
					</v-col>

					<template v-for="(answer, i) in answers">
						<v-col cols="10" md="10" sm="10" :key="i" class="py-2">
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

						<v-col cols="2" md="10" sm="10" :key="'img-' + i" class="py-2">
							<v-btn icon tile @click="addImage(i)">
								<v-icon size="30">mdi-image-plus</v-icon>
							</v-btn>
						</v-col>
					</template>

					<v-col cols="12" md="12" sm="12" class="py-2">
						<v-btn tile small class="pl-2 prim-grad" block @click="addQuestion">
							<v-icon>mdi-plus</v-icon>
							Add Answer
						</v-btn>
					</v-col>

					<v-col cols="12" md="12" sm="12" class="py-2">
						<v-divider dark style="border-color: #f0f8ff59" />
					</v-col>
				</v-row>

				<v-subheader
					class="pa-0"
					style="font-size: 1.2rem; font-weight: 500; color: #f0f8ff"
					>Option</v-subheader
				>

				<v-row>
					<v-col cols="10" md="10" sm="10" class="pt-2 pb-1">
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

					<v-col cols="2" md="10" sm="10" class="pt-2 pb-1">
						<v-btn icon tile @click="modal = true">
							<v-icon size="30">mdi-calendar-clock-outline</v-icon>
						</v-btn>
					</v-col>

					<v-col cols="10" md="10" sm="10" class="d-flex align-center py-0">
						Protect poll with password
					</v-col>

					<v-col cols="2" md="10" sm="10" class="pa-0 d-flex justify-center">
						<v-switch v-model="protectPassword" class="pr-2"></v-switch>
					</v-col>

					<v-col cols="10" md="10" sm="10" class="d-flex align-center py-0">
						Required details from voter
					</v-col>

					<v-col cols="2" md="10" sm="10" class="py-0">
						<v-btn icon tile>
							<v-icon size="30">mdi-arrow-right-box</v-icon>
						</v-btn>
					</v-col>
				</v-row>

				<v-row align="center" justify="center" class="mt-5" no-gutters>
					<v-col cols="10" md="10" sm="10">
						<v-avatar size="80" tile>
							<v-img :src="imgSrc"></v-img>
						</v-avatar>
					</v-col>
					<div>
						{{ imgSrc }}
					</div>
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
			question: "",
			description: "",
			date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
				.toISOString()
				.substr(0, 10),
			modal: false,
			imgMenu: [{ title: "Gallery" }, { title: "Camera" }],
			imgSrc: "https://picsum.photos/id/11/500/300",
		};
	},
	mounted() {
		this.answers = [
			{
				text: "",
				img: null,
			},
		];
	},
	// watch: {
	// 	date(val) {
	// 		this.dateFormatted = this.formatDate(this.date);
	// 	},
	// },
	// computed: {
	// 	computedDateFormatted() {
	// 		return this.formatDate(this.date);
	// 	},
	// },
	methods: {
		prependIconCallback(idx) {
			this.answers.splice(idx, 1);
		},
		addImage(idx) {
			console.log(idx);
		},
		openImg(idx) {
			console.log(idx);
			Camera.getPhoto({
				quality: 90,
				allowEditing: true,
				resultType: CameraResultType.Uri,
			}).then((result) => {
				this.imgSrc = result.webPath
				console.log(result);
			});
			// const takePicture = async () => {

			// 	// const image = await

			// 	// // image.webPath will contain a path that can be set as an image src.
			// 	// // You can access the original file using image.path, which can be
			// 	// // passed to the Filesystem API to read the raw data of the image,
			// 	// // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
			// 	// var imageUrl = image.webPath;

			// 	// // Can be set to the src of an image now
			// 	// this.imgSrc= imageUrl;
			// };
		},
		addQuestion() {
			const question = {
				text: "",
				img: null,
			};

			this.answers.push(question);
		},
		navigation_back() {
			this.$router.back();
		},
		savePoll() {
			this.$router.back();
		},
		saveDate() {
			this.$refs.dialog.save(this.date);
			console.log(this.formatDateValue(this.date));
			this.deadline = this.formatDate(this.date);
		},
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