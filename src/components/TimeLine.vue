<template>
    <div class="w-100 h-100 d-flex flex-column overflow-y-scroll timeline-scroll-behaviour">
        <v-timeline v-if="timelineData.length" side="end" class="w-100 pr-4">
            <v-timeline-item class="w-100" v-for="imageData in timelineData" :key="imageData.tripTitle" size="small">
                <div class="w-100 h-100">
                    <div class="text-h6 w-100">{{ transformTitleIfShort(imageData.tripTitle) }} </div>
                    <v-card class="w-100" height="200" @click="onClickTimelineCard(imageData)">
                        <v-img class="w-100 h-100" :src="imageData.imageUrls[0]">

                        </v-img>
                    </v-card>
                </div>
            </v-timeline-item>
      </v-timeline>
    </div>
</template>

<script lang="ts">
import { useImageGallary } from '@/stores/imageGallary';
import { defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
    emits: ['on-click-timeline'],
    setup(props, { emit }) {
        const timelineData = ref([]);
        const imageGallary = useImageGallary();

        const transformTitleIfShort = (title: string) => {
            if (title.length < 20){
                const remaining = 20 - title.length;
                let updatedTitle = ""
                for (var i = 0; i < remaining / 2; i++){
                    updatedTitle += '-'
                }
                updatedTitle += title;
                for (var i = 0; i < remaining / 2; i++){
                    updatedTitle += '-'
                }
                return updatedTitle
            }
            return title;
        }

        const onClickTimelineCard = (imageData) => {
            window.scrollTo({
                behavior: 'smooth',
                top: 0,
                left: 0,
            });
            emit('on-click-timeline', imageData);
        }

        onMounted(async () => {
            const allImageReq = await fetch('https://travelmemories.azurewebsites.net/ImageUpload/AllTripData', {
                method: 'GET'
            });

            if (allImageReq.status === 200){
                const allImageData = await allImageReq.json();

                timelineData.value = allImageData;
                imageGallary.allTripData = allImageData;
            }
        })

        return {
            timelineData,
            onClickTimelineCard,
            transformTitleIfShort,
        }
    },
})
</script>

<style scoped>
.timeline-scroll-behaviour {
    scrollbar-color: #4DB6AC white;
    scrollbar-width: thin;
}
</style>
