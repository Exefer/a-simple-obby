import { Controller, Modding, OnStart } from "@flamework/core";
import { OnPlayerJoined } from "client/listeners";
import { Events } from "client/networking";

@Controller()
export class OnPlayerJoinedController implements OnStart {
	public onStart(): void {
		const listeners = new Set<OnPlayerJoined>();

		Modding.onListenerAdded<OnPlayerJoined>((object) => listeners.add(object));
		Modding.onListenerRemoved<OnPlayerJoined>((object) => listeners.delete(object));

		Events.playerJoined.connect((checkpointIndex) => {
			for (const listener of listeners) {
				task.spawn(() => listener.onPlayerJoined(checkpointIndex));
			}
		});
	}
}
