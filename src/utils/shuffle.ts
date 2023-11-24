export default function shuffle<T> (arr:T[]) {
	const res = [...arr];

	for (let i = 0; i < res.length; i++) {
		const destinationIndex = Math.floor(Math.random() * (res.length));
		const temp = res[i];
		res[i] = res[destinationIndex];
		res[destinationIndex] = temp;
	}

	return (res);
}