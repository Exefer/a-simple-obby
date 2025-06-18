interface Workspace extends Model {
	Spawn: Folder & {
		Leaderboard: Part & {
			Weld: Weld;
			Item: Frame & {
				UIListLayout: UIListLayout;
				Player: TextLabel;
				Rebirths: TextLabel;
				Rank: TextLabel;
			};
			LeaderboardGui: SurfaceGui & {
				Container: Frame & {
					Header: Frame & {
						UIListLayout: UIListLayout;
						Player: TextLabel;
						Rebirths: TextLabel;
						Rank: TextLabel;
					};
					PlayersContainer: ScrollingFrame & {
						UIListLayout: UIListLayout;
					};
				};
			};
		};
	};
}
