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

    let addCarrinho = document.getElementsByClassName("comprar-pag-produto")
    for (var i = 0; i < addCarrinho.length; i++) {
        addCarrinho[i].addEventListener("click", calcularTotal())
    }

    let btnComprar = document.getElementById("finalizar-compra")
    btnComprar.addEventListener("click", realizarCompra)

    

}


function realizarCompra() {
    precoTotal = document.getElementById('total').innerHTML
    tituloRemover = document.querySelector('.titulo-pag-produto').innerHTML
    tituloRemover = tituloRemover.trim()
    
    if (precoTotal === "0,00") {
        alert("Seu carrinho está vazio!")
    } else {
        alert(
            `
        Obrigado pela sua compra!
        Valor: R$ ${precoTotal}
        Volte sempre!
        `)
    }
    
    document.querySelector(".dropdown-cart").innerHTML = ""

    fetch('/atualizar-carrinho', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tituloRemover })
    })
}

function CliqueBotaoMM(event) {
    let acao = event.target;
    let acaoPai = acao.parentElement.parentElement;
    let titulojs = acaoPai.parentElement.parentElement
    let titulo = titulojs.querySelector('.nome').innerHTML
    titulo = titulo.trim()

    let quantidade = parseInt(acaoPai.querySelector(".quantidade-itens").innerHTML);
    let action
    if (acao.classList.contains("bx-minus") && quantidade > 0) {
        quantidade--
        action = 'minus'
    } else if (acao.classList.contains("bx-plus")) {
        action = 'plus'
        quantidade++
    }

    acaoPai.querySelector(".quantidade-itens").innerHTML = quantidade

    if (quantidade === 0) {
        acaoPai.parentElement.parentElement.remove()

    }

    fetch('/atualizar-carrinho', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, titulo })
    })

    calcularTotal();
}


function removerItem(event) {
    acao = event.target.parentElement.parentElement
    let tituloRemover = acao.querySelector('.nome').innerHTML
    tituloRemover = tituloRemover.trim()

    fetch('/atualizar-carrinho', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tituloRemover })
    })

    acao.closest('.dropdown-cart').remove()
    calcularTotal();
}


function calcularTotal() {
    console.log('usado calcular')
    fetch('/total')
    .then (response => response.json())
    .then (data => {
        document.getElementById("total").innerHTML = "R$ " + data.total.toFixed(2)
    })
    
}


function tamanhosBot(op) {
    let conteudo = document.getElementsByClassName('btn-tam')

    for (let i = 0; i < conteudo.length; i++) {

        conteudo[i].classList.remove('selecionado')

    }
    document.getElementById(op).classList.add('selecionado')
}