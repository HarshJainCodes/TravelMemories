import { useQuery } from '@tanstack/vue-query';
import { computed, Ref, ref } from 'vue';
import { subscriptionDetails, tripData, tripUploadPayload } from './types';
import { useUserDetails } from '@/stores/userDetails';

// backend url
const PROD_URL = 'https://travelmemoriesbackend.harshjain17.com';
const LOCAL_URL = 'https://localhost:7221';

// chatbot url
const CHATBOT_PROD_URL = 'https://mcpservermemories.harshjain17.com';
const CHATBOT_LOCAL_URL = 'https://localhost:7210';

export const BACKEND_URL = PROD_URL;
export const CHATBOT_URL = CHATBOT_PROD_URL;

const DEFAULT_OPTIONS = {
	cacheTime: Infinity,
	staleTime: Infinity,
	refetchOnMount: false,
};

export const deleteConversationId = async (conversationId: Ref<string | null>) => {
	console.log(conversationId);
	const res = await fetch(`${BACKEND_URL}/AIChat/Delete?conversationId=${conversationId.value}`, {
		method: 'DELETE',
		credentials: 'include',
	});

	if (res.status === 204) {
		return true;
	}

	throw new Error(`Failed to delete conversation for conversation id ${conversationId}`);
};

export const getConversationMessages = async (conversationId: string) => {
	const resposne = await fetch(
		`${BACKEND_URL}/AIChat/GetMessages?conversationId=${conversationId}`,
		{
			method: 'GET',
			credentials: 'include',
		},
	);

	if (resposne.status === 200) {
		return await resposne.json();
	}
	throw new Error(`Failed to get conversation for conversation id ${conversationId}`);
};

export const getSideConversationsList = async () => {
	const response = await fetch(`${BACKEND_URL}/AIChat/Conversations`, {
		method: 'GET',
		credentials: 'include',
	});

	if (response.status === 200) {
		return await response.json();
	}
	throw new Error('Failed to fetch side conversations');
};

export const useSideConversationsList = () => {
	return useQuery({
		queryKey: ['sideConversationsList'],
		queryFn: getSideConversationsList,
		select: (data) =>
			data.sort((x, y) => new Date(y.createdAt).getTime() - new Date(x.createdAt).getTime()),
		...DEFAULT_OPTIONS,
	});
};

const getSubscriptionDetails = async (): Promise<subscriptionDetails> => {
	const response = await fetch(`${BACKEND_URL}/Subscription/GetSubscriptionDetails`, {
		method: 'GET',
		credentials: 'include',
	});

	if (response.status === 200) {
		return response.json();
	} else {
		throw new Error('Failed to fetch subscription details');
	}
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
		`${BACKEND_URL}/ImageUpload?tripTitle=${tripTitle.value}&year=${tripYear.value}&lat=${locationCoords.value.lat}&lon=${locationCoords.value.lon}`,
		{
			method: 'POST',
			body: formData,
			credentials: 'include',
		},
	);

	if (res.status === 200) {
		return await res.text();
	} else {
		throw new Error(await res.text());
	}
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

export const useSubscriptionDetails = () => {
	const userDetails = useUserDetails();
	const userEmail = computed(() => userDetails.userEmail);

	return useQuery({
		queryKey: ['subscriptionDetails', userEmail],
		queryFn: getSubscriptionDetails,
		...DEFAULT_OPTIONS,
		select: (data) => data,
		enabled: () => userEmail.value !== '',
	});
};

export const updateSubscription = async (payload) => {
	const response = await fetch(`${BACKEND_URL}/Subscription/UpdateSubscription/AdminBypass`, {
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify(payload),
		headers: {
			'Content-Type': 'application/json',
		},
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
