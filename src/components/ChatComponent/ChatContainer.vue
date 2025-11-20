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
								<v-list-item> Delete Conversation </v-list-item>
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
</template>

<script lang="ts">
import { defineComponent, nextTick, Ref, ref } from 'vue';
import { marked } from 'marked';
import RenderChat from './RenderChat.vue';
import { ChatTillNow } from './types';
import { SAMPLE_PROMPTS } from './Constants';
import { BACKEND_URL, CHATBOT_URL, getConversationMessages } from '../Queries';
import { useChatbot } from '@/stores/chatbot';
import { storeToRefs } from 'pinia';

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
			console.log('conversation id', response.conversationId);
			currentConversationId.value = response.conversationId;
			const markdownToHtml = await marked(response.content);

			if (call.status === 200) {
				chatTillNow.value.push({
					key: 'something-random',
					isUserPrompt: false,
					stringToRender: markdownToHtml,
				});
				scrollToBottom();
			}
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
			onPressEnter,
			onClickExistingPrompt,
			onClickConversation,
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
