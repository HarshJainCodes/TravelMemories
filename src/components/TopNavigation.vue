<template>
	<div class="w-100 top-nav">
		<div class="d-flex mx-auto" style="width: 80%">
			<div class="w-100 py-5 d-flex align-center">
				<div
					class="text-h5 font-weight-bold text-teal-lighten-2"
					@click="clickOnWebsiteName"
					style="cursor: pointer"
				>
					<v-icon icon="mdi-airplane" color="teal-lighten-1"></v-icon>
					<span> Travel Memories </span>
				</div>
			</div>
			<div
				v-if="!mobile"
				class="w-100 py-5 d-flex justify-center align-center"
				style="color: #374151; font-weight: 500; font-size: 14px"
			>
				<span
					class="px-3 nav-links"
					v-for="link in MIDDLE_NAV_LINKS"
					:key="link.name"
					@click="onClickMiddleNavLink(link)"
				>
					{{ link.name }}
				</span>
			</div>
			<div v-if="!mobile" class="w-100 py-5 d-flex align-center justify-end">
				<div v-if="hasCompletedLoginCall" class="d-flex align-center">
					<v-icon icon="mdi-weather-sunny" class="mx-2"> </v-icon>

					<v-btn class="mx-2" color="teal-lighten-1" elevation="5">
						<template #prepend>
							<v-icon icon="mdi-lightning-bolt" color="white"> </v-icon>
						</template>
						Launch Now
					</v-btn>

					<v-btn v-if="isLoggedIn" variant="outlined" rounded color="teal-lighten-1">
						<template #prepend>
							<v-icon icon="mdi-sd"></v-icon>
						</template>
						{{ subscriptionData?.storageUsedInGB.toFixed(2) }} /
						{{ subscriptionData?.storageCapacityInGB }} GB Used
					</v-btn>

					<div v-if="!isLoggedIn" class="d-flex">
						<v-btn
							variant="outlined"
							color="teal-lighten-1"
							class="mx-2"
							@click="onClickLogin"
						>
							<template #prepend>
								<v-icon icon="mdi-arrow-collapse-right"></v-icon>
							</template>
							Sign In
						</v-btn>
					</div>

					<v-menu
						v-if="isLoggedIn"
						style="font-family: 'Geist', 'Geist fallback', sans-serif"
					>
						<template #activator="{ props }">
							<v-img
								v-bind="props"
								rounded
								:src="demo_user_img"
								width="40"
								class="rounded-circle mx-2"
							>
							</v-img>
						</template>

						<v-card elevation="4">
							<v-list density="compact">
								<v-list-item @click="() => {}">
									<div class="d-flex align-center">
										<v-img
											rounded
											:src="userProfilePicUrl"
											max-width="40"
											class="rounded-circle mx-2"
										>
										</v-img>
										<div class="d-flex flex-column">
											<div class="text-blue-grey-darken-1">
												{{ userName }}
											</div>
											<div
												style="font-size: 12px"
												class="text-blue-grey-lighten-1"
											>
												{{ userEmail }}
											</div>
										</div>
									</div>
								</v-list-item>
								<v-list-item>
									<v-divider class="w-100" />
								</v-list-item>
								<v-list-item @click="() => {}">
									<div class="d-flex w-100">
										<v-icon icon="mdi-wallet-bifold-outline"></v-icon>
										<div class="w-100 px-3">Subscription Management</div>
									</div>
								</v-list-item>
								<v-list-item @click="() => {}">
									<div class="d-flex w-100">
										<v-icon icon="mdi-cash-multiple"></v-icon>
										<div class="w-100 px-3">Invoices</div>
									</div>
								</v-list-item>
								<v-list-item>
									<v-divider class="w-100"></v-divider>
								</v-list-item>
								<v-list-item @click="onClickLogout">
									<div class="d-flex w-100" style="cursor: pointer">
										<v-icon icon="mdi-logout" color="pink-darken-1"></v-icon>
										<div class="w-100 px-3 text-pink-darken-1">Sign Out</div>
									</div>
								</v-list-item>
							</v-list>
						</v-card>
					</v-menu>
				</div>
			</div>
			<div v-if="mobile" class="d-flex justify-end align-center">
				<v-btn
					icon="mdi-menu"
					variant="plain"
					:ripple="false"
					@click="toggleShowMobileNavLinks"
				>
				</v-btn>
			</div>
		</div>
		<div class="w-100 nav-border"></div>
		<div v-if="mobile && showMobileNavLinks" class="w-100">
			<div class="w-100">
				<div class="d-flex flex-column py-5">
					<span class="px-3 nav-links py-1"> Image Editor </span>
					<span class="px-3 nav-links py-1" @click="onClickUpload"> Upload </span>
					<span class="px-3 nav-links py-1"> Showcase </span>
					<span class="px-3 nav-links py-1"> Github </span>
					<span class="px-3 nav-links py-1"> Pricing </span>
					<span class="px-3 nav-links py-1"> API </span>
				</div>

				<div class="mx-auto nav-border" style="width: 80%"></div>

				<div class="w-100 d-flex flex-column align-center justify-center py-2">
					<div style="width: 90%">
						<v-btn class="w-100 rounded-lg" color="teal-lighten-1" elevation="5">
							<template #prepend>
								<v-icon icon="mdi-lightning-bolt" color="white"> </v-icon>
							</template>
							Launch Now
						</v-btn>
					</div>

					<div class="d-flex py-4">
						<v-btn
							v-if="!isLoggedIn"
							variant="outlined"
							color="teal-lighten-1"
							class="mx-2"
							@click="onClickLogin"
						>
							<template #prepend>
								<v-icon icon="mdi-arrow-collapse-right"></v-icon>
							</template>
							Sign In
						</v-btn>
						<v-btn v-else @click="onClickLogout">
							<template #prepend>
								<v-icon icon="mdi-arrow-collapse-right"></v-icon>
							</template>
							Log Out
						</v-btn>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { useUserDetails } from '@/stores/userDetails';
import { computed, defineComponent, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useDisplay } from 'vuetify';
import { useRouter } from 'vue-router';
import { BACKEND_URL, useSubscriptionDetails } from './Queries';
import demo_user_img from '../assets/images/demo-user.png';
import { MIDDLE_NAV_LINKS } from './Constants/TopNavigation';

export default defineComponent({
	name: 'TopNavigation',
	setup() {
		const { hasCompletedLoginCall, isLoggedIn, userProfilePicUrl, userEmail, userName } =
			storeToRefs(useUserDetails());
		const { reDirectIfNotLoggedIn } = useUserDetails();
		const subscriptionDetails = useSubscriptionDetails();

		const subscriptionData = computed(() => subscriptionDetails.data.value);

		const router = useRouter();
		const { mobile } = useDisplay();

		const showMobileNavLinks = ref(false);

		const toggleShowMobileNavLinks = () => {
			showMobileNavLinks.value = !showMobileNavLinks.value;
		};

		const clickOnWebsiteName = () => {
			router.push({
				name: 'home',
			});
		};

		const onClickLogin = () => {
			router.push({
				name: 'login',
			});
		};

		const onClickLogout = async () => {
			const call = await fetch(`${BACKEND_URL}/auth/Logout`, {
				method: 'GET',
				credentials: 'include',
			});

			if (call.status === 200) {
				isLoggedIn.value = false;
				await reDirectIfNotLoggedIn();
			}
		};

		const onClickMiddleNavLink = (link) => {
			if (link.external) {
				window.open(link.link, '_blank');
			} else {
				router.push(link.link);
			}
		};

		const onClickUpload = async () => {
			await reDirectIfNotLoggedIn();

			router.push({
				name: '/Upload',
			});
		};

		return {
			isLoggedIn,
			hasCompletedLoginCall,
			userEmail,
			userName,
			userProfilePicUrl,
			mobile,
			showMobileNavLinks,
			demo_user_img,
			MIDDLE_NAV_LINKS,
			subscriptionData,
			toggleShowMobileNavLinks,
			onClickLogin,
			clickOnWebsiteName,
			onClickLogout,
			onClickMiddleNavLink,
			onClickUpload,
		};
	},
});
</script>

<style scoped>
.nav-border {
	border-bottom: 1px solid #64ffda;
}

.top-nav {
	font-family: 'Geist', 'Geist fallback', sans-serif;
	position: sticky;
	top: 0;
	z-index: 5;
	backdrop-filter: blur(40px);
}

.nav-links {
	transition: color 0.5s ease;
}

.nav-links:hover {
	cursor: pointer;
	color: #26a69a; /* teal-lighten-1 */
}
</style>
