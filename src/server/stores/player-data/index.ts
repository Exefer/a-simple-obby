import { createPlayerStore } from "@rbxts/lyra";
import { PlayerDataConfig } from "./config";

export const PlayerDataStore = createPlayerStore({
	name: "PlayerData",
	template: PlayerDataConfig.DataStructure,
	schema: PlayerDataConfig.Schema,
	changedCallbacks: PlayerDataConfig.ChangedCallbacks,
});
