<template>
    <div class="d-flex w-100 h-100 position-relative">
        <div id="map" class="w-100" :class="{
            'map-mobile': mobile, 'map-lg': !mobile
        }" />

        <image-gallary class="position-absolute imageGallary z-index-2" :class="{
            'map-mobile': mobile, 'map-lg': !mobile
        }"/>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { useDisplay } from 'vuetify/lib/framework.mjs';
import mapboxgl from 'mapbox-gl';
import ImageGallary from './ImageGallary.vue';
import {MapboxOverlay as DeckOverlay} from '@deck.gl/mapbox';
import { IconLayer } from '@deck.gl/layers';
import { useImageGallary } from '@/stores/imageGallary';
import svgIcon from '../assets/logo.svg'

export default defineComponent({
    components: {
        ImageGallary,
    },
    emits: ['map-instance', 'on-click-timeline'],
    setup(props, { emit }) {
        const { mobile } = useDisplay();
        const imageGallary = useImageGallary();

        let deckOverlay;

        const map = ref(null);
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

        const mapCenter = ref([]);

        const deckLayers = computed(() => [
            new IconLayer({
                id: 'places-icon',
                data: imageGallary.allTripData.filter(d => {
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
                getSize: () => Math.max(map.value.getZoom() * map.value.getZoom() * 0.8, 20),
                onClick: (icon) => {
                    emit('on-click-timeline', icon.object)
                },
                onHover: ({ object }) => {document.body.style.cursor = object ? 'pointer' : 'default'},
            })
        ])

        onMounted(() => {
            map.value = new mapboxgl.Map({
                container: 'map',
                interactive: true,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [80, 20],
                zoom: 5,
            })

            map.value.on('move', () => {
                mapCenter.value = map.value.getCenter()
            })

            map.value.on('zoom', () => {       
                mapCenter.value = map.value.getCenter()
            })

            deckOverlay = new DeckOverlay({
                layers: deckLayers.value,
            });

            map.value.addControl(deckOverlay);
            map.value.addControl(new mapboxgl.NavigationControl());
            emit('map-instance', map.value);
        })

        watch(deckLayers, (dl) => {
            deckOverlay.setProps({
                layers: dl,
            })
        })

        return {
            mobile,
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
</style>
