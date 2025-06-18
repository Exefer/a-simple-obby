import { Players, RunService } from "@rbxts/services";

const LocalPlayer = Players.LocalPlayer;

export const IS_SERVER = RunService.IsServer();
export const IS_CLIENT = RunService.IsClient();
export const IS_DEV = RunService.IsStudio();
export const IS_PROD = !IS_DEV;
export const IS_STUDIO = !RunService.IsRunning();

/** @client */
export const PlayerGui =
	IS_CLIENT && RunService.IsRunning()
		? (LocalPlayer.WaitForChild("PlayerGui") as PlayerGui)
		: (undefined as unknown as PlayerGui);
