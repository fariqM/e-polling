<template>
	<v-container>
		<v-row class="text-center">
			<v-col cols="12">
				<v-img
					:src="require('../assets/logo.svg')"
					class="my-3"
					contain
					height="200"
				/>
			</v-col>

			<v-col class="mb-5" cols="12">
				<div class="d-flex justify-space-around align-center">
					<v-btn :to="{ name: 'maps' }">Go to Map Testing</v-btn>
				</div>
			</v-col>
			<v-col class="" cols="12">
				<div class="">
					<v-text-field
						placeholder="Insert a link or polling code"
						label="Polling Address"
						v-model="pol_address"
					></v-text-field>
					<v-btn
						:to="{ name: 'polling', params: { pollingUrl: pol_address } }"
						color="info"
						>Go to Polling</v-btn
					>
				</div>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	name: "HelloWorld",

	data: () => ({
    pol_address:"",
  }),
};
</script>
