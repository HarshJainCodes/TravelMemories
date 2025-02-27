<template>
    <div  v-if="imageGallary.tripName && imageGallary.showImagesOnMap" class="d-flex flex-column w-100 h-100 blurred-overlay pa-5">
        <!-- this will be the heading  -->
        <div class="d-flex w-100">
            <v-spacer />
            <div :class="{
                'text-h4' : !mobile,
                'text-h6' : mobile
            }">
                {{ imageGallary.tripName }}
            </div>
            <v-spacer />
            <v-icon icon="mdi-close" @click="onClickCloseIcon" size="x-large">
            </v-icon>
        </div>

        <v-window v-model="currWindow" class="w-100 fill-height" :show-arrows="!mobile">
            <v-window-item class="w-100 h-100" v-for="url in imageGallary.selectedTrip.imageUrls" :key="url">
                <v-img :src="url">
                    <template #placeholder>
                        <div class="w-100 h-100 d-flex justify-center align-center">
                            <v-progress-circular 
                                indeterminate
                                color="grey-lighten-4" 
                            />
                        </div>
                    </template>
                </v-img>
            </v-window-item>
        </v-window>
        <div class="d-flex w-100 justify-center">
            <v-tabs class="mx-auto d-flex justify-center" v-model="currWindow" center-active>
                <v-tab v-for="x in imageGallary.selectedTrip.imageUrls.length" :key="x" density="compact">
                    {{ x }}
                </v-tab>
            </v-tabs>
        </div>
    </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import { useImageGallary } from '@/stores/imageGallary';
import { useDisplay } from 'vuetify/lib/framework.mjs';

export default defineComponent({
    props: {
        images: {
            required: false,
            type: Array,
        }
    },
    setup() {
        const currWindow = ref(0);
        const imageGallary = useImageGallary();
        const { mobile } = useDisplay();

        const onClickCloseIcon = () => {
            imageGallary.setTrip({});
        }

        watch(() => imageGallary.selectedTrip, () => {
            currWindow.value = 0;
        })

        return {
            currWindow,
            imageGallary,
            mobile,
            onClickCloseIcon
        }
    },
})
</script>

<style scoped>
.blurred-overlay{
    backdrop-filter: blur(5px);
}
</style>