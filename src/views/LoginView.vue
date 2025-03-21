<template>
    <login-page v-if="isSafeToShowLoginPage" :google-client-id="googleClientId"
        @on-google-authenticated="onGoogleAuthenticated"
        @on-click-login-or-register="onClickLoginOrRegister"
    >
        <template #topHeading>
            Your Unique Photo Diary With The Power Of Map Visualization
        </template>
    </login-page>
</template>

<script lang="ts">
import { defineComponent, onActivated, ref } from 'vue'
import { useUserDetails } from '@/stores/userDetails';
import { useRouter } from 'vue-router';
import { LoginPage, LoginModes } from 'corecomponentshj';
import { TYPE, useToast } from 'vue-toastification';

export default defineComponent({
    components: {
        LoginPage
    },
    setup() {
        const userDetails = useUserDetails();
        const router = useRouter();
        const toast = useToast();
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

        const onClickLoginOrRegister = async (event) => {
            if (event.currentView == LoginModes.CreateAccount) {
                const call = await fetch('https://travelmemories.azurewebsites.net/auth/Register', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8'
                    },
                    body: JSON.stringify({
                        userName: event.userName,
                        email: event.email,
                        password: event.password,
                    }),
                    credentials: 'include',
                })

                if (call.status == 200) {
                    const res = await call.json();
                    userDetails.setIsLoggedIn(true);
                    console.log(res);
                    userDetails.userName = res.userName
                    router.push('/MyCollection');
                } else if (call.status == 400) {
                    const errorMsg = await call.text()
                    toast(errorMsg, {
                        type: TYPE.ERROR
                    });
                }
            }else {
                const call = await fetch('https://travelmemories.azurewebsites.net/auth/Login', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8'
                    },
                    body: JSON.stringify({
                        userName: event.userName,
                        email: event.email,
                        password: event.password,
                    }),
                    credentials: 'include',
                })

                if (call.status == 200) {
                    const res = await call.json();
                    userDetails.setIsLoggedIn(true);
                    userDetails.userName = res.userName
                    router.push('/MyCollection');
                } else {
                    const errorMsg = await call.text()
                    toast(errorMsg, {
                        type: TYPE.ERROR
                    });
                }
            }
        }

        onActivated(async () => {
            // if you are already logged in then you dont need to be seeing login page
            await userDetails.reDirectFromLogin();
            isSafeToShowLoginPage.value = true;
        })

        return {
            googleClientId,
            isSafeToShowLoginPage,
            onGoogleAuthenticated,
            onClickLoginOrRegister,
        }
    },
})
</script>

<style scoped>
.login-custom-class:hover{
    cursor: pointer;
}
</style>
