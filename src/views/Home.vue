<template>
	<v-container>
		<v-row class="text-center" align="center">
			<v-col cols="12" class="pa-0">
				<v-img
					:src="require('../assets/poll.png')"
					class="my-3"
					contain
					height="250"
				/>
			</v-col>
			<v-col class="pa-0" cols="12">
				<div class="noselect" style="font-weight: 600; font-size: 2.3rem">
					Join polling
				</div>
				<!-- <div class="d-flex justify-space-around align-center">
					<v-btn :to="{ name: 'maps' }">Go to Map Testing</v-btn>
				</div> -->
			</v-col>
			<v-col cols="12" class="noselect">
				<v-text-field
					outlined
					class="mb-4"
					clearable
					@click="inputFocus"
					style="border-radius:0px"
					placeholder="Insert a link or polling code"
					label="Polling Address"
					v-model="pol_address"
					:error-messages="err_msg"
				></v-text-field>
				<v-btn tile @click="goToPoll" class="prim-grad">Go to Polling</v-btn>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	data() {
		return {
			pol_address: "",
			err_msg: "",
		};
	},
	methods: {
		goToPoll() {
			if (this.pol_address === "") {
				this.err_msg = "Please inser a url polling";
			} else {
				this.$router.push({
					name: "polling",
					params: { pollingUrl: this.pol_address },
				});
			}
		},
		inputFocus(){
			this.err_msg = "Please inser a url polling";
		}
	},
};
</script>
