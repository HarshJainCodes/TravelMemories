<template>
	<div class="w-100 mt-5 d-flex justify-center text-h6">Recent Conversations</div>

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
				ref="renameInputRef"
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
import { defineComponent } from 'vue';

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
		const onClickConversation = (conversationId: string) => {
			emit('click-conversation', conversationId);
		};

		const onClickRename = (conversation) => {
			emit('click-rename', conversation);
		};

		const onRenmaeConversation = () => {
			emit('rename-conversation');
		};

		return {
			onClickConversation,
			onClickRename,
			onRenmaeConversation,
		};
	},
});
</script>
