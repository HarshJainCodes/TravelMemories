<template>
    <div class="d-flex w-100 bg-teal-lighten-4 h-100">
        <div class="bg-teal-lighten-4 h-100" style="width: 40%;">
            <div class="text-h4 pa-10 text-white">
                Your Unique Photo Diary With The Power Of Map Visualization
            </div>
        </div>

        <div class="position-absolute" style="top: 20%; left: 10%;">
            <v-img width="900" :src="random_shapes">
            </v-img>
        </div>

        <div class="h-100 pa-5 bg-white d-flex flex-column align-center justify-center" style="width: 60%;">
            <div class="text-h4 pt-10 font-weight-bold text-center">
                <div v-if="currentView === LoginModes.CreateAccount">
                    CREATE ACCOUNT
                </div>
                <div v-if="currentView === LoginModes.LoginToAccount">
                    WELCOME BACK
                </div>
            </div>

            <google-login class="pa-10" :callback="onGoogleAuthenticated" popup-type="TOKEN" ux-mode="redirect">
                <v-btn prepend-icon="mdi-google" color="teal-lighten-4" size="large">
                    Continue With Google
                </v-btn>
            </google-login>

            <div class="text-h5 text-blue-grey-lighten-3 text-center">
                - OR -
            </div>

            <div class="w-50 d-flex flex-column pt-5">
                <v-text-field v-model="userName" label="UserName" type="text" variant="underlined"></v-text-field>
                <v-text-field v-model="email" label="Email" type="email" variant="underlined"></v-text-field>
                <v-text-field v-model="password"
                              label="Password"
                              :type="showPassword ? 'text' : 'password'" 
                              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" 
                              @click:append-inner="onClickPasswordEye"
                              variant="underlined"
                ></v-text-field>
            </div>

            <v-btn color="teal-lighten-4 w-50 border-radius-10" border="md" rounded size="x-large" @click="onClickLoginOrRegister">
                <div class="text-white h-100">
                    <div v-if="currentView === LoginModes.CreateAccount">
                        CREATE ACCOUNT
                    </div>
                    <div v-if="currentView === LoginModes.LoginToAccount">
                        LOGIN
                    </div>
                </div>
            </v-btn>
            <div class="text-h5 pa-5">
                <div v-if="currentView === LoginModes.CreateAccount">
                    Already have an account? <span class="text-teal-lighten-2 login-custom-class" 
                                                   @click="onClickAlreadyHaveAnAccountOrSignup"> Login </span>
                </div>
                <div v-if="currentView === LoginModes.LoginToAccount">
                    Don't have an account? <span class="text-teal-lighten-2 login-custom-class" @click="onClickAlreadyHaveAnAccountOrSignup">Sign Up</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import random_shapes from '../assets/images/random_shapes.png'
import { LoginModes } from '@/components/Login/Constants';
import { useUserDetails } from '@/stores/userDetails';
import { useToast } from 'vue-toastification';
import { useRoute } from 'vue-router';

export default defineComponent({
    setup() {
        const route = useRoute();

        const userDetails = useUserDetails();
        const toast = useToast();

        const userName = ref('');
        const email = ref('')
        const password = ref('')

        const showPassword = ref(false);
        const currentView = ref(LoginModes.CreateAccount);

        const onClickPasswordEye = () => {
            showPassword.value = !showPassword.value
        }

        const onClickAlreadyHaveAnAccountOrSignup = () => {
            if (currentView.value === LoginModes.CreateAccount){
                currentView.value = LoginModes.LoginToAccount;
            }else if (currentView.value === LoginModes.LoginToAccount){
                currentView.value = LoginModes.CreateAccount
            }
        }

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

        onMounted(() => {
            console.log(route.query)
        })

        return {
            random_shapes,
            LoginModes,
            userName,
            email,
            password,
            currentView,
            showPassword,
            onClickPasswordEye,
            onClickAlreadyHaveAnAccountOrSignup,
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
