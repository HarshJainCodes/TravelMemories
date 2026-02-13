import { useSideConversationsList } from '@/components/Queries';
import { defineStore } from 'pinia';
import { computed, Ref, ref } from 'vue';

export const useChatbot = defineStore('chatbout-store', () => {
	const currentConversationId: Ref<string | null> = ref(null);

	const conversations = useSideConversationsList();
	const sideConversations = computed(() => conversations.data.value || []);

	return {
		currentConversationId,
		sideConversations,
	};
});
