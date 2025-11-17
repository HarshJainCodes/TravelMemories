import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ImageUploader from '@/components/ImageUploader.vue';
import LoginView from '@/views/LoginView.vue';
import DiaryContainer from '@/components/DiaryContainer.vue';
import ApiPage from '@/components/ApiPage.vue';
import PricingPage from '@/components/PricingPage/PricingPageContainer.vue';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{ path: '/', name: 'home', component: HomeView },
		{ path: '/Upload', name: 'upload', component: ImageUploader },
		{ path: '/login', name: 'login', component: LoginView },
		{ path: '/MyCollection', name: 'MyCollection', component: DiaryContainer },
		{ path: '/api', name: 'api', component: ApiPage },
		{ path: '/Pricing', name: 'Pricing', component: PricingPage },
	],
});

export default router;
