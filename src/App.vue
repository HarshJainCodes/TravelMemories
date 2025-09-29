<template>
	<v-app>
		<v-main
			class="w-100 h-100 d-flex align-center flex-column font-settings"
			:class="{
				'bg-black': uiMode.mode === UIMode.Dark,
			}"
		>
			<top-navigation v-if="showNavBar" />
			<div class="w-100 fill-height">
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
import { defineComponent, watch, computed } from 'vue';
import { RouterView } from 'vue-router';
import TopNavigation from './components/TopNavigation.vue';
import { UIMode, useUIMode } from './stores/UIMode';
import { useRoute } from 'vue-router';

export default defineComponent({
	components: {
		RouterView,
		TopNavigation,
	},
	setup() {
		const uiMode = useUIMode();

		const route = useRoute();

		const showNavBar = computed(() => route.name !== 'login');

		return {
			uiMode,
			UIMode,
			showNavBar,
		};
	},
});
</script>

<style>
.font-settings {
	font-family: 'Geist', 'Geist fallback', sans-serif;
	position: sticky;
	top: 0;
	z-index: 5;
	backdrop-filter: blur(40px);
}
</style>
