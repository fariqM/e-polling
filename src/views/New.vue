<template>
	<v-container>
		<v-subheader
			class="pa-0"
			style="font-size: 1.2rem; font-weight: 500; color: aliceblue"
			>Create New Poll</v-subheader
		>
		<v-row>
			<v-col cols="10" md="10" sm="10">
				<v-text-field
					placeholder="Question"
					dense
					:hide-details="true"
					solo-inverted
				></v-text-field>
			</v-col>

			<v-col cols="2" md="10" sm="10">
				<v-btn icon tile>
					<v-icon size="30">mdi-image-plus</v-icon>
				</v-btn>
			</v-col>

			<v-col cols="10" md="10" sm="10">
				<v-text-field
					placeholder="Description"
					dense
					:hide-details="true"
					solo-inverted
				></v-text-field>
			</v-col>

			<v-col cols="12" md="12" sm="12">
				<v-divider dark style="border-color: #f0f8ff59" />
			</v-col>

			<template v-for="(answer, i) in answers">
				<v-col cols="10" md="10" sm="10" :key="i">
					<v-text-field
						placeholder="Answer"
						dense
						prepend-icon="mdi-minus"
						@click:prepend="prependIconCallback(i)"
						:hide-details="true"
						solo-inverted
						v-model="answer.text"
					></v-text-field>
				</v-col>

				<v-col cols="2" md="10" sm="10" :key="'img-' + i">
					<v-btn icon tile @click="addImage(i)">
						<v-icon size="30">mdi-image-plus</v-icon>
					</v-btn>
				</v-col>
			</template>

			<v-col cols="10" md="10" sm="10" >
				<v-text-field
					placeholder="Answer"
					dense
          solo
          persistent-placeholder
          background-color="transparent"
					prepend-icon="mdi-plus"
				></v-text-field>
			</v-col>
		</v-row>
		<!-- <div class="d-flex justify-center align-center" style="height: 100%">
      <v-text-field placeholder="Question"></v-text-field>
		</div> -->
	</v-container>
</template>

<script>
export default {
	data() {
		return {
			answers: {},
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
	},
};
</script>

<style>
</style>