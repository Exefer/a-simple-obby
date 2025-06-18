import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";
import { Leaderstats } from "server/modules/leaderstats";
import { Events } from "server/networking";
import { PlayerDataStore } from "server/stores/player-data";
import { getLogger } from "shared/utils/setup-logger";

interface Attributes {}

@Component({
	tag: "Checkpoint",
})
export class CheckpointComponent extends BaseComponent<Attributes, SpawnLocation> implements OnStart {
	private readonly CHECKPOINT_INDEX = tonumber(this.instance.FindFirstAncestorOfClass("Folder")?.Name)!;
	private readonly logger = getLogger();

	public onStart() {
		this.instance.Touched.Connect((otherPart) => {
			const character = otherPart.FindFirstAncestorOfClass("Model");
			if (!character) return;

			const player = Players.GetPlayerFromCharacter(character);
			if (!player || player.RespawnLocation === this.instance) return;

			const humanoid = character.FindFirstChildOfClass("Humanoid")!;
			if (!humanoid || humanoid.GetState() === Enum.HumanoidStateType.Dead) return;

			if (this.CHECKPOINT_INDEX !== Leaderstats.getValues(player).Checkpoints + 1) return;

			this.logger.Debug(
				`Checkpoint ${this.CHECKPOINT_INDEX} reached! Player was at checkpoint ${Leaderstats.getValues(player).Checkpoints}`,
			);

			player.RespawnLocation = this.instance;

			Leaderstats.updateValues(player, {
				Checkpoints: this.CHECKPOINT_INDEX,
			});

			PlayerDataStore.updateAsync(player, (data) => {
				data.Gameplay.CurrentCheckpoint = this.CHECKPOINT_INDEX;
				return true;
			});

			Events.checkpointReached.fire(player, this.CHECKPOINT_INDEX);
		});
	}
}
