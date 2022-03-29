<template>
	<v-app style="height: 100%">
		<div style="max-width: 30.5rem; width: 100vw; height: 100%">
			<router-view />
		</div>
	</v-app>
</template>

<script>
export default {
	name: "App",

	data: () => ({
	}),
	mounted() {
		this.$vuetify.theme.dark = true;
	},
};
</script>

<style>
.v-application--wrap {
	align-items: center;
}
.noselect {
	-webkit-touch-callout: none; /* iOS Safari */
	-webkit-user-select: none; /* Safari */
	-khtml-user-select: none; /* Konqueror HTML */
	-moz-user-select: none; /* Old versions of Firefox */
	-ms-user-select: none; /* Internet Explorer/Edge */
	user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}
</style>
