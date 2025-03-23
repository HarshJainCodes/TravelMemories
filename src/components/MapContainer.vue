<template>
    <div class="d-flex w-100 h-100 position-relative">
        <div id="map" class="w-100" :class="{
            'map-mobile': mobile, 'map-lg': !mobile
        }" />

        <div v-for="(trips) in groupedTripData" :key="trips.tripTitle" class="z-index-1">
            <v-list class="position-absolute overflow-y" max-height="200"
                :style="{
                    'top': trips[0].x + 'px', 'left': trips[0].y + 'px'
                }"
                v-if="trips[0].x >= 0 && trips[0].y >= 0 && trips[0].y + 10 <= mapRectBoundingBox.width && trips[0].x <= mapRectBoundingBox.height"
            >
                <v-list-item v-for="trip in trips" :key="trip.tripTitle" @click="$emit('on-click-timeline', trip)" density="compact">
                    {{ trip.tripTitle }}
                </v-list-item>
            </v-list>            
        </div>

        <image-gallary class="position-absolute imageGallary z-index-5" :class="{
            'map-mobile': mobile, 'map-lg': !mobile
        }"/>

        <div v-if="!(tripName && showImagesOnMap)" class="position-absolute d-flex w-100 h-100 align-end pa-5" style="pointer-events: none;">
            <div class="d-flex text-h6" v-if="!mobile">
                <div class="px-1">
                    Latitude: {{ mouseCoordinates.lat }}
                </div>

                <div>
                    Longitude: {{ mouseCoordinates.lng }}
                </div>
            </div>
            <div class="d-flex" v-else>
                <div class="px-1">
                    Latitude: {{ touchCoordinates.lat }}
                </div>
        
                <div>
                    Longitude: {{ touchCoordinates.lng }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { useDisplay } from 'vuetify/lib/framework.mjs';
import mapboxgl from 'mapbox-gl';
import ImageGallary from './ImageGallary.vue';
import {MapboxOverlay as DeckOverlay} from '@deck.gl/mapbox';
import { IconLayer } from '@deck.gl/layers';
import svgIcon from '../assets/logo.svg'
import { useImages } from './Queries';

export default defineComponent({
    components: {
        ImageGallary,
    },
    emits: ['map-instance', 'on-click-timeline'],
    setup(props, { emit }) {
        const { mobile } = useDisplay();
        const { allTripData, tripName, showImagesOnMap } = useImages();

        let mapRectBoundingBox = ref({
            width: 0,
            height: 0
        });

        const getTextCoords = (coords) => {
            return deckOverlay._deck.viewManager._viewports[0].project([coords[0], coords[1]])
        }

        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN
        const map = ref(null);

        const mouseCoordinates = ref({
            lng: 20, lat: 80
        })

        const touchCoordinates = ref({
            lng: 20, lat: 80
        })

        const mapCenter = ref({
            lng: 20, lat: 80
        });

        const groupedTripData = ref([]);

        const deckLayers = computed(() => [
            new IconLayer({
                id: 'places-icon',
                data: allTripData.value.filter(d => {
                    const cameraPos = mapCenter.value; // Get current map center
                    const cameraLngLat = [cameraPos.lng, cameraPos.lat];
                    if (!cameraLngLat) return true;

                    // Convert lat/lon to Mercator projection (approximation)
                    const dotProduct = cameraLngLat[0] * d.lon + cameraLngLat[1] * d.lat;
                    return dotProduct > 0; // Show only front-facing icons
                    }),
                iconAtlas: svgIcon,
                iconMapping: {
                    marker: { x: 0, y: 0, width: 256, height: 256, anchorY: 64 }
                },
                pickable: true,
                parameters: {
                    cullMode: 'front'
                },
                getIcon: d => 'marker',
                getPosition: d => [d.lon, d.lat],
                getSize: () => Math.max(map.value.getZoom() * map.value.getZoom() * 0.3, 20),
                onClick: (icon) => {
                    emit('on-click-timeline', icon.object)
                },
                onHover: ({ object }) => {document.body.style.cursor = object ? 'pointer' : 'default'},
            }),
        ])

        const deckOverlay = new DeckOverlay({
            layers: deckLayers.value,
        });

        const allTripsScreenCoords = ref({})

        const distance = (x1, y1, x2, y2) => {
            return Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1))
        }

        const groupPlacesAccordingToZoom = () => {
            groupedTripData.value = [];
            const alreadySeenPlaces = new Map();
                allTripData.value.forEach((trip, index) => {
                    const groupedArr = []
                    allTripData.value.forEach((tripOther, indexOther) => {
                        if (index !== indexOther) {
                            if (alreadySeenPlaces.get(tripOther.tripTitle)){
                                return;
                            }
                            const yourScreenCoords = getTextCoords([trip.lon, trip.lat])
                            const otherScreenCoords = getTextCoords([tripOther.lon, tripOther.lat])

                            const distanceOnMap = distance(yourScreenCoords[0], yourScreenCoords[1], otherScreenCoords[0], otherScreenCoords[1])

                            if (distanceOnMap < 100) {
                                // group together
                                alreadySeenPlaces.set(tripOther.tripTitle, true);
                                groupedArr.push({
                                    ...tripOther,
                                    x: getTextCoords([tripOther.lon, tripOther.lat])[1],
                                    y: getTextCoords([tripOther.lon, tripOther.lat])[0],
                                })
                            }
                        }
                    })
                    if (!alreadySeenPlaces.get(trip.tripTitle)){
                        groupedArr.push({
                            ...trip,
                            x: getTextCoords([trip.lon, trip.lat])[1],
                            y: getTextCoords([trip.lon, trip.lat])[0]
                        })
                    }
                    alreadySeenPlaces.set(trip.tripTitle, true);
                    if (groupedArr.length > 0){
                        groupedTripData.value.push(groupedArr)
                    }
                })
        }

        onMounted(() => {
            map.value = new mapboxgl.Map({
                container: 'map',
                interactive: true,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [80, 20],
                zoom: 3,
            })

            map.value.on('load', () => {
                mapRectBoundingBox.value = document.getElementById('map').getBoundingClientRect();
            })

            // mapbox events
            map.value.on('move', () => {
                mapCenter.value = map.value.getCenter()
                allTripsScreenCoords.value = allTripData.value.map((td) => ({
                    ...td,
                    x: getTextCoords([td.lon, td.lat])[1],
                    y: getTextCoords([td.lon, td.lat])[0],
                }))

                groupPlacesAccordingToZoom()
            })

            map.value.on('zoom', () => {       
                mapCenter.value = map.value.getCenter()
            })

            map.value.on('mousemove', (e) => {
                mouseCoordinates.value.lat = e.lngLat.lat.toFixed(6)
                mouseCoordinates.value.lng = e.lngLat.lng.toFixed(6)
            })

            map.value.on('touchmove', () => {
                touchCoordinates.value.lat = Number(mapCenter.value.lat.toFixed(4))
                touchCoordinates.value.lng = Number(mapCenter.value.lng.toFixed(4))
            })

            map.value.addControl(deckOverlay);
            map.value.addControl(new mapboxgl.NavigationControl());

            setTimeout(() => {
                allTripsScreenCoords.value = allTripData.value.map((td) => ({
                    ...td,
                    x: getTextCoords([td.lon, td.lat])[1],
                    y: getTextCoords([td.lon, td.lat])[0],
                }))

                groupPlacesAccordingToZoom()
            }, 1000); // TODO: get rid of this 1000, need to come with an efficient way here!
            emit('map-instance', map.value);
        })

        watch(deckLayers, (dl) => {
            deckOverlay.setProps({
                layers: dl,
            })
        })

        return {
            map,
            mobile,
            mapRectBoundingBox,
            showImagesOnMap,
            tripName,
            mouseCoordinates,
            touchCoordinates,
            allTripsScreenCoords,
            groupedTripData,
            getTextCoords,
        }
    },
})
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

canvas, .imageGallary {
    border-radius: 20px;
}

.customText:hover {
    cursor: pointer;
}
</style>
