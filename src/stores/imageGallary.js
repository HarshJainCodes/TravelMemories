import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useImageGallary = defineStore('image-gallary', () => {
    const selectedTrip = ref({});
    const allTripData = ref([]);

    const tripName = computed(() => selectedTrip.value.tripTitle)
    const allTripHeading = computed(() => allTripData.value.map(x => x.tripTitle))

    const setTrip = (trip) => {
        selectedTrip.value = trip;
    }

    return {
        selectedTrip,
        tripName,
        allTripData,
        allTripHeading,
        setTrip,
    }
})