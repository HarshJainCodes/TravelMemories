<template>
	<div v-if="isUserPrompt">
		<div class="d-flex w-100 justify-end my-5">
			<div class="w-75 d-flex justify-end">
				<v-card class="rounded-xl bg-teal-lighten-5 pa-4">
					{{ stringToRender }}
				</v-card>
			</div>
		</div>
	</div>
	<div v-else>
		<div class="d-flex mt-5 w-100">
			<div class="h-100">
				<v-icon icon="mdi-creation"></v-icon>
			</div>
			<div class="w-75 h-100 ml-3">
				<div v-html="markdownToHtml"></div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';
import { marked } from 'marked';

export default defineComponent({
	name: 'RenderCHat',
	props: {
		isUserPrompt: {
			type: Boolean,
			required: true,
		},
		stringToRender: {
			type: String,
			required: true,
		},
	},
	setup(props) {
		const { stringToRender } = toRefs(props);

		const markdownToHtml = marked(stringToRender.value);

		return {
			markdownToHtml,
		};
	},
});
</script>
