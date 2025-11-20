import { getSideConversationsList } from '@/components/Queries';
import { defineStore } from 'pinia';
import { onMounted, Ref, ref } from 'vue';

export const useChatbot = defineStore('chatbout-store', () => {
	const currentConversationId: Ref<string | null> = ref(null);
	const sideConversations: Ref<Array<string>> = ref([]);

	onMounted(async () => {
		// fetch the conversations from the backend
		const list = await getSideConversationsList();
		sideConversations.value = list.sort(
			(x, y) => new Date(y.createdAt) - new Date(x.createdAt),
		);
	});

	return {
		currentConversationId,
		sideConversations,
	};
});
