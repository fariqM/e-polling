<template>
	<div style="height: 100%; width:100%">
		<v-app-bar color="deep-purple accent-4" min-width="100%">
			<v-btn icon>
				<v-icon>mdi-magnify</v-icon>
			</v-btn>
		</v-app-bar>
		<v-main style="height: 100%">
			<v-container>
				<div class="d-flex justify-center align-center" style="height: 100%">
					<div class="text-center">
						receiving from URL :
						<br />
						<b>https://polling-pol.site/p/{{ polling_params }}</b>
					</div>
				</div>
			</v-container>
		</v-main>
	</div>
</template>

<script>
export default {
	data() {
		return {
			polling_params: "",
		};
	},
	mounted() {
		this.polling_params = this.$router.history.current.params.pollingUrl;
	},
};
</script>

<style>
</style>