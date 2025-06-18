import { Controller, Modding, OnStart } from "@flamework/core";
import { OnCheckpointReached } from "client/listeners";
import { Events } from "client/networking";

@Controller()
export class OnCheckpointReachedController implements OnStart {
	public onStart(): void {
		const listeners = new Set<OnCheckpointReached>();

		Modding.onListenerAdded<OnCheckpointReached>((object) => listeners.add(object));
		Modding.onListenerRemoved<OnCheckpointReached>((object) => listeners.delete(object));

		Events.checkpointReached.connect((checkpointIndex) => {
			for (const listener of listeners) {
				task.spawn(() => listener.onCheckpointReached(checkpointIndex));
			}
		});
	}
}
