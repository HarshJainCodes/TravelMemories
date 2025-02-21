import { defineStore } from "pinia";
import { onMounted, ref } from "vue";

export const useUserDetails = defineStore('userDetails', () => {
    const userName = ref('');
    const isLoggedIn = ref(false);
    const userProfilePicUrl = ref('')

    function setIsLoggedIn(val) {
        isLoggedIn.value = val
    }

    onMounted(async () => {
        if (isLoggedIn.value === false){
            // check if it is logged in
            const req = await fetch('https://travelmemories.azurewebsites.net/ImageUpload/CheckLogin', {
                method: 'GET',
                credentials: 'include'
            });

            if (req.status === 200){
                isLoggedIn.value = true;
            }
        }
    })

    return {
        userName,
        isLoggedIn,
        userProfilePicUrl,
        setIsLoggedIn,
    }
})