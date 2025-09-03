if (!localStorage.getItem("jogadoras")) {
  fetch('jogadoras.json')
    .then(response => response.json())
    .then(data => {
      localStorage.setItem("jogadoras", JSON.stringify(data));
      renderJogadoras();
    });
} else {
  renderJogadoras();
}

function getJogadoras() {
  return JSON.parse(localStorage.getItem("jogadoras"));
}

function salvarJogadoras(jogadoras) {
  localStorage.setItem("jogadoras", JSON.stringify(jogadoras));
}

function renderJogadoras(filtro = "") {
  const container = document.getElementById("jogadoras-container");
  container.innerHTML = "";

  let jogadoras = getJogadoras();

  const busca = document.getElementById("busca").value.toLowerCase();
  const clubeFiltro = document.getElementById("filtro-clube").value;

  jogadoras = jogadoras.filter(j => 
    (j.nome.toLowerCase().includes(busca) || j.posicao.toLowerCase().includes(busca)) &&
    (clubeFiltro === "" || j.clube === clubeFiltro)
  );

  jogadoras.forEach((j, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="foto-container">
        <img src=${j.foto}/>
      </div>
      <h3>${j.nome}</h3>
      <p>${j.posicao} - ${j.clube}</p>
      <p>Gols: ${j.gols} | Assistências: ${j.assistencias} | Jogos: ${j.jogos}</p>
      <span class="favorita" onclick="toggleFavorita(${index})">${j.favorita ? "★" : "☆"}</span>
      <br/>
      <button onclick="editarJogadora(${index})">Editar</button>
      <button onclick="removerJogadora(${index})">Remover</button>
    `;
    container.appendChild(card);
  });

  atualizarFiltroClubes();
}

function atualizarFiltroClubes() {
  const select = document.getElementById("filtro-clube");
  const jogadoras = getJogadoras();
  const clubes = [...new Set(jogadoras.map(j => j.clube))];
  select.innerHTML = `<option value="">Todos os clubes</option>`;
  clubes.forEach(clube => {
    const option = document.createElement("option");
    option.value = clube;
    option.textContent = clube;
    select.appendChild(option);
  });
}

function toggleFavorita(index) {
  const jogadoras = getJogadoras();
  jogadoras[index].favorita = !jogadoras[index].favorita;
  salvarJogadoras(jogadoras);
  renderJogadoras();
}

function removerJogadora(index) {
  const jogadoras = getJogadoras();
  jogadoras.splice(index, 1);
  salvarJogadoras(jogadoras);
  alert("Jogadora removida com sucesso!");
  renderJogadoras();
}

function editarJogadora(index) {
  const j = getJogadoras()[index];
  document.getElementById("edit-index").value = index;
  document.getElementById("nome").value = j.nome;
  document.getElementById("posicao").value = j.posicao;
  document.getElementById("clube").value = j.clube;
  document.getElementById("gols").value = j.gols;
  document.getElementById("assistencias").value = j.assistencias;
  document.getElementById("jogos").value = j.jogos;
  document.getElementById("foto").value = j.foto;
}

document.getElementById("jogadora-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const nome = document.getElementById("nome").value;
  const posicao = document.getElementById("posicao").value;
  const clube = document.getElementById("clube").value;
  const gols = parseInt(document.getElementById("gols").value);
  const assistencias = parseInt(document.getElementById("assistencias").value);
  const jogos = parseInt(document.getElementById("jogos").value);
  const foto = document.getElementById("foto").value;
  const index = document.getElementById("edit-index").value;

  if (!nome || !posicao || !clube || !foto) return;

  const novaJogadora = { nome, posicao, clube, gols, assistencias, jogos, foto, favorita: false };
  const jogadoras = getJogadoras();

  if (index === "") {
    jogadoras.push(novaJogadora);
    alert("Jogadora adicionada com sucesso!");
  } else {
    jogadoras[index] = novaJogadora;
    alert("Jogadora editada com sucesso!");
  }

  salvarJogadoras(jogadoras);
  this.reset();
  renderJogadoras();
});

function ordenarPor(campo) {
  const jogadoras = getJogadoras();
  jogadoras.sort((a, b) => a[campo].localeCompare(b[campo]));
  salvarJogadoras(jogadoras);
  renderJogadoras();
}

document.getElementById("busca").addEventListener("input", renderJogadoras);
document.getElementById("filtro-clube").addEventListener("change", renderJogadoras);

renderJogadoras();
