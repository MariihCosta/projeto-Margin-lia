
// LIVROS DO CATÁLOGO

let livros = [
    {
        titulo: "A Hipótese do Amor",
        autor: "Ali Hazelwood",
        genero: "Romance",
        ano: "2022",
        editora: "Arqueiro",
        capa: "https://covers.openlibrary.org/b/isbn/9786555653304-L.jpg",
        sinopse: "Olive é uma estudante de doutorado que acaba entrando em um relacionamento de mentira com Adam. O que começa como um acordo pode se transformar em uma história de amor."
    },

    {
        titulo: "A Empregada",
        autor: "Freida McFadden",
        genero: "Suspense",
        ano: "2023",
        editora: "Arqueiro",
        capa: "https://covers.openlibrary.org/b/isbn/9786555655063-L.jpg",
        sinopse: "Millie consegue um emprego em uma casa aparentemente perfeita, mas começa a descobrir que seus patrões escondem muitos segredos."
    },

    {
        titulo: "Quarta Asa",
        autor: "Rebecca Yarros",
        genero: "Fantasia",
        ano: "2024",
        editora: "Planeta Minotauro",
        capa: "https://covers.openlibrary.org/b/isbn/9788542225853-L.jpg",
        sinopse: "Violet precisa enfrentar os desafios de uma academia de cavaleiros de dragões e descobrir sua própria força para sobreviver."
    }
];


// ABRIR UM LIVRO

function abrirLivro(numero) {

    let livro = livros[numero];

    document.getElementById("catalogo").hidden = true;
    document.getElementById("detalhes").hidden = false;

    document.getElementById("capa-detalhe").src = livro.capa;
    document.getElementById("titulo").innerText = livro.titulo;
    document.getElementById("autor").innerText = livro.autor;
    document.getElementById("genero").innerText = livro.genero;
    document.getElementById("ano").innerText = livro.ano;
    document.getElementById("editora").innerText = livro.editora;
    document.getElementById("sinopse").innerText = livro.sinopse;

    document.getElementById("favorito").innerText = "♡ Favoritos";

    window.scrollTo(0, 0);
}


// VOLTAR AO CATÁLOGO

function voltar() {

    document.getElementById("detalhes").hidden = true;
    document.getElementById("catalogo").hidden = false;

}


// FILTRAR POR GÊNERO

function filtrar(genero) {

    let cards = document.querySelectorAll(".livro");

    cards.forEach(function(card) {

        if (genero === "Todos" || card.dataset.genero === genero) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }

    });

}


// PESQUISAR LIVROS


 let resultados = [];

 async function pesquisar() {
  const nome = document.getElementById("pesquisa").value.trim();
  const area = document.getElementById("resultados");

  if (nome === "") {
    alert("Digite o nome de um livro ou autor!");
    return;
  }

  area.innerHTML = "<p>Buscando livros...</p>";

  try {
    const resposta = await fetch(
      "https://openlibrary.org/search.json?q=" +
      encodeURIComponent(nome) + "&limit=12"
    );

    const dados = await resposta.json();

    // Busca a sinopse e os gêneros de cada livro
    resultados = await Promise.all(
      dados.docs.map(async function(livro) {
        let sinopse = "Sinopse não disponível.";
        let generos = livro.subject ? livro.subject.slice(0, 3) : [];

        try {
          if (livro.key) {
            const detalhe = await fetch(
              "https://openlibrary.org" + livro.key + ".json"
            );

            const informacoes = await detalhe.json();

            if (informacoes.description) {
              sinopse = typeof informacoes.description === "string"
                ? informacoes.description
                : informacoes.description.value;
            }

            if (informacoes.subjects) {
              generos = informacoes.subjects.slice(0, 3);
            }
          }
        } catch (erro) {
          console.log("Não foi possível carregar os detalhes.");
        }

        return {
          ...livro,
          sinopse: sinopse,
          generos: generos
        };
      })
    );

    area.innerHTML = "";

    if (resultados.length === 0) {
      area.innerHTML = "<p>Nenhum livro encontrado.</p>";
      return;
    }

    resultados.forEach(function(livro, i) {
      const card = document.createElement("article");
      card.className = "livro";

      const capa = document.createElement("img");
      capa.alt = "Capa de " + livro.title;

      if (livro.cover_i) {
        capa.src = "https://covers.openlibrary.org/b/id/" +
          livro.cover_i + "-M.jpg";
      }

      const titulo = document.createElement("h3");
      titulo.textContent = livro.title;

      const autor = document.createElement("p");
      autor.textContent = livro.author_name
        ? livro.author_name[0]
        : "Autor desconhecido";

      const genero = document.createElement("p");
      genero.textContent = "Gênero: " +
        (livro.generos.length ? livro.generos.join(", ") : "Não informado");

      const sinopse = document.createElement("p");
      sinopse.textContent = "Sinopse: " + livro.sinopse;

      const botao = document.createElement("button");
      botao.textContent = "Ver detalhes";
      botao.onclick = function() {
        abrirResultado(i);
      };

      card.append(capa, titulo, autor, genero, sinopse, botao);
      area.appendChild(card);
    });

  } catch (erro) {
    area.innerHTML = "<p>Erro ao buscar os livros. Tente novamente.</p>";
  }
}

function abrirResultado(numero) {
  const livro = resultados[numero];

  document.getElementById("catalogo").hidden = true;
  document.getElementById("detalhes").hidden = false;

  document.getElementById("capa-detalhe").src =
    livro.cover_i
      ? "https://covers.openlibrary.org/b/id/" + livro.cover_i + "-L.jpg"
      : "";

  document.getElementById("titulo").textContent = livro.title;

  document.getElementById("autor").textContent =
    livro.author_name
      ? livro.author_name.join(", ")
      : "Autor desconhecido";

  document.getElementById("genero").textContent =
    livro.generos.length
      ? livro.generos.join(", ")
      : "Gênero não informado";

  document.getElementById("ano").textContent =
    livro.first_publish_year || "Ano não informado";

  document.getElementById("editora").textContent =
    livro.publisher ? livro.publisher[0] : "Editora não informada";

  document.getElementById("sinopse").textContent = livro.sinopse;

  window.scrollTo(0, 0);
}



// MODO CLARO E ESCURO

function mudarTema() {

    document.body.classList.toggle("escuro");

}


// FAVORITOS

function favoritar() {

    let botao = document.getElementById("favorito");

    if (botao.innerText === "♡ Favoritos") {
        botao.innerText = "♥ Favoritado";
    } else {
        botao.innerText = "♡ Favoritos";
    }

}

// PESQUISAR LIVROS NA OPEN LIBRARY

let resultados = [];

async function pesquisar() {

    let nome = document.getElementById("pesquisa").value;

    if (nome === "") {
        alert("Digite o nome de um livro!");
        return;
    }

    let endereco = "https://openlibrary.org/search.json?q="
        + encodeURIComponent(nome)
        + "&limit=12";

    let resposta = await fetch(endereco);

    let dados = await resposta.json();

    resultados = dados.docs;

    let area = document.getElementById("resultados");

    area.innerHTML = "";

    resultados.forEach(function(livro, i) {

        let capa = livro.cover_i
            ? "https://covers.openlibrary.org/b/id/" + livro.cover_i + "-M.jpg"
            : "";

        let autor = livro.author_name
            ? livro.author_name[0]
            : "Autor desconhecido";

        area.innerHTML += `
            <article class="livro">

                <div class="capa">
                    ${capa
                        ? `<img src="${capa}" alt="Capa de ${livro.title}">`
                        : "<p>Sem capa disponível</p>"
                    }
                </div>

                <p>${autor}</p>

                <h3>${livro.title}</h3>

                <button onclick="abrirResultado(${i})">
                    Ver livro
                </button>

            </article>
        `;

    });

    if (resultados.length === 0) {
        area.innerHTML = "<p>Nenhum livro encontrado.</p>";
    }

}


// ABRIR OS DETALHES DO LIVRO PESQUISADO

function abrirResultado(numero) {

    let livro = resultados[numero];

    document.getElementById("catalogo").hidden = true;
    document.getElementById("detalhes").hidden = false;

    document.getElementById("capa-detalhe").src =
        livro.cover_i
        ? "https://covers.openlibrary.org/b/id/" + livro.cover_i + "-L.jpg"
        : "";

    document.getElementById("titulo").innerText = livro.title;

    document.getElementById("autor").innerText =
        livro.author_name
        ? livro.author_name.join(", ")
        : "Autor desconhecido";

    document.getElementById("genero").innerText =
        livro.subject
        ? livro.subject.slice(0, 3).join(", ")
        : "Gênero não informado";

    document.getElementById("ano").innerText =
        livro.first_publish_year || "Ano não informado";

    document.getElementById("editora").innerText =
        livro.publisher
        ? livro.publisher[0]
        : "Editora não informada";

    document.getElementById("sinopse").innerText =
        "Conheça esta obra e descubra uma nova história para sua próxima leitura.";

    window.scrollTo(0, 0);

}
