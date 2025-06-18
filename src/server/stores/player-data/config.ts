import { t } from "@rbxts/t";

export type PlayerData = t.static<typeof Schema>;

const DataStructure: PlayerData = {
	Gameplay: {
		TimeSpent: 0,
		CurrentCheckpoint: 0,
	},
	Products: {
		Gamepasses: new Set(),
		TotalRobuxSpent: 0,
	},
};

const GameplaySchema = t.strictInterface({
	TimeSpent: t.number,
	CurrentCheckpoint: t.number,
});

const ProductsSchema = t.strictInterface({
	Gamepasses: t.set(t.string),
	TotalRobuxSpent: t.number,
});

const Schema = t.strictInterface({
	Gameplay: GameplaySchema,
	Products: ProductsSchema,
});

const ChangedCallbacks: Array<() => void> = [];

export const PlayerDataConfig = {
	DataStructure,
	Schema,
	ChangedCallbacks,
};
