export const MARKETS = ["egypt", "saudi", "uae", "lebanon"] as const;

export type MarketKey = (typeof MARKETS)[number];
