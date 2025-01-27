<template>
    <div class="d-flex w-100 h-100 px-5">
        <diary-container />
    </div>
</template>

<script>
import { defineComponent } from 'vue'
import DiaryContainer from '@/components/DiaryContainer.vue';

export default defineComponent({
    name: 'HomeView',
    components: {
        DiaryContainer,
    },
    setup() {
        
    },
})
</script>

