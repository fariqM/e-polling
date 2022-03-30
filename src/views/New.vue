<template>
	<div style="height: 100%; width: 100%" id="newPol">
		<v-speed-dial :top="false" :bottom="true" :right="true" :left="false">
			<template v-slot:activator>
				<v-btn color="prim-grad" dark fab @click="savePoll">
					<v-icon> mdi-check </v-icon>
				</v-btn>
			</template>
		</v-speed-dial>
		<v-app-bar color="prim-grad" dense>
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
				<v-row class="mt-1">
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
						<v-btn icon tile>
							<v-icon size="30">mdi-image-plus</v-icon>
						</v-btn>
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
						<!-- Voting Deadline -->
						<v-text-field
							color="primary"
							placeholder="Voting Deadline"
							dense
							:hide-details="true"
							solo-inverted
							readonly
							style="border-radius: 0px"
              v-model="deadline"
						></v-text-field>
					</v-col>

					<v-col cols="2" md="10" sm="10" class="pt-2 pb-1">
						<v-btn icon tile>
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
			</v-container>
		</v-main>
	</div>
</template>

<script>
export default {
	data() {
		return {
			answers: [],
			protectPassword: false,
      deadline:"",
      question:"",
      description:""
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
	methods: {
		prependIconCallback(idx) {
			this.answers.splice(idx, 1);
		},
		addImage(idx) {
			console.log(idx);
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