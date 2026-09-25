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
  {
    id: "t1",
    nome: "Travessia Petrópolis x Teresópolis",
    dificuldade: "",
    duracao: "3 dias",
    descricao: "Considerada a travessia mais bonita do Brasil, com paisagens magníficas.",
    link: "https://mymento.com.br/ser-aventureiro-trekking/travessia-petropolis-teresopolis",
    disponibilidade: "disponivel",
    horario: "",
    foto: "",
  },
  {
    id: "t2",
    nome: "Travessia Vale dos Deuses x Vale dos Frades",
    dificuldade: "",
    duracao: "2 dias",
    descricao: "Passa por dois vales cercados por altas montanhas; inclui acampamento no Vale dos Deuses e ataque a cumes como Caixa de Fósforos e Cabeça de Dragão.",
    link: "https://mymento.com.br/ser-aventureiro-trekking/travessia-deuses-x-frades",
    disponibilidade: "disponivel",
    horario: "",
    foto: "",
  },
  {
    id: "t3",
    nome: "Pedra do Sino",
    dificuldade: "Moderada",
    duracao: "2 dias (recomendado)",
    descricao: "Ponto mais alto da Serra dos Órgãos. Trilha tradicional da cidade, sem grandes dificuldades técnicas apesar da distância — ótima para ver o sol nascer.",
    link: "https://mymento.com.br/ser-aventureiro-trekking/pedra-do-sino_e_mirante_do_inferno",
    disponibilidade: "disponivel",
    horario: "",
    foto: "",
  },
  {
    id: "t4",
    nome: "Dois Bicos",
    dificuldade: "Moderada",
    duracao: "1 dia",
    descricao: "Trilha dentro de uma fazenda, com visual estonteante até o cume do Bico Maior. Na volta dá pra passar pela Cachoeira dos Frades.",
    link: "https://mymento.com.br/ser-aventureiro-trekking/dois-bicos",
    disponibilidade: "disponivel",
    horario: "",
    foto: "",
  },
  {
    id: "t5",
    nome: "Mirante da Agulha",
    dificuldade: "Pesada",
    duracao: "1 dia",
    descricao: "Parte do trajeto da Pedra do Sino. Termina em um dos mirantes mais bonitos do PARNASO, de frente para a Agulha do Diabo.",
    link: "https://mymento.com.br/ser-aventureiro-trekking/mirante-do-inferno",
    disponibilidade: "disponivel",
    horario: "",
    foto: "",
  },
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
      ? [item.dificuldade, item.duracao].filter(Boolean).join(" · ")
      : `${item.local} · ${item.data}`;
    const fotoHtml = item.foto
      ? `<img class="list-item-foto" src="${item.foto}" alt="Foto de ${item.nome || item.titulo}" />`
      : "";
    const descricaoHtml = item.descricao ? `<p class="descricao">${item.descricao}</p>` : "";
    const linkHtml = item.link ? `<a class="saiba-mais" href="${item.link}" target="_blank" rel="noopener">Saiba mais →</a>` : "";
    div.innerHTML = `
      ${fotoHtml}
      <div class="info">
        <h4>${item.nome || item.titulo}</h4>
        <p>${linha2}</p>
        ${descricaoHtml}
        ${linkHtml}
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
        <td>${item.dificuldade || "-"}</td>
        <td>${item.duracao || "-"}</td>
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
        <input id="f_dificuldade" value="${item ? item.dificuldade || "" : ""}" placeholder="ex: Moderada" />
        <label>Duração</label>
        <input id="f_duracao" value="${item ? item.duracao || "" : ""}" placeholder="ex: 2 dias" />
        <label>Descrição</label>
        <input id="f_descricao" value="${item ? item.descricao || "" : ""}" />
        <label>Link (saiba mais)</label>
        <input id="f_link" value="${item ? item.link || "" : ""}" placeholder="https://..." />
        <label>Disponibilidade</label>
        <select id="f_disponibilidade">
          ${campoSelectDisponibilidade(item ? item.disponibilidade : "disponivel", ["disponivel", "manutencao", "fechado"])}
        </select>
        <label>Horário de funcionamento</label>
        <input id="f_horario" value="${item ? item.horario || "" : ""}" placeholder="ex: 6h às 18h" />
        <label>Foto (nome do arquivo dentro de images/)</label>
        <input id="f_foto" value="${item ? item.foto || "" : ""}" placeholder="ex: images/pedra-do-sino.jpg" />
      `,
      aoSalvar: () => {
        const novo = {
          id: item ? item.id : "t" + Date.now(),
          nome: document.getElementById("f_nome").value.trim(),
          dificuldade: document.getElementById("f_dificuldade").value.trim(),
          duracao: document.getElementById("f_duracao").value.trim(),
          descricao: document.getElementById("f_descricao").value.trim(),
          link: document.getElementById("f_link").value.trim(),
          disponibilidade: document.getElementById("f_disponibilidade").value,
          horario: document.getElementById("f_horario").value.trim(),
          foto: document.getElementById("f_foto").value.trim(),
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
