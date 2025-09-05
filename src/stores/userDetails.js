import { defineStore } from 'pinia';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { BACKEND_URL } from '@/components/Queries';

export const useUserDetails = defineStore('userDetails', () => {
	const router = useRouter();

	const userName = ref('');
	const userEmail = ref('');

	const isLoggedIn = ref(false);
	const userProfilePicUrl = ref('');
	const hasCompletedLoginCall = ref(false);

	function setIsLoggedIn(val) {
		isLoggedIn.value = val;
	}

	function setUserEmail(val) {
		userEmail.value = val;
	}

	const reDirectIfNotLoggedIn = async () => {
		await checkLogin();
		if (!isLoggedIn.value) {
			router.push('/Login');
		}
	};

	const reDirectFromLogin = async () => {
		await checkLogin();
		if (isLoggedIn.value) {
			router.push('/MyCollection');
		}
		return true;
	};

	const checkLogin = async () => {
		if (isLoggedIn.value === false) {
			const req = await fetch(`${BACKEND_URL}/ImageUpload/CheckLogin`, {
				method: 'GET',
				credentials: 'include',
			});

			if (req.status === 200) {
				const res = await req.json();
				isLoggedIn.value = true;
				userEmail.value = res.userEmail;
				userProfilePicUrl.value = res.profilePicUrl;
			}
		}
		hasCompletedLoginCall.value = true;
	};

	onMounted(async () => {
		await checkLogin();
	});

	return {
		userName,
		isLoggedIn,
		userProfilePicUrl,
		userEmail,
		hasCompletedLoginCall,
		setUserEmail,
		setIsLoggedIn,
		reDirectIfNotLoggedIn,
		reDirectFromLogin,
	};
});
