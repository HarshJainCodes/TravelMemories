<template>
	<div
		v-if="tripName && showImagesOnMap"
		class="d-flex flex-column w-100 h-100 blurred-overlay pa-5"
	>
		<!-- this will be the heading  -->
		<div class="d-flex w-100">
			<v-spacer />
			<div
				:class="{
					'text-h4': !mobile,
					'text-h6': mobile,
				}"
			>
				{{ tripName }}
			</div>
			<v-spacer />
			<v-icon icon="mdi-close" @click="onClickCloseIcon" size="x-large"> </v-icon>
		</div>

		<v-window v-model="currWindow" class="w-100 fill-height" :show-arrows="!mobile">
			<v-window-item class="w-100 h-100" v-for="url in selectedTrip.imageUrls" :key="url">
				<v-img :src="url">
					<template #placeholder>
						<div class="w-100 h-100 d-flex justify-center align-center">
							<v-progress-circular indeterminate color="grey-lighten-4" />
						</div>
					</template>
				</v-img>
			</v-window-item>
		</v-window>
		<div class="d-flex w-100 justify-center">
			<v-tabs class="mx-auto d-flex justify-center" v-model="currWindow" center-active>
				<v-tab v-for="x in selectedTrip.imageUrls.length" :key="x" density="compact">
					{{ x }}
				</v-tab>
			</v-tabs>
		</div>
	</div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import { MAPBOX_FLY_DURATION } from './Constants';
import { useImages } from './Queries';

export default defineComponent({
	props: {
		images: {
			required: false,
			type: Array,
		},
	},
	setup() {
		const currWindow = ref(0);
		const { selectedTrip, tripName, showImagesOnMap, lastChosenPlace, setTrip } = useImages();
		const { mobile } = useDisplay();

		const onClickCloseIcon = () => {
			setTrip({});
		};

		watch(selectedTrip, () => {
			currWindow.value = 0;
		});

		// this will first zoom into map and then show the images, make sure flyTime and timeout time is same!
		watch(tripName, (tN, oldTn) => {
			if (lastChosenPlace.value === tN && oldTn === undefined) {
				showImagesOnMap.value = true;
				return;
			}

			if (tN !== undefined && tN !== oldTn) {
				lastChosenPlace.value = tN;
				showImagesOnMap.value = false;
				setTimeout(() => {
					showImagesOnMap.value = true;
				}, MAPBOX_FLY_DURATION);
			}
		});

		return {
			currWindow,
			selectedTrip,
			showImagesOnMap,
			mobile,
			tripName,
			onClickCloseIcon,
		};
	},
});
</script>

<style scoped>
.blurred-overlay {
	backdrop-filter: blur(5px);
}
</style>
