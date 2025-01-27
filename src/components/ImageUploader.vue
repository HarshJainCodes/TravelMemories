<template>
    <div class="w-100 h-100 d-flex align-center flex-column">

        <v-card class="w-50 h-100" elevation="4" :class="{
            'w-75': mobile
        }">
            <div :class="{
                'w-50 mx-auto' : !mobile
            }">
                <v-text-field label="Trip Title" class="pa-5" v-model="tripTitle">
                </v-text-field>

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
import { defineComponent, ref, watch } from 'vue'
import { useDisplay } from 'vuetify/lib/framework.mjs';

export default defineComponent({
    setup() {
        const { mobile } = useDisplay();

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
                console.log('select atleast one image');
                return;
            }

            const formData = new FormData();

            selectedFiles.value.forEach((file) => {
                formData.append('images', file);
            })

            const req = await fetch(`https://travelmemories.azurewebsites.net/ImageUpload?tripTitle=${tripTitle.value}&year=${tripYear.value}&lat=${locationCoords.value.lat}&lon=${locationCoords.value.lon}`, {
                method: 'POST',
                body: formData,
            })

            if (req.status === 200){
                console.log('images uploaded successfully')
            }else{
                console.log('some error occured')
            }
        }

        return {
            tripTitle,
            tripYear,
            locationCoords,
            mobile,
            onFilesChanged,
            onUploadImage
        }
    },
})
</script>


<style scoped>

</style>