<template>
	<div style="height: 100%">
		<v-progress-linear
			indeterminate
			absolute
			color="primary"
			v-if="loading"
		></v-progress-linear>
		<v-main style="height: 100%">
			<router-view />
		</v-main>

		<v-bottom-navigation v-model="value" grow absolute>
			<v-btn
				value="home"
				style="height: 100%"
				:color="value === 'home' ? '#535353' : ''"
				:to="{ name: 'home' }"
			>
				<span>Home</span>

				<v-icon>mdi-home-outline</v-icon>
			</v-btn>

			<v-btn
				value="poll"
				:color="value === 'poll' ? '#535353' : ''"
				style="height: 100%"
				:to="{ name: 'my.poll' }"
			>
				<span>Polling</span>

				<v-icon>mdi-vote-outline</v-icon>
			</v-btn>

			<v-btn
				value="history"
				:color="value === 'history' ? '#535353' : ''"
				style="height: 100%"
				:to="{ name: 'history' }"
			>
				<span>Notification</span>

				<v-icon>mdi-bell-outline</v-icon>
			</v-btn>

			<v-btn
				value="acc"
				:color="value === 'acc' ? '#535353' : ''"
				style="height: 100%"
				:to="{ name: 'account' }"
			>
				<span>Account</span>

				<v-icon>mdi-account-outline</v-icon>
			</v-btn>
		</v-bottom-navigation>
	</div>
</template>

<script>
export default {
	data() {
		return {
			value: "home",
			loading: false,
		};
	},
	mounted(){
		const pol = this.myPoll
	},
	computed: {
		myPoll: {
			get: function () {
				let poll = this.$store.getters.getMyPoll;
				if (poll == null) {
					this.loading = true;
				} else {
					this.loading = false;
				}
				return poll;
			},
			// setter
			set: function (newValue) {
				if (newValue == null) {
					this.loading = true;
				}
			},
		},
	},	
};
</script>

<style>
</style>