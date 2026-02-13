<template>
	<div
		class="d-flex h-100"
		:class="{
			'mx-5': !mobile,
		}"
	>
		<v-card
			v-if="!mobile"
			class="ma-5 w-25 h-100"
			style="min-height: 80vh; max-height: 80vh; overflow-y: auto"
			elevation="5"
		>
			<recent-conversations
				:side-conversations="sideConversations"
				:current-conversation-id="currentConversationId || ''"
				:conversation-to-be-renamed="conversationToBeRenamed"
				@click-conversation="onClickConversation"
				@on-rename-conversation="onRenmaeConversation"
				@show-delete-dialog="showDeleteDialog = true"
				@rename-conversation-id="conversationIdToBeDeleted = $event"
				@click-rename="onClickRename($event)"
				@rename-conversation="onRenmaeConversation"
				class="w-100"
			/>
		</v-card>
		<div
			class="ma-5 mx-auto"
			style="max-height: 80vh"
			:class="{
				'w-100': mobile,
				'w-75': !mobile,
			}"
		>
			<v-card class="w-100 h-100 d-flex flex-column position-relative" elevation="5">
				<div class="overflow-auto pt-5 h-100" ref="chatContainerRef">
					<v-icon
						v-if="mobile"
						icon="mdi-menu"
						class="position-absolute"
						@click="onClickMenuIcon"
					>
					</v-icon>

					<v-navigation-drawer v-model="openDrawer" absolute>
						<recent-conversations
							:side-conversations="sideConversations"
							:current-conversation-id="currentConversationId || ''"
							:conversation-to-be-renamed="conversationToBeRenamed"
							@click-conversation="onClickConversation"
							@on-rename-conversation="onRenmaeConversation"
							@show-delete-dialog="showDeleteDialog = true"
							@rename-conversation-id="conversationIdToBeDeleted = $event"
							@click-rename="onClickRename($event)"
							@rename-conversation="onRenmaeConversation"
							class="w-100"
						/>
					</v-navigation-drawer>
					<div
						class="h-100 mx-auto"
						:class="{
							'w-100': mobile,
							'w-75': !mobile,
						}"
					>
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
								<div v-if="!mobile">
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
								<div v-else class="h-100">
									<v-spacer></v-spacer>
									<div class="w-100 d-flex justify-center">
										<div class="text-center">
											<div class="text-h6">AI Chat</div>
											<div class="text-subtitle-1 mt-2">
												Ask AI about your travel memories
											</div>
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
							<v-icon
								:icon="
									currentlyStreamingMessages
										? 'mdi-stop-circle-outline'
										: 'mdi-send'
								"
								@click="requestStopChat"
							></v-icon>
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
import { computed, defineComponent, nextTick, Ref, ref } from 'vue';
import RenderChat from './RenderChat.vue';
import { ChatTillNow } from './types';
import { SAMPLE_PROMPTS } from './Constants';
import {
	BACKEND_URL,
	CHATBOT_URL,
	deleteConversationId,
	getConversationMessages,
	renameConversation,
} from '../Queries';
import RecentConversations from './RecentConversations.vue';
import { useChatbot } from '@/stores/chatbot';
import { storeToRefs } from 'pinia';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { useDisplay } from 'vuetify/lib/framework.mjs';

export default defineComponent({
	name: 'ChatContainer',
	components: {
		RenderChat,
		RecentConversations,
	},
	setup() {
		const { mobile } = useDisplay();
		const { currentConversationId, sideConversations, currentlyStreamingMessages } =
			storeToRefs(useChatbot());

		const chatContainerRef: Ref<HTMLElement | null> = ref(null);
		const enteredPrompt = ref('');

		const chatTillNow: Ref<Array<ChatTillNow>> = ref([]);
		const showDeleteDialog = ref(false);
		const conversationIdToBeDeleted: Ref<string | null> = ref(null);
		const conversationIdToDelete: Ref<string | null> = ref(null);

		const openDrawer = ref(false);

		const onClickMenuIcon = () => {
			openDrawer.value = !openDrawer.value;
		};

		const conversationToBeRenamed: Ref<{
			conversationId: string | null;
			conversationName: string | null;
		}> = ref({
			conversationId: null,
			conversationName: null,
		});

		const renameInputRef: Ref<HTMLElement[] | null> = ref(null);

		const queryClient = useQueryClient();

		const onClickRename = (item) => {
			conversationToBeRenamed.value = {
				conversationId: item.conversationId,
				conversationName: item.conversationName,
			};

			nextTick(() => {
				renameInputRef.value?.[0].$el.querySelector('input').select();
			});
		};

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

		const renameConversationMutation = useMutation({
			mutationFn: renameConversation,
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: ['sideConversationsList'],
				});
			},
		});

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

		const onRenmaeConversation = () => {
			renameConversationMutation.mutate({
				conversationId: conversationToBeRenamed.value.conversationId,
				newName: conversationToBeRenamed.value.conversationName,
			});

			conversationToBeRenamed.value = {
				conversationId: null,
				conversationName: null,
			};

			queryClient.invalidateQueries({
				queryKey: ['sideConversationsList'],
			});
		};

		const onDeleteConversation = () => {
			conversationIdToDelete.value = conversationIdToBeDeleted.value;
			deleteConversation.mutate(conversationIdToDelete);
		};

		const requestStopChat = async () => {
			if (!currentlyStreamingMessages.value) {
				onPressEnter();
				return;
			}

			await fetch(
				`${BACKEND_URL}/AIChat/StopChat?conversationId=${currentConversationId.value}`,
				{
					method: 'GET',
					credentials: 'include',
				},
			);
		};

		const onPressEnter = async () => {
			// send the response to the api.
			if (currentlyStreamingMessages.value) return;
			currentlyStreamingMessages.value = true;

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
				currentlyStreamingMessages.value = false;
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
			currentConversationId,
			currentlyStreamingMessages,
			conversationToBeRenamed,
			renameInputRef,
			mobile,
			openDrawer,
			onClickMenuIcon,
			onClickRename,
			onPressEnter,
			onClickExistingPrompt,
			onClickConversation,
			onDeleteConversation,
			requestStopChat,
			onRenmaeConversation,
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
