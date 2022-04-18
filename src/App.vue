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

	data: () => ({}),
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
.prim-grad {
	background: linear-gradient(
		145deg,
		rgba(16, 141, 223, 1) 0%,
		rgba(8, 115, 191, 1) 41%,
		rgba(12, 59, 102, 1) 100%
	);
}
.prim-grad-2 {
	background: linear-gradient(
		145deg,
		rgb(16 141 223 / 63%) 0%,
		rgb(8 115 191 / 64%) 41%,
		rgb(12 59 102 / 64%) 100%
	);
}
.ellipsis-text {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.c-subheader {
	font-size: 1.2rem !important;
	font-weight: 500 !important;
	color: #f0f8ff !important;
}
.poll-container {
	padding: 12px;
}
.answer-title {
	font-size: 1.4rem;
	font-weight: 500;
}
</style>
