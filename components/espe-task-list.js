import { LitElement, html, css } from 'https://unpkg.com/lit@3/index.js?module';
import './espe-task-item.js';
import './espe-task-modal.js';

class EspeTaskList extends LitElement {
  static styles = css`
    :host {
      --color-primario: #003C71;
      --color-secundario: #FFD700;
      display: block;
      padding: 1rem;
      font-family: sans-serif;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
    }
    .header h2 {
      margin: 0.5rem 0;
    }
    .controls {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    select, button {
        background: var(--color-primario);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        cursor: pointer;
        border-radius: 5px;
        font-size: 1rem;
    }
    .task-group {
      margin-top: 1.5rem;
    }
    .group-title {
        font-size: 1.2rem;
        color: var(--color-secundario);
        margin-bottom: 0.5rem;
        text-transform: capitalize;
    }
  `;

  static properties = {
    tasks: { type: Array },
    showModal: { type: Boolean },
    selectedTask: { type: Object },
    viewMode: { type: String }
  };

  constructor() {
    super();
    this.tasks = [];
    this.showModal = false;
    this.selectedTask = null;
    this.viewMode = 'fecha';
  }

  render() {
    return html`
      <div class="header">
        <h2>Mis Tareas</h2>
        <div class="controls">
          <select @change=${this._cambiarVista}>
            <option value="fecha" ?selected=${this.viewMode === 'fecha'}>Por Fecha</option>
            <option value="prioridad" ?selected=${this.viewMode === 'prioridad'}>Por Prioridad</option>
          </select>
          <button @click=${this._abrirModal}>Agregar Tarea</button>
        </div>
      </div>

      ${this.viewMode === 'fecha'
        ? this._renderPorFecha()
        : this._renderPorPrioridad()}

      ${this.showModal
        ? html`
            <espe-task-modal
              .task=${this.selectedTask}
              @task-added=${this._agregarTarea}
              @modal-closed=${this._cerrarModal}
            ></espe-task-modal>
          `
        : ''}
    `;
  }

  _renderPorFecha() {
    const agrupadas = {};

    this.tasks.forEach(task => {
      if (!agrupadas[task.fecha]) {
        agrupadas[task.fecha] = [];
      }
      agrupadas[task.fecha].push(task);
    });

    return html`
      ${Object.keys(agrupadas).sort().map(fecha => html`
        <div class="task-group">
          <div class="group-title">${this._formatearFecha(fecha)}</div>
          ${agrupadas[fecha].map(task => this._renderItem(task))}
        </div>
      `)}
    `;
  }

  _renderPorPrioridad() {
    const alta = this.tasks.filter(t => t.prioridad === 'Alta');
    const media = this.tasks.filter(t => t.prioridad === 'Media');
    const baja = this.tasks.filter(t => t.prioridad === 'Baja');

    return html`
      <div class="task-group">
        <div class="group-title">Alta</div>
        ${alta.map(task => this._renderItem(task))}
      </div>
      <div class="task-group">
        <div class="group-title">Media</div>
        ${media.map(task => this._renderItem(task))}
      </div>
      <div class="task-group">
        <div class="group-title">Baja</div>
        ${baja.map(task => this._renderItem(task))}
      </div>
    `;
  }

  _formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-EC', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  }

  _renderItem(task) {
    return html`
      <espe-task-item
        .task=${task}
        @task-deleted=${this._eliminarTarea}
        @task-edit=${this._editarTarea}
      ></espe-task-item>
    `;
  }

  _cambiarVista(e) {
    this.viewMode = e.target.value;
  }

  _abrirModal() {
    this.selectedTask = null;
    this.showModal = true;
  }

  _cerrarModal() {
    this.showModal = false;
    this.selectedTask = null;
  }

  _agregarTarea(e) {
    const nueva = e.detail;

    if (nueva.id) {
      this.tasks = this.tasks.map(t => (t.id === nueva.id ? nueva : t));
    } else {
      nueva.id = Date.now();
      this.tasks = [...this.tasks, nueva];
    }

    this._cerrarModal();
  }

  _eliminarTarea(e) {
    this.tasks = this.tasks.filter(t => t.id !== e.detail);
  }

  _editarTarea(e) {
    this.selectedTask = e.detail;
    this.showModal = true;
  }
}

customElements.define('espe-task-list', EspeTaskList);