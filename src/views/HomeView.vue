<template>
    <div class="d-flex w-100 h-100">
        <v-row class="w-100 h-100 px-5" v-if="!mobile">
            <v-col cols="4">
                <div class="w-100 h-100 d-flex justify-center align-center flex-column text-teal-lighten-1 text-center text-h2">
                    <div class="w-100">
                        View Photos With Power Of Map
                    </div>

                    <v-divider class="w-33 ma-5" thickness="5" color="teal-lighten-1" opacity="1"></v-divider>

                    <div class="text-h5 text-teal-lighten-2">
                        Tired to find your photo scattered among 1000 others ? <br> See where all you have visited on the map
                         so that its easier to find photos.
                    </div>

                    <v-btn class="ma-5" variant="outlined" append-icon="mdi-chevron-right" @click="onClickStartCreating">
                        Start Creating
                    </v-btn>
                </div>
            </v-col>
            <v-col cols="8">
                <div class="w-100 h-100 d-flex align-center justify-center">
                    <v-img :src="world_map">
                    </v-img>
                </div>
            </v-col>
        </v-row>
        <div v-else class="d-flex flex-column w-100 h-100 mx-5 align-center text-teal-lighten-1 text-center">
            <div class="w-100">
                <v-img :src="world_map"></v-img>
            </div>

            <v-spacer></v-spacer>

            <div class="w-100 text-h4">
                View Photos With Power Of Map
            </div>
            <v-divider class="w-50 ma-5" thickness="5" color="teal-lighten-1" opacity="0.4"></v-divider>

            <div class="text-h6 text-teal-lighten-2 text-center">
                Tired to find your photo scattered among 1000 others ? <br> See where all you have visited on the map
                    so that its easier to find photos.
            </div>

            <v-btn class="ma-5" variant="outlined" append-icon="mdi-chevron-right" @click="onClickStartCreating">
                Start Creating
            </v-btn>

            <v-spacer></v-spacer>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue'
import world_map from '@/assets/images/world_map.png'
import { useRouter } from 'vue-router';
import { useUserDetails } from '@/stores/userDetails';
import { useDisplay } from 'vuetify/lib/framework.mjs';

export default defineComponent({
    name: 'HomeView',
    components: {
    },
    setup() {
        const router = useRouter();
        const userDetails = useUserDetails();
        const { mobile } = useDisplay();

        const onClickStartCreating = () => {
            if (!userDetails.isLoggedIn){
                router.push('/Login');
            }else{
                router.push('MyCollection')
            }
        }

        return {
            world_map,
            mobile,
            onClickStartCreating,
        }
    },
})
</script>
