/* =========================================================
   RJCAP - CONTROLE DE VISITAS
   SCRIPT.JS
========================================================= */

const formulario = document.getElementById("formVisita");

const telefone = document.getElementById("telefone");
const valorContrato = document.getElementById("valorContrato");
const dataVisita = document.getElementById("dataVisita");

const observacoes = document.getElementById("observacoes");
const contadorCaracteres = document.getElementById("contadorCaracteres");

const modalSucesso = document.getElementById("modalSucesso");
const fecharModal = document.getElementById("fecharModal");
const novaVisita = document.getElementById("novaVisita");

const btnLimparFormulario =
    document.getElementById("btnLimparFormulario");

const empresaConservadora =
    document.getElementById("empresaConservadora");

const campoOutraConservadora =
    document.getElementById("campoOutraConservadora");

const outraConservadora =
    document.getElementById("outraConservadora");

const idVisitaGerado =
    document.getElementById("idVisitaGerado");

const idRegistroGerado =
    document.getElementById("idRegistroGerado");

const boxIdVisitaGerado =
    document.getElementById("boxIdVisitaGerado");

const tituloModalSucesso =
    document.getElementById("tituloModalSucesso");

const textoModalSucesso =
    document.getElementById("textoModalSucesso");

const exportarExcel =
    document.getElementById("exportarExcel");

const exportarPdf =
    document.getElementById("exportarPdf");


/* =========================================================
   NOVOS CAMPOS
========================================================= */

const campoApoios =
    document.getElementById("campoApoios");

const radiosPrecisaApoio =
    document.querySelectorAll(
        'input[name="precisaApoio"]'
    );

const checkboxesApoio =
    document.querySelectorAll(
        'input[name="apoio"]'
    );

const tipoContrato =
    document.getElementById("tipoContrato");

const margemVenda =
    document.getElementById("margemVenda");

const numeroProposta =
    document.getElementById("numeroProposta");

const dadosProposta =
    document.getElementById("dadosProposta");

const radiosTemProposta =
    document.querySelectorAll(
        'input[name="temProposta"]'
    );

const radiosTipoRegistro =
    document.querySelectorAll(
        'input[name="tipoRegistro"]'
    );

const campoOportunidadeExistente =
    document.getElementById("campoOportunidadeExistente");

const idOportunidadeExistente =
    document.getElementById("idOportunidadeExistente");

const campoOrigemAtualizacao =
    document.getElementById("campoOrigemAtualizacao");

const radiosOrigemAtualizacao =
    document.querySelectorAll(
        'input[name="origemAtualizacao"]'
    );

const rotuloNatureza =
    document.getElementById("rotuloNatureza");

const rotuloDataRegistro =
    document.getElementById("rotuloDataRegistro");

    /* =========================================================
   CONSULTAR AO SAIR DO CAMPO DE ID
========================================================= */

if (
    idOportunidadeExistente
) {

    idOportunidadeExistente.addEventListener(
        "blur",
        async function () {

            const id =
                this.value.trim();


            if (!id) {

                return;

            }


            const valorOriginal =
                this.value;


            this.disabled =
                true;


            try {

                const oportunidade =
                    await buscarOportunidadeExistente(
                        id
                    );


                if (!oportunidade) {

                    alert(
                        "Oportunidade não encontrada.\n\n" +
                        "Confira o ID informado."
                    );


                    return;

                }


                preencherDadosOportunidade(
                    oportunidade
                );


                if (
                    oportunidadeSelecionadaNome
                ) {
                    oportunidadeSelecionadaNome.textContent =
                        oportunidade.nomeCondominio ||
                        id;
                }

                if (
                    oportunidadeSelecionadaDetalhes
                ) {
                    oportunidadeSelecionadaDetalhes.textContent =
                        [
                            oportunidade.bairro ||
                                "",
                            oportunidade.filial ||
                                obterSessao()?.filialNome ||
                                "5004 - RJ",
                            id
                        ]
                            .filter(Boolean)
                            .join(" • ");
                }

                if (
                    oportunidadeSelecionada
                ) {
                    oportunidadeSelecionada.hidden =
                        false;
                }


            } catch (erro) {

                console.error(
                    "Erro ao buscar oportunidade:",
                    erro
                );


                alert(
                    "Não foi possível buscar os dados da oportunidade.\n\n" +
                    "Verifique se a nova versão do Apps Script foi implantada."
                );


            } finally {

                this.disabled =
                    false;


                this.value =
                    valorOriginal;

            }

        }
    );

}

const idOportunidadeGerado =
    document.getElementById("idOportunidadeGerado");

const statusComercial =
    document.getElementById("statusComercial");

const campoMotivoPerda =
    document.getElementById("campoMotivoPerda");

const motivoPerda =
    document.getElementById("motivoPerda");

const campoDestinoDeclinio =
    document.getElementById("campoDestinoDeclinio");

const radiosDestinoDeclinio =
    document.querySelectorAll(
        'input[name="destinoDeclinio"]'
    );

const campoPrevisaoFechamento =
    document.getElementById("campoPrevisaoFechamento");

const previsaoFechamento =
    document.getElementById("previsaoFechamento");

const obsMotivo =
    document.getElementById("obsMotivo");

const bairro =
    document.getElementById("bairro");

const cidade =
    document.getElementById("cidade");

const uf =
    document.getElementById("uf");

const regiao =
    document.getElementById("regiao");


/* =========================================================
   EQUIPAMENTOS DINÂMICOS
========================================================= */

const listaEquipamentos =
    document.getElementById("listaEquipamentos");

const btnAdicionarEquipamento =
    document.getElementById("btnAdicionarEquipamento");

const totalEquipamentosResumo =
    document.getElementById("totalEquipamentosResumo");

const totalParadasResumo =
    document.getElementById("totalParadasResumo");

const TIPOS_EQUIPAMENTO = [
    "Elevador",
    "Escada Rolante",
    "Home Lift",
    "Plataforma de acessibilidade",
    "Uso Restrito",
    "Monta Carga",
    "Elevador de Carga",
    "Portas Automáticas",
    "Cadeira Elevante",
    "Cadeira de Piscina"
];

const MARCAS_EQUIPAMENTO = [
    "Thyssenkrupp",
    "Atlas",
    "Otis",
    "Ortobras",
    "Outros"
];


/* =========================================================
   EQUIPAMENTOS - CARDS DINÂMICOS
========================================================= */

function criarOpcoesSelect(lista, selecionado) {

    return lista
        .map(
            item =>
                `<option value="${item}" ${item === selecionado ? "selected" : ""}>${item}</option>`
        )
        .join("");

}


function criarCardEquipamento(dados = {}) {

    const card =
        document.createElement("div");

    card.className =
        "equipamento-card";

    const tipo =
        String(dados.tipo || "");

    const marca =
        String(dados.marca || "");

    const quantidade =
        Number(dados.quantidade || 1);

    const paradasPorEquipamento =
        Number(
            dados.paradasPorEquipamento ??
            dados.quantidadeParadas ??
            0
        );

    card.innerHTML = `
        <div class="equipamento-card-cabecalho">
            <div class="equipamento-card-titulo">
                <span class="equipamento-numero">1</span>
                <strong>Tipo de equipamento</strong>
            </div>

            <button
                type="button"
                class="btn-remover-equipamento"
                aria-label="Remover este equipamento"
            >
                Remover
            </button>
        </div>

        <div class="equipamento-grid">
            <div class="campo">
                <label>
                    Tipo de Equipamento
                    <span>*</span>
                </label>

                <select class="equipamento-tipo">
                    <option value="" ${!tipo ? "selected" : ""} disabled>
                        Selecione o tipo
                    </option>
                    ${criarOpcoesSelect(TIPOS_EQUIPAMENTO, tipo)}
                </select>
            </div>

            <div class="campo">
                <label>
                    Marca
                    <span>*</span>
                </label>

                <select class="equipamento-marca">
                    <option value="" ${!marca ? "selected" : ""} disabled>
                        Selecione a marca
                    </option>
                    ${criarOpcoesSelect(MARCAS_EQUIPAMENTO, marca)}
                </select>
            </div>

            <div class="campo">
                <label>
                    Quantidade deste tipo
                    <span>*</span>
                </label>

                <input
                    type="number"
                    class="equipamento-quantidade"
                    min="1"
                    step="1"
                    value="${quantidade > 0 ? quantidade : 1}"
                    placeholder="Ex.: 2"
                />
            </div>

            <div class="campo">
                <label>
                    Paradas por equipamento
                    <span>*</span>
                </label>

                <input
                    type="number"
                    class="equipamento-paradas-unitarias"
                    min="0"
                    step="1"
                    value="${paradasPorEquipamento >= 0 ? paradasPorEquipamento : 0}"
                    placeholder="Ex.: 10"
                />

                <small class="ajuda-equipamento">
                    Use 0 quando não se aplicar ao tipo de equipamento.
                </small>
            </div>

            <div class="campo campo-total-paradas">
                <label>Total de paradas deste item</label>

                <input
                    type="number"
                    class="equipamento-total-paradas"
                    value="0"
                    readonly
                    tabindex="-1"
                />
            </div>
        </div>
    `;

    return card;

}


function renumerarEquipamentos() {

    if (!listaEquipamentos) {
        return;
    }

    const cards =
        listaEquipamentos.querySelectorAll(
            ".equipamento-card"
        );

    cards.forEach(
        (card, indice) => {

            const numero =
                card.querySelector(
                    ".equipamento-numero"
                );

            const titulo =
                card.querySelector(
                    ".equipamento-card-titulo strong"
                );

            const remover =
                card.querySelector(
                    ".btn-remover-equipamento"
                );

            if (numero) {
                numero.textContent =
                    String(indice + 1)
                        .padStart(2, "0");
            }

            if (titulo) {
                titulo.textContent =
                    `Equipamento ${indice + 1}`;
            }

            if (remover) {
                remover.hidden =
                    cards.length === 1;
            }

        }
    );

}


function atualizarResumoEquipamentos() {

    if (!listaEquipamentos) {
        return;
    }

    let totalEquipamentos = 0;
    let totalParadas = 0;

    listaEquipamentos
        .querySelectorAll(
            ".equipamento-card"
        )
        .forEach(
            card => {

                const quantidade =
                    Number(
                        card.querySelector(
                            ".equipamento-quantidade"
                        )?.value || 0
                    );

                const paradasUnitarias =
                    Number(
                        card.querySelector(
                            ".equipamento-paradas-unitarias"
                        )?.value || 0
                    );

                const totalItem =
                    Math.max(quantidade, 0) *
                    Math.max(paradasUnitarias, 0);

                const campoTotal =
                    card.querySelector(
                        ".equipamento-total-paradas"
                    );

                if (campoTotal) {
                    campoTotal.value =
                        String(totalItem);
                }

                totalEquipamentos +=
                    Math.max(quantidade, 0);

                totalParadas +=
                    totalItem;

            }
        );

    if (totalEquipamentosResumo) {
        totalEquipamentosResumo.textContent =
            String(totalEquipamentos);
    }

    if (totalParadasResumo) {
        totalParadasResumo.textContent =
            String(totalParadas);
    }

}


function adicionarEquipamento(dados = {}) {

    if (!listaEquipamentos) {
        return;
    }

    const card =
        criarCardEquipamento(dados);

    listaEquipamentos.appendChild(card);

    renumerarEquipamentos();
    atualizarResumoEquipamentos();

}


function resetarEquipamentos() {

    if (!listaEquipamentos) {
        return;
    }

    listaEquipamentos.innerHTML = "";

    adicionarEquipamento();

}


function obterEquipamentos() {

    if (!listaEquipamentos) {
        return [];
    }

    return Array
        .from(
            listaEquipamentos.querySelectorAll(
                ".equipamento-card"
            )
        )
        .map(
            card => {

                const tipo =
                    card.querySelector(
                        ".equipamento-tipo"
                    )?.value || "";

                const marca =
                    card.querySelector(
                        ".equipamento-marca"
                    )?.value || "";

                const quantidade =
                    Number(
                        card.querySelector(
                            ".equipamento-quantidade"
                        )?.value || 0
                    );

                const paradasPorEquipamento =
                    Number(
                        card.querySelector(
                            ".equipamento-paradas-unitarias"
                        )?.value || 0
                    );

                return {
                    tipo,
                    marca,
                    quantidade,
                    paradasPorEquipamento,
                    totalParadas:
                        quantidade *
                        paradasPorEquipamento
                };

            }
        );

}


function validarEquipamentos() {

    if (!listaEquipamentos) {
        return false;
    }

    const cards =
        Array.from(
            listaEquipamentos.querySelectorAll(
                ".equipamento-card"
            )
        );

    if (!cards.length) {
        return false;
    }

    let valido = true;

    cards.forEach(
        card => {

            const tipo =
                card.querySelector(
                    ".equipamento-tipo"
                );

            const marca =
                card.querySelector(
                    ".equipamento-marca"
                );

            const quantidade =
                card.querySelector(
                    ".equipamento-quantidade"
                );

            const paradas =
                card.querySelector(
                    ".equipamento-paradas-unitarias"
                );

            if (!tipo?.value) {
                mostrarErro(
                    tipo,
                    "Selecione o tipo de equipamento."
                );
                valido = false;
            }

            if (!marca?.value) {
                mostrarErro(
                    marca,
                    "Selecione a marca."
                );
                valido = false;
            }

            if (
                !quantidade?.value ||
                Number(quantidade.value) < 1
            ) {
                mostrarErro(
                    quantidade,
                    "Informe uma quantidade maior que zero."
                );
                valido = false;
            }

            if (
                paradas?.value === "" ||
                Number(paradas.value) < 0
            ) {
                mostrarErro(
                    paradas,
                    "Informe as paradas por equipamento. Use 0 se não se aplicar."
                );
                valido = false;
            }

        }
    );

    return valido;

}


function carregarEquipamentosOportunidade(oportunidade) {

    if (!listaEquipamentos) {
        return;
    }

    listaEquipamentos.innerHTML = "";

    if (
        Array.isArray(oportunidade.equipamentos) &&
        oportunidade.equipamentos.length
    ) {

        oportunidade.equipamentos.forEach(
            equipamento =>
                adicionarEquipamento(equipamento)
        );

        return;
    }

    /*
       Compatibilidade com registros antigos,
       que possuíam apenas um tipo/marca por visita.
    */
    adicionarEquipamento({
        tipo:
            oportunidade.tipoEquipamento || "",
        marca:
            oportunidade.marca || "",
        quantidade:
            oportunidade.quantidadeEquipamentos || 1,
        paradasPorEquipamento:
            oportunidade.quantidadeEquipamentos
                ? Math.round(
                    Number(
                        oportunidade.quantidadeParadas || 0
                    ) /
                    Math.max(
                        Number(
                            oportunidade.quantidadeEquipamentos || 1
                        ),
                        1
                    )
                )
                : Number(
                    oportunidade.quantidadeParadas || 0
                )
    });

}


if (btnAdicionarEquipamento) {

    btnAdicionarEquipamento.addEventListener(
        "click",
        function () {

            adicionarEquipamento();

            const ultimoCard =
                listaEquipamentos
                    ?.lastElementChild;

            ultimoCard
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

        }
    );

}


if (listaEquipamentos) {

    listaEquipamentos.addEventListener(
        "input",
        atualizarResumoEquipamentos
    );

    listaEquipamentos.addEventListener(
        "change",
        atualizarResumoEquipamentos
    );

    listaEquipamentos.addEventListener(
        "click",
        function (event) {

            const botao =
                event.target.closest(
                    ".btn-remover-equipamento"
                );

            if (!botao) {
                return;
            }

            const cards =
                listaEquipamentos.querySelectorAll(
                    ".equipamento-card"
                );

            if (cards.length <= 1) {
                return;
            }

            botao
                .closest(
                    ".equipamento-card"
                )
                ?.remove();

            renumerarEquipamentos();
            atualizarResumoEquipamentos();

        }
    );

}


resetarEquipamentos();


/* =========================================================
   ÚLTIMO REGISTRO
========================================================= */

let ultimoRegistro = null;


/* =========================================================
   GOOGLE SHEETS
========================================================= */

const URL_GOOGLE_SHEETS =
    "https://script.google.com/macros/s/AKfycbzuILbvHjE_eZGbU-uMKm5xrg5Dgj0Fe2AMruSqeJ8-zSi1CfGss25yirURW8i1gu7FMg/exec";


/* =========================================================
   ACESSO / SESSÃO
   IMPORTANTE:
   O Apps Script precisa validar estes tokens no servidor.
========================================================= */

const CHAVE_SESSAO =
    "rjcap_sessao";

const telaAcesso =
    document.getElementById("telaAcesso");

const formAcesso =
    document.getElementById("formAcesso");

const filialAcesso =
    document.getElementById("filialAcesso");

const perfilAcesso =
    document.getElementById("perfilAcesso");

const vendedorAcesso =
    document.getElementById("vendedorAcesso");

const codigoAcesso =
    document.getElementById("codigoAcesso");

const erroAcesso =
    document.getElementById("erroAcesso");

const btnEntrar =
    document.getElementById("btnEntrar");

const btnSair =
    document.getElementById("btnSair");

const vendedorFormulario =
    document.getElementById("vendedor");


const perfilResponsavel =
    document.getElementById("perfilResponsavel");

const opcaoRegistroRetencao =
    document.getElementById("opcaoRegistroRetencao");

const avisoRetencao =
    document.getElementById("avisoRetencao");

const resumoErrosFormulario =
    document.getElementById("resumoErrosFormulario");

const listaErrosFormulario =
    document.getElementById("listaErrosFormulario");

const USUARIOS_RJCAP = {
    "5004": {
        nome: "5004 - RJ",

        vendedores: [
            "Pedro Pereira Filho",
            "Reinaldo Silva Soares Dias"
        ],

        consultores: [
            "Dayanna da Silva Pinto",
            "Erickson de Carvalho Souto Maior",
            "Luanda de Souza Santos",
            "Mariana da Silva dos Santos",
            "Pedro Ivo Valente do Carmo Gomes",
            "Renata Alves Narciso da Silva",
            "Renata Costa Hygino de Miranda",
            "Renata Martins Martellote de Castilho",
            "Thiago Ribeiro Fernandes"
        ]
    }
};

function obterPerfilPorNome(nome) {

    const filial =
        USUARIOS_RJCAP["5004"];

    if (
        filial.vendedores.includes(nome)
    ) {
        return "vendedor";
    }

    if (
        filial.consultores.includes(nome)
    ) {
        return "consultor";
    }

    return "";
}


function atualizarNomesLogin() {

    if (
        !vendedorAcesso ||
        !perfilAcesso ||
        !filialAcesso
    ) {
        return;
    }

    const filial =
        USUARIOS_RJCAP[
            filialAcesso.value
        ];

    const perfil =
        perfilAcesso.value;

    vendedorAcesso.innerHTML = "";

    const placeholder =
        document.createElement("option");

    placeholder.value = "";
    placeholder.disabled = true;
    placeholder.selected = true;

    if (!filial) {
        placeholder.textContent =
            "Filial não configurada";

        vendedorAcesso.appendChild(
            placeholder
        );

        vendedorAcesso.disabled = true;
        return;
    }

    if (!perfil) {
        placeholder.textContent =
            "Selecione primeiro o perfil";

        vendedorAcesso.appendChild(
            placeholder
        );

        vendedorAcesso.disabled = true;
        return;
    }

    placeholder.textContent =
        "Selecione seu nome";

    vendedorAcesso.appendChild(
        placeholder
    );

    const lista =
        perfil === "vendedor"
            ? filial.vendedores
            : filial.consultores;

    lista
        .slice()
        .sort(
            (a, b) =>
                a.localeCompare(
                    b,
                    "pt-BR"
                )
        )
        .forEach(nome => {

            const opcao =
                document.createElement(
                    "option"
                );

            opcao.value = nome;
            opcao.textContent = nome;

            vendedorAcesso.appendChild(
                opcao
            );

        });

    vendedorAcesso.disabled = false;
}


if (perfilAcesso) {
    perfilAcesso.addEventListener(
        "change",
        atualizarNomesLogin
    );
}

if (filialAcesso) {
    filialAcesso.addEventListener(
        "change",
        atualizarNomesLogin
    );
}

atualizarNomesLogin();

function ehConsultorAutenticado() {
    const sessao = obterSessao();
    return Boolean(sessao && sessao.perfil === "consultor");
}

function aplicarPerfilNaTela() {

    const sessao =
        obterSessao();

    /*
       O perfil exibido é sempre recalculado pelo nome.
       Isso evita sessão antiga mostrar "Vendedor" para um Consultor.
    */
    const perfilPorNome =
        sessao?.vendedor
            ? obterPerfilPorNome(
                sessao.vendedor
            )
            : "";

    const perfil =
        perfilPorNome ||
        sessao?.perfil ||
        "";

    if (
        sessao &&
        perfilPorNome &&
        sessao.perfil !== perfilPorNome
    ) {
        sessao.perfil =
            perfilPorNome;

        salvarSessao(
            sessao
        );
    }

    const consultor =
        perfil === "consultor";

    if (
        perfilResponsavel &&
        sessao?.vendedor
    ) {

        const nomePerfil =
            consultor
                ? "Consultor"
                : "Vendedor";

        const filialTexto =
            sessao.filialNome ||
            (
                sessao.filial === "5004"
                    ? "5004 - RJ"
                    : sessao.filial || ""
            );

        perfilResponsavel.textContent =
            [
                filialTexto,
                `Perfil: ${nomePerfil}`
            ]
                .filter(Boolean)
                .join(" • ");
    }
}


function obterSessao() {

    try {

        const valor =
            sessionStorage.getItem(
                CHAVE_SESSAO
            );

        return valor
            ? JSON.parse(valor)
            : null;

    } catch (erro) {

        return null;

    }

}


function salvarSessao(sessao) {

    sessionStorage.setItem(
        CHAVE_SESSAO,
        JSON.stringify(sessao)
    );

}


function limparSessao() {

    sessionStorage.removeItem(
        CHAVE_SESSAO
    );

}


function aplicarSessaoNaTela() {

    const sessao =
        obterSessao();

    const autenticado =
        Boolean(
            sessao &&
            sessao.token &&
            sessao.vendedor
        );

    if (telaAcesso) {

        telaAcesso.hidden =
            autenticado;

        telaAcesso.setAttribute(
            "aria-hidden",
            autenticado
                ? "true"
                : "false"
        );

    }

    document.body.classList.toggle(
        "acesso-bloqueado",
        !autenticado
    );

    if (btnSair) {

        btnSair.hidden =
            !autenticado;

    }

    if (
        vendedorFormulario &&
        autenticado
    ) {

        vendedorFormulario.value =
            sessao.vendedor;

        vendedorFormulario.disabled =
            true;

        vendedorFormulario
            .classList
            .add(
                "vendedor-bloqueado"
            );

    } else if (
        vendedorFormulario
    ) {

        vendedorFormulario.disabled =
            false;

        vendedorFormulario
            .classList
            .remove(
                "vendedor-bloqueado"
            );

    }

    aplicarPerfilNaTela();

}


async function autenticarVendedor(
    filial,
    perfil,
    vendedor,
    codigo
) {

    const url =
        `${URL_GOOGLE_SHEETS}` +
        `?acao=autenticar` +
        `&filial=${encodeURIComponent(filial)}` +
        `&perfil=${encodeURIComponent(perfil)}` +
        `&consultor=${encodeURIComponent(vendedor)}` +
        `&codigo=${encodeURIComponent(codigo)}`;

    const resposta =
        await fetch(
            url,
            {
                method: "GET",
                cache: "no-store"
            }
        );

    if (!resposta.ok) {
        throw new Error(
            "Não foi possível validar o acesso."
        );
    }

    const dados =
        await resposta.json();

    if (
        !dados.sucesso ||
        !dados.autenticado ||
        !dados.token
    ) {
        return null;
    }

    const nomeAutenticado =
        String(
            dados.consultor ||
            vendedor
        );

    const perfilAutenticado =
        String(
            obterPerfilPorNome(
                nomeAutenticado
            ) ||
            perfil ||
            dados.perfil ||
            ""
        ).toLowerCase();

    return {
        token:
            String(dados.token),

        vendedor:
            nomeAutenticado,

        perfil:
            perfilAutenticado,

        filial:
            String(
                dados.filial ||
                filial
            ),

        filialNome:
            String(
                dados.filialNome ||
                (
                    filial === "5004"
                        ? "5004 - RJ"
                        : filial
                )
            ),

        expiraEm:
            dados.expiraEm ||
            ""
    };
}


if (formAcesso) {

    formAcesso.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            if (erroAcesso) {
                erroAcesso.hidden = true;
                erroAcesso.textContent = "";
            }

            const filial =
                filialAcesso?.value ||
                "";

            const perfil =
                perfilAcesso?.value ||
                "";

            const vendedor =
                vendedorAcesso?.value ||
                "";

            const codigo =
                codigoAcesso?.value.trim() ||
                "";

            if (
                !filial ||
                !perfil ||
                !vendedor ||
                !codigo
            ) {

                if (erroAcesso) {
                    erroAcesso.textContent =
                        "Informe filial, perfil, nome e código de acesso.";
                    erroAcesso.hidden = false;
                }

                return;

            }

            if (btnEntrar) {
                btnEntrar.disabled = true;
            }

            try {

                const sessao =
                    await autenticarVendedor(
                        filial,
                        perfil,
                        vendedor,
                        codigo
                    );

                if (!sessao) {

                    if (erroAcesso) {
                        erroAcesso.textContent =
                            "Responsável ou código de acesso inválido.";
                        erroAcesso.hidden = false;
                    }

                    return;

                }

                salvarSessao(
                    sessao
                );

                if (codigoAcesso) {
                    codigoAcesso.value = "";
                }

                aplicarSessaoNaTela();

            } catch (erro) {

                console.error(
                    "Erro de autenticação:",
                    erro
                );

                if (erroAcesso) {
                    erroAcesso.textContent =
                        "Não foi possível validar o acesso agora.";
                    erroAcesso.hidden = false;
                }

            } finally {

                if (btnEntrar) {
                    btnEntrar.disabled = false;
                }

            }

        }
    );

}


if (btnSair) {

    btnSair.addEventListener(
        "click",
        function () {

            limparSessao();
            aplicarSessaoNaTela();

            if (perfilAcesso) {
                perfilAcesso.selectedIndex = 0;
            }

            if (filialAcesso) {
                filialAcesso.value = "5004";
            }

            atualizarNomesLogin();

        }
    );

}


aplicarSessaoNaTela();


/* =========================================================
   BUSCA DE OPORTUNIDADE POR CONDOMÍNIO
========================================================= */

const modosBuscaOportunidade =
    document.querySelectorAll(
        'input[name="modoBuscaOportunidade"]'
    );

const buscaPorCondominio =
    document.getElementById(
        "buscaPorCondominio"
    );

const buscaPorId =
    document.getElementById(
        "buscaPorId"
    );

const buscaCondominio =
    document.getElementById(
        "buscaCondominio"
    );

const resultadosCondominio =
    document.getElementById(
        "resultadosCondominio"
    );

const buscaCondominioCarregando =
    document.getElementById(
        "buscaCondominioCarregando"
    );

const oportunidadeSelecionada =
    document.getElementById(
        "oportunidadeSelecionada"
    );

const oportunidadeSelecionadaNome =
    document.getElementById(
        "oportunidadeSelecionadaNome"
    );

const oportunidadeSelecionadaDetalhes =
    document.getElementById(
        "oportunidadeSelecionadaDetalhes"
    );

const btnTrocarOportunidade =
    document.getElementById(
        "btnTrocarOportunidade"
    );

let temporizadorBuscaCondominio =
    null;


function obterTokenSessao() {

    return obterSessao()?.token ||
        "";

}


function atualizarModoBuscaOportunidade() {

    const modo =
        document.querySelector(
            'input[name="modoBuscaOportunidade"]:checked'
        )?.value ||
        "condominio";

    if (buscaPorCondominio) {
        buscaPorCondominio.hidden =
            modo !== "condominio";
    }

    if (buscaPorId) {
        buscaPorId.hidden =
            modo !== "id";
    }

}


modosBuscaOportunidade
    .forEach(
        radio => {

            radio.addEventListener(
                "change",
                atualizarModoBuscaOportunidade
            );

        }
    );


atualizarModoBuscaOportunidade();


async function pesquisarCondominios(
    termo
) {

    const sessao =
        obterSessao();

    if (
        !sessao ||
        !sessao.token
    ) {

        throw new Error(
            "SESSAO_INVALIDA"
        );

    }

    const url =
        `${URL_GOOGLE_SHEETS}` +
        `?acao=buscarCondominios` +
        `&termo=${encodeURIComponent(termo)}` +
        `&consultor=${encodeURIComponent(sessao.vendedor)}` +
        `&token=${encodeURIComponent(sessao.token)}`;

    const resposta =
        await fetch(
            url,
            {
                method: "GET",
                cache: "no-store"
            }
        );

    if (!resposta.ok) {

        throw new Error(
            "Falha na pesquisa."
        );

    }

    const dados =
        await resposta.json();

    if (
        !dados.sucesso
    ) {

        if (
            dados.erro ===
            "SESSAO_INVALIDA"
        ) {

            throw new Error(
                "SESSAO_INVALIDA"
            );

        }

        return [];

    }

    return Array.isArray(
        dados.resultados
    )
        ? dados.resultados
        : [];

}


function mostrarResultadosCondominio(
    resultados
) {

    if (!resultadosCondominio) {
        return;
    }

    resultadosCondominio.innerHTML =
        "";

    if (!resultados.length) {

        resultadosCondominio.innerHTML =
            '<div class="resultados-vazio">Nenhuma oportunidade encontrada.</div>';

        resultadosCondominio.hidden =
            false;

        return;

    }

    resultados
        .slice(
            0,
            8
        )
        .forEach(
            item => {

                const botao =
                    document.createElement(
                        "button"
                    );

                botao.type =
                    "button";

                botao.className =
                    "resultado-condominio";

                botao.dataset.idOportunidade =
                    item.idOportunidade ||
                    "";

                const nome =
                    document.createElement(
                        "strong"
                    );

                nome.textContent =
                    item.nomeCondominio ||
                    "Condomínio";

                const detalhes =
                    document.createElement(
                        "span"
                    );

                detalhes.textContent =
                    [
                        item.bairro ||
                            "",
                        item.filial ||
                            obterSessao()?.filialNome ||
                            "5004 - RJ",
                        item.statusComercial ||
                            ""
                    ]
                        .filter(Boolean)
                        .join(" • ");

                botao.append(
                    nome,
                    detalhes
                );

                resultadosCondominio
                    .appendChild(
                        botao
                    );

            }
        );

    resultadosCondominio.hidden =
        false;

}


if (buscaCondominio) {

    buscaCondominio.addEventListener(
        "input",
        function () {

            const termo =
                this.value.trim();

            clearTimeout(
                temporizadorBuscaCondominio
            );

            if (
                resultadosCondominio
            ) {
                resultadosCondominio.hidden =
                    true;
                resultadosCondominio.innerHTML =
                    "";
            }

            if (
                termo.length < 3
            ) {

                if (
                    buscaCondominioCarregando
                ) {
                    buscaCondominioCarregando.hidden =
                        true;
                }

                return;

            }

            temporizadorBuscaCondominio =
                setTimeout(
                    async () => {

                        if (
                            buscaCondominioCarregando
                        ) {
                            buscaCondominioCarregando.hidden =
                                false;
                        }

                        try {

                            const resultados =
                                await pesquisarCondominios(
                                    termo
                                );

                            mostrarResultadosCondominio(
                                resultados
                            );

                        } catch (erro) {

                            if (
                                erro.message ===
                                "SESSAO_INVALIDA"
                            ) {

                                limparSessao();
                                aplicarSessaoNaTela();

                            }

                            if (
                                resultadosCondominio
                            ) {
                                resultadosCondominio.innerHTML =
                                    '<div class="resultados-vazio">Não foi possível realizar a busca.</div>';
                                resultadosCondominio.hidden =
                                    false;
                            }

                        } finally {

                            if (
                                buscaCondominioCarregando
                            ) {
                                buscaCondominioCarregando.hidden =
                                    true;
                            }

                        }

                    },
                    450
                );

        }
    );

}


if (resultadosCondominio) {

    resultadosCondominio.addEventListener(
        "click",
        async function (event) {

            const botao =
                event.target.closest(
                    ".resultado-condominio"
                );

            if (!botao) {
                return;
            }

            const id =
                botao.dataset
                    .idOportunidade ||
                "";

            if (!id) {
                return;
            }

            try {

                const oportunidade =
                    await buscarOportunidadeExistente(
                        id
                    );

                if (!oportunidade) {
                    alert(
                        "Não foi possível carregar essa oportunidade."
                    );
                    return;
                }

                if (
                    idOportunidadeExistente
                ) {
                    idOportunidadeExistente.value =
                        id;
                }

                preencherDadosOportunidade(
                    oportunidade
                );

                if (
                    oportunidadeSelecionadaNome
                ) {
                    oportunidadeSelecionadaNome.textContent =
                        oportunidade.nomeCondominio ||
                        id;
                }

                if (
                    oportunidadeSelecionadaDetalhes
                ) {
                    oportunidadeSelecionadaDetalhes.textContent =
                        [
                            oportunidade.bairro ||
                                "",
                            oportunidade.filial ||
                                obterSessao()?.filialNome ||
                                "5004 - RJ",
                            id
                        ]
                            .filter(Boolean)
                            .join(" • ");
                }

                if (
                    oportunidadeSelecionada
                ) {
                    oportunidadeSelecionada.hidden =
                        false;
                }

                resultadosCondominio.hidden =
                    true;

            } catch (erro) {

                console.error(
                    "Erro ao carregar oportunidade:",
                    erro
                );

                alert(
                    "Não foi possível carregar a oportunidade."
                );

            }

        }
    );

}


if (btnTrocarOportunidade) {

    btnTrocarOportunidade.addEventListener(
        "click",
        function () {

            if (
                oportunidadeSelecionada
            ) {
                oportunidadeSelecionada.hidden =
                    true;
            }

            if (
                idOportunidadeExistente
            ) {
                idOportunidadeExistente.value =
                    "";
            }

            if (
                buscaCondominio
            ) {
                buscaCondominio.value =
                    "";
                buscaCondominio.focus();
            }

        }
    );

}


/* =========================================================
   BUSCAR OPORTUNIDADE EXISTENTE
========================================================= */

async function buscarOportunidadeExistente(
    idOportunidade
) {

    const id =
        String(
            idOportunidade || ""
        ).trim();


    if (!id) {

        return null;

    }


    const sessao =
        obterSessao();

    if (
        !sessao ||
        !sessao.token
    ) {

        throw new Error(
            "SESSAO_INVALIDA"
        );

    }

    const url =
        `${URL_GOOGLE_SHEETS}` +
        `?acao=buscarOportunidade` +
        `&idOportunidade=${encodeURIComponent(id)}` +
        `&consultor=${encodeURIComponent(sessao.vendedor)}` +
        `&token=${encodeURIComponent(sessao.token)}`;


    const resposta =
        await fetch(
            url,
            {
                method: "GET",
                cache: "no-store"
            }
        );


    if (!resposta.ok) {

        throw new Error(
            "Não foi possível consultar a oportunidade."
        );

    }


    const dados =
        await resposta.json();


    if (
        !dados.sucesso ||
        !dados.encontrado ||
        !dados.oportunidade
    ) {

        return null;

    }


    return dados.oportunidade;

}

/* =========================================================
   MARCAR RADIO AUTOMATICAMENTE
========================================================= */

function selecionarRadio(
    nome,
    valor
) {

    if (!valor) {

        return;

    }


    const radios =
        document.querySelectorAll(
            `input[name="${nome}"]`
        );


    radios.forEach(
        radio => {

            radio.checked =
                radio.value ===
                String(valor);

        }
    );

}


/* =========================================================
   PREENCHER CAMPO
========================================================= */

function preencherCampo(
    id,
    valor
) {

    const campo =
        document.getElementById(
            id
        );


    if (!campo) {

        return;

    }


    campo.value =
        valor === undefined ||
        valor === null
            ? ""
            : valor;


    campo.dispatchEvent(
        new Event(
            "change",
            {
                bubbles: true
            }
        )
    );

}

/* =========================================================
   PREENCHER DADOS DA OPORTUNIDADE
========================================================= */

function preencherDadosOportunidade(
    oportunidade
) {

    if (!oportunidade) {

        return;

    }


    /* VENDEDOR */

    preencherCampo(
        "vendedor",
        oportunidade.consultor
    );


    /* MODALIDADE */

    selecionarRadio(
        "modalidade",
        oportunidade.modalidade
    );


    /* TIPO RESIDENCIAL / COMERCIAL */

    selecionarRadio(
        "tipoCliente",
        oportunidade.tipoCliente
    );


    /* EQUIPAMENTOS */

    carregarEquipamentosOportunidade(
        oportunidade
    );


    /* CONSERVADORA */

    preencherCampo(
        "empresaConservadora",
        oportunidade.empresaConservadora
    );


    atualizarCampoOutraConservadora();


    /* CONDOMÍNIO */

    preencherCampo(
        "nomeCondominio",
        oportunidade.nomeCondominio
    );


    preencherCampo(
        "endereco",
        oportunidade.endereco
    );


    preencherCampo(
        "bairro",
        oportunidade.bairro
    );


    preencherCampo(
        "cidade",
        oportunidade.cidade ||
        "Rio de Janeiro"
    );


    preencherCampo(
        "uf",
        oportunidade.uf ||
        "RJ"
    );


    preencherCampo(
        "regiao",
        oportunidade.regiao
    );


    /* CONTATO */

    preencherCampo(
        "nomeContato",
        oportunidade.nomeContato
    );


    preencherCampo(
        "telefone",
        oportunidade.telefone
    );


    preencherCampo(
        "email",
        oportunidade.email
    );


    /* DADOS DA PROPOSTA */

    const possuiProposta =
        oportunidade.numeroProposta &&
        oportunidade.numeroProposta !==
            "Sem Proposta";


    selecionarRadio(
        "temProposta",
        possuiProposta
            ? "Sim"
            : "Não"
    );


    atualizarCamposProposta();


    if (possuiProposta) {

        preencherCampo(
            "numeroProposta",
            oportunidade.numeroProposta
        );


        preencherCampo(
            "tipoContrato",
            oportunidade.tipoContrato
        );


        if (
            oportunidade.valorContrato !==
            ""
        ) {

            const valor =
                Number(
                    oportunidade.valorContrato
                );


            if (
                !isNaN(valor)
            ) {

                preencherCampo(
                    "valorContrato",
                    valor.toLocaleString(
                        "pt-BR",
                        {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }
                    )
                );

            }

        }


        preencherCampo(
            "margemVenda",
            oportunidade.margemVenda
        );

    }


    /* STATUS ATUAL */

    preencherCampo(
        "statusComercial",
        oportunidade.statusComercial
    );


    atualizarStatusComercial();


    /* PREVISÃO */

    if (
        oportunidade.previsaoFechamento
    ) {

        preencherCampo(
            "previsaoFechamento",
            oportunidade.previsaoFechamento
        );

    }


    /* REGIÃO */

    atualizarRegiaoPorBairro();


    console.log(
        "Oportunidade carregada:",
        oportunidade
    );

}

async function enviarParaGoogleSheets(registro) {

    if (!navigator.onLine) {
        throw new Error("SEM_INTERNET");
    }


    const sessao =
        obterSessao();


    const payload = {
        ...registro,

        tokenSessao:
            obterTokenSessao(),

        consultorAutenticado:
            sessao?.vendedor ||
            ""
    };


    const corpo =
        JSON.stringify(
            payload
        );


    /*
       ENVIO RÁPIDO

       O modal não precisa esperar o Apps Script terminar
       toda a gravação na planilha.

       Primeiro tentamos sendBeacon, que entrega o POST em
       segundo plano e libera a interface imediatamente.
    */
    let disparado =
        false;


    if (
        typeof navigator.sendBeacon ===
        "function"
    ) {

        try {

            const blob =
                new Blob(
                    [corpo],
                    {
                        type:
                            "text/plain;charset=utf-8"
                    }
                );


            disparado =
                navigator.sendBeacon(
                    URL_GOOGLE_SHEETS,
                    blob
                );

        } catch (erroBeacon) {

            console.warn(
                "sendBeacon indisponível. Usando fetch.",
                erroBeacon
            );

        }

    }


    /*
       Fallback:
       se o navegador não aceitar sendBeacon,
       inicia o fetch SEM bloquear o modal.
    */
    if (!disparado) {

        try {

            fetch(
                URL_GOOGLE_SHEETS,
                {
                    method: "POST",

                    mode: "no-cors",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body:
                        corpo,

                    keepalive:
                        true
                }
            )
            .catch(
                erro => {

                    console.error(
                        "Falha posterior no envio:",
                        erro
                    );

                }
            );


            disparado =
                true;

        } catch (erroFetch) {

            throw erroFetch;

        }

    }


    if (!disparado) {
        throw new Error(
            "ENVIO_NAO_INICIADO"
        );
    }


    /*
       CONFIRMAÇÃO EM SEGUNDO PLANO

       Não bloqueia o usuário.
       O modal abre imediatamente enquanto o Google
       conclui a gravação.
    */
    const urlConfirmacao =
        `${URL_GOOGLE_SHEETS}` +
        `?acao=confirmarRegistro` +
        `&idRegistro=${encodeURIComponent(registro.idRegistro || "")}` +
        `&consultor=${encodeURIComponent(sessao?.vendedor || "")}` +
        `&token=${encodeURIComponent(obterTokenSessao() || "")}`;


    (async function confirmarEmSegundoPlano() {

        try {

            for (
                let tentativa = 1;
                tentativa <= 5;
                tentativa++
            ) {

                await new Promise(
                    resolve =>
                        setTimeout(
                            resolve,
                            tentativa === 1
                                ? 1200
                                : 1800
                        )
                );


                const resposta =
                    await fetch(
                        urlConfirmacao,
                        {
                            method:
                                "GET",

                            cache:
                                "no-store"
                        }
                    );


                if (!resposta.ok) {
                    continue;
                }


                const dados =
                    await resposta.json();


                if (
                    dados.sucesso &&
                    dados.confirmado
                ) {

                    console.log(
                        "Registro confirmado na planilha:",
                        registro.idRegistro
                    );

                    return;

                }

            }


            console.warn(
                "O envio foi disparado, mas a confirmação não foi lida a tempo:",
                registro.idRegistro
            );

        } catch (erroConfirmacao) {

            console.warn(
                "Não foi possível consultar a confirmação em segundo plano:",
                erroConfirmacao
            );

        }

    })();


    /*
       Retorna AGORA.
       Isso faz o modal aparecer praticamente na hora.
    */
    return {
        enviado:
            true,

        idRegistro:
            registro.idRegistro ||
            ""
    };

}


/* =========================================================
   SEGURANÇA LOCAL DOS REGISTROS
========================================================= */

const CHAVE_PENDENTES =
    "rjcap_registros_pendentes";


function obterPendentes() {

    try {

        const dados =
            localStorage.getItem(
                CHAVE_PENDENTES
            );

        return dados
            ? JSON.parse(dados)
            : [];

    } catch (erro) {

        console.error(
            "Erro ao ler registros pendentes:",
            erro
        );

        return [];

    }

}


function salvarPendentes(lista) {

    try {

        localStorage.setItem(
            CHAVE_PENDENTES,
            JSON.stringify(lista)
        );

        return true;

    } catch (erro) {

        console.error(
            "Erro ao salvar registros pendentes:",
            erro
        );

        return false;

    }

}


function adicionarPendente(registro) {

    const pendentes =
        obterPendentes();

    const existe =
        pendentes.some(
            item =>
                item.idRegistro ===
                registro.idRegistro
        );

    if (!existe) {

        pendentes.push({
            ...registro,

            salvoLocalmenteEm:
                new Date().toISOString()
        });

        salvarPendentes(
            pendentes
        );

    }

}


/* =========================================================
   DATA PADRÃO = HOJE
========================================================= */

function definirDataAtual() {

    if (!dataVisita) {
        return;
    }

    const hoje =
        new Date();

    const ano =
        hoje.getFullYear();

    const mes =
        String(
            hoje.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const dia =
        String(
            hoje.getDate()
        ).padStart(
            2,
            "0"
        );

    dataVisita.value =
        `${ano}-${mes}-${dia}`;

}

definirDataAtual();


/* =========================================================
   MÁSCARA DE TELEFONE
========================================================= */

if (telefone) {

    telefone.addEventListener(
        "input",
        function () {

            let valor =
                this.value.replace(
                    /\D/g,
                    ""
                );

            valor =
                valor.substring(
                    0,
                    11
                );

            if (valor.length > 10) {

                valor =
                    valor.replace(
                        /^(\d{2})(\d{5})(\d{4})$/,
                        "($1) $2-$3"
                    );

            } else if (
                valor.length > 6
            ) {

                valor =
                    valor.replace(
                        /^(\d{2})(\d{4})(\d{0,4})$/,
                        "($1) $2-$3"
                    );

            } else if (
                valor.length > 2
            ) {

                valor =
                    valor.replace(
                        /^(\d{2})(\d+)/,
                        "($1) $2"
                    );

            } else if (
                valor.length > 0
            ) {

                valor =
                    valor.replace(
                        /^(\d{0,2})/,
                        "($1"
                    );

            }

            this.value =
                valor;

        }
    );

}


/* =========================================================
   FORMATAÇÃO DO VALOR DO CONTRATO
========================================================= */

if (valorContrato) {

    valorContrato.addEventListener(
        "input",
        function () {

            let valor =
                this.value.replace(
                    /\D/g,
                    ""
                );

            if (!valor) {

                this.value = "";

                return;

            }

            valor =
                (
                    Number(valor) / 100
                ).toLocaleString(
                    "pt-BR",
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }
                );

            this.value =
                valor;

        }
    );

}


/* =========================================================
   MARGEM DE VENDA
========================================================= */

if (margemVenda) {

    margemVenda.addEventListener(
        "input",
        function () {

            let valor =
                this.value;

            if (
                valor === ""
            ) {
                return;
            }

            valor =
                valor.replace(
                    ",",
                    "."
                );

            if (
                Number(valor) < 0
            ) {

                this.value = 0;

            }

        }
    );

}


/* =========================================================
   CONTADOR DE OBSERVAÇÕES
========================================================= */

if (
    observacoes &&
    contadorCaracteres
) {

    observacoes.setAttribute(
        "maxlength",
        "1000"
    );

    observacoes.addEventListener(
        "input",
        function () {

            contadorCaracteres
                .textContent =
                this.value.length;

        }
    );

}


/* =========================================================
   EMPRESA CONSERVADORA - OUTROS
========================================================= */

function atualizarCampoOutraConservadora() {

    if (
        !empresaConservadora ||
        !campoOutraConservadora ||
        !outraConservadora
    ) {

        return;

    }

    const selecionouOutros =
        empresaConservadora.value ===
        "Outros";

    campoOutraConservadora.hidden =
        !selecionouOutros;

    outraConservadora.required =
        selecionouOutros;

    if (!selecionouOutros) {

        outraConservadora.value =
            "";

    }

}


if (empresaConservadora) {

    empresaConservadora.addEventListener(
        "change",
        function () {

            atualizarCampoOutraConservadora();

            if (
                this.value ===
                "Outros"
            ) {

                outraConservadora.focus();

            }

        }
    );

}


/* =========================================================
   JÁ EXISTE PROPOSTA?
========================================================= */

function atualizarCamposProposta() {

    const escolha =
        document.querySelector(
            'input[name="temProposta"]:checked'
        );

    const temProposta =
        escolha &&
        escolha.value === "Sim";

    if (dadosProposta) {

        dadosProposta.hidden =
            !temProposta;

    }

    [
        tipoContrato,
        valorContrato,
        margemVenda,
        numeroProposta
    ].forEach(
        campo => {

            if (!campo) {
                return;
            }

            campo.required =
                Boolean(temProposta);

            if (!temProposta) {

                if (
                    campo.tagName ===
                    "SELECT"
                ) {

                    campo.selectedIndex = 0;

                } else {

                    campo.value = "";

                }

                removerErroDoCampo(campo);

            }

        }
    );

}


radiosTemProposta
    .forEach(
        radio => {

            radio.addEventListener(
                "change",
                atualizarCamposProposta
            );

        }
    );


atualizarCamposProposta();


/* =========================================================
   PERFIL / RETENÇÃO
========================================================= */

function atualizarFluxoRetencao() {

    const tipoSelecionado =
        document.querySelector(
            'input[name="tipoRegistro"]:checked'
        );

    const modalidadeSelecionada =
        document.querySelector(
            'input[name="modalidade"]:checked'
        );

    const retencaoPorTipo =
        tipoSelecionado?.value ===
        "Acompanhamento / Retenção de Cliente";

    const retencaoPorModalidade =
        modalidadeSelecionada?.value ===
        "Retenção";

    const retencao =
        retencaoPorTipo ||
        retencaoPorModalidade;

    formulario.classList.toggle("modo-retencao", retencao);

    if (avisoRetencao) {
        avisoRetencao.hidden = !retencao;
    }

    const radiosTipoRegistroLocais =
        document.querySelectorAll(
            'input[name="tipoRegistro"]'
        );

    const tipoRetencao =
        document.querySelector(
            'input[name="tipoRegistro"][value="Acompanhamento / Retenção de Cliente"]'
        );

    const modalidadeRetencao =
        document.querySelector(
            'input[name="modalidade"][value="Retenção"]'
        );

    /*
       O gatilho principal agora é o Tipo de Registro.
       Ao clicar em Acompanhamento / Retenção de Cliente,
       a Modalidade Retenção é marcada automaticamente.
       Também mantemos compatibilidade com quem clicar
       diretamente em Retenção na modalidade.
    */
    if (retencao && tipoRetencao) {
        tipoRetencao.checked = true;
    }

    if (retencao && modalidadeRetencao) {
        modalidadeRetencao.checked = true;
    }

    /*
       TIPO DE REGISTRO fica SEMPRE liberado.
       Assim, se o usuário escolher Retenção por engano,
       pode trocar imediatamente para Nova Oportunidade
       ou Atualização da Oportunidade Existente.
    */
    radiosTipoRegistroLocais.forEach(radio => {
        radio.disabled = false;

        const card =
            radio.closest(".opcao-card");

        card?.classList.remove(
            "opcao-bloqueada"
        );
    });

    const radiosNatureza =
        document.querySelectorAll(
            'input[name="natureza"]'
        );

    const naturezaRelacionamento =
        document.querySelector(
            'input[name="natureza"][value="Relacionamento"]'
        );

    if (retencao && naturezaRelacionamento) {
        naturezaRelacionamento.checked = true;
    }

    radiosNatureza.forEach(radio => {
        const card = radio.closest(".opcao-card");

        if (retencao) {
            radio.disabled =
                radio.value !== "Relacionamento";

            card?.classList.toggle(
                "opcao-bloqueada",
                radio.disabled
            );
        } else {
            radio.disabled = false;
            card?.classList.remove("opcao-bloqueada");
        }
    });

    const permitidos = new Set([
        "modalidade",
        "tipoCliente",
        "natureza",
        "dataVisita",

        /* CLIENTE E LOCAL */
        "empresaConservadora",
        "outraConservadora",
        "nomeCondominio",
        "endereco",
        "bairro",
        "cidade",
        "uf",
        "regiao",

        /* CONTATO */
        "nomeContato",
        "telefone",
        "email",

        /* OBSERVAÇÕES */
        "observacoes",

        "vendedor"
    ]);

    const controles =
        Array.from(
            formulario.querySelectorAll(
                "input, select, textarea, button"
            )
        );

    controles.forEach(controle => {

        if (controle.type === "submit") return;

        const chave =
            controle.name || controle.id || "";

        if (
            chave === "tipoRegistro" ||
            chave === "natureza" ||
            chave === "modalidade"
        ) {
            return;
        }

        if (retencao) {

            if (controle.dataset.retencaoDisabledOriginal === undefined) {
                controle.dataset.retencaoDisabledOriginal =
                    controle.disabled ? "1" : "0";
            }

            if (controle.dataset.retencaoRequiredOriginal === undefined) {
                controle.dataset.retencaoRequiredOriginal =
                    controle.required ? "1" : "0";
            }

            const permitido = permitidos.has(chave);

            if (!permitido) {
                controle.disabled = true;
                controle.required = false;
            } else {
                controle.disabled =
                    controle.dataset.retencaoDisabledOriginal === "1";

                if (
                    [
                        "tipoCliente",
                        "dataVisita",

                                                                        "regiao",

                        "nomeContato",
                        "telefone",
                        "email",
                        "observacoes"
                    ].includes(chave)
                ) {
                    controle.required = true;
                }
            }

        } else {

            if (controle.dataset.retencaoDisabledOriginal !== undefined) {
                controle.disabled =
                    controle.dataset.retencaoDisabledOriginal === "1";
            }

            if (controle.dataset.retencaoRequiredOriginal !== undefined) {
                controle.required =
                    controle.dataset.retencaoRequiredOriginal === "1";
            }

            delete controle.dataset.retencaoDisabledOriginal;
            delete controle.dataset.retencaoRequiredOriginal;
        }
    });

    formulario.querySelectorAll(".campo").forEach(campo => {
        const internos =
            Array.from(
                campo.querySelectorAll("input, select, textarea")
            );

        if (!internos.length) return;

        const temAtivo =
            internos.some(el => !el.disabled);

        campo.classList.toggle(
            "campo-retencao-inativo",
            retencao && !temAtivo
        );
    });

    [
        document.getElementById("secaoEquipamentos")
    ].forEach(secao => {
        secao?.classList.toggle(
            "secao-retencao-inativa",
            retencao
        );
    });

    /*
       Cliente e Local FAZ PARTE do fluxo de Retenção.
       Garantimos que a seção nunca fique acinzentada.
    */
    document
        .getElementById("secaoCliente")
        ?.classList.remove(
            "secao-retencao-inativa"
        );

    atualizarTipoRegistro();
    limparErros();
}


document
    .querySelectorAll('input[name="modalidade"]')
    .forEach(radio => {
        radio.addEventListener(
            "change",
            atualizarFluxoRetencao
        );
    });


/* =========================================================
   TIPO DE REGISTRO / OPORTUNIDADE
========================================================= */

function atualizarTipoRegistro() {

    const escolha =
        document.querySelector(
            'input[name="tipoRegistro"]:checked'
        );

    const atualizacao =
        escolha &&
        escolha.value ===
            "Atualização da Oportunidade Existente";

    if (campoOportunidadeExistente) {
        campoOportunidadeExistente.hidden =
            !atualizacao;
    }

    if (campoOrigemAtualizacao) {
        campoOrigemAtualizacao.hidden =
            !atualizacao;
    }

    radiosOrigemAtualizacao
        .forEach(
            radio => {

                radio.required =
                    Boolean(atualizacao);

                if (!atualizacao) {
                    radio.checked =
                        false;
                }

            }
        );

    if (idOportunidadeExistente) {

        idOportunidadeExistente.required =
            Boolean(atualizacao);

        if (!atualizacao) {

            idOportunidadeExistente.value =
                "";

            removerErroDoCampo(
                idOportunidadeExistente
            );

        }

    }

    if (rotuloNatureza) {
        rotuloNatureza.innerHTML =
            atualizacao
                ? 'Natureza da Atualização <span>*</span>'
                : 'Natureza da Visita <span>*</span>';
    }

    if (rotuloDataRegistro) {
        rotuloDataRegistro.innerHTML =
            atualizacao
                ? 'Data da Atualização <span>*</span>'
                : 'Data da Visita <span>*</span>';
    }

}


radiosTipoRegistro
    .forEach(
        radio => {

            radio.addEventListener(
                "change",
                function () {

                    const ehRetencao =
                        this.value ===
                        "Acompanhamento / Retenção de Cliente";

                    if (ehRetencao) {

                        const modalidadeRetencao =
                            document.querySelector(
                                'input[name="modalidade"][value="Retenção"]'
                            );

                        if (modalidadeRetencao) {
                            modalidadeRetencao.checked = true;
                        }

                    } else {

                        /*
                           Se o usuário sair de Retenção,
                           desmarcamos a modalidade Retenção.
                           Resgate/Captação voltam a ficar disponíveis
                           e o formulário comercial normal é restaurado.
                        */
                        const modalidadeRetencao =
                            document.querySelector(
                                'input[name="modalidade"][value="Retenção"]'
                            );

                        if (modalidadeRetencao?.checked) {
                            modalidadeRetencao.checked = false;
                        }
                    }

                    atualizarTipoRegistro();
                    atualizarFluxoRetencao();
                }
            );

        }
    );


atualizarTipoRegistro();
atualizarFluxoRetencao();


/* =========================================================
   STATUS COMERCIAL / PERDA
========================================================= */

function atualizarMotivoPerda() {

    const semSuporte =
        motivoPerda &&
        motivoPerda.value ===
            "Sem suporte técnico";

    if (campoDestinoDeclinio) {

        campoDestinoDeclinio.hidden =
            !semSuporte;

    }

    radiosDestinoDeclinio
        .forEach(
            radio => {

                radio.required =
                    Boolean(semSuporte);

                if (!semSuporte) {

                    radio.checked =
                        false;

                    removerErroDoCampo(
                        radio
                    );

                }

            }
        );

}


function atualizarStatusComercial() {

    const status =
        statusComercial
            ? statusComercial.value
            : "";

    const perda =
        status ===
        "Perda";


    /* MOSTRAR / ESCONDER MOTIVO DA PERDA */

    if (campoMotivoPerda) {

        campoMotivoPerda.hidden =
            !perda;

    }


    if (motivoPerda) {

        motivoPerda.required =
            Boolean(perda);

        if (!perda) {

            motivoPerda.selectedIndex =
                0;

            removerErroDoCampo(
                motivoPerda
            );

        }

    }


    /* PREVISÃO DE FECHAMENTO - SEMPRE OBRIGATÓRIA */

    if (campoPrevisaoFechamento) {
        campoPrevisaoFechamento.hidden = false;
    }

    if (previsaoFechamento) {
        previsaoFechamento.required = true;
    }

    if (
        previsaoFechamento &&
        (
            status === "Assinado" ||
            status === "Perda"
        )
    ) {

        previsaoFechamento.value =
            "";

        removerErroDoCampo(
            previsaoFechamento
        );

    }


    /*
       SE FOR PERDA POR
       SEM SUPORTE TÉCNICO,
       ABRE DESTINO DO CASO.
    */

    atualizarMotivoPerda();

}


if (
    statusComercial
) {

    statusComercial.addEventListener(
        "change",
        atualizarStatusComercial
    );

}


if (
    motivoPerda
) {

    motivoPerda.addEventListener(
        "change",
        atualizarMotivoPerda
    );

}


atualizarStatusComercial();


/* =========================================================
   PRECISA DE APOIO?
========================================================= */

function atualizarCampoApoio() {

    if (!campoApoios) {

        return;

    }

    const escolha =
        document.querySelector(
            'input[name="precisaApoio"]:checked'
        );

    const precisa =
        escolha &&
        escolha.value === "Sim";

    campoApoios.hidden =
        !precisa;

    if (!precisa) {

        checkboxesApoio
            .forEach(
                checkbox => {

                    checkbox.checked =
                        false;

                }
            );

    }

}


radiosPrecisaApoio
    .forEach(
        radio => {

            radio.addEventListener(
                "change",
                atualizarCampoApoio
            );

        }
    );


atualizarCampoApoio();


/* =========================================================
   BAIRROS DO RIO DE JANEIRO
   REGIÃO AUTOMÁTICA
========================================================= */

const bairrosPorRegiao = {

    "Centro": [

        "Benfica",
        "Caju",
        "Catumbi",
        "Centro",
        "Cidade Nova",
        "Estácio",
        "Gamboa",
        "Glória",
        "Lapa",
        "Mangueira",
        "Paquetá",
        "Rio Comprido",
        "Santa Teresa",
        "Santo Cristo",
        "Saúde",
        "São Cristóvão",
        "Vasco da Gama"

    ],


    "Zona Sul": [

        "Botafogo",
        "Catete",
        "Copacabana",
        "Cosme Velho",
        "Flamengo",
        "Gávea",
        "Humaitá",
        "Ipanema",
        "Jardim Botânico",
        "Lagoa",
        "Laranjeiras",
        "Leblon",
        "Leme",
        "Rocinha",
        "São Conrado",
        "Urca",
        "Vidigal"

    ],


    "Zona Norte": [

        "Abolição",
        "Acari",
        "Água Santa",
        "Alto da Boa Vista",
        "Anchieta",
        "Andaraí",
        "Barros Filho",
        "Bento Ribeiro",
        "Bonsucesso",
        "Brás de Pina",
        "Cachambi",
        "Campinho",
        "Cascadura",
        "Cavalcanti",
        "Cidade Universitária",
        "Coelho Neto",
        "Colégio",
        "Complexo do Alemão",
        "Cordovil",
        "Costa Barros",
        "Del Castilho",
        "Encantado",
        "Engenheiro Leal",
        "Engenho da Rainha",
        "Engenho de Dentro",
        "Engenho Novo",
        "Freguesia (Ilha do Governador)",
        "Galeão",
        "Grajaú",
        "Guadalupe",
        "Higienópolis",
        "Honório Gurgel",
        "Inhaúma",
        "Irajá",
        "Jacaré",
        "Jacarezinho",
        "Jardim América",
        "Jardim Carioca",
        "Jardim Guanabara",
        "Lins de Vasconcelos",
        "Madureira",
        "Maracanã",
        "Marechal Hermes",
        "Maria da Graça",
        "Méier",
        "Moneró",
        "Manguinhos",
        "Olaria",
        "Oswaldo Cruz",
        "Parada de Lucas",
        "Parque Anchieta",
        "Parque Colúmbia",
        "Pavuna",
        "Penha",
        "Penha Circular",
        "Piedade",
        "Pilares",
        "Pitanga",
        "Portuguesa",
        "Praça da Bandeira",
        "Praia da Bandeira",
        "Quintino Bocaiúva",
        "Ramos",
        "Riachuelo",
        "Ribeira",
        "Ricardo de Albuquerque",
        "Rocha",
        "Rocha Miranda",
        "Sampaio",
        "São Francisco Xavier",
        "Tauá",
        "Tijuca",
        "Todos os Santos",
        "Tomás Coelho",
        "Turiaçu",
        "Vaz Lobo",
        "Vicente de Carvalho",
        "Vigário Geral",
        "Vila da Penha",
        "Vila Isabel",
        "Vila Kosmos",
        "Vista Alegre",
        "Zumbi"

    ],


    "Zona Oeste": [

        "Anil",
        "Bangu",
        "Barra da Tijuca",
        "Barra de Guaratiba",
        "Camorim",
        "Campo dos Afonsos",
        "Campo Grande",
        "Cidade de Deus",
        "Cosmos",
        "Curicica",
        "Deodoro",
        "Freguesia (Jacarepaguá)",
        "Gardênia Azul",
        "Gericinó",
        "Grumari",
        "Guaratiba",
        "Inhoaíba",
        "Itanhangá",
        "Jabour",
        "Jacarepaguá",
        "Jardim Sulacap",
        "Joá",
        "Magalhães Bastos",
        "Paciência",
        "Padre Miguel",
        "Pechincha",
        "Pedra de Guaratiba",
        "Praça Seca",
        "Realengo",
        "Recreio dos Bandeirantes",
        "Santíssimo",
        "Santa Cruz",
        "Senador Camará",
        "Senador Vasconcelos",
        "Sepetiba",
        "Tanque",
        "Taquara",
        "Vargem Grande",
        "Vargem Pequena",
        "Vila Kennedy",
        "Vila Militar"

    ]

};


/* =========================================================
   LISTA GERAL DE BAIRROS
========================================================= */

const listaBairros =
    Object
        .values(
            bairrosPorRegiao
        )
        .flat()
        .sort(
            (a, b) =>
                a.localeCompare(
                    b,
                    "pt-BR"
                )
        );


/* =========================================================
   DESCOBRIR REGIÃO PELO BAIRRO
========================================================= */

function descobrirRegiao(
    bairroSelecionado
) {

    if (!bairroSelecionado) {

        return "";

    }

    for (
        const [nomeRegiao, bairros]
        of Object.entries(
            bairrosPorRegiao
        )
    ) {

        if (
            bairros.includes(
                bairroSelecionado
            )
        ) {

            return nomeRegiao;

        }

    }

    return "";

}


/* =========================================================
   PREENCHER REGIÃO AUTOMATICAMENTE
========================================================= */

function atualizarRegiaoPorBairro() {

    if (
        !bairro ||
        !regiao
    ) {

        return;

    }

    const bairroSelecionado =
        bairro.value.trim();

    const regiaoEncontrada =
        descobrirRegiao(
            bairroSelecionado
        );

    regiao.value =
        regiaoEncontrada;

}


if (
    bairro
) {

    bairro.addEventListener(
        "change",
        atualizarRegiaoPorBairro
    );

    bairro.addEventListener(
        "input",
        atualizarRegiaoPorBairro
    );

}


/* =========================================================
   CIDADE E UF FIXOS
========================================================= */

function definirLocalizacaoPadrao() {

    if (
        cidade
    ) {

        cidade.value =
            "Rio de Janeiro";

    }

    if (
        uf
    ) {

        uf.value =
            "RJ";

    }

}


definirLocalizacaoPadrao();

/* =========================================================
   ERROS DO FORMULÁRIO
========================================================= */

function limparErros() {

    if (typeof limparResumoErros === "function") {
        limparResumoErros();
    }

    document
        .querySelectorAll(
            ".erro-mensagem"
        )
        .forEach(
            erro =>
                erro.remove()
        );

    document
        .querySelectorAll(
            ".campo-erro"
        )
        .forEach(
            campo =>
                campo.classList.remove(
                    "campo-erro"
                )
        );

}


function mostrarErro(
    elemento,
    mensagem
) {

    if (!elemento) {
        return;
    }

    const campo =
        elemento.closest(
            ".campo"
        );

    if (!campo) {
        return;
    }

    campo.classList.add(
        "campo-erro"
    );

    const erroAnterior =
        campo.querySelector(
            ".erro-mensagem"
        );

    if (erroAnterior) {

        erroAnterior.remove();

    }

    const erro =
        document.createElement(
            "div"
        );

    erro.className =
        "erro-mensagem";

    erro.textContent =
        mensagem;

    campo.appendChild(
        erro
    );

}


function removerErroDoCampo(
    elemento
) {

    if (!elemento) {
        return;
    }

    const campo =
        elemento.closest(
            ".campo"
        );

    if (!campo) {
        return;
    }

    campo.classList.remove(
        "campo-erro"
    );

    const erro =
        campo.querySelector(
            ".erro-mensagem"
        );

    if (erro) {

        erro.remove();

    }

}


/* =========================================================
   RESUMO AMIGÁVEL DOS CAMPOS PENDENTES
========================================================= */

function obterNomeCampoErro(campo) {
    if (!campo) return "Campo obrigatório";

    const label = campo.querySelector("label");
    if (label) {
        return label.textContent
            .replace(/\*/g, "")
            .replace(/\s+/g, " ")
            .trim();
    }

    const titulo =
        campo.closest(".secao-formulario")
            ?.querySelector(".titulo-secao h3");

    return titulo
        ? titulo.textContent.trim()
        : "Campo obrigatório";
}

const ROTULOS_CAMPOS_RJCAP = {
    tipoRegistro: "Tipo de Registro",
    origemAtualizacao: "Origem da Atualização",
    modalidade: "Modalidade de Negócios",
    tipoCliente: "Tipo (Residencial ou Comercial)",
    natureza: "Natureza da Visita",
    statusComercial: "Status Comercial",
    motivoPerda: "Motivo da Perda",
    destinoDeclinio: "Destino do Caso",
    previsaoFechamento: "Previsão de Fechamento",
    temProposta: "Já existe proposta?",
    tipoContrato: "Tipo de Contrato",
    valorContrato: "Valor do Contrato",
    margemVenda: "Margem da Venda",
    numeroProposta: "Número da Proposta",
    precisaApoio: "Precisa de Apoio?",
    apoio: "Tipo de Apoio",
    empresaConservadora: "Empresa Conservadora",
    outraConservadora: "Outra Conservadora",
    nomeCondominio: "Nome do Condomínio",
    endereco: "Endereço",
    bairro: "Bairro",
    cidade: "Cidade",
    uf: "UF",
    regiao: "Região",
    dataVisita: "Data da Visita",
    nomeContato: "Nome do Contato",
    telefone: "Telefone",
    email: "E-mail",
    observacoes: "Observações Gerais"
};


function obterCamposPendentes() {

    const camposComErro =
        Array.from(
            formulario.querySelectorAll(
                ".campo-erro"
            )
        );

    const nomes =
        camposComErro
            .map(campo => {

                const controle =
                    campo.querySelector(
                        "input, select, textarea"
                    );

                const chave =
                    controle?.name ||
                    controle?.id ||
                    "";

                if (
                    chave &&
                    ROTULOS_CAMPOS_RJCAP[chave]
                ) {
                    return ROTULOS_CAMPOS_RJCAP[chave];
                }

                return obterNomeCampoErro(
                    campo
                );

            })
            .filter(Boolean);

    /*
       Segurança extra: inclui grupos de rádio obrigatórios que
       eventualmente não tenham recebido .campo-erro no contêiner.
    */
    const gruposRadioObrigatorios = [
        ["tipoRegistro", "Tipo de Registro"],
        ["modalidade", "Modalidade de Negócios"],
        ["tipoCliente", "Tipo (Residencial ou Comercial)"],
        ["natureza", "Natureza da Visita"],
        ["temProposta", "Já existe proposta?"],
        ["precisaApoio", "Precisa de Apoio?"]
    ];

    gruposRadioObrigatorios.forEach(
        ([name, rotulo]) => {

            const radios =
                Array.from(
                    formulario.querySelectorAll(
                        `input[type="radio"][name="${name}"]`
                    )
                );

            const existeAtivo =
                radios.some(
                    radio =>
                        !radio.disabled &&
                        !radio.closest("[hidden]") &&
                        !radio.closest(".campo-retencao-inativo")
                );

            const algumMarcado =
                radios.some(
                    radio =>
                        !radio.disabled &&
                        radio.checked
                );

            if (
                existeAtivo &&
                !algumMarcado
            ) {
                nomes.push(rotulo);
            }
        }
    );

    return [
        ...new Set(nomes)
    ];

}


function mostrarAlertaCamposPendentes() {

    const campos =
        obterCamposPendentes();

    if (!campos.length) {
        return;
    }

    const lista =
        campos
            .map(
                (campo, indice) =>
                    `${indice + 1}. ${campo}`
            )
            .join("\\n");

    alert(
        "ATENÇÃO! Faltam campos obrigatórios.\\n\\n" +
        "Preencha antes de registrar a visita:\\n\\n" +
        lista
    );

}


function atualizarResumoErros() {
    if (!resumoErrosFormulario || !listaErrosFormulario) return;

    const nomes =
        obterCamposPendentes();

    listaErrosFormulario.innerHTML = "";

    nomes.forEach(nome => {
        const item = document.createElement("li");
        item.textContent = nome;
        listaErrosFormulario.appendChild(item);
    });

    resumoErrosFormulario.hidden = nomes.length === 0;
}

function limparResumoErros() {
    if (resumoErrosFormulario) {
        resumoErrosFormulario.hidden = true;
    }
    if (listaErrosFormulario) {
        listaErrosFormulario.innerHTML = "";
    }
}

function focarPrimeiroErro() {
    const primeiroErro =
        formulario.querySelector(".campo-erro");

    if (!primeiroErro) return;

    primeiroErro.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    const controle =
        primeiroErro.querySelector(
            "input:not([disabled]), select:not([disabled]), textarea:not([disabled])"
        );

    setTimeout(() => {
        try {
            controle?.focus?.({ preventScroll: true });
        } catch (_) {}
    }, 350);
}

function campoEstaAtivo(elemento) {
    return Boolean(
        elemento &&
        !elemento.disabled &&
        !elemento.closest("[hidden]") &&
        !elemento.closest(".campo-retencao-inativo")
    );
}


/* =========================================================
   VALIDAR CAMPOS RADIO
========================================================= */

function validarRadio(
    nome,
    mensagem
) {

    const selecionado =
        document.querySelector(
            `input[name="${nome}"]:checked`
        );

    if (!selecionado) {

        const primeiro =
            document.querySelector(
                `input[name="${nome}"]`
            );

        mostrarErro(
            primeiro,
            mensagem
        );

        return false;

    }

    return true;

}


/* =========================================================
   VALIDAR BAIRRO
========================================================= */

function validarBairro() {

    if (!bairro) {
        return true;
    }

    const bairroDigitado =
        bairro.value.trim();

    if (!bairroDigitado) {

        mostrarErro(
            bairro,
            "Selecione o bairro."
        );

        return false;

    }

    const bairroValido =
        listaBairros.some(
            item =>
                item.toLocaleLowerCase(
                    "pt-BR"
                ) ===
                bairroDigitado.toLocaleLowerCase(
                    "pt-BR"
                )
        );

    if (!bairroValido) {

        mostrarErro(
            bairro,
            "Selecione um bairro válido da lista."
        );

        return false;

    }

    const nomePadronizado =
        listaBairros.find(
            item =>
                item.toLocaleLowerCase(
                    "pt-BR"
                ) ===
                bairroDigitado.toLocaleLowerCase(
                    "pt-BR"
                )
        );

    bairro.value =
        nomePadronizado;

    atualizarRegiaoPorBairro();

    return true;

}


/* =========================================================
   VALIDAÇÃO COMPLETA DO FORMULÁRIO
========================================================= */

function validarFormulario() {

    limparErros();

    let valido = true;

    const modalidadeAtual =
        document.querySelector(
            'input[name="modalidade"]:checked'
        )?.value || "";

    const tipoRegistroAtual =
        document.querySelector(
            'input[name="tipoRegistro"]:checked'
        )?.value || "";

    const retencao =
        modalidadeAtual === "Retenção" ||
        tipoRegistroAtual ===
            "Acompanhamento / Retenção de Cliente";

    const campos =
        formulario.querySelectorAll(
            "input:not([type='radio']):not([type='checkbox']), select, textarea"
        );

    campos.forEach(campo => {
        if (
            campoEstaAtivo(campo) &&
            campo.required &&
            !String(campo.value).trim()
        ) {
            mostrarErro(
                campo,
                "Este campo é obrigatório."
            );
            valido = false;
        }
    });

    if (retencao) {

        const tipoRetencao =
            document.querySelector(
                'input[name="tipoRegistro"][value="Acompanhamento / Retenção de Cliente"]'
            );

        if (!tipoRetencao?.checked) {
            mostrarErro(
                tipoRetencao,
                "O tipo de registro de Retenção deve estar selecionado."
            );
            valido = false;
        }

        if (
            !validarRadio(
                "tipoCliente",
                "Informe se o cliente é Residencial ou Comercial."
            )
        ) {
            valido = false;
        }

        const natureza =
            document.querySelector(
                'input[name="natureza"]:checked'
            );

        if (
            !natureza ||
            natureza.value !== "Relacionamento"
        ) {
            mostrarErro(
                document.querySelector(
                    'input[name="natureza"][value="Relacionamento"]'
                ),
                "Na Retenção, a Natureza da Visita deve ser Relacionamento."
            );
            valido = false;
        }

    } else {

        if (
            !validarRadio(
                "tipoRegistro",
                "Informe se é uma nova oportunidade ou atualização."
            )
        ) {
            valido = false;
        }

        if (
            !validarRadio(
                "tipoCliente",
                "Informe se o cliente é Residencial ou Comercial."
            )
        ) {
            valido = false;
        }

        const tipoRegistroSelecionado =
            document.querySelector(
                'input[name="tipoRegistro"]:checked'
            );

        if (
            tipoRegistroSelecionado &&
            tipoRegistroSelecionado.value ===
                "Atualização da Oportunidade Existente" &&
            (
                !idOportunidadeExistente ||
                !idOportunidadeExistente.value.trim()
            )
        ) {
            mostrarErro(
                idOportunidadeExistente,
                "Informe o ID da oportunidade existente."
            );
            valido = false;
        }

        if (
            tipoRegistroSelecionado &&
            tipoRegistroSelecionado.value ===
                "Atualização da Oportunidade Existente" &&
            !validarRadio(
                "origemAtualizacao",
                "Selecione a origem da atualização."
            )
        ) {
            valido = false;
        }

        if (
            !validarRadio(
                "modalidade",
                "Selecione uma modalidade de negócios."
            )
        ) {
            valido = false;
        }

        if (
            !validarRadio(
                "natureza",
                "Selecione a natureza da visita ou atualização."
            )
        ) {
            valido = false;
        }

        if (
            !statusComercial ||
            !statusComercial.value
        ) {
            mostrarErro(
                statusComercial,
                "Selecione o status comercial."
            );
            valido = false;
        }

        if (
            statusComercial &&
            statusComercial.value === "Perda"
        ) {
            if (!motivoPerda?.value) {
                mostrarErro(
                    motivoPerda,
                    "Informe o motivo da perda."
                );
                valido = false;
            }

            if (
                motivoPerda?.value ===
                    "Sem suporte técnico" &&
                !validarRadio(
                    "destinoDeclinio",
                    "Informe o destino dado ao caso."
                )
            ) {
                valido = false;
            }
        }

        if (
            !validarRadio(
                "temProposta",
                "Informe se já existe proposta."
            )
        ) {
            valido = false;
        }

        if (
            !validarRadio(
                "precisaApoio",
                "Informe se precisa de apoio."
            )
        ) {
            valido = false;
        }

        const precisaApoio =
            document.querySelector(
                'input[name="precisaApoio"]:checked'
            );

        if (
            precisaApoio?.value === "Sim" &&
            !document.querySelector(
                'input[name="apoio"]:checked'
            )
        ) {
            mostrarErro(
                document.querySelector('input[name="apoio"]'),
                "Selecione pelo menos um tipo de apoio."
            );
            valido = false;
        }

        if (!validarEquipamentos()) {
            valido = false;
        }

        if (!validarBairro()) {
            valido = false;
        }
    }

    const email =
        document.getElementById("email");

    if (
        campoEstaAtivo(email) &&
        email.value.trim()
    ) {
        const regexEmail =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regexEmail.test(email.value)) {
            mostrarErro(
                email,
                "Informe um e-mail válido."
            );
            valido = false;
        }
    }

    if (
        campoEstaAtivo(telefone) &&
        telefone.value
    ) {
        const numeros =
            telefone.value.replace(/\D/g, "");

        if (numeros.length < 10) {
            mostrarErro(
                telefone,
                "Informe um telefone válido com DDD."
            );
            valido = false;
        }
    }

    if (
        !retencao &&
        valorContrato &&
        campoEstaAtivo(valorContrato) &&
        valorContrato.required &&
        valorContrato.value === "0,00"
    ) {
        mostrarErro(
            valorContrato,
            "Informe um valor de contrato maior que zero."
        );
        valido = false;
    }

    if (
        !retencao &&
        margemVenda &&
        campoEstaAtivo(margemVenda) &&
        margemVenda.value !== "" &&
        Number(
            String(margemVenda.value)
                .replace(",", ".")
        ) < 0
    ) {
        mostrarErro(
            margemVenda,
            "Informe uma margem válida."
        );
        valido = false;
    }

    atualizarResumoErros();

    return valido;
}


/* =========================================================
   GERAR ID DA OPORTUNIDADE
========================================================= */

function gerarIdOportunidade() {

    const agora =
        new Date();

    const data =
        [
            agora.getFullYear(),

            String(
                agora.getMonth() + 1
            ).padStart(
                2,
                "0"
            ),

            String(
                agora.getDate()
            ).padStart(
                2,
                "0"
            )

        ].join("");


    const hora =
        [
            String(
                agora.getHours()
            ).padStart(
                2,
                "0"
            ),

            String(
                agora.getMinutes()
            ).padStart(
                2,
                "0"
            ),

            String(
                agora.getSeconds()
            ).padStart(
                2,
                "0"
            )

        ].join("");


    const aleatorio =
        Math.random()
            .toString(36)
            .substring(
                2,
                6
            )
            .toUpperCase();


    return (
        `OPP-${data}-${hora}-${aleatorio}`
    );

}


/* =========================================================
   GERAR ID DA VISITA
========================================================= */

function gerarIdVisita() {

    const agora =
        new Date();

    const data =
        [
            agora.getFullYear(),

            String(
                agora.getMonth() + 1
            ).padStart(
                2,
                "0"
            ),

            String(
                agora.getDate()
            ).padStart(
                2,
                "0"
            )

        ].join("");


    const hora =
        [
            String(
                agora.getHours()
            ).padStart(
                2,
                "0"
            ),

            String(
                agora.getMinutes()
            ).padStart(
                2,
                "0"
            ),

            String(
                agora.getSeconds()
            ).padStart(
                2,
                "0"
            )

        ].join("");


    const aleatorio =
        Math.random()
            .toString(36)
            .substring(
                2,
                6
            )
            .toUpperCase();


    return (
        `RJCAP-${data}-${hora}-${aleatorio}`
    );

}


/* =========================================================
   GERAR ID DO REGISTRO
   Todo lançamento recebe um ID próprio.
========================================================= */

function gerarIdRegistro() {

    const agora =
        new Date();

    const data =
        [
            agora.getFullYear(),
            String(
                agora.getMonth() + 1
            ).padStart(
                2,
                "0"
            ),
            String(
                agora.getDate()
            ).padStart(
                2,
                "0"
            )
        ].join("");

    const hora =
        [
            String(
                agora.getHours()
            ).padStart(
                2,
                "0"
            ),
            String(
                agora.getMinutes()
            ).padStart(
                2,
                "0"
            ),
            String(
                agora.getSeconds()
            ).padStart(
                2,
                "0"
            )
        ].join("");

    const aleatorio =
        Math.random()
            .toString(36)
            .substring(
                2,
                7
            )
            .toUpperCase();

    return (
        `REG-${data}-${hora}-${aleatorio}`
    );

}


/* =========================================================
   FORMATAR ENDEREÇO COMPLETO
========================================================= */

function montarEnderecoCompleto(
    registro
) {

    const partes =
        [];


    if (
        registro.endereco
    ) {

        partes.push(
            registro.endereco
        );

    }


    if (
        registro.bairro
    ) {

        partes.push(
            registro.bairro
        );

    }


    if (
        registro.cidade
    ) {

        partes.push(
            registro.cidade
        );

    }


    let enderecoCompleto =
        partes.join(
            ", "
        );


    if (
        registro.uf
    ) {

        enderecoCompleto +=
            ` - ${registro.uf}`;

    }


    return enderecoCompleto;

}

/* =========================================================
   RÓTULOS DO REGISTRO
   USADOS NO PDF E EXCEL
========================================================= */

function rotulosRegistro(
    registro
) {

    return {

        "ID do Registro":
            registro.idRegistro,

        "ID da Oportunidade":
            registro.idOportunidade,

        "ID da Visita":
            registro.idVisita || "Não se aplica",

        "Tipo de Registro":
            registro.tipoRegistro,

        "Origem da Atualização":
            registro.origemAtualizacao,

        "Data do Registro / Visita":
            registro.dataVisita,

        "Vendedor":
            registro.consultor,

        "Modalidade de Negócios":
            registro.modalidade,

        "Tipo":
            registro.tipoCliente,

        "Natureza da Visita":
            registro.natureza,

        "Status Comercial":
            registro.statusComercial,

        "Motivo da Perda":
            registro.motivoPerda,

        "Destino do caso":
            registro.destinoDeclinio,

        "Previsão de Fechamento":
            registro.previsaoFechamento,

        "Obs./Motivo":
            registro.obsMotivo,

        "Já existe proposta?":
            registro.temProposta,

        "Precisa de Apoio":
            registro.precisaApoio,

        "Apoio":
            registro.apoio,

        "Tipo de Contrato":
            registro.tipoContrato,

        "Valor do Contrato":
            registro.valorContrato
                ? `R$ ${registro.valorContrato}`
                : "",

        "Margem de Venda (%)":
            registro.margemVenda
                ? `${registro.margemVenda}%`
                : "",

        "Número da Proposta":
            registro.numeroProposta,

        "Quantidade de Equipamentos":
            registro.quantidadeEquipamentos,

        "Quantidade de Paradas":
            registro.quantidadeParadas,

        "Marca":
            registro.marca,

        "Tipo de Equipamento":
            registro.tipoEquipamento,

        "Detalhamento dos Equipamentos":
            Array.isArray(registro.equipamentos)
                ? registro.equipamentos
                    .map(
                        item =>
                            `${item.tipo} | ${item.marca} | Qtd: ${item.quantidade} | Paradas/equip.: ${item.paradasPorEquipamento} | Total: ${item.totalParadas}`
                    )
                    .join(" ; ")
                : "",

        "Empresa Conservadora":
            registro.empresaConservadora,

        "Nome do Condomínio":
            registro.nomeCondominio,

        "Endereço":
            registro.endereco,

        "Bairro":
            registro.bairro,

        "Cidade":
            registro.cidade,

        "UF":
            registro.uf,

        "Região":
            registro.regiao,

        "Endereço Completo":
            montarEnderecoCompleto(
                registro
            ),

        "Nome do Contato":
            registro.nomeContato,

        "Telefone":
            registro.telefone,

        "E-mail":
            registro.email,

        "Observações Gerais":
            registro.observacoes

    };

}


/* =========================================================
   EXPORTAR REGISTRO PARA EXCEL
========================================================= */

function exportarRegistroExcel() {

    if (!ultimoRegistro) {

        alert(
            "Registre uma visita antes de exportar."
        );

        return;

    }


    if (
        typeof XLSX ===
        "undefined"
    ) {

        alert(
            "Não foi possível carregar o recurso de Excel."
        );

        return;

    }


    const linha =
        rotulosRegistro(
            ultimoRegistro
        );


    const planilha =
        XLSX.utils.json_to_sheet(
            [linha]
        );


    /*
       Ajusta automaticamente
       a largura das colunas.
    */

    planilha["!cols"] =
        Object.keys(
            linha
        ).map(
            chave => ({

                wch:
                    Math.min(
                        Math.max(
                            chave.length + 2,
                            18
                        ),
                        42
                    )

            })
        );


    const pasta =
        XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
        pasta,
        planilha,
        "Visita"
    );


    XLSX.writeFile(
        pasta,
        `${ultimoRegistro.idRegistro || ultimoRegistro.idVisita}.xlsx`
    );

}

/* =========================================================
   EXPORTAR REGISTRO PARA PDF

   Gera o PDF diretamente no navegador usando jsPDF.

   REGRAS:
   - Título único:
     "RJCAP - Registro da Visita"

   - Exibe somente campos preenchidos e aplicáveis.
   - Campos vazios ou "Não se aplica" são omitidos.

   Também inclui a logotipo da TKE no cabeçalho.
========================================================= */

async function exportarRegistroPdf() {

    if (!ultimoRegistro) {

        alert(
            "Registre uma visita ou atualização antes de exportar."
        );

        return;

    }


    if (
        !window.jspdf ||
        !window.jspdf.jsPDF
    ) {

        alert(
            "Não foi possível carregar o recurso de PDF."
        );

        return;

    }


    const {
        jsPDF
    } =
        window.jspdf;


    const pdf =
        new jsPDF({
            unit: "mm",
            format: "a4"
        });


    const dados =
        rotulosRegistro(
            ultimoRegistro
        );


    /* =====================================================
       IDENTIFICAR SE FOI PRESENCIAL
    ===================================================== */

    const origem =
        String(
            ultimoRegistro.origemAtualizacao ||
            ""
        ).trim();


    const presencial =
        origem ===
        "Presencial";


    const tituloPdf =
        "RJCAP - Registro da Visita";


    /* =====================================================
       LOGOTIPO TKE

       Arquivo salvo no Google Drive:
       ID:
       1Gipnn5iDl_Sg3loSloCTwWUwKjLF0wNV
    ===================================================== */

    const urlLogo =
    "./img/logo-tke.png";


    /*
       Converte a imagem para Base64
       antes de inserir no jsPDF.
    */
    async function carregarImagemBase64(url) {

        const resposta =
            await fetch(
                url
            );


        if (
            !resposta.ok
        ) {

            throw new Error(
                "Não foi possível carregar a logotipo."
            );

        }


        const blob =
            await resposta.blob();


        return new Promise(
            (
                resolve,
                reject
            ) => {

                const leitor =
                    new FileReader();


                leitor.onloadend =
                    function () {

                        resolve(
                            leitor.result
                        );

                    };


                leitor.onerror =
                    reject;


                leitor.readAsDataURL(
                    blob
                );

            }
        );

    }


    let logoBase64 =
        null;


    try {

        logoBase64 =
            await carregarImagemBase64(
                urlLogo
            );

    } catch (erro) {

        console.warn(
            "A logotipo não pôde ser carregada no PDF:",
            erro
        );

    }


    /* =====================================================
       CABEÇALHO
    ===================================================== */

    let y =
        18;


    /*
       Insere a logotipo se ela tiver sido
       carregada corretamente.
    */
    if (
        logoBase64
    ) {

        try {

            /*
               O jsPDF detecta automaticamente
               PNG/JPEG pelo Base64.
            */
            pdf.addImage(
                logoBase64,
                "PNG",
                15,
                10,
                32,
                16
            );

        } catch (erro) {

            /*
               Caso a imagem não seja PNG,
               tenta como JPEG.
            */
            try {

                pdf.addImage(
                    logoBase64,
                    "JPEG",
                    15,
                    10,
                    32,
                    16
                );

            } catch (erroImagem) {

                console.warn(
                    "Não foi possível inserir a logotipo no PDF.",
                    erroImagem
                );

            }

        }

    }


    /*
       TÍTULO
    */

    pdf.setFont(
        "helvetica",
        "bold"
    );


    pdf.setFontSize(
        17
    );


    pdf.text(
        tituloPdf,
        55,
        17
    );


    /*
       SUBTÍTULO
    */

    pdf.setFont(
        "helvetica",
        "normal"
    );


    pdf.setFontSize(
        9
    );


    pdf.text(
        "Controle Comercial - RJCAP",
        55,
        23
    );


    /*
       LINHA SEPARADORA
    */

    pdf.setLineWidth(
        0.5
    );


    pdf.line(
        15,
        31,
        195,
        31
    );


    y =
        40;


    /* =====================================================
       ID DO REGISTRO
    ===================================================== */

    pdf.setFontSize(
        10
    );


    pdf.setFont(
        "helvetica",
        "bold"
    );


    pdf.text(
        "Registro:",
        15,
        y
    );


    pdf.setFont(
        "helvetica",
        "normal"
    );


    pdf.text(
        String(
            ultimoRegistro.idRegistro ||
            "—"
        ),
        35,
        y
    );


    y +=
        12;


    /* =====================================================
       DADOS DO REGISTRO
    ===================================================== */

    Object.entries(
        dados
    ).forEach(
        ([rotulo, valor]) => {


            /*
               ID do Registro já apareceu
               no cabeçalho.
            */

            if (
                rotulo ===
                "ID do Registro"
            ) {

                return;

            }


            /*
               Quando não houve visita presencial,
               evita mostrar "ID da Visita: Não se aplica"
               caso você prefira omitir totalmente.
            */

            if (
                rotulo ===
                    "ID da Visita" &&
                !presencial
            ) {

                return;

            }


            const valorTexto =
                String(
                    valor ??
                    ""
                ).trim();


            /*
               PDF LIMPO:
               mostra somente informações realmente preenchidas
               e aplicáveis ao tipo de registro realizado.
            */
            const valorNormalizado =
                valorTexto
                    .toLowerCase()
                    .trim();


            const valoresNaoExibir = [
                "",
                "não se aplica",
                "nao se aplica",
                "n/a",
                "—",
                "-"
            ];


            if (
                valoresNaoExibir.includes(
                    valorNormalizado
                )
            ) {

                return;

            }


            const valorLinhas =
                pdf.splitTextToSize(
                    valorTexto,
                    110
                );


            /*
               NOVA PÁGINA

               Se estiver chegando ao final da folha,
               cria automaticamente outra página.
            */

            if (
                y +
                valorLinhas.length *
                6 >
                282
            ) {

                pdf.addPage();


                y =
                    20;

            }


            /*
               RÓTULO
            */

            pdf.setFont(
                "helvetica",
                "bold"
            );


            pdf.setFontSize(
                10
            );


            pdf.text(
                `${rotulo}:`,
                15,
                y
            );


            /*
               VALOR
            */

            pdf.setFont(
                "helvetica",
                "normal"
            );


            pdf.text(
                valorLinhas,
                78,
                y
            );


            y +=
                Math.max(
                    8,
                    valorLinhas.length *
                    6
                );

        }
    );


    /* =====================================================
       RODAPÉ
    ===================================================== */

    const totalPaginas =
        pdf.getNumberOfPages();


    for (
        let pagina = 1;
        pagina <= totalPaginas;
        pagina++
    ) {

        pdf.setPage(
            pagina
        );


        pdf.setFont(
            "helvetica",
            "normal"
        );


        pdf.setFontSize(
            8
        );


        pdf.text(
            `Página ${pagina} de ${totalPaginas}`,
            180,
            290,
            {
                align: "right"
            }
        );

    }


    /* =====================================================
       SALVAR PDF
    ===================================================== */

    pdf.save(
        `${
            ultimoRegistro.idRegistro ||
            ultimoRegistro.idVisita
        }.pdf`
    );

}

/* =========================================================
   BOTÕES DE EXPORTAÇÃO
========================================================= */

if (
    exportarExcel
) {

    exportarExcel.addEventListener(
        "click",
        exportarRegistroExcel
    );

}


if (
    exportarPdf
) {

    exportarPdf.addEventListener(
        "click",
        exportarRegistroPdf
    );

}


/* =========================================================
   LIMPAR FORMULÁRIO
========================================================= */

function limparFormulario() {

    liberarBotaoRegistrar();

    formulario.reset();

    resetarEquipamentos();


    if (
        contadorCaracteres
    ) {

        contadorCaracteres
            .textContent =
            "0";

    }


    limparErros();


    /*
       Volta a data para hoje.
    */

    definirDataAtual();


    /*
       Cidade e UF permanecem
       padronizados.
    */

    definirLocalizacaoPadrao();


    /*
       Região volta vazia até
       selecionar o bairro.
    */

    if (
        regiao
    ) {

        regiao.value =
            "";

    }


    /*
       Atualiza campos condicionais.
    */

    atualizarCampoOutraConservadora();

    atualizarCampoApoio();

    atualizarCamposProposta();

    atualizarTipoRegistro();

    atualizarStatusComercial();

    aplicarSessaoNaTela();

    if (
        oportunidadeSelecionada
    ) {
        oportunidadeSelecionada.hidden =
            true;
    }

    if (
        buscaCondominio
    ) {
        buscaCondominio.value =
            "";
    }

    if (
        resultadosCondominio
    ) {
        resultadosCondominio.hidden =
            true;
        resultadosCondominio.innerHTML =
            "";
    }

}


/* =========================================================
   VERIFICAR SE O FORMULÁRIO TEM DADOS
========================================================= */

function formularioPossuiDados() {

    const campos =
        formulario.querySelectorAll(
            "input, select, textarea"
        );


    return Array
        .from(
            campos
        )
        .some(
            campo => {


                /*
                   RADIO / CHECKBOX
                */

                if (
                    campo.type ===
                        "radio" ||
                    campo.type ===
                        "checkbox"
                ) {

                    return (
                        campo.checked
                    );

                }


                /*
                   DATA NÃO CONTA,
                   POIS JÁ VEM PREENCHIDA.
                */

                if (
                    campo.id ===
                    "dataVisita"
                ) {

                    return false;

                }


                /*
                   CIDADE E UF TAMBÉM
                   JÁ VÊM PREENCHIDOS.
                */

                if (
                    campo.id ===
                        "cidade" ||
                    campo.id ===
                        "uf"
                ) {

                    return false;

                }


                return (
                    String(
                        campo.value
                    ).trim() !== ""
                );

            }
        );

}


/* =========================================================
   BOTÃO LIMPAR DADOS
========================================================= */

if (
    btnLimparFormulario
) {

    btnLimparFormulario.addEventListener(
        "click",
        function () {


            if (
                !formularioPossuiDados()
            ) {

                limparFormulario();

                return;

            }


            const confirmar =
                window.confirm(
                    "Deseja realmente limpar todos os dados preenchidos?"
                );


            if (
                !confirmar
            ) {

                return;

            }


            limparFormulario();


            formulario.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }
    );

}

/* =========================================================
   PROTEÇÃO CONTRA DUPLO REGISTRO
========================================================= */

const botaoRegistrarVisita =
    formulario.querySelector(
        ".btn-enviar"
    );

let envioRegistroEmAndamento =
    false;


function bloquearBotaoRegistrar() {

    envioRegistroEmAndamento =
        true;

    if (!botaoRegistrarVisita) {
        return;
    }

    botaoRegistrarVisita.disabled =
        true;

    botaoRegistrarVisita
        .classList
        .add(
            "btn-enviando"
        );

    const texto =
        botaoRegistrarVisita
            .querySelector("span");

    if (texto) {
        texto.textContent =
            "Registrando...";
    }

}


function liberarBotaoRegistrar() {

    envioRegistroEmAndamento =
        false;

    if (!botaoRegistrarVisita) {
        return;
    }

    botaoRegistrarVisita.disabled =
        false;

    botaoRegistrarVisita
        .classList
        .remove(
            "btn-enviando"
        );

    const texto =
        botaoRegistrarVisita
            .querySelector("span");

    if (texto) {
        texto.textContent =
            "Registrar visita";
    }

}


/*
   Cria uma assinatura sem considerar IDs gerados,
   data/hora técnica ou latitude/longitude.

   Se os dados comerciais forem iguais, a assinatura
   será a mesma.
*/
function gerarAssinaturaRegistroLocal(
    registro
) {

    const campos = [
        "consultor",
        "perfilResponsavel",
        "filial",
        "tipoRegistro",
        "origemAtualizacao",
        "dataVisita",
        "modalidade",
        "tipoCliente",
        "natureza",
        "statusComercial",
        "motivoPerda",
        "destinoDeclinio",
        "previsaoFechamento",
        "precisaApoio",
        "apoio",
        "temProposta",
        "numeroProposta",
        "tipoContrato",
        "valorContrato",
        "margemVenda",
        "empresaConservadora",
        "outraConservadora",
        "nomeCondominio",
        "endereco",
        "bairro",
        "cidade",
        "uf",
        "regiao",
        "nomeContato",
        "telefone",
        "email",
        "observacoes"
    ];


    const base = {};

    campos.forEach(chave => {
        base[chave] =
            String(
                registro[chave] ?? ""
            )
                .trim()
                .toLowerCase();
    });


    base.equipamentos =
        Array.isArray(
            registro.equipamentos
        )
            ? registro.equipamentos.map(
                item => ({
                    tipo:
                        String(item.tipo || "")
                            .trim()
                            .toLowerCase(),

                    marca:
                        String(item.marca || "")
                            .trim()
                            .toLowerCase(),

                    quantidade:
                        Number(item.quantidade || 0),

                    paradas:
                        Number(
                            item.paradasPorEquipamento ||
                            0
                        )
                })
            )
            : [];


    const texto =
        JSON.stringify(
            base
        );


    /*
       Hash simples e determinístico apenas para
       proteção local contra clique/reenvio repetido.
    */
    let hash =
        2166136261;

    for (
        let i = 0;
        i < texto.length;
        i++
    ) {

        hash ^=
            texto.charCodeAt(i);

        hash =
            Math.imul(
                hash,
                16777619
            );

    }


    return (
        hash >>> 0
    ).toString(16);

}


function registroFoiEnviadoRecentemente(
    registro
) {

    try {

        const chave =
            gerarAssinaturaRegistroLocal(
                registro
            );

        const salvo =
            JSON.parse(
                localStorage.getItem(
                    "rjcap_ultimo_envio"
                ) ||
                "null"
            );


        if (
            !salvo ||
            salvo.chave !== chave ||
            !salvo.horario
        ) {

            return false;
        }


        /*
           Bloqueia o mesmo conteúdo por 2 minutos.
           Isso evita duplo clique, F5 ou reenvio acidental.
        */
        return (
            Date.now() -
            Number(salvo.horario)
        ) < 120000;

    } catch (erro) {

        console.warn(
            "Não foi possível verificar duplicidade local:",
            erro
        );

        return false;
    }

}


function marcarRegistroComoEnviado(
    registro
) {

    try {

        localStorage.setItem(
            "rjcap_ultimo_envio",
            JSON.stringify({
                chave:
                    gerarAssinaturaRegistroLocal(
                        registro
                    ),

                horario:
                    Date.now(),

                idRegistro:
                    registro.idRegistro ||
                    ""
            })
        );

    } catch (erro) {

        console.warn(
            "Não foi possível salvar a trava local de duplicidade:",
            erro
        );

    }

}


/* =========================================================
   ENVIO DO FORMULÁRIO
========================================================= */

formulario.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        /*
           Se o usuário clicar novamente enquanto o mesmo
           registro ainda está sendo processado, ignoramos.
        */
        if (
            envioRegistroEmAndamento
        ) {

            return;

        }


        const sessaoAtual =
            obterSessao();

        if (
            !sessaoAtual ||
            !sessaoAtual.token ||
            !sessaoAtual.vendedor
        ) {

            limparSessao();
            aplicarSessaoNaTela();

            alert(
                "Seu acesso não está ativo. Entre novamente para registrar a visita."
            );

            return;

        }


        if (
            vendedorFormulario
        ) {

            vendedorFormulario.disabled =
                false;

            vendedorFormulario.value =
                sessaoAtual.vendedor;

        }


        /* =================================================
           1. VALIDAR FORMULÁRIO
        ================================================= */

        if (
            !validarFormulario()
        ) {

            atualizarResumoErros();

            /*
               Mostra imediatamente um alerta com TODOS os campos
               que ficaram sem preencher ou possuem erro.
            */
            mostrarAlertaCamposPendentes();

            /*
               Depois do usuário fechar o alerta, a tela vai
               automaticamente ao primeiro campo que precisa
               ser corrigido.
            */
            focarPrimeiroErro();

            return;

        }


        /*
           A partir daqui o formulário está válido.
           Trava o botão para um clique não gerar dois IDs.
        */
        bloquearBotaoRegistrar();


        /* =================================================
           2. GARANTIR PADRONIZAÇÃO DA LOCALIZAÇÃO
        ================================================= */

        atualizarRegiaoPorBairro();

        definirLocalizacaoPadrao();


        /* =================================================
           3. COLETAR DADOS DO FORMULÁRIO
        ================================================= */

        const dados =
            new FormData(
                formulario
            );


        if (
            vendedorFormulario
        ) {

            vendedorFormulario.disabled =
                true;

            vendedorFormulario
                .classList
                .add(
                    "vendedor-bloqueado"
                );

        }


        const registro =
            {};


        /*
           O campo "apoio" é diferente
           dos demais porque permite
           selecionar vários checkboxes.

           Por isso ele será tratado
           separadamente.
        */

        dados.forEach(
            (valor, chave) => {

                if (
                    chave !==
                    "apoio"
                ) {

                    registro[chave] =
                        typeof valor === "string"
                            ? valor.trim()
                            : valor;

                }

            }
        );


        /*
           O responsável vem obrigatoriamente da sessão autenticada.
           Mesmo que alguém altere o HTML no navegador, o front-end
           não usa outro responsável no registro.
        */

        /*
           Compatibilidade com o Apps Script:
           visualmente usamos "Vendedor", mas o backend
           ainda recebe a propriedade "consultor".
        */
        registro.consultor =
            sessaoAtual.vendedor;

        registro.perfilResponsavel =
            sessaoAtual.perfil || "";

        registro.filial =
            sessaoAtual.filial || "5004";

        registro.nomeFilial =
            sessaoAtual.filialNome || "5004 - RJ";

        delete registro.vendedor;


        /*
           Define o fluxo antes de tratar equipamentos.
           IMPORTANTE: esta variável precisa existir antes do primeiro uso.
        */
        const registroEhRetencao =
            registro.modalidade === "Retenção" ||
            registro.tipoRegistro ===
                "Acompanhamento / Retenção de Cliente";

        /* =================================================
           EQUIPAMENTOS

           No fluxo normal, coleta os equipamentos.
           Na Retenção, equipamentos não fazem parte do fluxo.
        ================================================= */

        registro.equipamentos =
            registroEhRetencao
                ? []
                : obterEquipamentos();

        registro.quantidadeEquipamentos =
            registro.equipamentos.reduce(
                (total, item) =>
                    total + Number(item.quantidade || 0),
                0
            );

        registro.quantidadeParadas =
            registro.equipamentos.reduce(
                (total, item) =>
                    total + Number(item.totalParadas || 0),
                0
            );

        registro.tipoEquipamento =
            [
                ...new Set(
                    registro.equipamentos
                        .map(item => item.tipo)
                        .filter(Boolean)
                )
            ].join(" / ");

        registro.marca =
            [
                ...new Set(
                    registro.equipamentos
                        .map(item => item.marca)
                        .filter(Boolean)
                )
            ].join(" / ");


        /* =================================================
           4. APOIOS SELECIONADOS
        ================================================= */

        const apoiosSelecionados =
            dados.getAll(
                "apoio"
            );


        const precisaApoioSelecionado =
            document.querySelector(
                'input[name="precisaApoio"]:checked'
            );


        registro.precisaApoio =
            precisaApoioSelecionado
                ? precisaApoioSelecionado.value
                : "";


        if (
            registro.precisaApoio ===
            "Sim"
        ) {

            registro.apoio =
                apoiosSelecionados.join(
                    ", "
                );

        } else {

            registro.apoio =
                "Não necessita";

        }


        /* =================================================
           5. EMPRESA CONSERVADORA
        ================================================= */

        if (
            registro.empresaConservadora ===
            "Outros"
        ) {

            registro.empresaConservadora =
                outraConservadora
                    ? outraConservadora.value.trim()
                    : "";

        }


        /*
           Não precisamos enviar
           "outraConservadora" como
           coluna separada.
        */

        delete registro
            .outraConservadora;


        /* =================================================
           6. LOCALIZAÇÃO PADRONIZADA
        ================================================= */

        registro.endereco =
            registro.endereco
                ? registro.endereco.trim()
                : "";


        registro.bairro =
            bairro
                ? bairro.value.trim()
                : "";


        registro.cidade =
            "Rio de Janeiro";


        registro.uf =
            "RJ";


        registro.regiao =
            descobrirRegiao(
                registro.bairro
            );


        if (
            regiao
        ) {

            regiao.value =
                registro.regiao;

        }


        /*
           Endereço completo.
           Pode ser usado futuramente
           para geolocalização.
        */

        registro.enderecoCompleto =
            montarEnderecoCompleto(
                registro
            );


        /* =================================================
           7. NOVOS CAMPOS COMERCIAIS
        ================================================= */

        registro.temProposta =
            registro.temProposta ||
            "";


        /*
           SE JÁ EXISTE PROPOSTA
        */

        if (
            registro.temProposta ===
            "Sim"
        ) {

            registro.tipoContrato =
                registro.tipoContrato ||
                "";

            registro.valorContrato =
                registro.valorContrato ||
                "";

            registro.margemVenda =
                registro.margemVenda ||
                "";

            registro.numeroProposta =
                registro.numeroProposta ||
                "";

        } else {

            /*
               SE NÃO EXISTE PROPOSTA,
               SALVA AUTOMATICAMENTE
               "Sem Proposta".
            */

            registro.tipoContrato =
                "";

            registro.valorContrato =
                "";

            registro.margemVenda =
                "";

            registro.numeroProposta =
                "Sem Proposta";

        }


        /*
           OPORTUNIDADE
        */

        const ehRetencao =
            registroEhRetencao;

        if (ehRetencao) {

            /*
               Retenção é uma visita de relacionamento,
               não uma nova oportunidade comercial.
            */
            registro.idOportunidade = "";

        } else if (
            registro.tipoRegistro ===
            "Atualização da Oportunidade Existente"
        ) {

            registro.idOportunidade =
                (
                    registro.idOportunidadeExistente ||
                    ""
                ).trim();

        } else {

            registro.idOportunidade =
                gerarIdOportunidade();

        }


        /*
           O campo usado só para selecionar
           uma oportunidade existente não
           precisa virar coluna separada.
        */

        delete registro
            .idOportunidadeExistente;


        /*
           STATUS COMERCIAL
        */

        registro.statusComercial =
            registro.statusComercial ||
            "";


        /*
           MOTIVO DA PERDA

           Se o status não for Perda,
           salva "Não se aplica".
        */

        registro.motivoPerda =
            registro.statusComercial ===
            "Perda"
                ? (
                    registro.motivoPerda ||
                    ""
                )
                : "Não se aplica";


        /*
           DESTINO DO CASO

           Só faz sentido quando:
           Status = Perda
           Motivo = Sem suporte técnico
        */

        if (
            registro.statusComercial ===
                "Perda" &&
            registro.motivoPerda ===
                "Sem suporte técnico"
        ) {

            registro.destinoDeclinio =
                registro.destinoDeclinio ||
                "";

        } else {

            registro.destinoDeclinio =
                "Não se aplica";

        }


        /*
           PREVISÃO DE FECHAMENTO

           Quando já foi Assinado ou
           houve Perda, não existe mais
           previsão futura.
        */

        registro.previsaoFechamento =
            registro.previsaoFechamento || "";


        /*
           OBS / MOTIVO COMERCIAL
        */

        registro.obsMotivo =
            registro.obsMotivo ||
            "";


        /* =================================================
           8. ORIGEM + IDS DO REGISTRO / VISITA
        ================================================= */

        const ehNovaOportunidade =
            registro.tipoRegistro ===
            "Nova Oportunidade (Primeira Visita ao Cliente)";

        if (ehNovaOportunidade) {

            /*
               A primeira oportunidade sempre nasce
               de uma primeira visita presencial.
            */
            registro.origemAtualizacao =
                "Presencial";

        } else {

            registro.origemAtualizacao =
                registro.origemAtualizacao ||
                "";

        }


        /*
           TODO lançamento gera ID do Registro.
        */
        registro.idRegistro =
            gerarIdRegistro();


        /*
           ID da Visita só existe quando houve
           presença física no cliente.
        */
        const houveVisitaPresencial =
            ehRetencao ||
            ehNovaOportunidade ||
            registro.origemAtualizacao ===
                "Presencial";

        registro.idVisita =
            houveVisitaPresencial
                ? gerarIdVisita()
                : "";


        /* =================================================
           9. DATA/HORA DO REGISTRO
        ================================================= */

        registro.dataHoraRegistro =
            new Date()
                .toLocaleString(
                    "pt-BR",
                    {
                        timeZone:
                            "America/Sao_Paulo"
                    }
                );


        /* =================================================
           10. CÓPIA DE SEGURANÇA LOCAL
        ================================================= */

        adicionarPendente(
            registro
        );


        const copiaSalva =
            obterPendentes()
                .some(
                    item =>
                        item.idVisita ===
                        registro.idVisita
                );


        if (
            !copiaSalva
        ) {

            alert(
                "Não foi possível criar a cópia de segurança deste registro.\n\n" +
                "Não feche a página e tente novamente."
            );

            return;

        }


        /* =================================================
           11. GUARDAR ÚLTIMO REGISTRO
        ================================================= */

        ultimoRegistro = {
            ...registro
        };


        /* =================================================
           12. MOSTRAR IDS GERADOS
        ================================================= */

        if (
            idRegistroGerado
        ) {

            idRegistroGerado
                .textContent =
                registro.idRegistro;

        }


        if (
            idVisitaGerado
        ) {

            idVisitaGerado
                .textContent =
                registro.idVisita ||
                "—";

        }


        if (
            boxIdVisitaGerado
        ) {

            boxIdVisitaGerado.hidden =
                !registro.idVisita;

        }


        if (
            tituloModalSucesso
        ) {

            tituloModalSucesso.textContent =
                registroEhRetencao
                    ? "Visita de retenção registrada!"
                    : (
                        registro.idVisita
                            ? "Visita registrada!"
                            : "Atualização registrada!"
                    );

        }


        if (
            textoModalSucesso
        ) {

            textoModalSucesso.textContent =
                registroEhRetencao
                    ? "A visita de retenção foi enviada para registro com sucesso."
                    : (
                        registro.idVisita
                            ? "A visita foi enviada para registro com sucesso."
                            : "A atualização foi enviada para registro com sucesso."
                    );

        }


        if (
            idOportunidadeGerado
        ) {

            idOportunidadeGerado
                .textContent =
                registro.idOportunidade ||
                "Não se aplica";

        }


        /* =================================================
           13. CONFERÊNCIA NO CONSOLE
        ================================================= */

        console.log(
            "Registro que será enviado:",
            registro
        );


        console.log(
            "Localização:",
            {
                endereco:
                    registro.endereco,

                bairro:
                    registro.bairro,

                cidade:
                    registro.cidade,

                uf:
                    registro.uf,

                regiao:
                    registro.regiao,

                enderecoCompleto:
                    registro.enderecoCompleto
            }
        );


        /* =================================================
           14. EVITAR REENVIO DO MESMO CONTEÚDO
        ================================================= */

        if (
            registroFoiEnviadoRecentemente(
                registro
            )
        ) {

            liberarBotaoRegistrar();

            alert(
                "Este mesmo registro já foi enviado há poucos instantes.\n\n" +
                "Para evitar uma linha duplicada na planilha, o novo envio foi bloqueado."
            );

            return;
        }


        /* =================================================
           15. ENVIAR PARA GOOGLE SHEETS
        ================================================= */

        try {

            await enviarParaGoogleSheets(
                registro
            );

            /*
               Marca localmente somente depois que o envio
               foi disparado sem erro.
            */
            marcarRegistroComoEnviado(
                registro
            );

        } catch (erro) {

            console.error(
                "Falha no envio para o Google Sheets:",
                erro
            );


            /*
               Houve falha real no disparo: libera nova tentativa.
            */
            liberarBotaoRegistrar();


            if (
                erro.message ===
                "SEM_INTERNET"
            ) {

                alert(
                    "Você está sem internet.\n\n" +
                    "A visita foi salva com segurança neste aparelho, " +
                    "mas ainda não foi enviada para a planilha.\n\n" +
                    "Não limpe os dados do navegador."
                );

            } else if (
                erro.message ===
                "SESSAO_INVALIDA"
            ) {

                alert(
                    "Sua sessão expirou.\n\n" +
                    "Entre novamente no sistema e tente registrar a visita."
                );

            } else {

                alert(
                    "Não foi possível enviar a visita agora.\n\n" +
                    "Uma cópia foi salva neste aparelho para evitar " +
                    "a perda dos dados."
                );

            }


            return;

        }


        /* =================================================
           15. ABRIR MODAL DE SUCESSO
        ================================================= */

        if (
            modalSucesso
        ) {

            modalSucesso
                .classList
                .add(
                    "ativo"
                );

        }

    }
);

/* =========================================================
   FECHAR MODAL E LIMPAR FORMULÁRIO
========================================================= */

function fecharModalELimpar() {

    /*
       Novo registro = libera o botão novamente.
    */
    liberarBotaoRegistrar();


    if (
        modalSucesso
    ) {

        modalSucesso
            .classList
            .remove(
                "ativo"
            );

    }


    /* LIMPA O FORMULÁRIO SEM ENCERRAR A SESSÃO */

    limparFormulario();


    /* LIMPA O ÚLTIMO REGISTRO */

    ultimoRegistro =
        null;


    /* LIMPA OS IDS EXIBIDOS NO MODAL */

    if (
        idRegistroGerado
    ) {

        idRegistroGerado
            .textContent =
            "—";

    }


    if (
        idVisitaGerado
    ) {

        idVisitaGerado
            .textContent =
            "—";

    }


    if (
        boxIdVisitaGerado
    ) {

        boxIdVisitaGerado.hidden =
            false;

    }


    if (
        idOportunidadeGerado
    ) {

        idOportunidadeGerado
            .textContent =
            "—";

    }


    /* MANTÉM O VENDEDOR LOGADO */

    aplicarSessaoNaTela();


    /* VOLTA AO TOPO */

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   X DO MODAL
========================================================= */

if (
    fecharModal
) {

    fecharModal.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();

            fecharModalELimpar();

        }
    );

}


/* =========================================================
   CLICAR FORA DO MODAL
========================================================= */

if (
    modalSucesso
) {

    modalSucesso.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                modalSucesso
            ) {

                fecharModalELimpar();

            }

        }
    );

}


/* =========================================================
   BOTÃO NOVA VISITA
========================================================= */

if (
    novaVisita
) {

    novaVisita.addEventListener(
        "click",
        function () {

            limparFormulario();


            ultimoRegistro =
                null;


            if (
                idRegistroGerado
            ) {

                idRegistroGerado
                    .textContent =
                    "—";

            }


            if (
                idVisitaGerado
            ) {

                idVisitaGerado
                    .textContent =
                    "—";

            }


            if (
                boxIdVisitaGerado
            ) {

                boxIdVisitaGerado.hidden =
                    false;

            }


            if (
                idOportunidadeGerado
            ) {

                idOportunidadeGerado
                    .textContent =
                    "—";

            }


            if (
                modalSucesso
            ) {

                modalSucesso
                    .classList
                    .remove(
                        "ativo"
                    );

            }


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}


/* =========================================================
   REMOVER ERRO AO DIGITAR
========================================================= */

formulario.addEventListener(
    "input",
    function (event) {

        removerErroDoCampo(
            event.target
        );

    }
);


/* =========================================================
   REMOVER ERRO AO ALTERAR
========================================================= */

formulario.addEventListener(
    "change",
    function (event) {

        removerErroDoCampo(
            event.target
        );

    }
);


/* =========================================================
   CAMPO DE BAIRRO PESQUISÁVEL
========================================================= */

function normalizarTexto(
    texto
) {

    return String(
        texto || ""
    )
        .normalize(
            "NFD"
        )
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase()
        .trim();

}


/* =========================================================
   CRIAR LISTA VISUAL DOS BAIRROS
========================================================= */

function criarSeletorBairros() {

    if (
        !bairro
    ) {

        return;

    }


    const campoContainer =
        bairro.closest(
            ".campo"
        );


    if (
        !campoContainer
    ) {

        return;

    }


    if (
        document.getElementById(
            "listaBairrosPersonalizada"
        )
    ) {

        return;

    }


    const lista =
        document.createElement(
            "div"
        );


    lista.id =
        "listaBairrosPersonalizada";


    lista.className =
        "lista-bairros-personalizada";


    lista.hidden =
        true;


    campoContainer.appendChild(
        lista
    );


    function mostrarBairros(
        filtro = ""
    ) {

        lista.innerHTML =
            "";


        const textoFiltro =
            normalizarTexto(
                filtro
            );


        const bairrosFiltrados =
            listaBairros.filter(
                nomeBairro => {

                    return normalizarTexto(
                        nomeBairro
                    ).includes(
                        textoFiltro
                    );

                }
            );


        if (
            bairrosFiltrados.length ===
            0
        ) {

            const vazio =
                document.createElement(
                    "div"
                );


            vazio.className =
                "bairro-sem-resultado";


            vazio.textContent =
                "Nenhum bairro encontrado";


            lista.appendChild(
                vazio
            );


            lista.hidden =
                false;


            return;

        }


        bairrosFiltrados
            .forEach(
                nomeBairro => {

                    const item =
                        document.createElement(
                            "button"
                        );


                    item.type =
                        "button";


                    item.className =
                        "item-bairro";


                    item.textContent =
                        nomeBairro;


                    item.addEventListener(
                        "click",
                        function () {

                            bairro.value =
                                nomeBairro;


                            lista.hidden =
                                true;


                            atualizarRegiaoPorBairro();


                            removerErroDoCampo(
                                bairro
                            );


                            bairro.dispatchEvent(
                                new Event(
                                    "change",
                                    {
                                        bubbles: true
                                    }
                                )
                            );

                        }
                    );


                    lista.appendChild(
                        item
                    );

                }
            );


        lista.hidden =
            false;

    }


    bairro.addEventListener(
        "focus",
        function () {

            mostrarBairros(
                this.value
            );

        }
    );


    bairro.addEventListener(
        "input",
        function () {

            mostrarBairros(
                this.value
            );


            atualizarRegiaoPorBairro();

        }
    );


    document.addEventListener(
        "click",
        function (event) {

            if (
                !campoContainer.contains(
                    event.target
                )
            ) {

                lista.hidden =
                    true;

            }

        }
    );

}


/* =========================================================
   INICIAR SELETOR DE BAIRROS
========================================================= */

criarSeletorBairros();

/* =========================================================
   GARANTIR LOCALIZAÇÃO PADRONIZADA
========================================================= */

function garantirLocalizacaoPadronizada() {

    definirLocalizacaoPadrao();


    if (
        bairro &&
        bairro.value
    ) {

        const encontrado =
            listaBairros.find(
                item =>
                    normalizarTexto(
                        item
                    ) ===
                    normalizarTexto(
                        bairro.value
                    )
            );


        if (
            encontrado
        ) {

            bairro.value =
                encontrado;

        }

    }


    atualizarRegiaoPorBairro();

}


/* =========================================================
   CORRIGIR CIDADE E UF SE FOREM ALTERADOS
========================================================= */

if (
    cidade
) {

    cidade.addEventListener(
        "input",
        function () {

            this.value =
                "Rio de Janeiro";

        }
    );

}


if (
    uf
) {

    uf.addEventListener(
        "input",
        function () {

            this.value =
                "RJ";

        }
    );

}


/* =========================================================
   INICIALIZAÇÃO DO SISTEMA
========================================================= */

function inicializarFormulario() {

    /* DATA */

    definirDataAtual();


    /* LOCALIZAÇÃO */

    definirLocalizacaoPadrao();


    if (
        regiao &&
        !bairro?.value
    ) {

        regiao.value =
            "";

    }


    /* CONSERVADORA */

    atualizarCampoOutraConservadora();


    /* APOIO */

    atualizarCampoApoio();


    /* PROPOSTA */

    atualizarCamposProposta();


    /* TIPO DE REGISTRO */

    atualizarTipoRegistro();


    /* STATUS COMERCIAL */

    atualizarStatusComercial();


    console.log(
        "RJCAP - Formulário inicializado."
    );


    console.log(
        `Bairros disponíveis: ${listaBairros.length}`
    );

}


/* =========================================================
   EXECUTAR INICIALIZAÇÃO
========================================================= */

inicializarFormulario();


/* =========================================================
   FIM DO SCRIPT
========================================================= */
