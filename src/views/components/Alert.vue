<template>
	<v-alert
		dense
		:type="type"
		:color="type"
		class="mb-2"
		tile
		style="font-size: 0.9rem !important"
		dismissible
		colored-border
		border="left"
		transition="scale-transition"
		v-model="show"
       
	>
		{{ msg }}
	</v-alert>
</template>

<script>
export default {
	props: {
		show: Boolean,
		msg: String,
		type: String,
	},
    methods:{
        dismiss(){
            console.log("dismiss");
        }
    }
};
</script>

<style>
</style>