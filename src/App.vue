<template>
  <v-app style=" height: 100%">
		<div style="max-width: 30.5rem; width: 100vw; height: 100% ">
			<router-view />
		</div>
	</v-app>
</template>

<script>


export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>

<style>
.v-application--wrap {
	align-items: center;
}
</style>
