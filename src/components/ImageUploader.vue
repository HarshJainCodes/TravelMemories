<template>
    <div class="w-100 h-100 d-flex align-center flex-column pa-5">

        <v-card class="w-50 h-100" elevation="4" :class="{
            'w-100': mobile,
        }">
            <div :class="{
                'w-75 mx-auto' : !mobile
            }">
                <v-autocomplete v-model="tripTitle" label="Select Trip" class="pa-5" :items="imageGallary.allTripHeading"
                    @update:search="onSearchValueChanged"
                    @update:model-value="onClickExistingTripName"
                    hide-no-data
                    data-qa-id="trip-title-searchbar"
                ></v-autocomplete>

                <v-text-field v-model="tripYear" label="Year" class="pa-5" data-qa-id="trip-year"></v-text-field>
                
                <div class="w-100 pa-5" :class="{
                    'map-height': !mobile,
                    'map-height-mobile': mobile
                }">
                    <div id="map-container-image-uploader" class="w-100 h-100 d-flex justify-center">
                        <div class="pa-2 ma-3 text-green bg-white position-absolute d-flex justify-center">
                            Select / Click Location On Map
                        </div>
                    </div>
                </div>

                <div class="pa-5">
                    <v-file-upload
                        data-qa-id="file-upload"
                        class="pa-5"
                        v-model="selectedFiles"
                        multiple
                        clearable
                        accept="image/*"
                        show-size
                        :density="mobile ? 'comfortable' : 'default'"
                        @update:model-value="onFilesChanged"
                    >
                        <template #title>
                            Upload Images Here
                        </template>
                    </v-file-upload>
                    <div class="d-flex w-100 justify-center">
                        <v-btn class="ma-5 mx-auto" @click="onUploadImage" data-qa-id="upload-images">
                            Upload Images
                        </v-btn>
                    </div>
                </div>
            </div>         
        </v-card>
    </div>
</template>

<script>
import { useImageGallary } from '@/stores/imageGallary';
import { useUserDetails } from '@/stores/userDetails';
import mapboxgl from 'mapbox-gl';
import { defineComponent, onMounted, ref, watch } from 'vue'
import { TYPE, useToast } from 'vue-toastification';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import { MAPBOX_FLY_DURATION } from './Constants';

export default defineComponent({
    setup() {
        const { mobile } = useDisplay();
        const imageGallary = useImageGallary();
        const toast = useToast()
        const userDetails = useUserDetails();

        const tripTitle = ref('');
        const tripYear = ref(0);
        const locationCoords = ref({
            lat: null,
            lon: null,
        })
        const selectedFiles = ref([]);

        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN
        const map = ref(null);

        const onFilesChanged = (files) => {
            files.forEach((file) => {
                if (!(file.type.startsWith('image') || (file.name.endsWith('.HEIC')))) {
                    toast("Only Images are supported", {
                        type: TYPE.ERROR
                    })
                    selectedFiles.value = [];
                    return;
                }
            })
        }

        const onUploadImage = async () => {
            if (selectedFiles.value.length === 0) {
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

        onMounted(() => {
            userDetails.reDirectIfNotLoggedIn();

            // initialize map
            map.value = new mapboxgl.Map({
                container: 'map-container-image-uploader',
                interactive: true,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [80, 20],
                zoom: 3,
            })

            map.value.on('click', (e) => {
                locationCoords.value.lat = e.lngLat.lat;
                locationCoords.value.lon = e.lngLat.lng;
            })
        })

        watch(locationCoords, (lc) => {
            map.value.flyTo({
                center: [lc.lon, lc.lat],
                zoom: 10,
                duration: MAPBOX_FLY_DURATION,
            })
        }, { deep: true })

        return {
            tripTitle,
            tripYear,
            imageGallary,
            locationCoords,
            mobile,
            selectedFiles,
            onFilesChanged,
            onUploadImage,
            onSearchValueChanged,
            onClickExistingTripName
        }
    },
})
</script>


<style scoped>
.v-autocomplete__content{
    height: 300px !important;
    overflow-y: scroll !important;
}

.map-height {
    height: 600px;
}

.map-height-mobile {
    height: 400px;
}
</style>