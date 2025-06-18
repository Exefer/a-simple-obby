import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";

interface Attributes {}

@Component({
	tag: "KillPart",
})
export class KillPartComponent extends BaseComponent<Attributes, BasePart> implements OnStart {
	public onStart() {
		this.instance.Touched.Connect((otherPart) => {
			const humanoid = otherPart.Parent?.FindFirstChildOfClass("Humanoid");
			if (!humanoid) return;

			humanoid.Health = 0;
		});
	}
}
