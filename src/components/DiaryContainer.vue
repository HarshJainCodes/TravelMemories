<template>
	<div
		class="d-flex w-100 h-100 align-center px-5"
		:class="{
			'flex-column': mobile,
		}"
	>
		<div
			class="d-flex flex-column w-100 h-100"
			:class="{
				'width-lg': mdAndUp,
				'width-sm': mobile,
			}"
		>
			<div class="w-100 d-flex justify-center">
				<v-tabs v-model="currentWindow">
					<v-tab :value="0"> Explore Map </v-tab>
					<v-tab :value="1"> Chat with AI </v-tab>
				</v-tabs>
			</div>
			<v-window class="w-100 h-100" v-model="currentWindow">
				<v-window-item :value="0" class="w-100 h-100">
					<div class="d-flex w-100 h-100">
						<map-container
							@map-instance="onReceiveMapInstance"
							@on-click-timeline="onClickTimeline"
						></map-container>

						<div
							class="d-flex rounded-xl"
							:class="{
								'timeline-lg': !mobile,
								'timeline-mobile': mobile,
							}"
						>
							<time-line @on-click-timeline="onClickTimeline" />
						</div>
					</div>
				</v-window-item>

				<v-window-item :value="1" class="w-100 h-100">
					<div class="w-100 h-100">
						<chat-container />
					</div>
				</v-window-item>
			</v-window>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onActivated, ref } from 'vue';
import MapContainer from './MapContainer.vue';
import TimeLine from './TimeLine.vue';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import { MAPBOX_FLY_DURATION } from './Constants';
import { useUserDetails } from '@/stores/userDetails';
import { useImages } from './Queries';
import mapboxgl from 'mapbox-gl';
import ChatContainer from './ChatComponent/ChatContainer.vue';

export default defineComponent({
	components: {
		MapContainer,
		TimeLine,
		ChatContainer,
	},
	setup() {
		const { mdAndUp, mdAndDown, mobile } = useDisplay();
		const mapInstance: mapboxgl.Map = ref(null);

		const currentWindow = ref(0);

		const { setTrip } = useImages();
		const userDetails = useUserDetails();

		const onReceiveMapInstance = (mapInst) => {
			mapInstance.value = mapInst;
		};

		const onClickTimeline = (imageData) => {
			setTrip(imageData);

			mapInstance.value.flyTo({
				center: [imageData.lon, imageData.lat],
				zoom: 15,
				duration: MAPBOX_FLY_DURATION,
			});
		};

		onActivated(() => {
			userDetails.reDirectIfNotLoggedIn();
		});

		return {
			mobile,
			mdAndUp,
			mdAndDown,
			userDetails,
			currentWindow,
			onReceiveMapInstance,
			onClickTimeline,
		};
	},
});
</script>

<style scoped>
.width-lg {
	width: 80%;
	/* height: 300px; */
}

.width-sm {
	width: 100%;
	/* height: 300px; */
}

.timeline-lg {
	width: 20%;
	height: 900px;
}

.timeline-mobile {
	width: 100%;
}
</style>
