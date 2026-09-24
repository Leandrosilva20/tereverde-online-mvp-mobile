/* ==========================================================
   Circuito Terê Verde - lógica compartilhada
   IMPORTANTE (leia o README): este é um MVP front-end puro.
   O "login" abaixo é só uma simulação para fins de demonstração
   acadêmica. Ele NÃO é seguro e não deve ser usado como está
   em produção. Ver seção "Segurança" do README para o porquê
   e o que seria necessário para um login real.
   ========================================================== */

const STORAGE_KEYS = {
  trilhas: "tereverde_trilhas",
  eventos: "tereverde_eventos",
  sessao: "tereverde_admin_logado",
};

const SEED_TRILHAS = [
  { id: "t1", nome: "Trilha do Açude", dificuldade: "Fácil", distancia: 2.5, disponibilidade: "disponivel", horario: "6h às 18h" },
  { id: "t2", nome: "Pedra do Sino", dificuldade: "Difícil", distancia: 14, disponibilidade: "disponivel", horario: "5h às 12h (saída obrigatória até o meio-dia)" },
  { id: "t3", nome: "Trilha dos Três Picos", dificuldade: "Difícil", distancia: 18, disponibilidade: "manutencao", horario: "Fechada temporariamente" },
];

const SEED_EVENTOS = [
  { id: "e1", titulo: "Mutirão de Limpeza de Trilhas", data: "2026-10-04", local: "Parque Natural Municipal", disponibilidade: "disponivel", horario: "8h às 12h" },
  { id: "e2", titulo: "Caminhada Guiada de Observação de Aves", data: "2026-10-18", local: "PARNASO", disponibilidade: "lotado", horario: "6h30" },
];

function carregar(chave, seed) {
  const salvo = localStorage.getItem(chave);
  if (salvo) return JSON.parse(salvo);
  localStorage.setItem(chave, JSON.stringify(seed));
  return seed;
}

function salvar(chave, dados) {
  localStorage.setItem(chave, JSON.stringify(dados));
}

function getTrilhas() { return carregar(STORAGE_KEYS.trilhas, SEED_TRILHAS); }
function getEventos() { return carregar(STORAGE_KEYS.eventos, SEED_EVENTOS); }

function rotuloDisponibilidade(valor) {
  const mapa = {
    disponivel: "Disponível",
    manutencao: "Em manutenção",
    fechado: "Fechada",
    lotado: "Lotado",
    cancelado: "Cancelado",
  };
  return mapa[valor] || valor;
}

/* ---------------- Login (demonstração, ver aviso acima) ---------------- */

function estaLogado() {
  return sessionStorage.getItem(STORAGE_KEYS.sessao) === "1";
}

function configurarLoginModal() {
  const modal = document.getElementById("loginModal");
  const abrir = document.getElementById("openLogin");
  const fechar = document.getElementById("closeLogin");
  const cancelar = document.getElementById("cancelLogin");
  const entrar = document.getElementById("loginBtn");
  const msg = document.getElementById("loginMsg");

  if (!modal) return;

  const abrirModal = () => modal.setAttribute("aria-hidden", "false");
  const fecharModal = () => {
    modal.setAttribute("aria-hidden", "true");
    if (msg) msg.textContent = "";
  };

  if (abrir) abrir.addEventListener("click", abrirModal);
  if (fechar) fechar.addEventListener("click", fecharModal);
  if (cancelar) cancelar.addEventListener("click", fecharModal);

  if (entrar) {
    entrar.addEventListener("click", () => {
      const email = document.getElementById("email").value.trim();
      const senha = document.getElementById("senha").value;

      // Simulação: em produção isso deve ser validado por um backend
      // (ex.: API com hash de senha + tokens), nunca no navegador.
      if (email && senha.length >= 4) {
        sessionStorage.setItem(STORAGE_KEYS.sessao, "1");
        window.location.href = "admin.html";
      } else {
        msg.textContent = "Informe um email válido e uma senha (mín. 4 caracteres).";
      }
    });
  }
}

function protegerPaginaAdmin() {
  if (!document.body.classList.contains("admin-page")) return;
  if (!estaLogado()) {
    window.location.href = "index.html";
  }
  const sair = document.querySelector('[data-acao="sair"]');
  if (sair) {
    sair.addEventListener("click", (e) => {
      e.preventDefault();
      sessionStorage.removeItem(STORAGE_KEYS.sessao);
      window.location.href = "index.html";
    });
  }
}

/* ---------------- Renderização pública (trilhas.html / biodiversidade.html) ---------------- */

function renderListaPublica(containerId, itens, tipo) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";

  if (itens.length === 0) {
    container.innerHTML = '<p class="empty-msg">Nenhum item cadastrado no momento.</p>';
    return;
  }

  itens.forEach((item) => {
    const div = document.createElement("div");
    div.className = "list-item";
    const linha2 = tipo === "trilha"
      ? `${item.dificuldade} · ${item.distancia} km`
      : `${item.local} · ${item.data}`;
    div.innerHTML = `
      <div class="info">
        <h4>${item.nome || item.titulo}</h4>
        <p>${linha2}</p>
      </div>
      <div class="status">
        <span class="badge ${item.disponibilidade}">${rotuloDisponibilidade(item.disponibilidade)}</span>
        <span class="horario">${item.horario || ""}</span>
      </div>
    `;
    container.appendChild(div);
  });
}

/* ---------------- Admin: CRUD de trilhas e eventos ---------------- */

function renderAdminTabela(tabelaId, itens, tipo) {
  const tbody = document.querySelector(`#${tabelaId} tbody`);
  if (!tbody) return;
  tbody.innerHTML = "";

  itens.forEach((item) => {
    const tr = document.createElement("tr");
    if (tipo === "trilha") {
      tr.innerHTML = `
        <td>${item.nome}</td>
        <td>${item.dificuldade}</td>
        <td>${item.distancia} km</td>
        <td><span class="badge ${item.disponibilidade}">${rotuloDisponibilidade(item.disponibilidade)}</span></td>
        <td>${item.horario || "-"}</td>
        <td>
          <button class="btn small ghost" data-editar="${item.id}">Editar</button>
          <button class="btn small danger" data-remover="${item.id}">Remover</button>
        </td>`;
    } else {
      tr.innerHTML = `
        <td>${item.titulo}</td>
        <td>${item.data}</td>
        <td>${item.local}</td>
        <td><span class="badge ${item.disponibilidade}">${rotuloDisponibilidade(item.disponibilidade)}</span></td>
        <td>${item.horario || "-"}</td>
        <td>
          <button class="btn small ghost" data-editar="${item.id}">Editar</button>
          <button class="btn small danger" data-remover="${item.id}">Remover</button>
        </td>`;
    }
    tbody.appendChild(tr);
  });
}

function abrirEditor({ titulo, camposHtml, aoSalvar }) {
  const modal = document.getElementById("editorModal");
  document.getElementById("editorTitle").textContent = titulo;
  document.getElementById("editorBody").innerHTML = camposHtml;
  modal.setAttribute("aria-hidden", "false");

  const salvar = document.getElementById("saveEditor");
  const cancelar = document.getElementById("cancelEditor");
  const fechar = document.getElementById("closeEditor");

  const fecharModal = () => modal.setAttribute("aria-hidden", "true");
  cancelar.onclick = fecharModal;
  fechar.onclick = fecharModal;
  salvar.onclick = () => {
    aoSalvar();
    fecharModal();
  };
}

function campoSelectDisponibilidade(valorAtual, opcoes) {
  return opcoes
    .map((op) => `<option value="${op}" ${op === valorAtual ? "selected" : ""}>${rotuloDisponibilidade(op)}</option>`)
    .join("");
}

function configurarAdminTrilhas() {
  const tabela = document.getElementById("trilhasTable");
  const addBtn = document.getElementById("addTrailBtn");
  if (!tabela) return;

  let trilhas = getTrilhas();
  renderAdminTabela("trilhasTable", trilhas, "trilha");

  function editar(item) {
    abrirEditor({
      titulo: item ? "Editar Trilha" : "Nova Trilha",
      camposHtml: `
        <label>Nome</label>
        <input id="f_nome" value="${item ? item.nome : ""}" />
        <label>Dificuldade</label>
        <input id="f_dificuldade" value="${item ? item.dificuldade : ""}" />
        <label>Distância (km)</label>
        <input id="f_distancia" type="number" step="0.1" value="${item ? item.distancia : ""}" />
        <label>Disponibilidade</label>
        <select id="f_disponibilidade">
          ${campoSelectDisponibilidade(item ? item.disponibilidade : "disponivel", ["disponivel", "manutencao", "fechado"])}
        </select>
        <label>Horário de funcionamento</label>
        <input id="f_horario" value="${item ? item.horario || "" : ""}" placeholder="ex: 6h às 18h" />
      `,
      aoSalvar: () => {
        const novo = {
          id: item ? item.id : "t" + Date.now(),
          nome: document.getElementById("f_nome").value.trim(),
          dificuldade: document.getElementById("f_dificuldade").value.trim(),
          distancia: parseFloat(document.getElementById("f_distancia").value) || 0,
          disponibilidade: document.getElementById("f_disponibilidade").value,
          horario: document.getElementById("f_horario").value.trim(),
        };
        if (!novo.nome) return;
        trilhas = item ? trilhas.map((t) => (t.id === item.id ? novo : t)) : [...trilhas, novo];
        salvar(STORAGE_KEYS.trilhas, trilhas);
        renderAdminTabela("trilhasTable", trilhas, "trilha");
      },
    });
  }

  addBtn.addEventListener("click", () => editar(null));

  tabela.addEventListener("click", (e) => {
    const idEditar = e.target.getAttribute("data-editar");
    const idRemover = e.target.getAttribute("data-remover");
    if (idEditar) editar(trilhas.find((t) => t.id === idEditar));
    if (idRemover) {
      trilhas = trilhas.filter((t) => t.id !== idRemover);
      salvar(STORAGE_KEYS.trilhas, trilhas);
      renderAdminTabela("trilhasTable", trilhas, "trilha");
    }
  });
}

function configurarAdminEventos() {
  const tabela = document.getElementById("eventsTable");
  const addBtn = document.getElementById("addEventBtn");
  if (!tabela) return;

  let eventos = getEventos();
  renderAdminTabela("eventsTable", eventos, "evento");

  function editar(item) {
    abrirEditor({
      titulo: item ? "Editar Evento" : "Novo Evento",
      camposHtml: `
        <label>Título</label>
        <input id="f_titulo" value="${item ? item.titulo : ""}" />
        <label>Data</label>
        <input id="f_data" type="date" value="${item ? item.data : ""}" />
        <label>Local</label>
        <input id="f_local" value="${item ? item.local : ""}" />
        <label>Disponibilidade</label>
        <select id="f_disponibilidade">
          ${campoSelectDisponibilidade(item ? item.disponibilidade : "disponivel", ["disponivel", "lotado", "cancelado"])}
        </select>
        <label>Horário</label>
        <input id="f_horario" value="${item ? item.horario || "" : ""}" placeholder="ex: 8h às 12h" />
      `,
      aoSalvar: () => {
        const novo = {
          id: item ? item.id : "e" + Date.now(),
          titulo: document.getElementById("f_titulo").value.trim(),
          data: document.getElementById("f_data").value,
          local: document.getElementById("f_local").value.trim(),
          disponibilidade: document.getElementById("f_disponibilidade").value,
          horario: document.getElementById("f_horario").value.trim(),
        };
        if (!novo.titulo) return;
        eventos = item ? eventos.map((ev) => (ev.id === item.id ? novo : ev)) : [...eventos, novo];
        salvar(STORAGE_KEYS.eventos, eventos);
        renderAdminTabela("eventsTable", eventos, "evento");
      },
    });
  }

  addBtn.addEventListener("click", () => editar(null));

  tabela.addEventListener("click", (e) => {
    const idEditar = e.target.getAttribute("data-editar");
    const idRemover = e.target.getAttribute("data-remover");
    if (idEditar) editar(eventos.find((ev) => ev.id === idEditar));
    if (idRemover) {
      eventos = eventos.filter((ev) => ev.id !== idRemover);
      salvar(STORAGE_KEYS.eventos, eventos);
      renderAdminTabela("eventsTable", eventos, "evento");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  configurarLoginModal();
  protegerPaginaAdmin();
  configurarAdminTrilhas();
  configurarAdminEventos();
  renderListaPublica("listaTrilhas", getTrilhas(), "trilha");
  renderListaPublica("listaEventos", getEventos(), "evento");
});
