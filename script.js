const produtos = [
    {
        id: 1,
        nome: "🍔 X-Burger",
        preco: 25,
        imagem: "assets/xburger.png",
        categoria: "Lanche",
         adicionais: [
        {
            nome: "🥓 Bacon",
            preco: 5
        },
        {
            nome: "🧀 Cheddar",
            preco: 4
        },
        {
            nome: "🍳 Ovo",
            preco: 3
        }
    ]
},
    {
        id: 2,
        nome: "🥓 X-Bacon",
        preco: 32,
        imagem: "assets/xbacon.png",
        categoria: "Lanche",
         adicionais: [
        {
            nome: "🥓 Bacon",
            preco: 5
        },
        {
            nome: "🧀 Cheddar",
            preco: 4
        },
        {
            nome: "🍳 Ovo",
            preco: 3
        }
    ]
    },
    {
        id: 3,
        nome: "🥗 X-Salada",
        preco: 28,
        imagem: "assets/xsalada.png",
        categoria: "Lanche",
         adicionais: [
        {
            nome: "🥓 Bacon",
            preco: 5
        },
        {
            nome: "🧀 Cheddar",
            preco: 4
        },
        {
            nome: "🍳 Ovo",
            preco: 3
        }
    ]
    },
    {
        id: 4,
        nome: "🍟 Batata Frita",
        preco: 15,
        imagem: "assets/batata.png",
        categoria: "Lanche",
        adicionais: [
    {
        nome:"🧀 Cheddar",
        preco:4
    },
    {
        nome:"🥓 Bacon",
        preco:5
    }
]
    },
    {
        id: 5,
        nome: "🥤 Coca-Cola",
        preco: 8,
        imagem: "assets/coca.png",
        categoria: "Bebida",
        adicionais: []
    },
    {
        id: 6,
        nome: "🥤 Guaraná",
        preco: 7,
        imagem: "assets/guarana.png",
        categoria: "Bebida",
        adicionais: []
    },
    {
        id: 7,
        nome: "🍰 Brownie",
        preco: 12,
        imagem: "assets/brownie.png",
        categoria: "Sobremesa",
        adicionais: []
    },
    {
        id: 8,
        nome: "🍨 Sorvete",
        preco: 10,
        imagem: "assets/sorvete.png",
        categoria: "Sobremesa",
        adicionais: []
    }
];

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

let historico = JSON.parse(localStorage.getItem("historico")) || [];

let produtoSelecionado = null;

let produtoEditando = null;

const produtosDiv = document.getElementById("produtos");

mostrarProdutos(produtos);
atualizarCarrinho();
atualizarHistorico();

function mostrarProdutos(lista){

    produtosDiv.innerHTML = "";

    lista.forEach(function(produto){

        produtosDiv.innerHTML += `

        <div class="card">

            <!-- Remova o comentário quando colocar as imagens -->
            <!-- <img src="${produto.imagem}" alt="${produto.nome}"> -->

            <h2>${produto.nome}</h2>

            <h4>${produto.categoria}</h4>

            <p>R$ ${produto.preco.toFixed(2)}</p>

            <button onclick="adicionarAoCarrinho(${produto.id})">

                Adicionar

            </button>

        </div>

        `;

    });

}

function salvarCarrinho(){

    localStorage.setItem("carrinho", JSON.stringify(carrinho));

}

function adicionarAoCarrinho(id){

    produtoSelecionado = produtos.find(function(produto){

        return produto.id == id;

    });

    if(produtoSelecionado.adicionais.length == 0){

        adicionarProdutoSemAdicionais();

        return;

    }

    abrirModalAdicionais();

}

function atualizarCarrinho(){

    const listaCarrinho = document.getElementById("listaCarrinho");

    listaCarrinho.innerHTML = "";

    let total = 0;

    if(carrinho.length == 0){

        listaCarrinho.innerHTML = "<p>Seu carrinho está vazio.</p>";

    }

    carrinho.forEach(function(item){

        listaCarrinho.innerHTML += `

        <div class="itemCarrinho">

            <h4>${item.nome}</h4>

${
    item.adicionais && item.adicionais.length > 0
        ? `
        <div class="adicionaisCarrinho">
            <strong>Adicionais:</strong><br>
            ${item.adicionais.map(function(add){
                return "• " + add;
            }).join("<br>")}
        </div>
        `
        : ""
}

<button onclick="diminuirQuantidade(${item.id})">-</button>

            <span>${item.quantidade}</span>

            <button onclick="aumentarQuantidade(${item.id})">+</button>

            <p>Subtotal: R$ ${(item.preco * item.quantidade).toFixed(2)}</p>

            <button onclick="removerItem(${item.id})">

                Remover

            </button>

            <hr>

        </div>

        `;

        total += item.preco * item.quantidade;

    });

    document.getElementById("total").innerHTML =
        "Total: R$ " + total.toFixed(2);

}

function aumentarQuantidade(id){

    const item = carrinho.find(function(produto){

        return produto.id == id;

    });

    if(item){

        item.quantidade++;

        salvarCarrinho();

        atualizarCarrinho();

    }

}

function diminuirQuantidade(id){

    const item = carrinho.find(function(produto){

        return produto.id == id;

    });

    if(!item){

        return;

    }

    if(item.quantidade > 1){

        item.quantidade--;

    }else{

        removerItem(id);

        return;

    }

    salvarCarrinho();

    atualizarCarrinho();

}

function removerItem(id){

    carrinho = carrinho.filter(function(item){

        return item.id != id;

    });

    salvarCarrinho();

    atualizarCarrinho();

}

function pesquisarProdutos(){

    const texto = document
        .getElementById("pesquisa")
        .value
        .toLowerCase();

    const resultado = produtos.filter(function(produto){

        return produto.nome.toLowerCase().includes(texto) ||
               produto.categoria.toLowerCase().includes(texto);

    });

    mostrarProdutos(resultado);

}

function filtrarCategoria(categoria, botao){

    const botoes = document.querySelectorAll(".filtros button");

    botoes.forEach(function(btn){

        btn.classList.remove("ativo");

    });

    botao.classList.add("ativo");

    if(categoria == "Todos"){

        mostrarProdutos(produtos);
        return;

    }

    const listaFiltrada = produtos.filter(function(produto){

        return produto.categoria == categoria;

    });

    mostrarProdutos(listaFiltrada);

}

function abrirModal(){

    if(carrinho.length == 0){

        alert("Seu carrinho está vazio!");

        return;

    }

    const modal = document.getElementById("modalPedido");

    const resumo = document.getElementById("resumoPedido");

    const totalPedido = document.getElementById("totalPedido");

    resumo.innerHTML = "";

    let total = 0;

    carrinho.forEach(function(item){

        resumo.innerHTML += `

            <p>

                <strong>${item.nome}</strong><br>

${
    item.adicionais && item.adicionais.length > 0
        ? `
        <small>
            Adicionais:<br>
            ${item.adicionais.map(function(add){
                return "• " + add;
            }).join("<br>")}
        </small><br><br>
        `
        : ""
}

Quantidade: ${item.quantidade}<br>

Subtotal: R$ ${(item.preco * item.quantidade).toFixed(2)}

            </p>

            <hr>

        `;

        total += item.preco * item.quantidade;

    });

    totalPedido.innerHTML = "Total: R$ " + total.toFixed(2);

    alterarTipoPedido();

    modal.style.display = "flex";

}

function fecharModal(){

    document.getElementById("modalPedido").style.display = "none";

}

function alterarTipoPedido(){

    const tipo = document.getElementById("tipoPedido").value;

    const endereco = document.getElementById("enderecoCliente");

    if(tipo == "Retirada"){

        endereco.style.display = "none";

    }else{

        endereco.style.display = "block";

    }

}

function confirmarPedido(){

    const nome = document.getElementById("nomeCliente").value.trim();

    const telefone = document.getElementById("telefoneCliente").value.trim();

    const tipo = document.getElementById("tipoPedido").value;

    const endereco = document.getElementById("enderecoCliente").value.trim();

    const pagamento = document.getElementById("pagamento").value;

    if(nome == ""){

        alert("Digite o nome do cliente.");

        return;

    }

    if(telefone == ""){

        alert("Digite o telefone.");

        return;

    }

    if(tipo == "Entrega" && endereco == ""){

        alert("Digite o endereço.");

        return;

    }

    let total = 0;
let itens = "";

carrinho.forEach(function(item){

    total += item.preco * item.quantidade;

    itens += "• " + item.nome;

    if(item.adicionais && item.adicionais.length > 0){

        itens += "\n   +" + item.adicionais.join(", +");

    }

    itens += "\n   Quantidade: " + item.quantidade;

    itens += "\n\n";

    const mensagem = `🍔 *NOVO PEDIDO*

👤 Cliente: ${nome}

📞 Telefone: ${telefone}

🚚 Tipo: ${tipo}

📍 Endereço: ${tipo == "Entrega" ? endereco : "Retirada"}

💳 Pagamento: ${pagamento}

🛒 PEDIDO

${itens}

💰 Total: R$ ${total.toFixed(2)}
`;

const numero = "55549912345678";

const url =
"https://wa.me/" +
numero +
"?text=" +
encodeURIComponent(mensagem);

window.open(url, "_blank");

});

    let totalPedido = 0;

carrinho.forEach(function(item){
    totalPedido += item.preco * item.quantidade;
});

historico.unshift({

    nome: nome,
    telefone: telefone,
    total: totalPedido,
    data: new Date().toLocaleString("pt-BR")

});

salvarHistorico();

atualizarHistorico();

    carrinho = [];

    salvarCarrinho();

    atualizarCarrinho();

    fecharModal();

    document.getElementById("nomeCliente").value = "";

    document.getElementById("telefoneCliente").value = "";

    document.getElementById("enderecoCliente").value = "";

    document.getElementById("tipoPedido").value = "Entrega";

    document.getElementById("pagamento").selectedIndex = 0;

}

function abrirModalAdicionais(){

    const lista = document.getElementById("listaAdicionais");

    lista.innerHTML = "";

    produtoSelecionado.adicionais.forEach(function(adicional, indice){

        lista.innerHTML += `

            <label>

                <input
                    type="checkbox"
                    id="add${indice}">

                ${adicional.nome}
                (+ R$ ${adicional.preco.toFixed(2)})

            </label>

            <br><br>

        `;

    });

    document.getElementById("modalAdicionais").style.display = "flex";

}

function fecharModalAdicionais(){

    document.getElementById("modalAdicionais").style.display = "none";

}

function confirmarAdicionais(){

    let precoFinal = produtoSelecionado.preco;

    let nomeFinal = produtoSelecionado.nome;

    let listaAdicionais = [];

    produtoSelecionado.adicionais.forEach(function(adicional, indice){

        const marcado = document.getElementById("add" + indice);

        if(marcado.checked){

            precoFinal += adicional.preco;

            listaAdicionais.push(adicional.nome);

        }

    });

    const itemCarrinho = carrinho.find(function(item){

        return item.nome == nomeFinal;

    });

    if(itemCarrinho){

        itemCarrinho.quantidade++;

    }else{

        carrinho.push({

    id: Date.now(),

    nome: produtoSelecionado.nome,

    adicionais: listaAdicionais,

    preco: precoFinal,

    quantidade: 1

});

    }

    salvarCarrinho();

    atualizarCarrinho();

    fecharModalAdicionais();

}

function adicionarProdutoSemAdicionais(){

    const itemCarrinho = carrinho.find(function(item){

        return item.id == produtoSelecionado.id;

    });

    if(itemCarrinho){

        itemCarrinho.quantidade++;

    }else{

        carrinho.push({

            id: produtoSelecionado.id,

            nome: produtoSelecionado.nome,

            preco: produtoSelecionado.preco,

            quantidade: 1

        });

    }

    salvarCarrinho();

    atualizarCarrinho();

}

function salvarHistorico() {

    localStorage.setItem(
        "historico",
        JSON.stringify(historico)
    );

}

function atualizarHistorico() {

    const lista = document.getElementById("listaHistorico");

    lista.innerHTML = "";

    if (historico.length == 0) {

        lista.innerHTML = "<p>Nenhum pedido realizado.</p>";
        return;

    }

    historico.forEach(function(pedido, indice) {

        lista.innerHTML += `

        <div class="pedidoHistorico">

            <h3>Pedido #${indice + 1}</h3>

            <p><strong>Cliente:</strong> ${pedido.nome}</p>

            <p><strong>Telefone:</strong> ${pedido.telefone}</p>

            <p><strong>Total:</strong> R$ ${pedido.total.toFixed(2)}</p>

            <p><strong>Data:</strong> ${pedido.data}</p>

        </div>

        <hr>

        `;

    });

}

function abrirPainelAdmin(){

    atualizarPainelAdmin();

    document.getElementById("modalAdmin").style.display = "flex";

}

function cadastrarProduto(){
    const nome = document.getElementById("novoNome").value;

    const preco = Number(document.getElementById("novoPreco").value);

    const categoria = document.getElementById("novaCategoria").value;

    if(nome == "" || preco <= 0){

        alert("Preencha todos os campos.");

        return 0;
    }

    if(produtoEditando){

    produtoEditando.nome = nome;
    produtoEditando.preco = preco;
    produtoEditando.categoria = categoria;

    produtoEditando = null;

    document.getElementById("btnCadastrar").innerHTML =
        "Cadastrar";

}else{

    produtos.push({

        id: Date.now(),

        nome: nome,

        preco: preco,

        categoria: categoria,

        imagem: "",

        adicionais: []

    });

}

mostrarProdutos(produtos);

atualizarPainelAdmin();

mostrarProdutos(produtos);

document.getElementById("novoNome").value = "";
document.getElementById("novoPreco").value = "";
document.getElementById("novaCategoria").selectedIndex = 0;

fecharPainelAdmin();

alert("Produto cadastrado com sucesso!");

}

function atualizarPainelAdmin(){

    const lista = document.getElementById("listaProdutosAdmin");

    lista.innerHTML = "";

    produtos.forEach(function(produto){

        lista.innerHTML += `

        <div class="produtoAdmin">

            <strong>${produto.nome}</strong>

            <br>

            Categoria: ${produto.categoria}

            <br>

            R$ ${produto.preco.toFixed(2)}

            <br><br>

            <button onclick="editarProduto(${produto.id})">
                ✏️ Editar
            </button>

            <button onclick="excluirProduto(${produto.id})">
                🗑 Excluir
            </button>

            <hr>

        </div>

        `;

    });

}

function excluirProduto(id){

    produtos.splice(

        produtos.findIndex(function(produto){

            return produto.id == id;

        }),

        1

    );

    mostrarProdutos(produtos);

    atualizarPainelAdmin();

}

function editarProduto(id){

    alert("Vamos implementar a edição no próximo passo.");

}

function abrirPainelAdmin() {

    document.getElementById("modalAdmin").style.display = "flex";

}

function fecharPainelAdmin() {

    document.getElementById("modalAdmin").style.display = "none";

}

function editarProduto(id){

    const produto = produtos.find(function(p){
        return p.id == id;
    });

    if(!produto){
        return;
    }

    produtoEditando = produto;

    document.getElementById("novoNome").value = produto.nome;
    document.getElementById("novoPreco").value = produto.preco;
    document.getElementById("novaCategoria").value = produto.categoria;

    document.getElementById("btnCadastrar").innerHTML =
        "💾 Salvar Alterações";

    abrirPainelAdmin();

}

function alternarTema(){

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem("tema","dark");

        document.getElementById("btnTema").innerHTML="☀️";

    }else{

        localStorage.setItem("tema","light");

        document.getElementById("btnTema").innerHTML="🌙";

    }

}