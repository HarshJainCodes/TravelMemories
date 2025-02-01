import { MAPBOX_FLY_DURATION } from "@/components/Constants";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

export const useImageGallary = defineStore('image-gallary', () => {
    const selectedTrip = ref({});
    const allTripData = ref([]);
    const showImagesOnMap = ref(false);
    const lastChosenPlace = ref('');

    const tripName = computed(() => selectedTrip.value.tripTitle)
    const allTripHeading = computed(() => allTripData.value.map(x => x.tripTitle))

    const setTrip = (trip) => {
        selectedTrip.value = trip;
    }

    // this will first zoom into map and then show the images, make sure flyTime and timeout time is same!
    watch(tripName, (tN, oldTn) => {
        if (lastChosenPlace.value === tN && oldTn === undefined){
            showImagesOnMap.value = true;
            return;
        }
        if (tN !== undefined && tN !== oldTn) {
            lastChosenPlace.value = tN;
            showImagesOnMap.value = false
            setTimeout(() => {
                showImagesOnMap.value = true
            }, MAPBOX_FLY_DURATION);
        }
    })

    watch(allTripData, (atd) => {
        console.log(atd);
    })

    return {
        selectedTrip,
        tripName,
        allTripData,
        allTripHeading,
        showImagesOnMap,
        setTrip,
    }
})