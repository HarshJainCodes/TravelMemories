<template>
    <login-page v-if="isSafeToShowLoginPage" :google-client-id="googleClientId"
        @on-google-authenticated="onGoogleAuthenticated"
    >
        <template #topHeading>
            Your Unique Photo Diary With The Power Of Map Visualization
        </template>
    </login-page>
</template>

<script>
import { defineComponent, onActivated, ref } from 'vue'
import { useUserDetails } from '@/stores/userDetails';
import { LoginPage } from 'corecomponentsHJ';

export default defineComponent({
    components: {
        LoginPage
    },
    setup() {
        const userDetails = useUserDetails();
        const router = useRouter();
        const isSafeToShowLoginPage = ref(false);

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
                router.push('/MyCollection');
            }
        }

        onActivated(async () => {
            // if you are already logged in then you dont need to be seeing login page
            await userDetails.reDirectFromLogin();
            isSafeToShowLoginPage.value = true;
        })

        return {
            googleClientId,
            onGoogleAuthenticated,
            isSafeToShowLoginPage,
        }
    },
})
</script>

<style scoped>
.login-custom-class:hover{
    cursor: pointer;
}
</style>
