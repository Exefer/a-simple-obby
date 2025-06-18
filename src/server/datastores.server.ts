import { DataStoreService, Players, Workspace } from "@rbxts/services";
import { Leaderstats } from "server/modules/leaderstats";
import { Events } from "server/networking";
import { PlayerDataStore } from "server/stores/player-data";
import { IS_STUDIO } from "shared/utils/constants";
import { getLogger } from "shared/utils/setup-logger";

// TODO: Reorganize this into a Service

const RebirthsStore = DataStoreService.GetOrderedDataStore("Rebirths");
const logger = getLogger();

Players.PlayerAdded.Connect((player: Player) => {
	PlayerDataStore.loadAsync(player);

	const playerData = PlayerDataStore.getAsync(player);

	Leaderstats.setup(player, { Checkpoints: playerData.Gameplay.CurrentCheckpoint });

	if (playerData.Gameplay.CurrentCheckpoint !== 0) {
		player.RespawnLocation = Workspace.WaitForChild("Levels")
			.WaitForChild(tostring(playerData.Gameplay.CurrentCheckpoint))
			.WaitForChild("Checkpoint") as SpawnLocation;

		player.LoadCharacter();
	}

	Events.playerJoined.fire(player, playerData.Gameplay.CurrentCheckpoint);

	const [success, result] = pcall(() => {
		return RebirthsStore.GetAsync(tostring(player.UserId));
	});

	if (!success) return;
	Leaderstats.updateValues(player, { Rebirths: result });
});

Players.PlayerRemoving.Connect((player: Player) => {
	PlayerDataStore.unloadAsync(player);

	const [success, err] = pcall(() => {
		RebirthsStore.SetAsync(tostring(player.UserId), Leaderstats.getValues(player).Rebirths);
	});

	if (success) return;
	logger.Error(`An error occured: ${err}`);
});

game.BindToClose(() => {
	if (IS_STUDIO) return;
	PlayerDataStore.closeAsync();
	const MAX_RETRIES = 3;
	const RETRY_DELAY = 0.1;

	for (const player of Players.GetPlayers()) {
		Promise.retryWithDelay(
			() =>
				new Promise((resolve, reject) => {
					const [success, err] = pcall(() =>
						RebirthsStore.SetAsync(tostring(player.UserId), Leaderstats.getValues(player).Rebirths),
					);
					if (success) resolve(true);
					else reject(err);
				}),
			MAX_RETRIES,
			RETRY_DELAY,
		).await();
	}
});
