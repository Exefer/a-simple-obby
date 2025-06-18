export interface OnCheckpointReached {
	onCheckpointReached(checkpointIndex: number): void;
}

export interface OnPlayerJoined {
	onPlayerJoined(checkpointIndex: number): void;
}
