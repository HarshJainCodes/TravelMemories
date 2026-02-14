<template>
	<v-btn
		class="mt-5 mx-4"
		variant="tonal"
		prepend-icon="mdi-chat-plus-outline"
		@click="onClickConversation(null)"
	>
		New Chat
	</v-btn>

	<div class="w-100 mt-4 px-4 d-flex justify-start text-grey-darken-2" style="font-size: small">
		Your Chats
	</div>

	<v-list active-class="text-teal-lighten-1" density="compact">
		<v-list-item
			class="conversation-item"
			v-for="item in sideConversations"
			:key="item.conversationId"
			:active="item.conversationId === currentConversationId"
			:ripple="conversationToBeRenamed.conversationName !== null ? false : true"
			@click="(e) => onClickConversation(item.conversationId)"
		>
			<v-text-field
				v-if="conversationToBeRenamed.conversationId === item.conversationId"
				ref="inputRef"
				v-model="conversationToBeRenamed.conversationName"
				density="compact"
				@click.stop
				@keydown.space.stop
				@keydown.enter.stop
				@keydown.enter="onRenmaeConversation"
				@blur="onRenmaeConversation"
				variant="plain"
			>
			</v-text-field>
			<div v-else>
				{{ item.conversationName }}
			</div>
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

					<v-list density="compact">
						<v-list-item prepend-icon="mdi-pencil" @click="() => onClickRename(item)">
							Rename
						</v-list-item>
						<v-list-item
							prepend-icon="mdi-delete"
							@click="
								() => {
									$emit('show-delete-dialog', true);
									$emit('rename-conversation-id', item.conversationId);
								}
							"
						>
							<v-list-item-title> Delete </v-list-item-title>
						</v-list-item>
					</v-list>
				</v-menu>
			</template>
		</v-list-item>
	</v-list>
</template>

<script lang="ts">
import { defineComponent, nextTick, ref } from 'vue';

export default defineComponent({
	name: 'RecentConversations',
	props: {
		sideConversations: {
			type: Array,
			required: true,
		},
		currentConversationId: {
			type: String,
			required: true,
		},
		conversationToBeRenamed: {
			type: Object,
			required: true,
		},
	},
	emits: [
		'click-conversation',
		'click-rename',
		'rename-conversation',
		'show-delete-dialog',
		'rename-conversation-id',
	],
	setup(props, { emit }) {
		const inputRef = ref(null);

		const onClickConversation = (conversationId: string) => {
			emit('click-conversation', conversationId);
		};

		const onClickRename = (conversation) => {
			emit('click-rename', conversation);

			nextTick(() => {
				inputRef.value?.[0].$el.querySelector('input').select();
			});
		};

		const onRenmaeConversation = () => {
			emit('rename-conversation');
		};

		return {
			inputRef,
			onClickConversation,
			onClickRename,
			onRenmaeConversation,
		};
	},
});
</script>
