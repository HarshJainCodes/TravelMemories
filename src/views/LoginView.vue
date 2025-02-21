<template>
    <login-page :google-client-id="googleClientId"
        @on-google-authenticated="onGoogleAuthenticated"
    >
        <template #topHeading>
            Your Unique Photo Diary With The Power Of Map Visualization
        </template>
    </login-page>
</template>

<script>
import { defineComponent } from 'vue'
import { useUserDetails } from '@/stores/userDetails';
import { useToast } from 'vue-toastification';
import { useRoute } from 'vue-router';
import { LoginPage } from 'corecomponentsHJ';

export default defineComponent({
    components: {
        LoginPage
    },
    setup() {
        const userDetails = useUserDetails();

        const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

        // google login methods
        const onGoogleAuthenticated = async (res) => {
            const google_jwt = res.access_token;

            const googleLoginCall = await fetch(
                'https://travelmemories.azurewebsites.net/auth/googleLogin', {
                //  'https://localhost:7221/auth/googleLogin', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8'
                    },
                    body: JSON.stringify({
                        idToken: google_jwt
                    }),
                    credentials: 'include'
                }
            )

            if (googleLoginCall.status === 200){
                const response = await googleLoginCall.json();
                userDetails.setIsLoggedIn(true);
                userDetails.userName = response.userName
            }
        }

        return {
            googleClientId,
            onGoogleAuthenticated,
        }
    },
})
</script>

<style scoped>
.login-custom-class:hover{
    cursor: pointer;
}
</style>
