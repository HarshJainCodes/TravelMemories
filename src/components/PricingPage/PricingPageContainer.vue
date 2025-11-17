<template>
	<div class="w-100 h-100 d-flex align-center flex-column bg-teal-lighten-5">
		<div class="mt-15">
			<v-chip color="teal-darken-1" prepend-icon="mdi-airplane">
				Limited Time: Save 17% with Annual Billing
			</v-chip>
		</div>
		<div class="text-h3 text-teal-lighten-1 font-weight-bold mt-5">
			Choose Your Perfect Plan
		</div>

		<div class="mt-5 text-h6 font-weight-regular">Unlimited creativity starts here</div>

		<div
			class="border-solid d-flex justify-center align-center mt-5 pa-1 text-teal-lighten-1 rounded-xl"
		>
			<v-tabs
				v-model="currentTab"
				hide-slider
				mandatory
				selected-class="bg-teal-lighten-2 rounded"
			>
				<v-tab class="border-solid rounded-xl"> Monthly </v-tab>

				<v-tab class="border-solid rounded-xl"> Yearly (17% Off) </v-tab>
			</v-tabs>
		</div>

		<div class="w-75 d-flex justify-center mt-10">
			<pricing-card
				v-for="card in pricingCardInfo"
				:key="card.type"
				:icon-name="card.icon"
				:title="card.type"
				:subtitle="card.subtitle"
				:price="card.price"
				:plan-type="currentTab"
				:time-period="card.timePeriod"
				:plan-benifits="card.planBenifits"
				:strike-through-price="card.strikeThroughPrice"
				@on-click-subscribe="onClickSubscribe"
			/>
		</div>

		<div class="text-h3 text-teal-lighten-1 font-weight-bold mt-10">
			Frequently Asked Questions
		</div>

		<v-card
			v-for="question in FAQQuestions"
			:key="question.question"
			class="pa-5 w-50 mt-10 rounded-xl"
		>
			<div class="text-h5 font-weight-bold">
				{{ question.question }}
			</div>

			<br />

			{{ question.answer }}
		</v-card>

		<div class="text-h6 mt-10">Have more questions? We're here to help</div>

		<v-btn class="mt-5 rounded-xl" color="teal-lighten-1"> Contact Support </v-btn>

		<br />
		<br />
	</div>

	<v-dialog
		v-model="paymentMethodDialogModel"
		:persistent="false"
		style="backdrop-filter: blur(20px)"
	>
		<div class="w-25 h-50 mx-auto">
			<v-card class="rounded-xl">
				<div class="w-100 d-flex px-5 py-3 position-absolute">
					<v-spacer></v-spacer>
					<v-btn
						icon="mdi-close"
						density="compact"
						variant="plain"
						@click="paymentMethodDialogModel = false"
					></v-btn>
				</div>
				<div class="pa-3" style="border-bottom: 1px solid #64ffda">
					<div class="text-h6 text-center text-teal-lighten-1 font-weight-bold">
						<v-icon icon="mdi-shield"></v-icon>
						Choose Payment Method
					</div>
					<div class="text-center font-weight-bold">
						Secure & Fast Multiple Payment Options
					</div>
				</div>
				<div class="ma-5">
					<div class="rounded-xl pa-5" style="border: 3px solid #64ffda">
						<div
							class="d-flex align-center pb-3"
							style="cursor: pointer"
							@click="() => {}"
						>
							<v-icon
								icon="mdi-credit-card mx-2"
								color="teal-lighten-1"
								size="x-large"
							></v-icon>
							<div class="d-flex flex-column">
								<span class="font-weight-bold" style="font-size: large">
									Razorpay
								</span>
								<span style="font-size: small">
									Secure And Trusted Payment Gateway
								</span>
							</div>
							<v-spacer></v-spacer>
							<v-icon icon="mdi-chevron-right"></v-icon>
						</div>
					</div>

					<div class="rounded-xl pa-5 mt-5" style="border: 3px solid #64ffda">
						<div
							class="d-flex align-center pb-3"
							style="cursor: pointer"
							@click="onClickAdminByPass"
						>
							<v-icon
								icon="mdi-credit-card mx-2"
								color="teal-lighten-1"
								size="x-large"
							></v-icon>
							<div class="d-flex flex-column">
								<span class="font-weight-bold" style="font-size: large">
									Admin Bypass
								</span>
								<span style="font-size: small">
									(until we have approval from razorpay)
								</span>
							</div>
							<v-spacer></v-spacer>
							<v-icon icon="mdi-chevron-right"></v-icon>
						</div>
					</div>
					<div class="mt-5" style="border: 1px solid #64ffda"></div>
					<div class="mt-5 pa-2 d-flex align-center bg-teal-lighten-1 rounded-lg">
						<v-icon icon="mdi-shield" class="mx-3"></v-icon>
						<span style="font-size: small">
							All payment information is encrypted with SSL for secure transactions
						</span>
					</div>
				</div>
			</v-card>
		</div>
	</v-dialog>
</template>

<script lang="ts">
import { useUserDetails } from '@/stores/userDetails';
import { storeToRefs } from 'pinia';
import { computed, defineComponent, Ref, ref } from 'vue';
import PricingCard from './PricingCard.vue';
import { PlanType, type PricingCardDetails, type SubscriptionType } from './Types';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { updateSubscription } from '../Queries';
import { useToast, TYPE } from 'vue-toastification';

export default defineComponent({
	name: 'PricingPageContainer',
	components: {
		PricingCard,
	},
	setup() {
		const { isLoggedIn } = storeToRefs(useUserDetails());
		const queryClient = useQueryClient();
		const toast = useToast();

		const subscriptionTypeFromCardSelection: Ref<SubscriptionType | null> = ref(null);

		const updateSubscriptionDetails = useMutation({
			mutationFn: updateSubscription,
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: ['subscriptionDetails'],
				});
				toast('Subscription Updated Successfully', {
					type: TYPE.SUCCESS,
				});
				paymentMethodDialogModel.value = false;
			},
		});

		const paymentMethodDialogModel = ref(false);

		const FAQQuestions = [
			{
				question: 'Can I change my plan anytime?',
				answer: 'Yes, you can upgrade or downgrade your plan at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle.',
			},
			{
				question: 'Do unused credits roll over?',
				answer: 'Monthly plan credits do not roll over to the next month. Yearly plan credits are valid for the entire subscription period. We recommend choosing a plan based on your actual usage needs.',
			},
			{
				question: 'What payment methods are supported?',
				answer: 'We support credit cards, debit cards, Alipay, WeChat Pay, and various other payment methods. All payments are processed through secure third-party payment platforms.',
			},
		];

		const currentTab = ref(0);

		const pricingDetailsMonthly: Array<PricingCardDetails> = [
			{
				type: 'Free',
				icon: 'mdi-flash',
				subtitle: 'Perfect for individuals and light users',
				price: 0,
				timePeriod: 'month',
				planBenifits: ['5 GB storage /month', 'Download/Upload images'],
			},
			{
				type: 'Basic',
				icon: 'mdi-rocket-launch',
				subtitle: 'Best for professional creators',
				price: 99,
				timePeriod: 'month',
				planBenifits: [
					'30 GB storage /month',
					'Download/Upload images',
					'Get Insights on your trips using AI',
					'Basic customer support',
					'API support (Coming soon)',
				],
			},
			{
				type: 'Pro',
				icon: 'mdi-crown',
				subtitle: 'Best for user with heavy data and usage',
				price: 299,
				timePeriod: 'month',
				planBenifits: [
					'100 GB storage /month',
					'Download/Upload images',
					'Get Insights on your trips using AI',
					'Priority customer support',
					'API support (Coming soon)',
				],
			},
		];

		const pricingDetailsYearly: Array<PricingCardDetails> = [
			{
				type: 'Free',
				icon: 'mdi-flash',
				subtitle: 'Perfect for individuals and light users',
				price: 0,
				timePeriod: 'month',
				planBenifits: ['5 GB storage /month', 'Download/Upload images'],
			},
			{
				type: 'Basic',
				icon: 'mdi-rocket-launch',
				subtitle: 'Best for professional creators',
				price: 83,
				timePeriod: 'month',
				planBenifits: [
					'30 GB storage /month',
					'Download/Upload images',
					'Get Insights on your trips using AI',
					'Basic customer support',
					'API support (Coming soon)',
				],
				strikeThroughPrice: 99,
			},
			{
				type: 'Pro',
				icon: 'mdi-crown',
				subtitle: 'Best for user with heavy data and usage',
				price: 250,
				timePeriod: 'month',
				planBenifits: [
					'100 GB storage /month',
					'Download/Upload images',
					'Get Insights on your trips using AI',
					'Priority customer support',
					'API support (Coming soon)',
				],
				strikeThroughPrice: 299,
			},
		];

		const pricingCardInfo = computed(() =>
			currentTab.value === 0 ? pricingDetailsMonthly : pricingDetailsYearly,
		);

		const onClickAdminByPass = () => {
			// assume that the payment has been succeeded
			updateSubscriptionDetails.mutate({
				subscriptionType: subscriptionTypeFromCardSelection.value,
				planType: currentTab.value === 0 ? PlanType.Monthly : PlanType.Yearly,
			});
		};

		const onClickSubscribe = (subscriptionType: SubscriptionType) => {
			paymentMethodDialogModel.value = true;
			subscriptionTypeFromCardSelection.value = subscriptionType;
		};

		return {
			currentTab,
			isLoggedIn,
			pricingCardInfo,
			FAQQuestions,
			paymentMethodDialogModel,
			onClickSubscribe,
			onClickAdminByPass,
		};
	},
});
</script>
