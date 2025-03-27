import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUIMode = defineStore('UIMode', () => {
	const mode = ref(UIMode.Light);

	function toggleMode() {
		if (mode.value === UIMode.Light) {
			mode.value = UIMode.Dark;
		} else {
			mode.value = UIMode.Light;
		}
	}

	return {
		mode,
		toggleMode,
	};
});

export enum UIMode {
	Light,
	Dark,
}
