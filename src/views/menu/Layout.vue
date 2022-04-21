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

		<bottom-nav :options="options" :value="selected" />

		<!-- <v-bottom-navigation v-model="value" grow absolute>
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
		</v-bottom-navigation> -->
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import BottomNav from "../components/BottomNav.vue";

export default {
	components: {
		BottomNav,
	},

	data() {
		return {
			value: "home",
			loading: false,
			options: [
				{
					id: "home",
					icon: "mdi-home-outline",
					title: "HOME",
					path: { name: "home" },
				},
				{
					id: "poll",
					icon: "mdi-vote-outline",
					title: "POLLING",
					path: { name: "my.poll" },
				},
			],
		};
	},
	mounted() {
		if (this.myPoll === null) {
			if (this.value === "poll") {
				this.loading = true;
			}
		}
		console.log(this.$router.history.current.name);
	},
	computed: {
		...mapGetters({
			myPoll: "getMyPoll",
		}),
		selected: {
			set: function (newVal) {
				return newVal;
			},
			get: function () {
				return this.$router.history.current.name;
			},
		},
	},
	watch: {
		myPoll: function (newVal) {
			if (newVal !== null) {
				this.loading = false;
			} else {
				if (this.value === "poll") {
					this.loading = true;
				}
			}
		},
		value: function (newVal) {
			// console.log(newVal);
			if (newVal === "poll") {
				if (this.myPoll === null) {
					this.loading = true;
				} else {
					this.loading = false;
				}
			}
		},
	},
};
</script>

<style>
</style>