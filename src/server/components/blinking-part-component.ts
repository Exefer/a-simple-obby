import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { TweenService } from "@rbxts/services";

interface Attributes {
	FadeInDelay: number;
	FadeOutDelay: number;
	FadeInDuration: number;
	FadeOutDuration: number;
	Cooldown: number;
}

@Component({
	tag: "BlinkingPart",
	defaults: {
		FadeInDelay: 3,
		FadeOutDelay: 3,
		FadeInDuration: 3,
		FadeOutDuration: 3,
		Cooldown: 0,
	},
})
export class BlinkingPartComponent extends BaseComponent<Attributes, BasePart> implements OnStart {
	public onStart() {
		const fadeOut = TweenService.Create(
			this.instance,
			new TweenInfo(this.attributes.FadeOutDuration, Enum.EasingStyle.Quad, Enum.EasingDirection.Out),
			{
				Transparency: 1,
				CanCollide: false,
				CanTouch: false,
			},
		);
		const fadeIn = TweenService.Create(
			this.instance,
			new TweenInfo(this.attributes.FadeInDuration, Enum.EasingStyle.Quad, Enum.EasingDirection.In),
			{
				Transparency: 0,
				CanCollide: true,
				CanTouch: true,
			},
		);

		fadeOut.Play();
		fadeOut.Completed.Connect(() => {
			task.wait(this.attributes.FadeInDelay);
			fadeIn.Play();
			fadeIn.Completed.Wait();
			task.wait(this.attributes.FadeOutDelay);
			fadeOut.Play();
			task.wait(this.attributes.Cooldown);
		});
	}
}
