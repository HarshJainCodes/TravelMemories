<template>
	<!-- <login-page
		v-if="isSafeToShowLoginPage"
		:google-client-id="googleClientId"
		@on-google-authenticated="onGoogleAuthenticated"
		@on-click-login-or-register="onClickLoginOrRegister"
	>
		<template #topHeading>
			Your Unique Photo Diary With The Power Of Map Visualization
		</template>
	</login-page> -->
	<div class="w-100 h-100 d-flex justify-center align-center bg-teal-lighten-5">
		<v-card style="width: 450px; height: 420px" elevation="10" class="rounded-xl">
			<div class="d-flex flex-column justify-center align-center h-100">
				<v-icon
					class="ma-5"
					icon="mdi-airplane"
					color="teal-lighten-1"
					size="xxx-large"
				></v-icon>
				 
				<span class="text-teal-lighten-1 font-weight-bold" style="font-size: x-large">
					Welcome To Travel Memories
				</span>
				<span style="font-size: 14px; color: rgb(75 85 99)">
					Sign in to continue to your Travel Diary
				</span>

				<div class="my-10">
					<v-tabs v-model="currentLoginTab" color="teal-lighten-1">
						<v-tab> Google Sign In </v-tab>
						<v-tab> Email Sign In </v-tab>
					</v-tabs>

					<v-window class="w-100" v-model="currentLoginTab">
						<v-window-item class="w-100">
							<google-login
								:client-id="googleClientId"
								popup-type="TOKEN"
								ux-mode="redirect"
								class="pa-5"
							>
								<template #default>
									<v-btn
										prepend-icon="mdi-google"
										size="large"
										color="teal-lighten-1"
									>
										Continue With Google
									</v-btn>
								</template>
							</google-login>
						</v-window-item>

						<v-window-item> Hello </v-window-item>
					</v-window>
				</div>
				<span style="font-size: 12px; color: rgb(75 85 99)">
					By signing in, you agree to our Terms of Service and Privacy Policy
				</span>
			</div>
		</v-card>
	</div>
</template>

<script lang="ts">
import { defineComponent, onActivated, ref } from 'vue';
import { useUserDetails } from '@/stores/userDetails';
import { useRouter } from 'vue-router';
import { LoginPage, LoginModes } from 'corecomponentshj';
import { TYPE, useToast } from 'vue-toastification';
import type { CallbackTypes } from 'vue3-google-login';
import { BACKEND_URL } from '@/components/Queries';
import appinsights from '../appInsights';
import { GoogleLogin } from 'vue3-google-login';

export default defineComponent({
	components: {
		LoginPage,
		GoogleLogin,
	},
	setup() {
		const userDetails = useUserDetails();
		const router = useRouter();
		const toast = useToast();

		const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

		const isSafeToShowLoginPage = ref(false);
		const currentLoginTab = ref(0);

		// google login methods
		const onGoogleAuthenticated: CallbackTypes.TokenResponseCallback = async (res) => {
			const google_jwt = res.access_token;
			console.log('Hi');

			const googleLoginCall = await fetch(`${BACKEND_URL}/auth/googleLogin`, {
				method: 'POST',
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
				},
				body: JSON.stringify({
					idToken: google_jwt,
				}),
				credentials: 'include',
			});

			if (googleLoginCall.status === 200) {
				const response = await googleLoginCall.json();
				userDetails.setIsLoggedIn(true);
				userDetails.userName = response.userName;
				userDetails.userEmail = response.email;
				toast(userDetails.userName, {
					type: TYPE.SUCCESS,
				});
				router.push('/MyCollection');
			}
			if (googleLoginCall.status === 401) {
				toast('Not able to authenticate', {
					type: TYPE.ERROR,
				});
				appinsights.trackException({
					exception: new Error('Not able to login after google login'),
				});
			}
		};

		const onClickLoginOrRegister = async (event: {
			currentView: LoginModes;
			userName: string;
			email: string;
			password: string;
		}) => {
			if (event.currentView == LoginModes.CreateAccount) {
				const call = await fetch(`${BACKEND_URL}/auth/Register`, {
					method: 'POST',
					headers: {
						'Content-type': 'application/json; charset=UTF-8',
					},
					body: JSON.stringify({
						userName: event.userName,
						email: event.email,
						password: event.password,
					}),
					credentials: 'include',
				});

				if (call.status == 200) {
					const res = await call.json();
					userDetails.setIsLoggedIn(true);
					userDetails.userName = res.userName;
					userDetails.userEmail = res.email;
					router.push('/MyCollection');
				} else if (call.status == 400) {
					const errorMsg = await call.text();
					toast(errorMsg, {
						type: TYPE.ERROR,
					});
				}
			} else {
				const call = await fetch(`${BACKEND_URL}/auth/Login`, {
					method: 'POST',
					headers: {
						'Content-type': 'application/json; charset=UTF-8',
					},
					body: JSON.stringify({
						userName: event.userName,
						email: event.email,
						password: event.password,
					}),
					credentials: 'include',
				});

				if (call.status == 200) {
					const res = await call.json();
					userDetails.setIsLoggedIn(true);
					userDetails.userName = res.userName;
					userDetails.userEmail = res.email;
					router.push('/MyCollection');
				} else {
					const errorMsg = await call.text();
					toast(errorMsg, {
						type: TYPE.ERROR,
					});
				}
			}
		};

		onActivated(async () => {
			// if you are already logged in then you dont need to be seeing login page
			await userDetails.reDirectFromLogin();
			isSafeToShowLoginPage.value = true;
		});

		return {
			currentLoginTab,
			googleClientId,
			isSafeToShowLoginPage,
			onGoogleAuthenticated,
			onClickLoginOrRegister,
		};
	},
});
</script>

<style scoped>
.login-custom-class:hover {
	cursor: pointer;
}
</style>
