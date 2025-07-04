import { LitElement, html, css } from 'https://unpkg.com/lit@3/index.js?module';

class EspeTaskItem extends LitElement {
  static styles = css`
    .item {
      background: #112d2c;
      padding: 1rem;
      margin: 0.5rem 0;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: white;
    }
    .info {
      flex: 1;
    }
    .info p {
      margin: 0.2rem 0;
    }
    .prioridad {
      font-weight: bold;
      color: #FFD700;
    }
    button {
      background: transparent;
      border: none;
      color: #FFD700;
      cursor: pointer;
      margin-left: 0.5rem;
      font-size: 1.2rem;
    }
  `;

  static properties = {
    task: { type: Object }
  };

  constructor() {
    super();
    this.task = {};
  }

  render() {
    return html`
      <div class="item">
        <div class="info">
          <p><strong>${this.task.nombre}</strong> - ${this.task.hora || ''}</p>
          ${this.task.notas ? html`<p>${this.task.notas}</p>` : ''}
          ${this.task.prioridad ? html`<p class="prioridad">Prioridad: ${this.task.prioridad}</p>` : ''}
        </div>
        <div>
          <button @click=${this._editar} aria-label="Editar tarea">✏️</button>
          <button @click=${this._eliminar} aria-label="Eliminar tarea">🗑️</button>
        </div>
      </div>
    `;
  }

  _eliminar() {
    this.dispatchEvent(
      new CustomEvent('task-deleted', {
        detail: this.task.id,
        bubbles: true,
        composed: true
      })
    );
  }

  _editar() {
    this.dispatchEvent(
      new CustomEvent('task-edit', {
        detail: this.task,
        bubbles: true,
        composed: true
      })
    );
  }
}

customElements.define('espe-task-item', EspeTaskItem);