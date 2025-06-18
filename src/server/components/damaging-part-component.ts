import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";

interface Attributes {
	Damage: number;
}

@Component({
	tag: "DamagingPart",
	defaults: {
		Damage: 5,
	},
})
export class DamagingPartComponent extends BaseComponent<Attributes, BasePart> implements OnStart {
	public onStart() {
		this.instance.Touched.Connect((otherPart) => {
			const humanoid = otherPart.Parent?.FindFirstChildOfClass("Humanoid");
			if (!humanoid) return;

			humanoid.Health -= this.attributes.Damage;
		});
	}
}
