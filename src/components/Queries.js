import { useQuery } from "@tanstack/vue-query";
import { computed, ref } from "vue";

const DEFAULT_OPTIONS = {
    cacheTime: Infinity,
    staleTime: Infinity,
    refetchOnMount: false,
}

const imageDataQueryFunc = async () => {
    const response = await fetch('https://travelmemories.azurewebsites.net/ImageUpload/AllTripData', {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error("Failed to fetch image data");
    }

    return response.json();
};

export const uploadImageQueryFunc = async (tripData) => {
    const { tripTitle, tripYear, locationCoords, selectedFiles } = tripData;

    const formData = new FormData();

    selectedFiles.value.forEach((file) => {
        formData.append('images', file);
    })

    await fetch(`https://travelmemories.azurewebsites.net/ImageUpload?tripTitle=${tripTitle.value}&year=${tripYear.value}&lat=${locationCoords.value.lat}&lon=${locationCoords.value.lon}`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
    })
}

const useImagesQuery = () => {
    return useQuery({
        queryKey: ['imageData'],
        queryFn: imageDataQueryFunc,
        ...DEFAULT_OPTIONS,
    })
}

const selectedTrip = ref({});
const showImagesOnMap = ref(false);
const lastChosenPlace = ref('');

export const useImages = () => {
    const images = useImagesQuery();

    const allTripData = computed(() => images.data.value || []);
    const tripName = computed(() => selectedTrip.value.tripTitle);
    const allTripHeading = computed(() => allTripData.value.map(x => x.tripTitle))

    const setTrip = (trip) => {
        selectedTrip.value = trip;
    }

    return {
        allTripData,
        tripName,
        showImagesOnMap,
        allTripHeading,
        selectedTrip,
        lastChosenPlace,
        setTrip
    }
}