<template>
    <div class="d-flex w-100 h-100 align-center ma-5" v-if="userDetails.isLoggedIn" :class="{
        'flex-column': mobile
    }">
        <div class="d-flex" :class="{
            'width-lg': mdAndUp,
            'width-sm': mobile
        }">
            <map-container 
                @map-instance="onReceiveMapInstance" 
                @on-click-timeline="onClickTimeline"
            ></map-container>
        </div>

        <div class="d-flex rounded-xl" :class="{
            'timeline-lg': !mobile,
            'timeline-mobile': mobile,
        }">
            <time-line @on-click-timeline="onClickTimeline" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onActivated, ref } from 'vue'
import MapContainer from './MapContainer.vue';
import TimeLine from './TimeLine.vue';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import { useImageGallary } from '@/stores/imageGallary';
import { MAPBOX_FLY_DURATION } from './Constants';
import { useUserDetails } from '@/stores/userDetails';

export default defineComponent({
    components: {
        MapContainer,
        TimeLine,
    },
    setup() {
        const { mdAndUp, mdAndDown, mobile } = useDisplay()
        const mapInstance = ref(null);
        
        const imageGallary = useImageGallary();
        const userDetails = useUserDetails();

        const onReceiveMapInstance = (mapInst) => {
            mapInstance.value = mapInst;
        }

        const onClickTimeline = (imageData) => {
            imageGallary.setTrip(imageData);

            mapInstance.value.flyTo({
                center: [imageData.lon, imageData.lat],
                zoom: 8,
                duration: MAPBOX_FLY_DURATION,
            })
        }

        onActivated(() => {
            userDetails.reDirectIfNotLoggedIn();
        })

        return {
            mobile,
            mdAndUp,
            mdAndDown,
            userDetails,
            onReceiveMapInstance,
            onClickTimeline,
        }
    },
})
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