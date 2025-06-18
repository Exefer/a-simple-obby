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
	tag: "FadingPart",
	defaults: {
		FadeInDelay: 3.5,
		FadeOutDelay: 0.4,
		FadeInDuration: 1,
		FadeOutDuration: 1,
		Cooldown: 0.5,
	},
})
export class FadingPartComponent extends BaseComponent<Attributes, BasePart> implements OnStart {
	private debounce = false;

	public onStart() {
		const fadeOut = TweenService.Create(
			this.instance,
			new TweenInfo(this.attributes.FadeOutDuration, Enum.EasingStyle.Quad, Enum.EasingDirection.Out),
			{ Transparency: 1, CanCollide: false },
		);
		const fadeIn = TweenService.Create(
			this.instance,
			new TweenInfo(this.attributes.FadeInDuration, Enum.EasingStyle.Quad, Enum.EasingDirection.In),
			{ Transparency: 0, CanCollide: true },
		);

		this.instance.Touched.Connect((otherPart) => {
			const humanoid = otherPart.Parent?.FindFirstChildOfClass("Humanoid");
			if (!humanoid) return;
			if (this.debounce) return;
			this.debounce = true;

			task.wait(this.attributes.FadeOutDelay);

			fadeOut.Play();
			fadeOut.Completed.Wait();

			task.wait(this.attributes.FadeInDelay);

			fadeIn.Play();
			fadeIn.Completed.Wait();

			task.wait(this.attributes.Cooldown);

			this.debounce = false;
		});
	}
}
