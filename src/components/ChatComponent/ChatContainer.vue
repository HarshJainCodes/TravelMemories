<template>
	<div class="d-flex mx-5">
		<v-card
			class="ma-5 w-25 h-100"
			style="min-height: 80vh; max-height: 80vh; overflow-y: auto"
			elevation="5"
		>
			<div class="ma-3 w-100 d-flex justify-center text-h6">Recent Conversations</div>
			<v-list>
				<v-list-item
					class="conversation-item"
					v-for="item in sideConversations"
					:key="item.conversationId"
					@click="(e) => onClickConversation(item.conversationId)"
				>
					{{ item.conversationName }}

					<template #append>
						<v-menu>
							<template #activator="{ props }">
								<v-icon
									class="hover-icon"
									icon="mdi-dots-vertical"
									v-bind="props"
									@click.prevent
								></v-icon>
							</template>

							<v-list>
								<v-list-item
									@click="
										() => {
											showDeleteDialog = true;
											conversationIdToBeDeleted = item.conversationId;
										}
									"
								>
									Delete Conversation
								</v-list-item>
							</v-list>
						</v-menu>
					</template>
				</v-list-item>
			</v-list>
		</v-card>
		<div class="w-75 bg-green ma-5 mx-auto" style="max-height: 80vh">
			<v-card class="w-100 h-100 d-flex flex-column" elevation="5">
				<div class="overflow-auto pt-5 h-100" ref="chatContainerRef">
					<div class="w-75 mx-auto">
						<div class="d-flex justify-center flex-column">
							<div v-if="chatTillNow.length">
								<render-chat
									v-for="chat in chatTillNow"
									:key="chat.key"
									:is-user-prompt="chat.isUserPrompt"
									:string-to-render="chat.stringToRender"
								/>
							</div>
							<div v-else>
								<div class="w-100 d-flex justify-center">
									Ask AI about your travel
								</div>

								<div class="w-100 mt-5">
									<div
										class="w-50 rounded-xl pa-5"
										style="border: 1px dashed green"
									>
										Sample Prompts
										<div
											class="w-100 d-flex flex-column"
											v-for="prompt in SAMPLE_PROMPTS"
											:key="prompt"
										>
											<v-btn
												class="my-1"
												variant="outlined"
												@click="onClickExistingPrompt(prompt)"
											>
												{{ prompt }}
											</v-btn>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="w-75 d-flex justify-center align-end mx-auto py-5">
					<v-card class="w-100 d-flex flex-column pa-5 rounded-xl" elevation="5">
						<v-textarea
							v-model="enteredPrompt"
							placeholder="Enter Your Prompt Here"
							variant="plain"
							max-rows="5"
							rows="1"
							auto-grow
							class="w-100"
							@keydown.enter.exact.prevent="onPressEnter"
						>
						</v-textarea>
						<div class="w-100 d-flex">
							<v-icon icon="mdi-plus" class="mx-2" @click="() => {}"></v-icon>
							<v-icon icon="mdi-tune" class="mx-2" @click="() => {}"></v-icon>
							<v-spacer></v-spacer>
							<v-icon icon="mdi-send"></v-icon>
						</div>
					</v-card>
				</div>
			</v-card>
		</div>
	</div>

	<v-dialog v-model="showDeleteDialog" persistent max-width="400">
		<v-card title="Delete Conversation ?" text="This will delete the conversation permanently.">
			<template #append>
				<v-icon icon="mdi-close" @click="showDeleteDialog = false"> </v-icon>
			</template>
			<template #actions>
				<v-btn @click="showDeleteDialog = false"> Cancel </v-btn>

				<v-btn color="red" variant="flat" @click="onDeleteConversation"> Delete </v-btn>
			</template>
		</v-card>
	</v-dialog>
</template>

<script lang="ts">
import { defineComponent, nextTick, Ref, ref } from 'vue';
import RenderChat from './RenderChat.vue';
import { ChatTillNow } from './types';
import { SAMPLE_PROMPTS } from './Constants';
import {
	BACKEND_URL,
	CHATBOT_URL,
	deleteConversationId,
	getConversationMessages,
} from '../Queries';
import { useChatbot } from '@/stores/chatbot';
import { storeToRefs } from 'pinia';
import { useMutation, useQueryClient } from '@tanstack/vue-query';

export default defineComponent({
	name: 'ChatContainer',
	components: {
		RenderChat,
	},
	setup() {
		const { currentConversationId, sideConversations } = storeToRefs(useChatbot());

		const chatContainerRef: Ref<HTMLElement | null> = ref(null);
		const enteredPrompt = ref('');

		const chatTillNow: Ref<Array<ChatTillNow>> = ref([]);
		const showDeleteDialog = ref(false);
		const conversationIdToBeDeleted: Ref<string | null> = ref(null);
		const conversationIdToDelete: Ref<string | null> = ref(null);

		const queryClient = useQueryClient();

		const scrollToBottom = () => {
			if (chatContainerRef.value !== null) {
				nextTick(() => {
					chatContainerRef.value!.scrollTo({
						top: chatContainerRef.value!.scrollHeight,
						behavior: 'smooth',
					});
				});
			}
		};

		// useDeleteConversation(conversationIdToDelete);

		const deleteConversation = useMutation({
			mutationFn: deleteConversationId,
			onSuccess: () => {
				if (currentConversationId.value === conversationIdToDelete.value) {
					chatTillNow.value = [];
					currentConversationId.value = null;
				}

				conversationIdToDelete.value = null;
				conversationIdToBeDeleted.value = null;
				showDeleteDialog.value = false;

				queryClient.invalidateQueries({
					queryKey: ['sideConversationsList'],
				});
			},
		});

		const onDeleteConversation = () => {
			conversationIdToDelete.value = conversationIdToBeDeleted.value;
			deleteConversation.mutate(conversationIdToDelete);
		};

		const onPressEnter = async () => {
			// send the response to the api.

			chatTillNow.value.push({
				key: 'something-random',
				isUserPrompt: true,
				stringToRender: enteredPrompt.value,
			});
			scrollToBottom();

			const call = await fetch(`${BACKEND_URL}/AIChat`, {
				method: 'POST',
				credentials: 'include',
				body: JSON.stringify({
					prompt: enteredPrompt.value,
					conversationId: currentConversationId.value,
				}),
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
				},
			});
			enteredPrompt.value = '';

			const response = await call.json();

			if (currentConversationId.value === null) {
				queryClient.invalidateQueries({
					queryKey: ['sideConversationsList'],
				});
			}
			currentConversationId.value = response.conversationId;

			chatTillNow.value.push({
				key: new Date().toISOString(), // TODO: get individual message id for this
				isUserPrompt: false,
				stringToRender: '',
			});
			const eventSource = new EventSource(
				`${BACKEND_URL}/AIChat/StreamResponse?conversationId=${response.conversationId}`,
				{
					withCredentials: true,
				},
			);

			let eventSourceResponse = '';
			eventSource.onmessage = async (message) => {
				if (!message.data) return;
				eventSourceResponse += message.data;

				chatTillNow.value.pop();
				chatTillNow.value.push({
					key: new Date().toISOString(), // TODO: get individual message id for this
					isUserPrompt: false,
					stringToRender: eventSourceResponse,
				});
				scrollToBottom();
			};

			eventSource.addEventListener('done', () => {
				eventSource.close();
			});
		};

		const onClickConversation = async (conversationId) => {
			currentConversationId.value = conversationId;
			let messages = await getConversationMessages(conversationId);

			messages = messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

			chatTillNow.value = messages.map((message) => ({
				key: message.messageId,
				isUserPrompt: message.role === 'user',
				stringToRender: message.message,
			}));

			scrollToBottom();
		};

		const onClickExistingPrompt = (prompt: string) => {
			enteredPrompt.value = prompt;
			onPressEnter();
		};

		return {
			chatContainerRef,
			enteredPrompt,
			chatTillNow,
			SAMPLE_PROMPTS,
			sideConversations,
			showDeleteDialog,
			conversationIdToBeDeleted,
			onPressEnter,
			onClickExistingPrompt,
			onClickConversation,
			onDeleteConversation,
		};
	},
});
</script>

<style scoped>
.conversation-item .hover-icon {
	opacity: 0;
}

.conversation-item:hover .hover-icon {
	opacity: 1;
}
</style>
