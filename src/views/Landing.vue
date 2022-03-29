<template>
	<div>landing</div>
</template>

<script>
export default {
	beforeRouteEnter(to, from, next) {
		// next()
		next((vm) => {
			vm.$router.push({ name: "home" });
			// access to component instance via `vm`
		});
		// console.log(this.$$router);
	},
};
</script>

<style>
</style>