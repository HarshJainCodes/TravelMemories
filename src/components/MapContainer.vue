<template>
    <div class="d-flex w-100 h-100">
        <div id="map" class="w-100" :class="{
            'map-mobile': mobile, 'map-lg': !mobile
        }">
        </div>
    </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import { useDisplay } from 'vuetify/lib/framework.mjs';
import mapboxgl from 'mapbox-gl';

export default defineComponent({
    emits: ['map-instance'],
    setup(props, { emit }) {
        const { mobile } = useDisplay();

        const map = ref(null);
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

        onMounted(() => {
            map.value = new mapboxgl.Map({
                container: 'map',
                interactive: true,
                style: 'mapbox://styles/mapbox/streets-v11',
            })

            emit('map-instance', map.value);

            console.log(import.meta.env)
        })

        return {
            mobile
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

canvas {
    border-radius: 20px;
}
</style>
