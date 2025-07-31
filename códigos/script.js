function slugify(text) {
    const from = "ãàáäâèéëêìíïîòóöôùúüûñç";
    const to = "aaaaaeeeeiiiioooouuuunc";
    
    let newText = text.toLowerCase();

    for (let i = 0; i < from.length; i++) {
        newText = newText.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }
    
    return newText
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

function mostrarProdutos(lista) {
    const divProdutos = document.getElementById('produtos');
    divProdutos.innerHTML = '';

    if (lista.length === 0) {
        divProdutos.innerHTML = "<p>Nenhum produto encontrado.</p>";
        return;
    }

    const produtosPorCategoria = {};
    lista.forEach(produto => {
        const categoria = produto.Categoria;
        if (!produtosPorCategoria[categoria]) {
            produtosPorCategoria[categoria] = [];
        }
        produtosPorCategoria[categoria].push(produto);
    });

    Object.keys(produtosPorCategoria).forEach(categoria => {
        const tituloCategoria = document.createElement('h2');
        tituloCategoria.classList.add('titulo-categoria');
        tituloCategoria.textContent = categoria;
        tituloCategoria.id = slugify(categoria);
        divProdutos.appendChild(tituloCategoria);

        const containerCategoria = document.createElement('div');
        containerCategoria.classList.add('container-categoria');

        produtosPorCategoria[categoria].forEach(p => {
            const produtoCard = document.createElement('div');
            produtoCard.classList.add('produto-card');
            produtoCard.innerHTML = `
                <img src="${p.Imagem}" alt="${p.Nome}">
                <h3>${p.Nome}</h3>
                <p>Estoque: ${p.QuantidadeEstoque}</p>
                <p class="valor">R$ ${p.Valor.toFixed(2)}</p>
                <button class="add-carrinho" data-id="${p.Id}">Adicionar no carrinho</button>
            `;
            containerCategoria.appendChild(produtoCard);

            produtoCard.querySelector('.add-carrinho').addEventListener('click', () => {
                adicionarCarrinho(p);
            });
        });
        divProdutos.appendChild(containerCategoria);
    });
}
//form
function pesquisar() {
    const form = document.getElementById('formulario');
    const pesquisa = document.getElementById('pesquisa').value.toLowerCase();

    const resultados = produtos.filter(p =>
        (p.Nome + ' ' + p.Categoria).toLowerCase().includes(pesquisa)
    );

    mostrarProdutos(resultados);

    return false;
}

let carrinho = [];

function atualizarContador() {
    const contador = document.getElementById('contador');
    contador.textContent = carrinho.length;
}

function adicionarCarrinho(produto) {
    carrinho.push(produto);
    atualizarContador();
    alert(`${produto.Nome} adicionado ao carrinho!`);
}

function abrirCarrinho(event) {
    event.preventDefault();

    const container = document.getElementById("carrinho-container");
    const lista = document.getElementById("lista-itens");
    const totalDiv = document.getElementById("total-carrinho");
    const finalizarBtn = document.getElementById("finalizar-compra");

    lista.innerHTML = "";

    let total = 0;

    if (carrinho.length === 0) {
        lista.innerHTML = "<li>Seu carrinho está vazio.</li>";
        totalDiv.textContent = "";
        finalizarBtn.style.display = "none";
    } else {
        carrinho.forEach((item) => {
            const li = document.createElement("li");
            li.classList.add("item-carrinho");

            const imagem = document.createElement("img");
            imagem.src = item.Imagem;
            imagem.alt = item.Nome;
            imagem.classList.add("imagem-carrinho");

            const texto = document.createElement("span");
            texto.textContent = `${item.Nome} - R$ ${item.Valor.toFixed(2)}`;


            li.appendChild(imagem);
            li.appendChild(texto);

            lista.appendChild(li);

            total += item.Valor
            finalizarBtn.style.display = "block";
        });
        totalDiv.textContent = `Total: R$ ${total.toFixed(2)}`;
    }
    if (container.style.display === "none" || container.style.display === "") {
        container.style.display = "block";

        document.addEventListener('click', fecharCarrinhoAoClicarFora);
    } else {
        container.style.display = "none";

        document.removeEventListener('click', fecharCarrinhoAoClicarFora);
    }
}

function fecharCarrinhoAoClicarFora(event) {
    const carrinhoContainer = document.getElementById('carrinho-container');
    const botaoCarrinho = document.querySelector('#carrinho a');

    if (!carrinhoContainer.contains(event.target) && !botaoCarrinho.contains(event.target)) {
        carrinhoContainer.style.display = 'none';

        document.removeEventListener('click', fecharCarrinhoAoClicarFora);
    }
}

function finalizarCompra() {
    const totalDiv = document.getElementById("total-carrinho");
    const totalTexto = totalDiv.textContent;

    alert(`Compra finalizada com sucesso!\n${totalTexto}\nAgradecemos a preferência!`);

    carrinho = [];  
    
    const lista = document.getElementById("lista-itens");
    const finalizarBtn = document.getElementById("finalizar-compra");
    const container = document.getElementById("carrinho-container");

    lista.innerHTML = "<li>Seu carrinho está vazio.</li>";
    totalDiv.textContent = "";
    finalizarBtn.style.display = "none";
    
    atualizarContador();
    
    container.style.display = 'none';

    document.removeEventListener('click', fecharCarrinhoAoClicarFora);
}

mostrarProdutos(produtos);