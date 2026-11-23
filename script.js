
// LIVROS DA COMUNIDADE

const livros = [
  {
      titulo: "A Hipótese do Amor",
      autor: "Ali Hazelwood",
      capa: "la-hipotesis-del-amor-3d.png",
      genero: "Romance",
      sinopse: "Olive Smith é uma estudante de doutorado que acredita mais na ciência do que no amor. Para ajudar sua melhor amiga, ela acaba entrando em um relacionamento de mentira com Adam Carlsen, um professor conhecido por sua personalidade difícil. O que começa como um simples acordo se transforma em uma experiência cheia de descobertas, situações divertidas e sentimentos inesperados. Entre a rotina acadêmica e as surpresas da convivência, Olive percebe que nem tudo na vida pode ser explicado pela ciência."
  },
  {
      titulo: "O Príncipe Cruel",
      autor: "Holly Black",
      capa: "the-cruel-prince-3d.png",
      genero: "Fantasia",
      sinopse: "Jude Duarte é humana, mas cresceu no Reino das Fadas, um lugar mágico onde os humanos são tratados como inferiores. Determinada a conquistar seu espaço, ela precisa aprender a sobreviver em meio a intrigas, disputas políticas e jogos de poder. Seu maior desafio é lidar com Cardan, um príncipe arrogante que parece fazer de tudo para dificultar sua vida. Em um mundo onde confiança é rara, Jude descobre que inteligência e coragem podem ser suas maiores armas."
  },
  {
      titulo: "O Rei Perverso",
      autor: "Holly Black",
      capa: "o-rei-perverso-3d.png",
      genero: "Fantasia",
      sinopse: "Depois dos acontecimentos de O Príncipe Cruel, Jude conquistou uma posição importante na corte das fadas, mas manter o poder se mostra ainda mais difícil do que conquistá-lo. Cercada por inimigos, alianças frágeis e segredos, ela precisa agir com cuidado para proteger seus interesses. Enquanto Cardan ocupa o trono, Jude se envolve em uma disputa política repleta de estratégias, traições e decisões complicadas."
  },
  {
      titulo: "A Rainha do Nada",
      autor: "Holly Black",
      capa: "a-rainha-do-nada-3d.png",
      genero: "Fantasia",
      sinopse: "No último volume da trilogia O Povo do Ar, Jude precisa enfrentar as consequências de suas escolhas e encontrar uma maneira de recuperar seu lugar no mundo das fadas. Mesmo distante da corte, os conflitos continuam acontecendo, e antigas rivalidades voltam a fazer parte de sua realidade. Entre magia, profecias, disputas pelo poder e sentimentos complicados, Jude terá que descobrir até onde está disposta a ir para proteger aquilo que considera importante."
  },
  {
      titulo: "Amor Teoricamente",
      autor: "Ali Hazelwood",
      capa: "love-theoretically-3d.png",
      genero: "Romance",
      sinopse: "Elsie Hannaway é uma física teórica que divide sua rotina entre a carreira acadêmica e um trabalho pouco convencional: fingir ser a namorada perfeita para clientes. Sua oportunidade de conquistar estabilidade profissional surge quando aparece uma vaga em uma universidade de prestígio. Porém, existe um obstáculo: Jack Smith, um físico experimental que pode influenciar diretamente seu futuro, não parece ter uma boa opinião sobre ela. Entre rivalidades científicas, diferenças profissionais e sentimentos inesperados, Elsie começa a questionar suas próprias certezas."
  }
];


// MOSTRAR OS LIVROS NA COMUNIDADE

const listaLivros = document.getElementById("lista-livros");
let filtro = "Todos";

function mostrarLivros() {

  const busca = document.getElementById("busca").value.toLowerCase();
  listaLivros.innerHTML = "";

  livros.forEach((livro, indice) => {

    const combinaAba = filtro === "Todos" || livro.genero === filtro;
    const combinaBusca = (livro.titulo + " " + livro.autor).toLowerCase().includes(busca);

    if (combinaAba && combinaBusca) {
      const card = document.createElement("article");
      card.className = "livro";

      card.innerHTML = `
          <img src="${livro.capa}" alt="Capa de ${livro.titulo}">
          <h3>${livro.titulo}</h3>
          <p>${livro.autor}</p>
          <button onclick="abrirLivro(${indice})">Conhecer livro</button>
      `;

      listaLivros.appendChild(card);
    }
  });

  if (listaLivros.children.length === 0) {
    listaLivros.innerHTML = '<p class="sem-comentarios">Nenhum livro encontrado.</p>';
  }
}

function trocarAba(genero, botao) {
  filtro = genero;
  document.querySelectorAll(".abas button").forEach(b => b.classList.remove("ativa"));
  botao.classList.add("ativa");
  mostrarLivros();
}

mostrarLivros();


// ABRIR A PÁGINA DO LIVRO

let livroAtual = 0;

function abrirLivro(indice) {

  livroAtual = indice;

  const livro = livros[indice];

  document.getElementById("comunidade").hidden = true;
  document.getElementById("detalhes").hidden = false;

  document.getElementById("foto-livro").src = livro.capa;
  document.getElementById("foto-livro").alt = "Capa de " + livro.titulo;
  document.getElementById("titulo-livro").textContent = livro.titulo;
  document.getElementById("autor-livro").textContent = livro.autor;
  document.getElementById("sinopse-livro").textContent = livro.sinopse;

  mostrarFeedbacks();
  window.scrollTo(0, 0);
}


// VOLTAR PARA A COMUNIDADE

function voltarComunidade() {

  document.getElementById("detalhes").hidden = true;
  document.getElementById("comunidade").hidden = false;

  window.scrollTo(0, 0);
}


// SALVAR E MOSTRAR COMENTÁRIOS

let feedbacks = JSON.parse(localStorage.getItem("feedbacks") || "{}");

function mostrarFeedbacks() {

  const area = document.getElementById("lista-feedbacks");
  const nomeLivro = livros[livroAtual].titulo;

  area.innerHTML = "";

  const comentarios = feedbacks[nomeLivro] || [];

  if (comentarios.length === 0) {
      area.innerHTML = '<p class="sem-comentarios">Ainda não existem opiniões. Seja a primeira pessoa a comentar!</p>';
      return;
  }

  comentarios.forEach(item => {

      const card = document.createElement("div");
      card.className = "comentario";

      const nome = document.createElement("strong");
      nome.textContent = item.nome;

      const texto = document.createElement("p");
      texto.textContent = item.opiniao;

      card.append(nome, texto);
      area.appendChild(card);
  });
}


// ENVIAR OPINIÃO

document.getElementById("form-feedback").addEventListener("submit", function(event) {

  event.preventDefault();

  const nome = document.getElementById("nome").value.trim() || "Leitor(a)";
  const opiniao = document.getElementById("opiniao").value.trim();
  const nomeLivro = livros[livroAtual].titulo;

  if (!opiniao) return;

  if (!feedbacks[nomeLivro]) {
      feedbacks[nomeLivro] = [];
  }

  feedbacks[nomeLivro].push({
      nome: nome,
      opiniao: opiniao
  });

  try {
      localStorage.setItem("feedbacks", JSON.stringify(feedbacks));

      this.reset();
      mostrarFeedbacks();

      alert("Sua opinião foi publicada!");
  } catch (erro) {
      alert("Não foi possível salvar sua opinião.");
  }

});

// MODO ESCURO

function mudarTema() {
  document.body.classList.toggle("escuro");
}

// FORMULÁRIO DE CONTATO

document.getElementById("form-contato").addEventListener("submit", function(event) {
  event.preventDefault();
  document.getElementById("retorno-contato").textContent = "Mensagem enviada! Obrigada pelo contato.";
  this.reset();
});

// CARROSSEL DE OPINIÕES

const depoimentos = [
  { texto: "Li em dois dias e já quero reler! O clima me ganhou.", autor: "Camila R. · Amor, Teoricamente" },
  { texto: "A Jude não é a mocinha delicada de sempre, ela luta por um lugar num mundo que não a quer.", autor: "Beatriz M. · O Príncipe Cruel" },
  { texto: "As intrigas da corte estão ainda mais afiadas e eu não confiava em ninguém.", autor: "Lucas · O Rei Perverso" },
  { texto: "Um fechamento de trilogia à altura. Fiquei com saudade quando acabou.", autor: "Anônimo · A Rainha do Nada" }
];

let posicao = 0;

function mostrarDepoimento() {
  document.getElementById("texto-depoimento").textContent = depoimentos[posicao].texto;
  document.getElementById("autor-depoimento").textContent = depoimentos[posicao].autor;
}

function mudarDepoimento(passo) {
  posicao = (posicao + passo + depoimentos.length) % depoimentos.length;
  mostrarDepoimento();
}

mostrarDepoimento();

