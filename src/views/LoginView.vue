<template>
	<login-page-v-2
		website-name="Travel Memories"
		mini-title="Travel Diary"
		:google-client-id="googleClientId"
		@on-google-authenticated="onGoogleAuthenticated"
		@on-send-verification-code="onSendVerficationCode"
		@on-click-verify-otp="onClickVerifyOtp"
		@on-click-resend-otp="onClickResendOtp"
	></login-page-v-2>
</template>

<script lang="ts">
import { defineComponent, onActivated, ref } from 'vue';
import { useUserDetails } from '@/stores/userDetails';
import { useRoute, useRouter } from 'vue-router';
import { LoginPageV2, LoginModes } from 'corecomponentshj';
import { TYPE, useToast } from 'vue-toastification';
import type { CallbackTypes } from 'vue3-google-login';
import { BACKEND_URL } from '@/components/Queries';
import appinsights from '../appInsights';

export default defineComponent({
	components: {
		LoginPageV2,
	},
	setup() {
		const userDetails = useUserDetails();
		const router = useRouter();
		const route = useRoute();
		const toast = useToast();

		const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

		const isSafeToShowLoginPage = ref(false);
		const currentLoginTab = ref(0);

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
				userDetails.userProfilePicUrl = response.profilePictureURL;

				if (route.query.redirect != null) {
					router.push(route.query.redirect.toString());
				} else {
					router.push('/MyCollection');
				}
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

		const onSendVerficationCode = async (email: String) => {
			const sendVerficationCall = await fetch(`${BACKEND_URL}/EmailService`, {
				method: 'POST',
				body: JSON.stringify({
					receiverEmail: email,
				}),
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
				},
			});
		};

		const onClickVerifyOtp = async ({ enteredEmail, enteredOtp }) => {
			console.log(enteredEmail, enteredOtp);

			const verifyOtpRequest = await fetch(`${BACKEND_URL}/EmailService/VerifyOtp`, {
				method: 'POST',
				body: JSON.stringify({
					email: enteredEmail,
					otp: enteredOtp,
				}),
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
				},
				credentials: 'include',
			});

			if (verifyOtpRequest.status === 200) {
				router.push('/MyCollection');
			} else {
				toast('Invalid or expired OTP', {
					type: TYPE.ERROR,
				});
			}
		};

		const onClickResendOtp = async (enteredEmail) => {
			console.log('sending otp');
			await onSendVerficationCode(enteredEmail);
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
			onSendVerficationCode,
			onClickVerifyOtp,
			onClickResendOtp,
		};
	},
});
</script>

<style scoped>
.login-custom-class:hover {
	cursor: pointer;
}
</style>
