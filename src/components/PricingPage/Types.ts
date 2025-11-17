export type PricingCardDetails = {
	type: 'Free' | 'Basic' | 'Pro';
	icon: string;
	subtitle: string;
	price: number;
	timePeriod: 'month' | 'year';
	planBenifits: string[];
	strikeThroughPrice?: number;
};

export enum SubscriptionType {
	Free,
	Basic,
	Pro,
}

export enum PlanType {
	Monthly,
	Yearly,
	Free,
}
