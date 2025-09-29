<template>
	<div class="d-flex w-100 h-100 position-relative overflow-hidden">
		<div
			id="map"
			class="w-100"
			:class="{
				'map-mobile': mobile,
				'map-lg': !mobile,
			}"
		/>

		<div v-if="showLocationCards">
			<div v-for="(trips, index) in groupedTripData" :key="index" class="z-index-1">
				<v-list
					class="position-absolute overflow-y"
					max-height="200"
					:style="{
						top: trips[0].x + 'px',
						left: trips[0].y + 'px',
					}"
				>
					<v-list-item
						v-for="trip in trips"
						:key="trip.tripTitle"
						@click="$emit('on-click-timeline', trip)"
						density="compact"
					>
						{{ trip.tripTitle }}
					</v-list-item>
				</v-list>
			</div>
		</div>

		<image-gallary
			class="position-absolute imageGallary z-index-5"
			:class="{
				'map-mobile': mobile,
				'map-lg': !mobile,
			}"
		/>

		<div class="position-absolute d-flex align-center">
			<v-switch v-model="showLocationCards" inset color="teal-darken-1">
				<template #label>
					<div class="text-h6">Show Location Cards</div>
				</template>
			</v-switch>
		</div>

		<div
			v-if="!(tripName && showImagesOnMap)"
			class="position-absolute d-flex w-100 h-100 align-end pa-5"
			style="pointer-events: none"
		>
			<div class="d-flex text-h6" v-if="!mobile">
				<div class="px-1">Latitude: {{ mouseCoordinates.lat }}</div>

				<div>Longitude: {{ mouseCoordinates.lng }}</div>
			</div>
			<div class="d-flex" v-else>
				<div class="px-1">Latitude: {{ touchCoordinates.lat }}</div>

				<div>Longitude: {{ touchCoordinates.lng }}</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, onActivated, Ref, ref, watch } from 'vue';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import mapboxgl from 'mapbox-gl';
import ImageGallary from './ImageGallary.vue';
import { MapboxOverlay as DeckOverlay } from '@deck.gl/mapbox';
import { IconLayer } from '@deck.gl/layers';
import svgIcon from '../assets/logo.svg';
import { useImages } from './Queries';
import { tripOnMap } from './types';

export default defineComponent({
	components: {
		ImageGallary,
	},
	emits: ['map-instance', 'on-click-timeline'],
	setup(props, { emit }) {
		const { mobile } = useDisplay();
		const { allTripData, tripName, showImagesOnMap } = useImages();
		const showLocationCards = ref(true);

		mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
		const map: mapboxgl.Map = ref(null);

		const mouseCoordinates = ref({
			lng: 20,
			lat: 80,
		});

		const touchCoordinates = ref({
			lng: 20,
			lat: 80,
		});

		const mapCenter = ref({
			lng: 20,
			lat: 80,
		});

		const groupedTripData: Ref<tripOnMap[][]> = ref([]);

		const deckLayers = computed(() => [
			new IconLayer({
				id: 'places-icon',
				data: allTripData.value.filter((d) => {
					const cameraPos = mapCenter.value; // Get current map center
					const cameraLngLat = [cameraPos.lng, cameraPos.lat];
					if (!cameraLngLat) return true;

					// Convert lat/lon to Mercator projection (approximation)
					const dotProduct = cameraLngLat[0] * d.lon + cameraLngLat[1] * d.lat;
					return dotProduct > 0; // Show only front-facing icons
				}),
				iconAtlas: svgIcon,
				iconMapping: {
					marker: { x: 0, y: 0, width: 256, height: 256, anchorY: 64 },
				},
				pickable: true,
				parameters: {
					cullMode: 'front',
				},
				getIcon: (d) => 'marker',
				getPosition: (d) => [d.lon, d.lat],
				getSize: () => Math.max(map.value.getZoom() * map.value.getZoom() * 0.3, 20),
				onClick: (icon) => {
					emit('on-click-timeline', icon.object);
				},
				onHover: ({ object }) => {
					document.body.style.cursor = object ? 'pointer' : 'default';
				},
			}),
		]);

		const deckOverlay = new DeckOverlay({
			layers: deckLayers.value,
		});

		const getTextCoords = (coords: [number, number]): [number, number] => {
			return deckOverlay._deck.viewManager._viewports[0].project([coords[0], coords[1]]);
		};

		const distance = (x1: number, y1: number, x2: number, y2: number): number => {
			return Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1));
		};

		const groupPlacesAccordingToZoom = () => {
			groupedTripData.value = [];
			const alreadySeenPlaces = new Map();
			allTripData.value.forEach((trip, index) => {
				const groupedArr: tripOnMap[] = [];
				allTripData.value.forEach((tripOther, indexOther) => {
					if (index !== indexOther) {
						if (alreadySeenPlaces.get(tripOther.tripTitle)) {
							return;
						}
						const yourScreenCoords = getTextCoords([trip.lon, trip.lat]);
						const otherScreenCoords = getTextCoords([tripOther.lon, tripOther.lat]);

						const distanceOnMap = distance(
							yourScreenCoords[0],
							yourScreenCoords[1],
							otherScreenCoords[0],
							otherScreenCoords[1],
						);

						if (distanceOnMap < 100) {
							// group together
							alreadySeenPlaces.set(tripOther.tripTitle, true);
							groupedArr.push({
								...tripOther,
								x: getTextCoords([tripOther.lon, tripOther.lat])[1],
								y: getTextCoords([tripOther.lon, tripOther.lat])[0],
							});
						}
					}
				});
				if (!alreadySeenPlaces.get(trip.tripTitle)) {
					groupedArr.push({
						...trip,
						x: getTextCoords([trip.lon, trip.lat])[1],
						y: getTextCoords([trip.lon, trip.lat])[0],
					});
				}
				alreadySeenPlaces.set(trip.tripTitle, true);
				if (groupedArr.length > 0) {
					groupedTripData.value.push(groupedArr);
				}
			});
		};

		onActivated(() => {
			if (map.value) {
				const interval = setInterval(() => {
					try {
						groupPlacesAccordingToZoom();
						clearInterval(interval);
					} catch {}
				}, 10);
				return;
			}

			map.value = new mapboxgl.Map({
				container: 'map',
				interactive: true,
				style: 'mapbox://styles/mapbox/streets-v11',
				center: [80, 20],
				zoom: 3,
			});

			map.value.on('mousemove', (e) => {
				mouseCoordinates.value.lat = e.lngLat.lat.toFixed(6);
				mouseCoordinates.value.lng = e.lngLat.lng.toFixed(6);
			});

			map.value.on('zoom', () => {
				mapCenter.value = map.value.getCenter();
			});

			map.value.on('touchmove', () => {
				const mapCenter = map.value.getCenter();
				touchCoordinates.value.lat = Number(mapCenter.lat.toFixed(4));
				touchCoordinates.value.lng = Number(mapCenter.lng.toFixed(4));
			});

			map.value.on('move', () => {
				mapCenter.value = map.value.getCenter();
				groupPlacesAccordingToZoom();
			});

			map.value.addControl(deckOverlay);
			map.value.addControl(new mapboxgl.NavigationControl());

			emit('map-instance', map.value);
		});

		watch(allTripData, () => {
			const interval = setInterval(() => {
				try {
					groupPlacesAccordingToZoom();
					clearInterval(interval);
				} catch {}
			}, 10);
		});

		watch(deckLayers, (dl) => {
			deckOverlay.setProps({
				layers: dl,
			});
		});

		return {
			map,
			mobile,
			showImagesOnMap,
			tripName,
			mouseCoordinates,
			touchCoordinates,
			groupedTripData,
			showLocationCards,
		};
	},
});
</script>

<style>
.mapboxgl-ctrl {
	display: none;
}

.map-mobile {
	height: 400px;
}

.map-lg {
	height: 900px;
}

canvas,
.imageGallary {
	border-radius: 20px;
}

.customText:hover {
	cursor: pointer;
}
</style>
