<template>
	<div class="w-100 h-100 d-flex flex-column">
		<v-timeline v-if="allTripData.length" side="end" class="w-100 pr-4 overflow-y-scroll timeline-scroll-behaviour">
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
        <div v-else class="h-100 w-100">
            <div class="d-flex h-100 justify-center align-center flex-column">
                <div class="w-100">
                    <v-img class="w-100" :src="no_image">
                    </v-img>
                </div>
                <div class="d-flex justify-center align-center mt-5">
                    <v-btn variant="outlined" color="teal-lighten-1" @click="onClickUploadFirstImage">
                        Upload Image
                    </v-btn>
                </div>
            </div>
        </div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useImages } from './Queries';
import { tripData } from './types';
import no_image from '@/assets/images/no_image.png'
import { useRouter } from 'vue-router';

export default defineComponent({
	emits: ['on-click-timeline'],
	setup(props, { emit }) {
		const { allTripData } = useImages();
        const router = useRouter();

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

        const onClickUploadFirstImage = () => {
            router.push('/Upload')
        }

		return {
			allTripData,
            no_image,
			onClickTimelineCard,
			transformTitleIfShort,
            onClickUploadFirstImage,
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
