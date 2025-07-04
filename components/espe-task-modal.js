import { LitElement, html, css } from 'https://unpkg.com/lit@3/index.js?module';

class EspeTaskModal extends LitElement {
  static styles = css`
    .modal {
      position: fixed;
      top: 20%;
      left: 50%;
      transform: translate(-50%, 0);
      background: #0B1E1B;
      padding: 2rem;
      border: 2px solid #FFD700;
      border-radius: 8px;
      z-index: 1000;
      color: white;
      min-width: 300px;
    }
    input, select, textarea {
      display: block;
      margin: 0.5rem 0;
      width: 100%;
      padding: 0.5rem;
      border-radius: 4px;
      border: none;
      font-size: 1rem;
    }
    textarea {
      resize: vertical;
      min-height: 60px;
    }
    button {
      margin-top: 1rem;
      padding: 0.5rem 1rem;
      border-radius: 5px;
      border: none;
      cursor: pointer;
      font-size: 1rem;
    }
    button.save {
      background-color: #0F766E;
      color: white;
      margin-right: 1rem;
    }
    button.cancel {
      background-color: #555;
      color: white;
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
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
      <h3 id="modalTitle">${this.task?.id ? 'Editar' : 'Nueva'} Tarea</h3>

      <input id="nombre" placeholder="Nombre de la tarea" .value=${this.task?.nombre || ''} />
      <textarea id="notas" placeholder="Notas">${this.task?.notas || ''}</textarea>
      <input id="hora" type="time" .value=${this.task?.hora || ''} />

      <select id="prioridad">
        <option value="Alta" ?selected=${this.task?.prioridad === 'Alta'}>Alta</option>
        <option value="Media" ?selected=${this.task?.prioridad === 'Media'}>Media</option>
        <option value="Baja" ?selected=${this.task?.prioridad === 'Baja'}>Baja</option>
      </select>

      <!-- ✅ Campo de fecha agregado -->
      <input id="fecha" type="date" .value=${this.task?.fecha || this._hoy()} />

      <div>
        <button class="save" @click=${this._guardar}>Agregar</button>
        <button class="cancel" @click=${this._cerrar}>Cancelar</button>
      </div>
    </div>
  `;
}

  _guardar() {
    const nombre = this.shadowRoot.getElementById('nombre').value.trim();
    const notas = this.shadowRoot.getElementById('notas').value.trim();
    const hora = this.shadowRoot.getElementById('hora').value;
    const prioridad = this.shadowRoot.getElementById('prioridad').value;
    const fecha = this.shadowRoot.getElementById('fecha').value;

    if (!nombre) {
      alert('El nombre es obligatorio');
      return;
    }

    this.dispatchEvent(
      new CustomEvent('task-added', {
        detail: {
          id: this.task?.id,
          nombre,
          notas,
          hora,
          prioridad,
          fecha 
        },
        bubbles: true,
        composed: true
      })
    );

    this._cerrar();
  }

  _hoy() {
  const hoy = new Date();
  return hoy.toISOString().split('T')[0]; // formato YYYY-MM-DD
}


  _cerrar() {
    this.dispatchEvent(
      new CustomEvent('modal-closed', {
        bubbles: true,
        composed: true
      })
    );
  }
}

customElements.define('espe-task-modal', EspeTaskModal);