if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready)
} else {
    ready()
}
precoTotal = "0,00"

function ready() {
    let RemoverProduto = document.getElementsByClassName("btn-remover");
    for (var i = 0; i < RemoverProduto.length; i++) {
        RemoverProduto[i].addEventListener("click", removerItem);
    }

    let addRemoverItens = document.getElementsByClassName("botaoMM");
    for (var i = 0; i < addRemoverItens.length; i++) {
        addRemoverItens[i].addEventListener("click", CliqueBotaoMM);
    }

    let addCarrinho = document.getElementsByClassName("comprar-btn")
    for (var i = 0; i < addCarrinho.length; i++) {
        addCarrinho[i].addEventListener("click", adicionarCarrinho)
    }

    let btnComprar = document.getElementById("finalizar-compra")
    btnComprar.addEventListener("click", realizarCompra)

}   

function realizarCompra(){
    if (precoTotal === "0,00"){
        alert("Seu carrinho está vazio!")
    }else{
        alert(
        `
        Obrigado pela sua compra!
        Valor: R$ ${precoTotal}
        Volte sempre!
        `)
    }

    document.querySelector("#carrinho tbody").innerHTML = ""
    calcularTotal()
}

function CliqueBotaoMM(event) {
    let acao = event.target;
    let acaoPai = acao.parentElement.parentElement;
    let quantidade = parseInt(acaoPai.querySelector(".quantidade-itens").innerHTML);

    if (acao.classList.contains("bx-minus") && quantidade > 0) {
        quantidade--;
    } else if (acao.classList.contains("bx-plus")) {
        quantidade++;
    }

    acaoPai.querySelector(".quantidade-itens").innerHTML = quantidade

    if (quantidade === 0) {
        acaoPai.parentElement.parentElement.remove()
    }

    calcularTotal();
}


function removerItem(event) {
    event.target.parentElement.parentElement.remove();
    calcularTotal();
}


function adicionarCarrinho(event) {
    let produto = event.target.parentElement
    let imgProduto = produto.querySelector(".imagem-produto").src
    let nomeProduto = produto.querySelector(".nome-produto").innerHTML
    let precoProduto = produto.querySelector(".preco").innerHTML

    let nomeProdutosCarrinho = document.getElementsByClassName("nome")
    for (var i=0; i<nomeProdutosCarrinho.length;i++){
        if (nomeProdutosCarrinho[i].innerHTML == nomeProduto){
        let quantidade = parseInt(nomeProdutosCarrinho[i].parentElement.parentElement.parentElement.querySelector(".quantidade-itens").innerHTML)
        nomeProdutosCarrinho[i].parentElement.parentElement.parentElement.querySelector(".quantidade-itens").innerHTML = quantidade +1
        calcularTotal()
            return
        }
    }

    let novoElement = document.createElement("tr")
    novoElement.classList.add("produto-carrinho")
    novoElement.innerHTML = 
    `
                    <td class="produto-identificao">
                        <img src="${imgProduto}" alt="${nomeProduto}">
                        <div class="info-carrinho">
                            <div class="nome">${nomeProduto}</div>
                         <!--   <div class="tipo">M</div>-->
                        </div>
                    </td>
                    <td class="preco-produto">${precoProduto}</td>
                    <td>
                        <div class="qty">
                            <button class="botaoMM" type="button"><i class='bx bx-minus'></i></button>
                            <span class="quantidade-itens">1</span>
                            <button class="botaoMM" type="button"><i class='bx bx-plus'></i></button>
                        </div>
                    </td>
                    <td class="remover">
                        <button type="button" class="btn-remover">REMOVER</button>
                    </td>
    `
    
    let tabela = document.querySelector("#carrinho tbody")
    tabela.append(novoElement)
    calcularTotal()
    novoElement.querySelector(".btn-remover").addEventListener("click", removerItem)
    novoElement.querySelector(".qty").addEventListener("click", CliqueBotaoMM)

}

function calcularTotal() {
    let total = document.getElementsByClassName("produto-carrinho");
    precoTotal = 0
    for (var x = 0; x < total.length; x++) {
        preco = total[x].querySelector(".preco-produto").innerHTML.replace("R$", "").replace(",", ".")
        quantidade = total[x].querySelector(".quantidade-itens").innerHTML
        precoTotal = precoTotal + (preco * quantidade)
    }

    precoTotal = precoTotal.toFixed(2)
    document.getElementById("total").innerHTML = "R$ " + precoTotal
}
