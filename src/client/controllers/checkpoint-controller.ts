import { Controller } from "@flamework/core";
import { ReplicatedStorage, SoundService, TweenService, Workspace } from "@rbxts/services";
import { OnCheckpointReached, OnPlayerJoined } from "client/listeners";

@Controller()
export class CheckpointController implements OnPlayerJoined, OnCheckpointReached {
	private readonly ARROW_DISTANCE_FROM_CHECKPOINT = 5;
	private readonly ARROW_RISE_UP_DISTANCE = 3;
	private readonly ARROW_RISE_UP_TIME = 1.25;
	private checkpointSound: Sound = SoundService.WaitForChild("CheckpointReached") as Sound;
	private arrow: Model | undefined;
	private tween: Tween | undefined;

	public onPlayerJoined(checkpointIndex: number): void {
		this.arrow = ReplicatedStorage.WaitForChild("Models").WaitForChild("Arrow").Clone() as Model;
		this.arrow.Parent = Workspace.WaitForChild("Levels");
		this.moveArrowToCheckpoint(checkpointIndex + 1);
	}

	public onCheckpointReached(checkpointIndex: number): void {
		this.checkpointSound.Play();
		this.moveArrowToCheckpoint(checkpointIndex + 1);
	}

	private moveArrowToCheckpoint(checkpointIndex: number): void {
		const checkpoint = this.getCheckpointFromIndex(checkpointIndex);
		if (!checkpoint) {
			this.arrow?.Destroy();
			this.arrow = undefined;
			return;
		}

		const targetPosition = checkpoint.CFrame.Position.add(new Vector3(0, this.ARROW_DISTANCE_FROM_CHECKPOINT, 0));
		this.arrow?.MoveTo(targetPosition);
		this.createTween();
	}

	private getCheckpointFromIndex(checkpointIndex: number): SpawnLocation | undefined {
		return Workspace.WaitForChild("Levels")
			.FindFirstChild(tostring(checkpointIndex))
			?.FindFirstChild("Checkpoint") as SpawnLocation;
	}

	private createTween(): void {
		if (!this.arrow) return;

		if (this.tween) {
			this.tween.Cancel();
			this.tween = undefined;
		}

		this.tween = TweenService.Create(
			this.arrow.PrimaryPart!,
			new TweenInfo(this.ARROW_RISE_UP_TIME, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut, -1, true),
			{
				Position: this.arrow.PrimaryPart?.Position.add(new Vector3(0, this.ARROW_RISE_UP_DISTANCE, 0)),
			},
		);
		this.tween.Play();
	}
}
