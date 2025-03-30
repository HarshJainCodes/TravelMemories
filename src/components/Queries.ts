import { useQuery } from '@tanstack/vue-query';
import { computed, Ref, ref } from 'vue';
import { tripData, tripUploadPayload } from './types';
import { useUserDetails } from '@/stores/userDetails';

const PROD_URL = 'https://travelmemories.azurewebsites.net';
const LOCAL_URL = 'https://localhost:7221';

export const BACKEND_URL = PROD_URL;

const DEFAULT_OPTIONS = {
	cacheTime: Infinity,
	staleTime: Infinity,
	refetchOnMount: false,
};

const imageDataQueryFunc = async (): Promise<tripData[]> => {
	const response = await fetch(`${BACKEND_URL}/ImageUpload/AllTripData`, {
		method: 'GET',
		credentials: 'include',
	});

	if (!response.ok) {
		throw new Error('Failed to fetch image data');
	}

	return response.json();
};

export const uploadImageQueryFunc = async (tripData: tripUploadPayload) => {
	const { tripTitle, tripYear, locationCoords, selectedFiles } = tripData;

	const formData = new FormData();

	selectedFiles.value.forEach((file) => {
		formData.append('images', file);
	});

	const res = await fetch(
		`${PROD_URL}/ImageUpload?tripTitle=${tripTitle.value}&year=${tripYear.value}&lat=${locationCoords.value.lat}&lon=${locationCoords.value.lon}`,
		{
			method: 'POST',
			body: formData,
			credentials: 'include',
		},
	);

	return res.json();
};

const useImagesQuery = () => {
	const userDetails = useUserDetails();
	const userEmail = computed(() => userDetails.userEmail);

	return useQuery({
		queryKey: ['imageData', userEmail],
		queryFn: imageDataQueryFunc,
		...DEFAULT_OPTIONS,
		enabled: () => userEmail.value !== '',
	});
};

const selectedTrip: Ref<tripData> = ref({
	email: '',
	imageUrls: [],
	lat: 0,
	lon: 0,
	tripTitle: '',
	year: 0,
});
const showImagesOnMap = ref(false);
const lastChosenPlace = ref('');

export const useImages = () => {
	const images = useImagesQuery();

	const allTripData = computed(() => images.data.value || []);
	const tripName = computed(() => selectedTrip.value.tripTitle);
	const allTripHeading = computed(() => allTripData.value.map((x) => x.tripTitle));

	const setTrip = (trip: tripData) => {
		selectedTrip.value = trip;
	};

	return {
		allTripData,
		tripName,
		showImagesOnMap,
		allTripHeading,
		selectedTrip,
		lastChosenPlace,
		setTrip,
	};
};
