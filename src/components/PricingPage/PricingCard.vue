<template>
	<v-card class="w-100 mx-5 pa-10 rounded-xl mt-5">
		<div class="w-100 d-flex justify-center flex-column align-center">
			<v-chip v-if="isCurrentCardSelected" color="teal-darken-1" text="Current Plan">
			</v-chip>
			<v-icon class="mt-5" :icon="iconName" size="x-large" color="teal-lighten-1"> </v-icon>
			<div class="text-h5 mt-5 font-weight-bold">{{ title }}</div>

			<div class="mt-2 text-center">
				{{ subtitle }}
			</div>

			<div class="text-h4 text-teal-lighten-1 font-weight-bold mt-2">
				<span
					v-if="strikeThroughPrice"
					class="text-decoration-line-through text-blue-grey-lighten-2"
				>
					₹ {{ strikeThroughPrice }}
				</span>
				₹ {{ price }}
				<span class="text-h6 text-blue-grey-darken-3"> /{{ timePeriod }}</span>
			</div>

			<div class="d-flex flex-column w-100 justify-start">
				<div v-for="benifit in planBenifits" :key="benifit.toString()" class="d-flex mt-5">
					<v-icon class="mx-1" icon="mdi-check" color="teal-lighten-1"></v-icon>
					{{ benifit }}
				</div>
			</div>

			<div class="mt-5 w-100">
				<v-btn
					v-if="title !== 'Free'"
					class="rounded-xl w-100"
					prepend-icon="mdi-login"
					color="teal-lighten-1"
					@click="onClickSubscribeBtn"
				>
					<div v-if="!isLoggedIn">Sign in to get started</div>
					<div v-else>Subscribe Now</div>
				</v-btn>
				<div v-if="!isLoggedIn" class="text-center mt-3" style="font-size: 14px">
					Please sign in to purchase a plan
				</div>
			</div>
		</div>
	</v-card>
</template>

<script lang="ts">
import { useUserDetails } from '@/stores/userDetails';
import { storeToRefs } from 'pinia';
import { computed, defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useSubscriptionDetails } from '../Queries';
import { PlanType, SubscriptionType } from './Types';

export default defineComponent({
	name: 'PricingCard',
	props: {
		iconName: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		planType: {
			type: Number,
			required: true,
		},
		subtitle: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		timePeriod: {
			type: String,
			required: true,
		},
		planBenifits: {
			type: Array<String>,
			required: true,
		},
		strikeThroughPrice: {
			type: Number,
			required: false,
			default: 0,
		},
	},
	emits: ['on-click-subscribe'],
	setup(props, { emit }) {
		const { isLoggedIn } = storeToRefs(useUserDetails());
		const router = useRouter();
		const subscription = useSubscriptionDetails();

		const getSubscriptionTypeFromTitle = (title: string) => {
			let subType;
			switch (title) {
				case 'Free':
					subType = SubscriptionType.Free;
					break;
				case 'Basic':
					subType = SubscriptionType.Basic;
					break;
				case 'Pro':
					subType = SubscriptionType.Pro;
					break;
				default:
					subType == null;
			}
			return subType;
		};

		const getPlanTypeFromTitle = (title: number) => {
			let planType;

			switch (title) {
				case 0:
					planType = PlanType.Monthly;
					break;
				case 1:
					planType = PlanType.Yearly;
					break;
				default:
					planType = null;
					break;
			}

			return planType;
		};

		const subscriptionData = computed(() => subscription.data.value);
		const isCurrentCardSelected = computed(() => {
			const subType = getSubscriptionTypeFromTitle(props.title);
			const planType = getPlanTypeFromTitle(props.planType);

			if (
				subscriptionData.value?.subscriptionType === subType &&
				subscriptionData.value?.planType === planType
			) {
				return true;
			}
			return false;
		});

		const onClickSubscribeBtn = () => {
			if (!isLoggedIn.value) {
				router.push('login?redirect=pricing');
			} else {
				const subscriptionType = getSubscriptionTypeFromTitle(props.title);
				emit('on-click-subscribe', subscriptionType);
			}
		};

		return {
			isLoggedIn,
			isCurrentCardSelected,
			onClickSubscribeBtn,
		};
	},
});
</script>
