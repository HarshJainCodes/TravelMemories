<template>
    <div class="w-100 h-100 d-flex align-center flex-column">

        <v-card class="w-50 h-100" elevation="4" :class="{
            'w-75': mobile
        }">
            <div :class="{
                'w-50 mx-auto' : !mobile
            }">
                <v-autocomplete v-model="tripTitle" label="Trip Title" class="pa-5" :items="imageGallary.allTripHeading"
                    @update:search="onSearchValueChanged"
                    @update:model-value="onClickExistingTripName"
                    hide-no-data
                ></v-autocomplete>

                <v-text-field v-model="tripYear" label="Year" type="number" class="pa-5"></v-text-field>

                <div class="d-flex pa-5 flex-column">
                    Location Coordinates
                    <div class="d-flex">
                        <v-text-field class="mx-1" type="number" label="locationX" v-model="locationCoords.lat"></v-text-field>
                        <v-text-field label="locationY" type="number" v-model="locationCoords.lon"></v-text-field>
                    </div>
                </div>
    
                <div class="d-flex w-100 justify-center flex-column">
                    <div class="pa-5" style="border: 2px dotted green;">
                        <label for="input">Upload your photos here</label>
                        <input class="pa-1" type="file" accept="image/*" multiple @change="onFilesChanged">
                    </div>
                    <v-btn class="ma-2" @click="onUploadImage">
                        Upload Images
                    </v-btn>
                </div>
            </div>         
        </v-card>
    </div>
</template>

<script>
import { useImageGallary } from '@/stores/imageGallary';
import { defineComponent, ref, watch } from 'vue'
import { TYPE, useToast } from 'vue-toastification';
import { useDisplay } from 'vuetify/lib/framework.mjs';

export default defineComponent({
    setup() {
        const { mobile } = useDisplay();
        const imageGallary = useImageGallary();
        const toast = useToast()

        const tripTitle = ref('');
        const tripYear = ref(0);
        const locationCoords = ref({
            lat: null,
            lon: null,
        })
        const selectedFiles = ref([]);

        const onFilesChanged = (event) => {
            selectedFiles.value = Array.from(event.target.files);
        }

        const onUploadImage = async () => {
            if (selectedFiles.value.length === 0){
                toast('Select Atleast one image', {
                    type: TYPE.ERROR
                })
                return;
            }

            const formData = new FormData();

            selectedFiles.value.forEach((file) => {
                formData.append('images', file);
            })

            const req = await fetch(`https://travelmemories.azurewebsites.net/ImageUpload?tripTitle=${tripTitle.value}&year=${tripYear.value}&lat=${locationCoords.value.lat}&lon=${locationCoords.value.lon}`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            })

            if (req.status === 200){
                toast('Images Uploaded Successfully', {
                    type: TYPE.SUCCESS,
                })
            }else{
                toast('Some error occured in uploading the image', {
                    type: TYPE.ERROR
                })
            }
        }

        const onSearchValueChanged = (title) => {
            tripTitle.value = title
        }

        const onClickExistingTripName = (name) => {
            const existingTrip = imageGallary.allTripData.find(x => x.tripTitle == name);
            if (existingTrip != undefined) {
                locationCoords.value.lat = existingTrip.lat;
                locationCoords.value.lon = existingTrip.lon;
                tripYear.value = existingTrip.year
            }
        }

        return {
            tripTitle,
            tripYear,
            imageGallary,
            locationCoords,
            mobile,
            onFilesChanged,
            onUploadImage,
            onSearchValueChanged,
            onClickExistingTripName
        }
    },
})
</script>


<style scoped>

</style>