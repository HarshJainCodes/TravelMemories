<template>
	<v-app>
		<v-main
			class="w-100 h-100 d-flex align-center flex-column"
			:class="{
				'bg-black': uiMode.mode === UIMode.Dark,
			}"
		>
			<top-navigation />
			<div class="w-100 h-100">
				<router-view v-slot="{ Component }">
					<keep-alive>
						<component :is="Component"></component>
					</keep-alive>
				</router-view>
			</div>
		</v-main>
	</v-app>
</template>
<script>
import { defineComponent } from 'vue';
import { RouterView } from 'vue-router';
import TopNavigation from './components/TopNavigation.vue';
import { UIMode, useUIMode } from './stores/UIMode';

export default defineComponent({
	components: {
		RouterView,
		TopNavigation,
	},
	setup() {
		const uiMode = useUIMode();

		return {
			uiMode,
			UIMode,
		};
	},
});
</script>

<style scoped></style>
