const stylesheet = new CSSStyleSheet()
stylesheet.replaceSync(`
  :host {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
  }
  div {
    --breeze: 0px;
    position: absolute;
    left: var(--left);
    top: 0;
    width: calc(10px * var(--density));
    aspect-ratio: 1;
    border-radius: 100%;
    background: white;
    animation: snowflake 10s linear both, breeze 1s infinite ease-in-out both;
    opacity: var(--density);
  }
  @property --breeze {
    syntax: "<length>";
    inherits: false;
    initial-value: 0px;
  }
  @keyframes snowflake {
    from {
      translate: var(--breeze) -10vh;
    }
    to {
      translate: var(--breeze) 110vh;
    }
  }
  @keyframes breeze {
    from {
      --breeze: 0px;
    }
    to {
      --breeze: 5000px;
    }
  }
`)
/**
 * An example Custom Element. This documentation ends up in the
 * README so describe how this elements works here.
 *
 * You can event add examples on the element is used with Markdown.
 *
 * ```
 * <falling-snow></falling-snow>
 * ```
 */
class FallingSnowElement extends HTMLElement {
  #renderRoot!: ShadowRoot
  connectedCallback(): void {
    this.#renderRoot = this.attachShadow({mode: 'closed'})
    this.#renderRoot.adoptedStyleSheets.push(stylesheet)
    if (matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      this.dropSnow()
    }
  }

  dropSnow() {
    const snowflake = this.ownerDocument.createElement('div')
    snowflake.style.setProperty('--left', `${Math.floor(Math.random() * 100)}%`)
    snowflake.style.setProperty('--density', Math.random())
    // snowflake.addEventListener('animationend', event => {
    //   if (event.animationName === 'snowflake') {
    //     snowflake.remove()
    //   }
    // })
    this.#renderRoot.append(snowflake)
    setTimeout(() => this.dropSnow(), 500)
  }

}

declare global {
  interface Window {
    FallingSnowElement: typeof FallingSnowElement
  }
}

export default FallingSnowElement

if (!window.customElements.get('falling-snow')) {
  window.FallingSnowElement = FallingSnowElement
  window.customElements.define('falling-snow', FallingSnowElement)
}
