<template>
	<div style="height: 100%; width: 100%" id="reqDetails">
		<v-speed-dial :top="false" :bottom="true" :right="true" :left="false">
			<template v-slot:activator>
				<v-btn color="prim-grad" dark fab @click="saveOption">
					<v-icon> mdi-check </v-icon>
				</v-btn>
			</template>
		</v-speed-dial>
		<v-app-bar color="prim-grad" dense absolute>
			<v-btn icon @click="navigation_back">
				<v-icon>mdi-chevron-left</v-icon>
			</v-btn>
			<v-toolbar-title>Voter Details</v-toolbar-title>
		</v-app-bar>

		<v-main>
			<v-container fluid>
				<v-row class="mt-10">
					<v-col cols="10" md="10" class="pt-3 pb-0"> Required email </v-col>

					<v-col
						cols="2"
						md="10"
						class="pa-0 pt-3 d-flex justify-center align-center"
					>
						<v-switch
							v-model="reqEmail"
							class="pr-2 ma-0 pa-0"
							:hide-details="true"
						></v-switch>
					</v-col>
                    <v-col cols="10" md="10" class="pt-3 pb-0"> Required name </v-col>

					<v-col
						cols="2"
						md="10"
						class="pa-0 pt-3 d-flex justify-center align-center"
					>
						<v-switch
							v-model="reqName"
							class="pr-2 ma-0 pa-0"
							:hide-details="true"
						></v-switch>
					</v-col>
				</v-row>
			</v-container>
		</v-main>
	</div>
</template>

<script>
export default {
	data() {
		return {
			reqEmail: false,
            reqName:false,
		};
	},
	methods: {
		saveOption() {},
		navigation_back() {
            this.$router.back();
        },
	},
};
</script>

<style>
#reqDetails .v-speed-dial {
	position: absolute;
}

#reqDetails .v-btn--floating {
	position: relative;
}
</style>