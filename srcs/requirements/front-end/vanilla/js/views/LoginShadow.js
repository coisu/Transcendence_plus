import { makeApiRequest } from "../utils/makeApiRequest";
import AbstractView from "./AbstractView";
import { getCookie } from "@utils/getCookie";
import { createElement } from "@utils/createElement";
import { htmlToElement } from "@utils/htmlToElement";
// import '@css/login.css';
import styles from '@css/login.css?raw';
import loginPageSource from "@views/loginPageSource";
// import { this.toggleClass, this.prop, this.fadeIn, this.fadeOut } from "@utils/jqueryUtils";

export default class LoginPage extends HTMLElement {
	constructor(element) {
		super(element);

		this.eventListeners = {} // garbage bin for my event listeners

		this.attachShadow({ mode: 'open' });
		
		// inject css into the shadow dom
		const styleEl = document.createElement('style');
		styleEl.textContent = styles;
		this.shadowRoot.appendChild(styleEl);
		
		// inject raw html into shadow dom
		this.shadowRoot.innerHTML += loginPageSource;
	}

	// this function gets called when the custom component gets added to the dom
	connectedCallback() {
		console.log('connectedCallback() called\n\n');
		this.setupEventListeners();
	}

	// this function gets called when the custom component is removed from the dom
	disconnectedCallback() {
		console.log('disconnectedCallback() called\n\n');
	}

	// garbage collection for my event listeners
	addTrackedListener(target, type, listener, options) {
		target.addEventListener(type, listener, options);
		this.eventListeners.push({ target, type, listener }); // Store the listener details
	}

	setupEventListeners() {
		let clickableElems = {
			'#closeLoginPopup': this.closeLoginPopup,
			'#submitOneTimeCode': this.submitOneTimeCode,
			'#closeForgotPasswordModal': this.closeForgotPasswordModal,
			'#sendUrlToEmail': this.sendUrlToEmail,
			'#closeSignupPopup': this.closeSignupPopup,
			'#sendVerificationCode': this.sendVerificationCode,
			'#verifyCode': this.verifyCode,
			'#openPrivacyPolicyPopup': this.openPrivacyPolicyPopup,
			'#closePrivacyPolicyPopup': this.closePrivacyPolicyPopup,
		}
		
		clickableElems.forEach(selector, action => {
			this.addTrackedListener(selector, "click", action);
		})

		this.updateSignupButtonStatus();
		this.toggleClass("#signupButton", "enabled", false);
	
		this.shadowRoot.querySelectorAll("#signupForm input").forEach(input => {
			// this.addTrackedListener(input, "input", this.updateSignupButtonStatus);
			input.addEventListener("input", () => {
				this.updateSignupButtonStatus();
			});
		});

		// let devDbButton = this.shadowRoot.querySelector('#devDbButton');
		// this.addTrackedListener(devDbButton, "click", this.getDevSetting);
		this.shadowRoot.querySelector('#devDbButton').addEventListener("click", () => {
			makeApiRequest('/api/user_management/auth/developer_setting', 'GET')
			.then(response => {
				if (response.ok) {
					console.log('Print all user data successful:', response);
					// window.location.href = '/api/user_management/auth/developer_setting';
				} else {
					console.log('Error Cannot print user data:', response.statusText);
				}
			})
			.catch(error => {
				console.error('Error Cannot print user data:', error);
			});
		});

		var signupClicked = false;

		this.shadowRoot.querySelector("#forgotPasswordLink").addEventListener("click", () => {
			this.fadeIn("#darkLayer");
			this.fadeIn("#forgotPasswordModal");
		});
	
		this.shadowRoot.querySelector("#signupLink").addEventListener("click", (event) => {
			event.stopPropagation()
			signupClicked = true;
			console.log('close login popup');
			this.fadeIn("#darkLayer");
			console.log('opacity applied');
			this.fadeIn("#signupPopup");
			console.log('fade in signup popup\n\n');
		});

		this.shadowRoot.querySelector("#loginLink").addEventListener("click", () => {
			console.log('log in link clicked');
			if (!signupClicked) {
				this.fadeIn("#darkLayer");
				console.log('opacity applied');
				this.fadeIn("#loginPopup");
				console.log('fade in login popup\n\n');
			}
			signupClicked = false; // Reset the flag after handling the click
		});
	}

	checkPasswordMatch() {
		var password = this.shadowRoot.querySelector("#signupForm input[name='password']").value;
		var confirmPassword = this.shadowRoot.querySelector("#confirmPassword").value;

		if (password !== confirmPassword) {
			this.shadowRoot.querySelector("#confirmPasswordError").textContent = "Passwords do not match";
		} else {
			this.shadowRoot.querySelector("#confirmPasswordError").textContent = "";
		}
	}

	updateSignupButtonStatus = () => {
		console.log('updateSignupButtonStatus() called\n\n');

		var form = this.shadowRoot.querySelector("#signupForm");
		var allFieldsFilled = Array.from(form.elements).every((element) => {
			return element.checkValidity();
		});

		var password = this.shadowRoot.querySelector("#signupForm input[name='password']").value;
		var confirmPassword = this.shadowRoot.querySelector("#confirmPassword").value;
		var isPasswordMatch = password === confirmPassword;

		var isCodeVerified = this.shadowRoot.querySelector("#successMessage").textContent === "Verified successfully";

		if (allFieldsFilled && isPasswordMatch && isCodeVerified) {
			this.prop("#signupButton", "disabled", false);
			console.log('BUTTON: need to be enable\n\n');
			
		} else {
			this.prop("#signupButton", "disabled", true);
		}
		this.toggleClass("#signupButton", "enabled", allFieldsFilled && isPasswordMatch && isCodeVerified);
	}

	sendVerificationCode() {
		var email = this.shadowRoot.querySelector("#signupEmail").value;
		makeApiRequest('/api/user_management/auth/access_code',
					'POST',
					{ 'email': email },
					{ 'X-CSRFToken': getCookie('csrftoken') })
		.then(response => response.json)
		.then(data => {
			if (data.success) {
				console.log('Code sent successfully');
			} else {
				console.log('Failed to send code:', data.error_message);
			}
		});
	}
	
	openPrivacyPolicyPopup() {
		fetch("/api/user_management/auth/policy")
		.then(response => response.text())
		.then(data => {
			this.shadowRoot.querySelector("#privacyPolicyPopup").innerHTML = data;
			this.shadowRoot.querySelector("#privacyPolicyPopup").style.display = "block";
		});
	}
	
	closePrivacyPolicyPopup() {
		this.fadeOut("#privacyPolicyPopup");
	}

	closeForgotPasswordModal() {
		this.fadeOut("#darkLayer");
		this.fadeOut("#forgotPasswordModal");
	}
	
	closeSignupPopup() {
		// $("#darkLayer").this.fadeOut();
		this.fadeOut("#signupPopup");
		console.log('closeSignupPopup() called\n\n');
	}

	closeLoginPopup() {
		this.fadeOut("#darkLayer");
		this.fadeOut("#loginPopup");
		console.log('closeLoginPopup() called\n\n');
	}

	closeSignupPopup() {
		// $("#darkLayer").this.fadeOut();
		this.fadeOut("#signupPopup");
		console.log('closeSignupPopup() called\n\n');
	}

	displayErrorMessage(message) {
		this.shadowRoot.getElementById('errorMessage').textContent = message;
		this.shadowRoot.getElementById('errorMessage').style.color = 'red';
	}

	// window.addEventListener("message", (event) => {
	// 	if (event.data.type === "checkboxStateChange") {
	// 		this.shadowRoot.getElementById('agreementCheckbox').checked = event.data.checked;
	// 	}
	// }, false);
	
	verifyCode(context) {
		var email = this.shadowRoot.querySelector("#signupEmail").value;
		var verificationCode = this.shadowRoot.querySelector("#verificationCode").value;
		makeApiRequest('/api/user_management/auth/verify_code',
					'POST',
					{ 'email': email, 'one_time_code': verificationCode, 'context': context },
					{ 'X-CSRFToken': getCookie('csrftoken') })
		.then(response => response.json())
		.then(data => {
			if (data.success) {
				console.log('Code verified successfully');
				this.shadowRoot.querySelector("#successMessage").textContent = "Verified successfully";
				updateSignupButtonStatus();
				// submitSignupForm();
			} else {
				console.log('Failed to verify code:', data.error_message);
			}
		})
		.catch(() => {
			console.log('An error occurred while processing your request.');
		});
	}
	
	submitSignupForm() {
		formData = new FormData(this.shadowRoot.querySelector('#signupForm'));
		makeApiRequest('/api/user_management/auth/signup',
					'POST',
					formData,
					{	'X-CSRFToken': getCookie('csrftoken'),
						'Content-Type': 'application/x-www-form-urlencoded' })
		.then(response => response.json())
		.then(data => {
			if (data.success) {
				console.log('signed up success\n\n');
				closeSignupPopup();
			} else {
				this.shadowRoot.querySelector('#signupPopupError').textContent = data.error_message;
			}
		})
		.catch(() => {
			console.log('An error occurred while processing your request.');
		});
	}

	submitLoginForm() {
		var formData = new FormData(this.shadowRoot.querySelector('#loginForm'));
		makeApiRequest('/api/user_management/auth/login',
					'POST',
					formData,
					{	'X-CSRFToken': getCookie('csrftoken'),
						'Content-Type': 'application/x-www-form-urlencoded' })
		.then(response => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error('An error occurred while processing your request.');
			}
		})
		.then(data => {
			console.log('Login successful:', data);
			if (data.requires_2fa) {
				this.shadowRoot.querySelector('#loginForm').style.display = 'none'; // hide
				this.shadowRoot.querySelector('#forgotPasswordLink').style.display = 'none'; // hide
				this.shadowRoot.querySelector('#signupLink').style.display = 'none'; // hide
				this.shadowRoot.querySelector('#oneTimeCodeSection').style.display = 'block'; // show
			} else {
				console.log('2FA not required');
			}
		})
		.catch(error => {
			console.log('An error occurred while processing your request.');
			console.error(error);
			displayErrorMessage('An error occurred while processing your request.');
		});
	}

	submitOneTimeCode(context) {
		var oneTimeCode = this.shadowRoot.querySelector('input[name="one_time_code"]').value;
		console.log('submitOneTimeCode submit');
		makeApiRequest('/api/user_management/auth/verify_code', 
					'POST', 
					{ 'one_time_code': oneTimeCode, 'context': context },
					{ 'X-CSRFToken': getCookie('csrftoken') })
		.then(response => {
			if (response.ok) {
				console.log('One-time code verification successful:', response);
				this.closeLoginPopup();
				// window.location.href = '';
			} else {
				console.log('One-time code verification failed:', response.statusText);
				displayErrorMessage('An error occurred while processing your request.');
			}
		})
		.catch(error => {
			console.log('One-time code verification failed.');
			console.error(error);
			displayErrorMessage('An error occurred while processing your request.');
		})
	}
	
	sendUrlToEmail() {
		var username = this.shadowRoot.querySelector('input[name="username_f"]').value;
		makeApiRequest('/api/user_management/auth/sendResetLink', 
					'POST', 
					{ 'username': username }, 
					{ 'X-CSRFToken': getCookie('csrftoken') })
		.then(response => {
			console.log('Status Code:', response.status);
			console.log('Response Body:', response.body);
			if (response.ok) {
				console.log('Password reset link sent successfully:', response);
				closeForgotPasswordModal();
			} else {
				console.log('Error sending reset Link:', response.statusText);
			}
		})
		.catch(error => {
			console.log('Error sending reset Link:', error);
		});
		return false;
	}

	// add or remove a class from all elements matching the selector
	toggleClass(selector, className, state) {
		const elements = document.querySelectorAll(selector);
		elements.forEach((element) => {
			// If state is defined, add or remove based on its boolean value
			// If state is undefined, toggle based on the element's current class state
			if (typeof state !== 'undefined') {
				if (state) {
					element.classList.add(className);
				} else {
					element.classList.remove(className);
				}
			} else {
				element.classList.toggle(className);
			}
		});
	}

	// set property value for all elements matching the selector
	prop(selector, property, value) {
		const elements = this.shadowRoot.querySelectorAll(selector);
		elements.forEach((element) => {
			element[property] = value;
		});
	}
	
	// add '.in' class after 10ms
	fadeIn(selector) {
		const element = this.shadowRoot.querySelector(selector);
		element.style.display = 'block'; // reset the display property to its default value
		element.classList.add('fade');
		setTimeout(() => element.classList.add('in'), 199); // 10ms delay to allow the DOM to update
	}
	
	// remove '.fade' class after the transition is done
	fadeOut(selector) {
		const element = this.shadowRoot.querySelector(selector);
		element.style.display = 'none'; // hide the element after the transition is done
		element.classList.remove('in');
		setTimeout(() => element.classList.remove('fade'), 500); // 500ms delay to allow the transition to finish (adjust to match the transition duration in the CSS file)
	}
	
}
	
customElements.define('login-page', LoginPage);
	