<template>
	<login-page
		v-if="isSafeToShowLoginPage"
		:google-client-id="googleClientId"
		@on-google-authenticated="onGoogleAuthenticated"
		@on-click-login-or-register="onClickLoginOrRegister"
	>
		<template #topHeading>
			Your Unique Photo Diary With The Power Of Map Visualization
		</template>
	</login-page>
</template>

<script lang="ts">
import { defineComponent, onActivated, ref } from 'vue';
import { useUserDetails } from '@/stores/userDetails';
import { useRouter } from 'vue-router';
import { LoginPage, LoginModes } from 'corecomponentshj';
import { TYPE, useToast } from 'vue-toastification';
import type { CallbackTypes } from 'vue3-google-login';
import { BACKEND_URL } from '@/components/Queries';

export default defineComponent({
	components: {
		LoginPage,
	},
	setup() {
		const userDetails = useUserDetails();
		const router = useRouter();
		const toast = useToast();
		const isSafeToShowLoginPage = ref(false);

		const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

		// google login methods
		const onGoogleAuthenticated: CallbackTypes.TokenResponseCallback = async (res) => {
			const google_jwt = res.access_token;

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
				router.push('/MyCollection');
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
