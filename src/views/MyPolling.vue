<template>
	<div id="create" style="height: 100%">
		<v-speed-dial
			:top="false"
			:bottom="true"
			:right="true"
			:left="false"
			class="mb-12"
		>
			<template v-slot:activator>
				<v-btn color="prim-grad" dark fab :to="{name:'new.poll'}">
					<v-icon> mdi-plus </v-icon>
				</v-btn>
			</template>
		</v-speed-dial>

		<v-subheader
			class="pa-0 ma-0 noselect"
			style="font-size: 1.2rem; font-weight: 500; color: #f0f8ff"
			>My Polling List</v-subheader
		>

		<v-sheet class="overflow-y-auto" color="transparent" max-height="81.7vh">
			<v-card
				tile
				class="pa-2 noselect mb-2"
				v-for="(polling, i) in pollings"
				:key="i"
				v-ripple
			>
				<div class="d-flex justify-space-between align-center">
					<div style="max-width: 80%">
						<div
							style="font-size: 1.2rem; font-weight: 600; max-width: 100%"
							class="ellipsis-text"
						>
							{{ polling.title }}
						</div>
						<div style="font-size: 0.9rem">{{ polling.total }} Vote</div>
					</div>
					<div>
						<v-avatar tile size="60">
							<v-img src="https://picsum.photos/id/11/500/300"></v-img>
						</v-avatar>
					</div>
				</div>
			</v-card>
		</v-sheet>
	</div>
</template>

<script>
export default {
	data() {
		return {
			pollings: [
				{
					title: "Polling Title Example",
					total: 4,
				},
				{
					title:
						"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
					total: 4,
				},
				{
					title:
						"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,",
					total: 4,
				},
				{
					title: "Polling Title Example",
					total: 4,
				},
				{
					title:
						"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
					total: 4,
				},
				{
					title:
						"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,",
					total: 4,
				},
				{
					title: "Polling Title Example",
					total: 4,
				},
				{
					title:
						"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
					total: 4,
				},
				{
					title:
						"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,",
					total: 4,
				},
			],
		};
	},
};
</script>

<style>
#create .v-speed-dial {
	position: absolute;
}

#create .v-btn--floating {
	position: relative;
}
</style>