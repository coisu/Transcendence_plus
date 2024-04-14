class Overlay extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="../../css/Overlay.css">
            <div class="overlay">
                <span class="closebtn">&times;</span>
                <div class="overlay-content">
                    <slot></slot>
                </div>
            </div>
        `;

        this.overlay = this.shadowRoot.querySelector('.overlay');
        this.closeButton = this.shadowRoot.querySelector('.closebtn');
        this.closeButton.addEventListener('click', () => this.hide());
    }

    connectedCallback() {
        if (!this.hasAttribute('role'))
            this.setAttribute('role', 'dialog');
    }

    show() {
        console.log('showing overlay');
        this.overlay.style.visibility = 'visible';
        this.overlay.style.height = '100%';
    }

    hide() {
        console.log('hiding overlay');
        this.overlay.style.height = '0%';
        setTimeout(() => {
            this.overlay.style.visibility = 'hidden';
        }, 500);
    }
}

customElements.define('custom-overlay', Overlay);
export default Overlay;
