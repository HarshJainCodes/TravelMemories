<template>
	<v-app>
		<v-main>
			<div class="w-100 ma-5">
				<router-view />
			</div>
		</v-main>
	</v-app>
</template>
<script>
import { defineComponent } from 'vue';
import { RouterView } from 'vue-router';

export default defineComponent({
	components: {
		RouterView,
	}
})

</script>

<style scoped>
</style>
