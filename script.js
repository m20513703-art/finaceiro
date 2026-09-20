// ======================================================
// PDV FINANCEIRO - CLIMATIZAÇÃO
// ======================================================

let entradas = JSON.parse(localStorage.getItem("financeiro_entradas")) || [];
let saidas = JSON.parse(localStorage.getItem("financeiro_saidas")) || [];
let contasReceber = JSON.parse(localStorage.getItem("financeiro_receber")) || [];
let contasPagar = JSON.parse(localStorage.getItem("financeiro_pagar")) || [];

let tipoModal = "";
let idEditando = null;


// ======================================================
// ELEMENTOS
// ======================================================

const modal = document.getElementById("modal");
const tituloModal = document.getElementById("tituloModal");
const formModal = document.getElementById("formModal");
const camposModal = document.getElementById("camposModal");


// ======================================================
// SALVAR DADOS
// ======================================================

function salvarDados() {

    localStorage.setItem(
        "financeiro_entradas",
        JSON.stringify(entradas)
    );

    localStorage.setItem(
        "financeiro_saidas",
        JSON.stringify(saidas)
    );

    localStorage.setItem(
        "financeiro_receber",
        JSON.stringify(contasReceber)
    );

    localStorage.setItem(
        "financeiro_pagar",
        JSON.stringify(contasPagar)
    );
}


// ======================================================
// FORMATAÇÃO
// ======================================================

function moeda(valor) {

    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


function escapar(texto) {

    return String(texto || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function gerarId() {

    return Date.now() + Math.floor(Math.random() * 1000);
}


function hoje() {

    return new Date().toISOString().split("T")[0];
}


function formatarData(data) {

    if (!data) return "-";

    const partes = data.split("-");

    if (partes.length !== 3) {
        return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


// ======================================================
// NAVEGAÇÃO
// ======================================================

document.querySelectorAll(".menu-item").forEach(botao => {

    botao.addEventListener("click", () => {

        const pagina = botao.dataset.pagina;

        abrirPagina(pagina);

    });

});


function abrirPagina(nome) {

    document.querySelectorAll(".pagina").forEach(pagina => {
        pagina.classList.remove("ativa-pagina");
    });

    document.querySelectorAll(".menu-item").forEach(botao => {
        botao.classList.remove("ativo");
    });

    const pagina = document.getElementById(nome);

    if (pagina) {
        pagina.classList.add("ativa-pagina");
    }

    const botao = document.querySelector(
        `.menu-item[data-pagina="${nome}"]`
    );

    if (botao) {
        botao.classList.add("ativo");
    }

    atualizarTudo();
}


// ======================================================
// BOTÕES DE AÇÃO
// ======================================================

document.querySelectorAll("[data-acao]").forEach(botao => {

    botao.addEventListener("click", () => {

        const acao = botao.dataset.acao;

        executarAcao(acao);

    });

});


function executarAcao(acao) {

    switch (acao) {

        case "nova-entrada":
            abrirModal("entrada");
            break;

        case "nova-saida":
            abrirModal("saida");
            break;

        case "nova-receber":
            abrirModal("receber");
            break;

        case "nova-pagar":
            abrirModal("pagar");
            break;

        case "formas-pagamento":
            alert(
                "Formas de pagamento disponíveis:\n\n" +
                "• Dinheiro\n" +
                "• Pix\n" +
                "• Cartão de débito\n" +
                "• Cartão de crédito\n" +
                "• Transferência"
            );
            break;

        case "categorias":
            alert(
                "Categorias financeiras poderão ser personalizadas futuramente."
            );
            break;

        case "limpar-dados":

            if (
                confirm(
                    "Tem certeza que deseja apagar todos os dados financeiros?"
                )
            ) {

                entradas = [];
                saidas = [];
                contasReceber = [];
                contasPagar = [];

                salvarDados();
                atualizarTudo();

                alert("Dados financeiros apagados.");
            }

            break;
    }
}


// ======================================================
// MODAL
// ======================================================

function abrirModal(tipo, id = null) {

    tipoModal = tipo;
    idEditando = id;

    modal.classList.add("aberto");

    let registro = null;

    if (id) {

        if (tipo === "entrada") {
            registro = entradas.find(item => item.id === id);
        }

        if (tipo === "saida") {
            registro = saidas.find(item => item.id === id);
        }

        if (tipo === "receber") {
            registro = contasReceber.find(item => item.id === id);
        }

        if (tipo === "pagar") {
            registro = contasPagar.find(item => item.id === id);
        }
    }

    montarFormulario(tipo, registro);
}


function fecharModal() {

    modal.classList.remove("aberto");

    formModal.reset();

    camposModal.innerHTML = "";

    tipoModal = "";
    idEditando = null;
}


document
    .getElementById("fecharModal")
    .addEventListener("click", fecharModal);


document
    .getElementById("cancelarModal")
    .addEventListener("click", fecharModal);


modal.addEventListener("click", evento => {

    if (evento.target === modal) {
        fecharModal();
    }

});


// ======================================================
// FORMULÁRIOS
// ======================================================

function campoTexto(
    nome,
    label,
    valor = "",
    tipo = "text",
    obrigatorio = true
) {

    return `
        <div class="campo">
            <label for="${nome}">${label}</label>

            <input
                type="${tipo}"
                id="${nome}"
                name="${nome}"
                value="${escapar(valor)}"
                ${obrigatorio ? "required" : ""}
            >
        </div>
    `;
}


function campoSelect(
    nome,
    label,
    opcoes,
    valor = ""
) {

    return `
        <div class="campo">
            <label for="${nome}">${label}</label>

            <select id="${nome}" name="${nome}" required>

                <option value="">
                    Selecione...
                </option>

                ${opcoes.map(opcao => `
                    <option
                        value="${escapar(opcao)}"
                        ${valor === opcao ? "selected" : ""}
                    >
                        ${escapar(opcao)}
                    </option>
                `).join("")}

            </select>
        </div>
    `;
}


function campoArea(
    nome,
    label,
    valor = "",
    obrigatorio = false
) {

    return `
        <div class="campo">
            <label for="${nome}">${label}</label>

            <textarea
                id="${nome}"
                name="${nome}"
                ${obrigatorio ? "required" : ""}
            >${escapar(valor)}</textarea>
        </div>
    `;
}


function montarFormulario(tipo, registro = null) {

    let html = "";

    if (tipo === "entrada") {

        tituloModal.textContent =
            registro ? "Editar entrada" : "Nova entrada";

        html += campoTexto(
            "descricao",
            "Descrição",
            registro?.descricao
        );

        html += campoTexto(
            "valor",
            "Valor",
            registro?.valor,
            "number"
        );

        html += campoTexto(
            "data",
            "Data",
            registro?.data || hoje(),
            "date"
        );

        html += campoSelect(
            "categoria",
            "Categoria",
            [
                "Venda",
                "Serviço",
                "Pagamento de cliente",
                "Outros"
            ],
            registro?.categoria
        );

        html += campoSelect(
            "pagamento",
            "Forma de pagamento",
            [
                "Dinheiro",
                "Pix",
                "Cartão de débito",
                "Cartão de crédito",
                "Transferência",
                "Outro"
            ],
            registro?.pagamento
        );

        html += campoArea(
            "observacoes",
            "Observações",
            registro?.observacoes
        );
    }


    if (tipo === "saida") {

        tituloModal.textContent =
            registro ? "Editar saída" : "Nova saída";

        html += campoTexto(
            "descricao",
            "Descrição",
            registro?.descricao
        );

        html += campoTexto(
            "valor",
            "Valor",
            registro?.valor,
            "number"
        );

        html += campoTexto(
            "data",
            "Data",
            registro?.data || hoje(),
            "date"
        );

        html += campoSelect(
            "categoria",
            "Categoria",
            [
                "Fornecedor",
                "Salário",
                "Aluguel",
                "Energia",
                "Água",
                "Internet",
                "Combustível",
                "Material",
                "Impostos",
                "Outros"
            ],
            registro?.categoria
        );

        html += campoSelect(
            "pagamento",
            "Forma de pagamento",
            [
                "Dinheiro",
                "Pix",
                "Cartão",
                "Transferência",
                "Boleto",
                "Outro"
            ],
            registro?.pagamento
        );

        html += campoArea(
            "observacoes",
            "Observações",
            registro?.observacoes
        );
    }


    if (tipo === "receber") {

        tituloModal.textContent =
            registro ? "Editar conta a receber" : "Nova conta a receber";

        html += campoTexto(
            "cliente",
            "Cliente",
            registro?.cliente
        );

        html += campoTexto(
            "descricao",
            "Descrição",
            registro?.descricao
        );

        html += campoTexto(
            "valor",
            "Valor",
            registro?.valor,
            "number"
        );

        html += campoTexto(
            "vencimento",
            "Vencimento",
            registro?.vencimento || hoje(),
            "date"
        );

        html += campoSelect(
            "status",
            "Status",
            [
                "Pendente",
                "Pago",
                "Cancelado"
            ],
            registro?.status || "Pendente"
        );

        html += campoArea(
            "observacoes",
            "Observações",
            registro?.observacoes
        );
    }


    if (tipo === "pagar") {

        tituloModal.textContent =
            registro ? "Editar conta a pagar" : "Nova conta a pagar";

        html += campoTexto(
            "fornecedor",
            "Fornecedor",
            registro?.fornecedor
        );

        html += campoTexto(
            "descricao",
            "Descrição",
            registro?.descricao
        );

        html += campoTexto(
            "valor",
            "Valor",
            registro?.valor,
            "number"
        );

        html += campoTexto(
            "vencimento",
            "Vencimento",
            registro?.vencimento || hoje(),
            "date"
        );

        html += campoSelect(
            "status",
            "Status",
            [
                "Pendente",
                "Pago",
                "Cancelado"
            ],
            registro?.status || "Pendente"
        );

        html += campoArea(
            "observacoes",
            "Observações",
            registro?.observacoes
        );
    }

    camposModal.innerHTML = html;
}


// ======================================================
// SALVAR FORMULÁRIO
// ======================================================

formModal.addEventListener("submit", evento => {

    evento.preventDefault();

    const dados = Object.fromEntries(
        new FormData(formModal).entries()
    );

    dados.valor = Number(dados.valor || 0);

    if (idEditando) {

        editarRegistro(
            tipoModal,
            idEditando,
            dados
        );

    } else {

        const novo = {
            id: gerarId(),
            ...dados,
            criadoEm: new Date().toISOString()
        };

        if (tipoModal === "entrada") {
            entradas.push(novo);
        }

        if (tipoModal === "saida") {
            saidas.push(novo);
        }

        if (tipoModal === "receber") {
            contasReceber.push(novo);
        }

        if (tipoModal === "pagar") {
            contasPagar.push(novo);
        }
    }

    salvarDados();
    fecharModal();
    atualizarTudo();
});


// ======================================================
// EDITAR
// ======================================================

function editarRegistro(tipo, id, dados) {

    let lista;

    if (tipo === "entrada") {
        lista = entradas;
    }

    if (tipo === "saida") {
        lista = saidas;
    }

    if (tipo === "receber") {
        lista = contasReceber;
    }

    if (tipo === "pagar") {
        lista = contasPagar;
    }

    const indice = lista.findIndex(item => item.id === id);

    if (indice !== -1) {

        lista[indice] = {
            ...lista[indice],
            ...dados
        };
    }
}


// ======================================================
// EXCLUIR
// ======================================================

function excluirRegistro(tipo, id) {

    if (!confirm("Deseja realmente excluir este lançamento?")) {
        return;
    }

    if (tipo === "entrada") {
        entradas = entradas.filter(item => item.id !== id);
    }

    if (tipo === "saida") {
        saidas = saidas.filter(item => item.id !== id);
    }

    if (tipo === "receber") {
        contasReceber =
            contasReceber.filter(item => item.id !== id);
    }

    if (tipo === "pagar") {
        contasPagar =
            contasPagar.filter(item => item.id !== id);
    }

    salvarDados();
    atualizarTudo();
}


// ======================================================
// MARCAR CONTA
// ======================================================

function alterarStatus(tipo, id) {

    let lista;

    if (tipo === "receber") {
        lista = contasReceber;
    }

    if (tipo === "pagar") {
        lista = contasPagar;
    }

    const item = lista.find(registro => registro.id === id);

    if (!item) return;

    if (item.status === "Pendente") {
        item.status = "Pago";
    } else if (item.status === "Pago") {
        item.status = "Pendente";
    } else {
        item.status = "Pendente";
    }

    salvarDados();
    atualizarTudo();
}


// ======================================================
// RENDERIZAÇÃO
// ======================================================

function renderizarEntradas(filtro = "") {

    const container =
        document.getElementById("listaEntradas");

    const lista = entradas.filter(item => {

        const texto = `
            ${item.descricao}
            ${item.categoria}
            ${item.pagamento}
        `.toLowerCase();

        return texto.includes(filtro.toLowerCase());
    });

    if (lista.length === 0) {

        container.innerHTML = `
            <div class="vazio">
                Nenhuma entrada encontrada.
            </div>
        `;

        return;
    }

    container.innerHTML = lista
        .slice()
        .reverse()
        .map(item => `

            <div class="lancamento">

                <div>
                    <h3>${escapar(item.descricao)}</h3>

                    <p>
                        ${escapar(item.categoria)}
                        •
                        ${escapar(item.pagamento)}
                        •
                        ${formatarData(item.data)}
                    </p>

                    ${
                        item.observacoes
                            ? `<p>${escapar(item.observacoes)}</p>`
                            : ""
                    }

                    <strong class="valor-entrada">
                        + ${moeda(item.valor)}
                    </strong>
                </div>

                <div class="acoes">

                    <button
                        class="btn-mini"
                        onclick="abrirModal('entrada', ${item.id})"
                    >
                        Editar
                    </button>

                    <button
                        class="btn-mini excluir"
                        onclick="excluirRegistro('entrada', ${item.id})"
                    >
                        Excluir
                    </button>

                </div>

            </div>

        `)
        .join("");
}


function renderizarSaidas(filtro = "") {

    const container =
        document.getElementById("listaSaidas");

    const lista = saidas.filter(item => {

        const texto = `
            ${item.descricao}
            ${item.categoria}
            ${item.pagamento}
        `.toLowerCase();

        return texto.includes(filtro.toLowerCase());
    });

    if (lista.length === 0) {

        container.innerHTML = `
            <div class="vazio">
                Nenhuma saída encontrada.
            </div>
        `;

        return;
    }

    container.innerHTML = lista
        .slice()
        .reverse()
        .map(item => `

            <div class="lancamento">

                <div>
                    <h3>${escapar(item.descricao)}</h3>

                    <p>
                        ${escapar(item.categoria)}
                        •
                        ${escapar(item.pagamento)}
                        •
                        ${formatarData(item.data)}
                    </p>

                    ${
                        item.observacoes
                            ? `<p>${escapar(item.observacoes)}</p>`
                            : ""
                    }

                    <strong class="valor-saida">
                        - ${moeda(item.valor)}
                    </strong>
                </div>

                <div class="acoes">

                    <button
                        class="btn-mini"
                        onclick="abrirModal('saida', ${item.id})"
                    >
                        Editar
                    </button>

                    <button
                        class="btn-mini excluir"
                        onclick="excluirRegistro('saida', ${item.id})"
                    >
                        Excluir
                    </button>

                </div>

            </div>

        `)
        .join("");
}


function renderizarReceber() {

    const container =
        document.getElementById("listaReceber");

    if (contasReceber.length === 0) {

        container.innerHTML = `
            <div class="vazio">
                Nenhuma conta a receber cadastrada.
            </div>
        `;

        return;
    }

    container.innerHTML = contasReceber
        .slice()
        .reverse()
        .map(item => `

            <div class="lancamento">

                <div>
                    <h3>${escapar(item.cliente)}</h3>

                    <p>
                        ${escapar(item.descricao)}
                    </p>

                    <p>
                        Vencimento:
                        ${formatarData(item.vencimento)}
                    </p>

                    <strong class="valor-entrada">
                        ${moeda(item.valor)}
                    </strong>

                    <br>

                    <span class="status ${classeStatus(item.status)}">
                        ${escapar(item.status)}
                    </span>
                </div>

                <div class="acoes">

                    <button
                        class="btn-mini"
                        onclick="alterarStatus('receber', ${item.id})"
                    >
                        Alterar status
                    </button>

                    <button
                        class="btn-mini"
                        onclick="abrirModal('receber', ${item.id})"
                    >
                        Editar
                    </button>

                    <button
                        class="btn-mini excluir"
                        onclick="excluirRegistro('receber', ${item.id})"
                    >
                        Excluir
                    </button>

                </div>

            </div>

        `)
        .join("");
}


function renderizarPagar() {

    const container =
        document.getElementById("listaPagar");

    if (contasPagar.length === 0) {

        container.innerHTML = `
            <div class="vazio">
                Nenhuma conta a pagar cadastrada.
            </div>
        `;

        return;
    }

    container.innerHTML = contasPagar
        .slice()
        .reverse()
        .map(item => `

            <div class="lancamento">

                <div>
                    <h3>${escapar(item.fornecedor)}</h3>

                    <p>
                        ${escapar(item.descricao)}
                    </p>

                    <p>
                        Vencimento:
                        ${formatarData(item.vencimento)}
                    </p>

                    <strong class="valor-saida">
                        ${moeda(item.valor)}
                    </strong>

                    <br>

                    <span class="status ${classeStatus(item.status)}">
                        ${escapar(item.status)}
                    </span>
                </div>

                <div class="acoes">

                    <button
                        class="btn-mini"
                        onclick="alterarStatus('pagar', ${item.id})"
                    >
                        Alterar status
                    </button>

                    <button
                        class="btn-mini"
                        onclick="abrirModal('pagar', ${item.id})"
                    >
                        Editar
                    </button>

                    <button
                        class="btn-mini excluir"
                        onclick="excluirRegistro('pagar', ${item.id})"
                    >
                        Excluir
                    </button>

                </div>

            </div>

        `)
        .join("");
}


function classeStatus(status) {

    if (status === "Pago") {
        return "pago";
    }

    if (status === "Cancelado") {
        return "cancelado";
    }

    return "pendente";
}


// ======================================================
// DASHBOARD
// ======================================================

function calcularTotais() {

    const totalEntradas =
        entradas.reduce(
            (total, item) =>
                total + Number(item.valor || 0),
            0
        );

    const totalSaidas =
        saidas.reduce(
            (total, item) =>
                total + Number(item.valor || 0),
            0
        );

    const totalReceber =
        contasReceber
            .filter(item => item.status === "Pendente")
            .reduce(
                (total, item) =>
                    total + Number(item.valor || 0),
                0
            );

    const totalPagar =
        contasPagar
            .filter(item => item.status === "Pendente")
            .reduce(
                (total, item) =>
                    total + Number(item.valor || 0),
                0
            );

    const saldo =
        totalEntradas - totalSaidas;

    return {
        totalEntradas,
        totalSaidas,
        totalReceber,
        totalPagar,
        saldo
    };
}


function atualizarDashboard() {

    const totais = calcularTotais();

    document.getElementById("totalEntradas").textContent =
        moeda(totais.totalEntradas);

    document.getElementById("totalSaidas").textContent =
        moeda(totais.totalSaidas);

    document.getElementById("saldoAtual").textContent =
        moeda(totais.saldo);

    document.getElementById("totalReceber").textContent =
        moeda(totais.totalReceber);

    document.getElementById("resumoPagar").textContent =
        moeda(totais.totalPagar);

    document.getElementById("resumoReceber").textContent =
        moeda(totais.totalReceber);

    document.getElementById("qtdEntradas").textContent =
        entradas.length;

    document.getElementById("qtdSaidas").textContent =
        saidas.length;

    document.getElementById("caixaEntradas").textContent =
        moeda(totais.totalEntradas);

    document.getElementById("caixaSaidas").textContent =
        moeda(totais.totalSaidas);

    document.getElementById("caixaSaldo").textContent =
        moeda(totais.saldo);

    document.getElementById("relatorioEntradas").textContent =
        moeda(totais.totalEntradas);

    document.getElementById("relatorioSaidas").textContent =
        moeda(totais.totalSaidas);

    document.getElementById("relatorioSaldo").textContent =
        moeda(totais.saldo);

    document.getElementById("relatorioLancamentos").textContent =
        entradas.length + saidas.length;
}


// ======================================================
// MOVIMENTAÇÕES RECENTES
// ======================================================

function renderizarMovimentacoes() {

    const container =
        document.getElementById("movimentacoesRecentes");

    const movimentos = [

        ...entradas.map(item => ({
            ...item,
            tipo: "entrada"
        })),

        ...saidas.map(item => ({
            ...item,
            tipo: "saida"
        }))

    ]
        .sort(
            (a, b) =>
                new Date(b.criadoEm) -
                new Date(a.criadoEm)
        )
        .slice(0, 8);

    if (movimentos.length === 0) {

        container.innerHTML = `
            <div class="vazio">
                Nenhuma movimentação cadastrada.
            </div>
        `;

        return;
    }

    container.innerHTML = movimentos
        .map(item => `

            <div class="movimento">

                <div class="movimento-info">

                    <strong>
                        ${escapar(item.descricao)}
                    </strong>

                    <small>
                        ${formatarData(item.data)}
                        •
                        ${escapar(item.categoria)}
                    </small>

                </div>

                <strong class="${
                    item.tipo === "entrada"
                        ? "valor-entrada"
                        : "valor-saida"
                }">

                    ${
                        item.tipo === "entrada"
                            ? "+"
                            : "-"
                    }

                    ${moeda(item.valor)}

                </strong>

            </div>

        `)
        .join("");
}


// ======================================================
// HISTÓRICO DO CAIXA
// ======================================================

function renderizarHistoricoCaixa() {

    const container =
        document.getElementById("historicoCaixa");

    const movimentos = [

        ...entradas.map(item => ({
            ...item,
            tipo: "entrada"
        })),

        ...saidas.map(item => ({
            ...item,
            tipo: "saida"
        }))

    ]
        .sort(
            (a, b) =>
                new Date(b.criadoEm) -
                new Date(a.criadoEm)
        );

    if (movimentos.length === 0) {

        container.innerHTML = `
            <div class="vazio">
                Nenhuma movimentação no caixa.
            </div>
        `;

        return;
    }

    container.innerHTML = movimentos
        .map(item => `

            <div class="movimento">

                <div class="movimento-info">

                    <strong>
                        ${escapar(item.descricao)}
                    </strong>

                    <small>
                        ${formatarData(item.data)}
                    </small>

                </div>

                <strong class="${
                    item.tipo === "entrada"
                        ? "valor-entrada"
                        : "valor-saida"
                }">

                    ${
                        item.tipo === "entrada"
                            ? "+"
                            : "-"
                    }

                    ${moeda(item.valor)}

                </strong>

            </div>

        `)
        .join("");
}


// ======================================================
// RELATÓRIO
// ======================================================

function renderizarRelatorio() {

    const totais = calcularTotais();

    document.getElementById(
        "relatorioDetalhado"
    ).innerHTML = `

        <div class="detalhe-relatorio">
            <span>Total recebido</span>
            <strong class="valor-entrada">
                ${moeda(totais.totalEntradas)}
            </strong>
        </div>

        <div class="detalhe-relatorio">
            <span>Total gasto</span>
            <strong class="valor-saida">
                ${moeda(totais.totalSaidas)}
            </strong>
        </div>

        <div class="detalhe-relatorio">
            <span>Contas pendentes a receber</span>
            <strong>
                ${moeda(totais.totalReceber)}
            </strong>
        </div>

        <div class="detalhe-relatorio">
            <span>Contas pendentes a pagar</span>
            <strong>
                ${moeda(totais.totalPagar)}
            </strong>
        </div>

    `;
}


// ======================================================
// PESQUISA
// ======================================================

const campoBuscaEntrada =
    document.getElementById("buscarEntrada");

if (campoBuscaEntrada) {

    campoBuscaEntrada.addEventListener(
        "input",
        evento => {

            renderizarEntradas(
                evento.target.value
            );

        }
    );
}


const campoBuscaSaida =
    document.getElementById("buscarSaida");

if (campoBuscaSaida) {

    campoBuscaSaida.addEventListener(
        "input",
        evento => {

            renderizarSaidas(
                evento.target.value
            );

        }
    );
}


// ======================================================
// ATUALIZAÇÃO GERAL
// ======================================================

function atualizarTudo() {

    atualizarDashboard();

    renderizarEntradas(
        campoBuscaEntrada?.value || ""
    );

    renderizarSaidas(
        campoBuscaSaida?.value || ""
    );

    renderizarReceber();

    renderizarPagar();

    renderizarMovimentacoes();

    renderizarHistoricoCaixa();

    renderizarRelatorio();
}


// ======================================================
// INICIALIZAÇÃO
// ======================================================

salvarDados();

atualizarTudo();

abrirPagina("inicio");