<template>
    <div class="d-flex justify-center top-navigation pa-5" :class="{
        'width-sm': mobile,
        'width-lg': mdAndUp,
    }">
        <div class="w-100 h-100 d-flex align-center">
            <div class="text-h4 navItem" :class="{
                'text-teal-lighten-2': uiMode.mode === UIMode.Light,
                'heading-dark-mode': uiMode.mode === UIMode.Dark
            }"
                @click="onClickTitle">
                Travel Diary
            </div>

            <div class="d-flex h-100 align-center" v-if="!mobile">
                <div class="text-h6 ml-15 navItem" @click="onClickUpload">
                    Upload
                </div>
    
                <div class="text-h6 mx-2 navItem">
                    Courses
                </div>
    
                <div class="text-h6 mx-2 navItem">
                    Goodies
                </div>
    
                <div class="text-h6 mx-2 navItem">
                    About
                </div>
            </div>

            <v-spacer />

            <div class="d-flex pa-1">
                <v-icon class="mx-2" :icon="uiMode.mode === UIMode.Light ? 'mdi-white-balance-sunny' : 'mdi-weather-night'" :size="mobile ? 'large' : 'x-large'"
                    @click="uiMode.toggleMode">
                </v-icon>
    
                <v-icon class="mx-2" icon="mdi-github" :size="mobile ? 'large' : 'x-large'"
                    @click="onClickGithub">
                </v-icon>

                <v-menu v-if="mobile">
                    <template v-slot:activator="{ props }">
                        <v-icon icon="mdi-menu" :size="mobile ? 'large' : 'x-large'" v-bind="props">
                        </v-icon>
                    </template>

                    <v-list density="compact">
                        <v-list-item @click="onClickUpload" density='compact' slim>
                            Upload
                        </v-list-item>
                    </v-list>
                </v-menu>
            </div>
        </div>
    </div>
</template>

<script>
import { UIMode, useUIMode } from '@/stores/UIMode';
import { defineComponent } from 'vue';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import { useRouter } from 'vue-router';

export default defineComponent({
    name: 'topNavigation',
    setup() {
        const { mdAndUp, mobile } = useDisplay();
        const uiMode = useUIMode();
        const router = useRouter();

        const onClickGithub = () => {
            window.open('https://github.com/HarshJainCodes/TravelMemories', '_blank')
        }

        const onClickUpload = () => {
            router.push('upload')
        }

        const onClickTitle = () => {
            router.push('/')
        }

        return {
            mdAndUp,
            mobile,
            uiMode,
            UIMode,
            onClickTitle,
            onClickGithub,
            onClickUpload,
        }
    }
})
</script>

<style scoped>
.heading-dark-mode {
    color: #6FC3BA;
}

.width-lg {
    width: 60%;
}

.width-sm {
    width: 100%;
}

.navItem:hover {
    cursor: pointer;
}
</style>
