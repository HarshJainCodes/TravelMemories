<template>
	<div class="w-100 h-100 d-flex flex-column overflow-y-scroll timeline-scroll-behaviour">
		<v-timeline v-if="allTripData.length" side="end" class="w-100 pr-4">
			<v-timeline-item
				class="w-100"
				v-for="imageData in allTripData"
				:key="imageData.tripTitle"
				size="small"
			>
				<div class="w-100 h-100">
					<div class="text-h6 w-100">
						{{ transformTitleIfShort(imageData.tripTitle) }}
					</div>
					<v-card class="w-100" height="200" @click="onClickTimelineCard(imageData)">
						<v-img class="w-100 h-100" :src="imageData.imageUrls[0]">
							<template #placeholder>
								<div class="w-100 h-100 d-flex justify-center align-center">
									<v-progress-circular indeterminate color="teal-lighten-3" />
								</div>
							</template>
						</v-img>
					</v-card>
				</div>
			</v-timeline-item>
		</v-timeline>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useImages } from './Queries';
import { tripData } from './types';

export default defineComponent({
	emits: ['on-click-timeline'],
	setup(props, { emit }) {
		const { allTripData } = useImages();

		const transformTitleIfShort = (title: string) => {
			if (title.length < 20) {
				const remaining = 20 - title.length;
				let updatedTitle = '';
				for (var i = 0; i < remaining / 2; i++) {
					updatedTitle += '-';
				}
				updatedTitle += title;
				for (var i = 0; i < remaining / 2; i++) {
					updatedTitle += '-';
				}
				return updatedTitle;
			}
			return title;
		};

		const onClickTimelineCard = (imageData: tripData) => {
			window.scrollTo({
				behavior: 'smooth',
				top: 0,
				left: 0,
			});
			emit('on-click-timeline', imageData);
		};

		return {
			allTripData,
			onClickTimelineCard,
			transformTitleIfShort,
		};
	},
});
</script>

<style scoped>
.timeline-scroll-behaviour {
	scrollbar-color: #4db6ac white;
	scrollbar-width: thin;
}
</style>
