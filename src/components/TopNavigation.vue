<template>
	<div
		class="d-flex justify-center top-navigation pa-5"
		:class="{
			'width-sm': mobile,
			'width-lg': mdAndUp,
		}"
	>
		<div class="w-100 h-100 d-flex align-center">
			<div
				class="text-h4 navItem"
				:class="{
					'text-teal-lighten-2': uiMode.mode === UIMode.Light,
					'heading-dark-mode': uiMode.mode === UIMode.Dark,
				}"
				@click="onClickTitle"
			>
				Travel Diary
			</div>

			<v-spacer></v-spacer>

			<div class="d-flex h-100 align-center" v-if="!mobile">
				<div
					v-if="userDetails.isLoggedIn"
					class="text-h6 ml-2 navItem"
					@click="onClickUpload"
					data-qa-id="upload-btn"
				>
					Upload
				</div>

				<div
					v-if="userDetails.isLoggedIn"
					@click="onClickLogout"
					data-qa-id="logout-btn"
					class="text-h6 mx-2 navItem"
				>
					Logout
				</div>
			</div>

			<v-spacer />

			<div class="d-flex pa-1">
				<v-icon
					class="mx-2"
					:icon="
						uiMode.mode === UIMode.Light
							? 'mdi-white-balance-sunny'
							: 'mdi-weather-night'
					"
					:size="mobile ? 'large' : 'x-large'"
					@click="uiMode.toggleMode"
				>
				</v-icon>

				<v-icon
					class="mx-2"
					icon="mdi-github"
					:size="mobile ? 'large' : 'x-large'"
					@click="onClickGithub"
				>
				</v-icon>

				<v-menu v-if="mobile">
					<template v-slot:activator="{ props }">
						<v-icon icon="mdi-menu" :size="mobile ? 'large' : 'x-large'" v-bind="props">
						</v-icon>
					</template>

					<v-list density="compact">
						<v-list-item
							v-if="!userDetails.isLoggedIn"
							@click="onClickLogin"
							density="compact"
							slim
						>
							Login
						</v-list-item>
						<v-list-item
							v-if="userDetails.isLoggedIn"
							@click="onClickUpload"
							density="compact"
							slim
						>
							Upload
						</v-list-item>
						<v-list-item
							v-if="userDetails.isLoggedIn"
							@click="onClickLogout"
							slim
							density="compact"
						>
							Logout
						</v-list-item>
					</v-list>
				</v-menu>
			</div>
		</div>
	</div>
</template>

<script>
import { UIMode, useUIMode } from '@/stores/UIMode';
import { defineComponent } from 'vue';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import { useRouter } from 'vue-router';
import { useUserDetails } from '@/stores/userDetails';
import { BACKEND_URL } from './Queries';

export default defineComponent({
	name: 'topNavigation',
	setup() {
		const { mdAndUp, mobile } = useDisplay();
		const uiMode = useUIMode();
		const router = useRouter();
		const userDetails = useUserDetails();

		const onClickGithub = () => {
			window.open('https://github.com/HarshJainCodes/TravelMemories', '_blank');
		};

		const onClickUpload = () => {
			router.push('upload');
		};

		const onClickLogin = () => {
			router.push({
				name: 'login',
			});
		};

		const onClickTitle = () => {
			router.push('/');
		};

		const onClickLogout = async () => {
			const call = await fetch(`${BACKEND_URL}/auth/Logout`, {
				method: 'GET',
				credentials: 'include',
			});

			if (call.status === 200) {
				userDetails.isLoggedIn = false;
				await userDetails.reDirectIfNotLoggedIn();
			}
		};

		return {
			mdAndUp,
			mobile,
			uiMode,
			UIMode,
			userDetails,
			onClickTitle,
			onClickGithub,
			onClickUpload,
			onClickLogin,
			onClickLogout,
		};
	},
});
</script>

<style scoped>
.heading-dark-mode {
	color: #6fc3ba;
}

.width-lg {
	width: 60%;
}

.width-sm {
	width: 100%;
}

.navItem:hover {
	cursor: pointer;
}
</style>
