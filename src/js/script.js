const formVeiculo = document.getElementById("formVeiculo");
const tabelaVeiculos = document.getElementById("tabelaVeiculos");
const filtroStatus = document.getElementById("filtroStatus");
const contadorTabela = document.getElementById("contadorTabela");

const totalVeiculos = document.getElementById("totalVeiculos");
const totalTransito = document.getElementById("totalTransito");
const totalPatio = document.getElementById("totalPatio");
const totalLiberados = document.getElementById("totalLiberados");

const STORAGE_KEY = "athenyxVeiculos";

let veiculos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function salvarNoLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(veiculos));
}

function criarClasseStatus(status) {
  if (status === "Em Trânsito") {
    return "status-badge status-transito";
  }

  if (status === "No Pátio") {
    return "status-badge status-patio";
  }

  if (status === "Liberado") {
    return "status-badge status-liberado";
  }

  if (status === "Entregue") {
    return "status-badge status-entregue";
  }

  return "status-badge";
}

function normalizarStatus(statusDigitado) {
  const status = statusDigitado.trim().toLowerCase();

  if (status === "em transito" || status === "em trânsito") {
    return "Em Trânsito";
  }

  if (status === "no patio" || status === "no pátio") {
    return "No Pátio";
  }

  if (status === "liberado") {
    return "Liberado";
  }

  if (status === "entregue") {
    return "Entregue";
  }

  return null;
}

function renderizarTabela() {
  tabelaVeiculos.innerHTML = "";

  const statusSelecionado = filtroStatus.value;

  let veiculosFiltrados = veiculos;

  if (statusSelecionado !== "Todos") {
    veiculosFiltrados = veiculos.filter((veiculo) => {
      return veiculo.status === statusSelecionado;
    });
  }

  if (veiculosFiltrados.length === 0) {
    tabelaVeiculos.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-muted py-4">
          Nenhum veículo encontrado.
        </td>
      </tr>
    `;

    contadorTabela.textContent = "Nenhum veículo encontrado.";
    atualizarDashboard();
    return;
  }

  veiculosFiltrados.forEach((veiculo) => {
    const linha = document.createElement("tr");

    linha.innerHTML = `
      <td>${veiculo.chassi}</td>
      <td>${veiculo.modelo}</td>
      <td>${veiculo.cor}</td>
      <td>${veiculo.motorista}</td>
      <td>${veiculo.destino}</td>
      <td>
        <span class="${criarClasseStatus(veiculo.status)}">
          ${veiculo.status}
        </span>
      </td>
      <td>
        <div class="action-buttons">
          <button class="btn-edit" onclick="editarStatus(${veiculo.id})">
            Editar
          </button>

          <button class="btn-delete" onclick="excluirVeiculo(${veiculo.id})">
            Excluir
          </button>
        </div>
      </td>
    `;

    tabelaVeiculos.appendChild(linha);
  });

  contadorTabela.textContent = `Mostrando ${veiculosFiltrados.length} de ${veiculos.length} veículos cadastrados.`;

  atualizarDashboard();
}

formVeiculo.addEventListener("submit", function (event) {
  event.preventDefault();

  const chassi = document.getElementById("chassi").value.trim();
  const modelo = document.getElementById("modelo").value.trim();
  const cor = document.getElementById("cor").value.trim();
  const motorista = document.getElementById("motorista").value.trim();
  const destino = document.getElementById("destino").value.trim();
  const dataEntrada = document.getElementById("dataEntrada").value;
  const status = document.getElementById("status").value;

  if (
    chassi === "" ||
    modelo === "" ||
    cor === "" ||
    motorista === "" ||
    destino === "" ||
    dataEntrada === "" ||
    status === ""
  ) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  const chassiJaExiste = veiculos.some((veiculo) => {
    return veiculo.chassi.toUpperCase() === chassi.toUpperCase();
  });

  if (chassiJaExiste) {
    alert("Esse chassi já foi cadastrado.");
    return;
  }

  const novoVeiculo = {
    id: Date.now(),
    chassi: chassi.toUpperCase(),
    modelo: modelo,
    cor: cor,
    motorista: motorista,
    destino: destino,
    dataEntrada: dataEntrada,
    status: status,
  };

  veiculos.push(novoVeiculo);

  salvarNoLocalStorage();
  renderizarTabela();
  formVeiculo.reset();

  alert("Veículo cadastrado com sucesso!");
});

function excluirVeiculo(id) {
  const confirmar = confirm("Tem certeza que deseja excluir este veículo?");

  if (!confirmar) {
    return;
  }

  veiculos = veiculos.filter((veiculo) => {
    return veiculo.id !== id;
  });

  salvarNoLocalStorage();
  renderizarTabela();
}

function editarStatus(id) {
  const veiculoEncontrado = veiculos.find((veiculo) => {
    return veiculo.id === id;
  });

  if (!veiculoEncontrado) {
    alert("Veículo não encontrado.");
    return;
  }

  const novoStatus = prompt(
    "Digite o novo status:\nEm Transito, No Patio, Liberado ou Entregue",
    veiculoEncontrado.status
  );

  if (novoStatus === null) {
    return;
  }

  const statusFormatado = normalizarStatus(novoStatus);

  if (statusFormatado === null) {
    alert("Status inválido. Use: Em Transito, No Patio, Liberado ou Entregue.");
    return;
  }

  veiculoEncontrado.status = statusFormatado;

  salvarNoLocalStorage();
  renderizarTabela();
}

filtroStatus.addEventListener("change", function () {
  renderizarTabela();
});

function atualizarDashboard() {
  totalVeiculos.textContent = veiculos.length;

  totalTransito.textContent = veiculos.filter((veiculo) => {
    return veiculo.status === "Em Trânsito";
  }).length;

  totalPatio.textContent = veiculos.filter((veiculo) => {
    return veiculo.status === "No Pátio";
  }).length;

  totalLiberados.textContent = veiculos.filter((veiculo) => {
    return veiculo.status === "Liberado";
  }).length;
}

function carregarDadosExemplo() {
  if (veiculos.length > 0) {
    return;
  }

  veiculos = [
    {
      id: 1,
      chassi: "9BWZZZ377VT004251",
      modelo: "BYD Dolphin",
      cor: "Branco",
      motorista: "João Silva",
      destino: "BYD Campinas N/S - SP",
      dataEntrada: "2026-06-01",
      status: "Em Trânsito",
    },
    {
      id: 2,
      chassi: "9BD265120K9101112",
      modelo: "BYD Song Plus",
      cor: "Preto",
      motorista: "Carlos Lima",
      destino: "BYD Perdizes - SP",
      dataEntrada: "2026-06-02",
      status: "No Pátio",
    },
    {
      id: 3,
      chassi: "9BM695301KB123456",
      modelo: "BYD Yuan Plus",
      cor: "Prata",
      motorista: "Marcos Pereira",
      destino: "BYD Limeira - SP",
      dataEntrada: "2026-06-03",
      status: "Liberado",
    },
  ];

  salvarNoLocalStorage();
}

carregarDadosExemplo();
renderizarTabela();