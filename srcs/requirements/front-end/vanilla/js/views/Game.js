import AbstractView from "./AbstractView";

export default class Game extends AbstractView {
	constructor(element) {
		super(element);
	}

	async getHtml() {
		return `
		<div class="card">
			<h1>Game</h1>
		</div>
		`;
	}

}