import { createElement } from "@utils/createElement";
import { htmlToElement } from "@utils/htmlToElement";
import AbstractComponent from "./AbstractComponent";
import actionButtonStyles from '@css/ActionButtonV2.css?raw';
import normalButtonStyles from '@css/NormalButtonV2.css?raw';
import deleteButtonStyles from '@css/DeleteButton.css?raw';

export default class CustomButton extends AbstractComponent {
	constructor(options = {}) {
		super();

		const styleEl = document.createElement('style');
		if (options.action) {
			styleEl.textContent = actionButtonStyles;
		} else if (options.delete) {
			styleEl.textContent = deleteButtonStyles;
		} else {
			styleEl.textContent = normalButtonStyles;
		}
		this.shadowRoot.appendChild(styleEl);

		let p = document.createElement('p');
		p.id = "buttonText"

		p.textContent = options.content ? options.content : "Go !";

		// if (options.style) {
		// 	for (const [key, value] of Object.entries(options.style)) {
		// 		console.log(key);
		// 		console.log(value);
		// 		this.shadowRoot.host.style.setProperty(key, value);
		// 	}
		// }

		if (options.style) {
			for (const key in options.style) {
				if (options.style.hasOwnProperty(key)) {
					this.style.setProperty(key, options.style[key]);
				}
			}
		}

		this.shadowRoot.appendChild(p);
	}
}

customElements.define('custom-button', CustomButton);