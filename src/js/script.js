const inicialJogadoras = [
  {
    nome: "Andressa Alves",
    posicao: "Meio-campo",
    clube: "Corinthians",
    foto: "https://tse1.mm.bing.net/th/id/OIP.dO_6G1gyf-lKX6aTa6efgQHaE7?r=0&amp;rs=1&amp;pid=ImgDetMain&amp;o=7&amp;rm=3/",
    gols: 15,
    assistencias: 10,
    jogos: 28,
    favorita: false
  },
  {
    nome: "Dayana Rodríguez",
    posicao: "Meio-campo",
    clube: "Corinthians",
    foto: "https://cdn.meutimao.com.br/_upload/jogador/dayana-lisset-rodriguez-leon-no-corinthians_a.jpg",
    gols: 5,
    assistencias: 12,
    jogos: 30,
    favorita: false
  },
  {
    nome: "Mariza",
    posicao: "Zagueira",
    clube: "Corinthians",
    foto: "https://tse4.mm.bing.net/th/id/OIP.yEd37VAkw4G0TqCKZ_QWzAAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    gols: 2,
    assistencias: 1,
    jogos: 32,
    favorita: false
  },
  {
    nome: "Thaís Regina",
    posicao: "Zagueira",
    clube: "Corinthians",
    foto: "https://cdn.meutimao.com.br/_upload/jogador/thais-regina-da-silva-no-corinthians_z.jpg",
    gols: 1,
    assistencias: 2,
    jogos: 25,
    favorita: false
  },
  {
    nome: "Letícia Teles",
    posicao: "Zagueira",
    clube: "Corinthians",
    foto: "https://cdn.meutimao.com.br/_upload/jogador/leticia-teles-da-silva-no-corinthians_xt.jpg",
    gols: 0,
    assistencias: 0,
    jogos: 18,
    favorita: false
  },
  {
    nome: "Tamires",
    posicao:"lateral-esqeurda",
    clube:"Corinthians",
    foto:"https://cdn.meutimao.com.br/_upload/noticia/2021/12/31/tamires-posa-com-a-taca-da-libertadores-da-1k941w.jpg",
    gols: 2,
    assistencias: 2,
    jogos: 22,
    favorita: false
  }
];



if (!localStorage.getItem("jogadoras")) {
  localStorage.setItem("jogadoras", JSON.stringify(inicialJogadoras));
}

function getJogadoras() {
  return JSON.parse(localStorage.getItem("jogadoras"));
}

function salvarJogadoras(jogadoras) {
  debugger;
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
      <img src=${j.foto}/>
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
