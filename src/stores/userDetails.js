import { defineStore } from 'pinia';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { BACKEND_URL } from '@/components/Queries';

export const useUserDetails = defineStore('userDetails', () => {
	const router = useRouter();

	const userName = ref('');
	const isLoggedIn = ref(false);
	const userProfilePicUrl = ref('');

	function setIsLoggedIn(val) {
		isLoggedIn.value = val;
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
				isLoggedIn.value = true;
			}
		}
	};

	onMounted(async () => {
		await checkLogin();
	});

	return {
		userName,
		isLoggedIn,
		userProfilePicUrl,
		setIsLoggedIn,
		reDirectIfNotLoggedIn,
		reDirectFromLogin,
	};
});
