import { DataStoreService, Players, Workspace } from "@rbxts/services";

function setupLeaderboard() {
	const RebirthsStore = DataStoreService.GetOrderedDataStore("Rebirths");
	const leaderboard = Workspace.Spawn.Leaderboard;
	const list = leaderboard.LeaderboardGui.Container.PlayersContainer;
	const item = leaderboard.Item;

	const [success, pages] = pcall(() => RebirthsStore.GetSortedAsync(true, 10));
	if (!success) return;

	const entries = pages.GetCurrentPage();
	for (const [rank, entry] of pairs(entries)) {
		const clonedItem = item.Clone();
		const username = Players.GetNameFromUserIdAsync(tonumber(entry.key)!);
		if (!username) continue;

		clonedItem.Name = username;
		clonedItem.Player.Text = username;
		clonedItem.Rank.Text = tostring(rank);
		clonedItem.Rebirths.Text = tostring(entry.value);

		clonedItem.Parent = list;
	}
}

setupLeaderboard();
