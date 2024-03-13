import { createElement } from "@utils/createElement";
import { htmlToElement } from "@utils/htmlToElement";
import AbstractComponent from "./AbstractComponent";

export default class FriendBlock extends AbstractComponent {
	constructor(options = {}) {
		super();

		let statusColor;
		if (options.status == "online") {
			statusColor = "green";
		} else if (options.status == "in game") {
			statusColor = "orange";
		} else
			statusColor = "red";

		options.avatar = options.avatar || "../js/assets/images/default-avatar.webp";

		this.shadowRoot.innerHTML += `
		<style>
			* {
				margin: 0;
				padding: 0;
			}
			#container {
				padding: 0px 10px 10px 10px;
				width: 250px;
				display: flex;
				flex-direction: row;
				align-items: center;
			}
			#img-container {
				width: 50px;
				height: 50px;
			}
			img {
				width: 100%;
				height: 100%;
				object-fit: contain;
				border-radius: 15px;
				border: 1px solid rgba(255, 255, 255, 0.2);
				box-shadow: 0 0 20px rgba(0, 0, 0, 0.7);
			}
			#info-container {
				display: flex;
				flex-direction: row;
				align-items: center;
			}
			h2, #status {
				padding: 0px 10px 0px 10px;
			}
			#status {
				position: absolute;
				right: 0;
				display: flex;
				flex-direction: row;
				align-items: center;
				color: ${statusColor};
			}
			#status-circle {
				width: 15px;
				height: 15px;
				margin-right: 5px;
				background-color: ${statusColor};
				border-radius: 50%;
			}
		</style>
		<div id="container">
			<div id="img-container">
				<img src="${options.avatar}" alt = "Avatar" />
			</div>
			<div id="info-container">
				<h2>${options.userName}</h2>
				<div id="status">
					<div id="status-circle"></div>
					<p>${options.status}</p>
				</div>
			</div>
		</div>
		`;

		if (options.style) {
			for (const key in options.style) {
				if (options.style.hasOwnProperty(key)) {
					this.style.setProperty(key, options.style[key]);
				}
			}
		}
	}
}

customElements.define('friend-block', FriendBlock);