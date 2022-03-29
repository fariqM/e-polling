<template>
	<div>
		<v-main>
			<v-container>
				<router-view />
			</v-container>
		</v-main>
		<v-bottom-navigation v-model="value" grow absolute>
			<v-btn
				value="home"
				style="height: 100%"
				:color="value==='home' ? '#535353': ''"
				:to="{ name: 'home' }"
			>
				<span>Home</span>

				<v-icon>mdi-home-outline</v-icon>
			</v-btn>

			<v-btn
				value="history"
				:color="value==='history' ? '#535353': ''"
				style="height: 100%"
                
				:to="{ name: 'history' }"
			>
				<span>History</span>

				<v-icon>mdi-history</v-icon>
			</v-btn>

			<v-btn
				value="poll"
				:color="value==='poll' ? '#535353': ''"
				style="height: 100%"
				:to="{ name: 'new.poll' }"
			>
				<span>New Poll</span>

				<v-icon>mdi-plus</v-icon>
			</v-btn>

			<v-btn
				value="acc"
				:color="value==='acc' ? '#535353': ''"
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
		};
	},
};
</script>

<style>
</style>