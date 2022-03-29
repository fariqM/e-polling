<template>
	<v-container>
		<v-row class="text-center" align="center">
			<v-col cols="12" class="pa-0">
				<v-img
					:src="require('../assets/poll.png')"
					class="my-3 "
					contain
					height="250"
				/>
			</v-col>
			<v-col class="pa-0" cols="12">
				<div class="noselect" style="font-weight: 600; font-size: 2.3rem;">
					Join polling
				</div>
				<!-- <div class="d-flex justify-space-around align-center">
					<v-btn :to="{ name: 'maps' }">Go to Map Testing</v-btn>
				</div> -->
			</v-col>
			<v-col cols="12" class="noselect">
				<v-text-field
					placeholder="Insert a link or polling code"
					label="Polling Address"
					v-model="pol_address"
				></v-text-field>
				<v-btn
					tile
					:to="{ name: 'polling', params: { pollingUrl: pol_address } }"
					color="primary"
					>Go to Polling</v-btn
				>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {};
</script>
