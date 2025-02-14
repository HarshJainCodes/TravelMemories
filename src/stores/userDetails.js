import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserDetails = defineStore('userDetails', () => {
    const userName = ref('');
    const isLoggedIn = ref(false);
    const userProfilePicUrl = ref('')

    function setIsLoggedIn(val) {
        isLoggedIn.value = val
    }

    return {
        userName,
        isLoggedIn,
        userProfilePicUrl,
        setIsLoggedIn,
    }
})