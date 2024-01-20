document.addEventListener("DOMContentLoaded", function () {
    calcularTotal()
});

function removerItem() {

    const botaoRemover = document.getElementsByClassName('remover');
    console.log(botaoRemover);

    for (var i = 0; i < botaoRemover.length; i++) {
        botaoRemover[i].addEventListener("click", function (event) {
            event.target.parentElement.parentElement.remove()
            calcularTotal()
        });
    }
}

function adicionarRemoverItens(acao, linha) {
    let quantidadeItensElement = parseInt(linha.querySelector('.quantidade-itens').innerHTML);
    if (acao === "adicionar") {
        quantidadeItensElement++;
    } else if (acao === "remover" && quantidadeItensElement > 0) {
        quantidadeItensElement--
    }
    linha.querySelector('.quantidade-itens').innerHTML = quantidadeItensElement;
    calcularTotal()
}

function adicionarProduto() {
    console.log(document.querySelector('.produto').innerHTML)
}

function calcularTotal() {
    let total = document.getElementsByClassName("produto-carrinho");
    let precoTotal = 0
    for (var x = 0; x < total.length; x++) {
        preco = total[x].querySelector(".preco-produto").innerHTML.replace("R$", "").replace(",", ".")
        quantidade = total[x].querySelector(".quantidade-itens").innerHTML
        precoTotal = precoTotal + (preco * quantidade)
    }

    precoTotal = precoTotal.toFixed(2)
    document.getElementById("total").innerHTML = "R$ " + precoTotal
}
