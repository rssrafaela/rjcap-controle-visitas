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

const bairro =
    document.getElementById("bairro");

const cidade =
    document.getElementById("cidade");

const uf =
    document.getElementById("uf");

const regiao =
    document.getElementById("regiao");


/* =========================================================
   ÚLTIMO REGISTRO
========================================================= */

let ultimoRegistro = null;


/* =========================================================
   GOOGLE SHEETS
========================================================= */

const URL_GOOGLE_SHEETS =
    "https://script.google.com/macros/s/AKfycbzuILbvHjE_eZGbU-uMKm5xrg5Dgj0Fe2AMruSqeJ8-zSi1CfGss25yirURW8i1gu7FMg/exec";


async function enviarParaGoogleSheets(registro) {

    if (!navigator.onLine) {

        throw new Error("SEM_INTERNET");

    }

    await fetch(
        URL_GOOGLE_SHEETS,
        {
            method: "POST",

            mode: "no-cors",

            headers: {
                "Content-Type":
                    "text/plain;charset=utf-8"
            },

            body:
                JSON.stringify(registro)
        }
    );

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
                item.idVisita ===
                registro.idVisita
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

const listaBairros = Object
    .values(bairrosPorRegiao)
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

function descobrirRegiao(bairroSelecionado) {

    if (!bairroSelecionado) {
        return "";
    }

    for (
        const [nomeRegiao, bairros]
        of Object.entries(bairrosPorRegiao)
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


if (bairro) {

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

    if (cidade) {

        cidade.value =
            "Rio de Janeiro";

    }

    if (uf) {

        uf.value =
            "RJ";

    }

}


definirLocalizacaoPadrao();


/* =========================================================
   ERROS DO FORMULÁRIO
========================================================= */

function limparErros() {

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

    /*
       PADRONIZA A ESCRITA.

       Exemplo:
       se alguém digitar "olaria",
       o sistema transforma em "Olaria".
    */

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

    let valido =
        true;


    /* CAMPOS OBRIGATÓRIOS */

    const campos =
        formulario.querySelectorAll(
            "input:not([type='radio']):not([type='checkbox']), select, textarea"
        );

    campos.forEach(
        campo => {

            if (
                campo.hasAttribute(
                    "required"
                ) &&
                !String(
                    campo.value
                ).trim()
            ) {

                mostrarErro(
                    campo,
                    "Este campo é obrigatório."
                );

                valido =
                    false;

            }

        }
    );


    /* MODALIDADE DE NEGÓCIOS */

    if (
        !validarRadio(
            "modalidade",
            "Selecione uma modalidade de negócios."
        )
    ) {

        valido =
            false;

    }


    /* NATUREZA DA VISITA */

    if (
        !validarRadio(
            "natureza",
            "Selecione a natureza da visita."
        )
    ) {

        valido =
            false;

    }


    /* PRECISA DE APOIO */

    if (
        !validarRadio(
            "precisaApoio",
            "Informe se precisa de apoio."
        )
    ) {

        valido =
            false;

    }


    /* SE PRECISA DE APOIO, EXIGE PELO MENOS UM */

    const precisaApoio =
        document.querySelector(
            'input[name="precisaApoio"]:checked'
        );

    if (
        precisaApoio &&
        precisaApoio.value === "Sim"
    ) {

        const apoioSelecionado =
            document.querySelector(
                'input[name="apoio"]:checked'
            );

        if (!apoioSelecionado) {

            const primeiroApoio =
                document.querySelector(
                    'input[name="apoio"]'
                );

            mostrarErro(
                primeiroApoio,
                "Selecione pelo menos um tipo de apoio."
            );

            valido =
                false;

        }

    }


    /* MARCA */

    if (
        !validarRadio(
            "marca",
            "Selecione a marca."
        )
    ) {

        valido =
            false;

    }


    /* TIPO DE EQUIPAMENTO */

    if (
        !validarRadio(
            "tipoEquipamento",
            "Selecione o tipo de equipamento."
        )
    ) {

        valido =
            false;

    }


    /* BAIRRO */

    if (
        !validarBairro()
    ) {

        valido =
            false;

    }


    /* EMAIL */

    const email =
        document.getElementById(
            "email"
        );

    if (
        email &&
        email.value.trim()
    ) {

        const regexEmail =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            !regexEmail.test(
                email.value
            )
        ) {

            mostrarErro(
                email,
                "Informe um e-mail válido."
            );

            valido =
                false;

        }

    }


    /* TELEFONE */

    if (
        telefone &&
        telefone.value
    ) {

        const numeros =
            telefone.value.replace(
                /\D/g,
                ""
            );

        if (
            numeros.length < 10
        ) {

            mostrarErro(
                telefone,
                "Informe um telefone válido com DDD."
            );

            valido =
                false;

        }

    }


    /* VALOR DO CONTRATO */

    if (
        valorContrato &&
        valorContrato.value ===
        "0,00"
    ) {

        mostrarErro(
            valorContrato,
            "Informe um valor de contrato maior que zero."
        );

        valido =
            false;

    }


    /* MARGEM DE VENDA */

    if (
        margemVenda &&
        margemVenda.value !== "" &&
        Number(
            String(
                margemVenda.value
            ).replace(
                ",",
                "."
            )
        ) < 0
    ) {

        mostrarErro(
            margemVenda,
            "Informe uma margem válida."
        );

        valido =
            false;

    }


    return valido;

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
   FORMATAR ENDEREÇO COMPLETO
========================================================= */

function montarEnderecoCompleto(registro) {

    const partes = [];

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
        partes.join(", ");


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

        "ID da Visita":
            registro.idVisita,

        "Data da Visita":
            registro.dataVisita,

        "Consultor":
            registro.consultor,

        "Modalidade de Negócios":
            registro.modalidade,

        "Natureza da Visita":
            registro.natureza,

        "Precisa de Apoio":
            registro.precisaApoio,

        "Apoio":
            registro.apoio,

        "Tipo de Contrato":
            registro.tipoContrato,

        "Valor do Contrato":
            `R$ ${registro.valorContrato}`,

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

        "Observações":
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
        `${ultimoRegistro.idVisita}.xlsx`
    );

}


/* =========================================================
   EXPORTAR REGISTRO PARA PDF
========================================================= */

function exportarRegistroPdf() {

    if (!ultimoRegistro) {

        alert(
            "Registre uma visita antes de exportar."
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


    let y =
        20;


    /* -----------------------------
       TÍTULO
    ----------------------------- */

    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.setFontSize(
        18
    );

    pdf.text(
        "RJCAP - Registro de Visita Comercial",
        15,
        y
    );


    y +=
        10;


    /* -----------------------------
       ID
    ----------------------------- */

    pdf.setFontSize(
        10
    );

    pdf.setFont(
        "helvetica",
        "normal"
    );


    pdf.text(
        `ID: ${ultimoRegistro.idVisita}`,
        15,
        y
    );


    y +=
        12;


    /* -----------------------------
       DADOS
    ----------------------------- */

    Object.entries(
        dados
    ).forEach(
        ([rotulo, valor]) => {


            /*
               O ID já apareceu
               no cabeçalho.
            */

            if (
                rotulo ===
                "ID da Visita"
            ) {

                return;

            }


            const valorTexto =
                String(
                    valor ?? ""
                );


            const valorLinhas =
                pdf.splitTextToSize(
                    valorTexto,
                    115
                );


            /*
               Cria nova página
               quando necessário.
            */

            if (
                y +
                valorLinhas.length * 6 >
                282
            ) {

                pdf.addPage();

                y =
                    20;

            }


            /* RÓTULO */

            pdf.setFont(
                "helvetica",
                "bold"
            );


            pdf.text(
                `${rotulo}:`,
                15,
                y
            );


            /* VALOR */

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
                    valorLinhas.length * 6
                );

        }
    );


    pdf.save(
        `${ultimoRegistro.idVisita}.pdf`
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

    formulario.reset();


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
   ENVIO DO FORMULÁRIO
========================================================= */

formulario.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        /* =================================================
           1. VALIDAR FORMULÁRIO
        ================================================= */

        if (
            !validarFormulario()
        ) {

            const primeiroErro =
                document.querySelector(
                    ".campo-erro"
                );


            if (
                primeiroErro
            ) {

                primeiroErro
                    .scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

            }


            return;

        }


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


        /* =================================================
           4. APOIOS SELECIONADOS
        ================================================= */

        const apoiosSelecionados =
            dados.getAll(
                "apoio"
            );


        if (
            registro.precisaApoio ===
            "Sim"
        ) {

            registro.apoio =
                apoiosSelecionados
                    .join(
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
            regiao
                ? regiao.value.trim()
                : descobrirRegiao(
                    registro.bairro
                );


        /*
           Criei endereço completo.
           Isso pode ser útil futuramente
           no Power BI para geolocalização.
        */

        registro.enderecoCompleto =
            montarEnderecoCompleto(
                registro
            );


        /* =================================================
           7. NOVOS CAMPOS COMERCIAIS
        ================================================= */

        registro.tipoContrato =
            registro.tipoContrato ||
            "";


        registro.margemVenda =
            registro.margemVenda ||
            "";


        registro.numeroProposta =
            registro.numeroProposta ||
            "";


        /* =================================================
           8. GERAR ID ÚNICO
        ================================================= */

        registro.idVisita =
            gerarIdVisita();


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
           12. MOSTRAR ID GERADO
        ================================================= */

        if (
            idVisitaGerado
        ) {

            idVisitaGerado
                .textContent =
                registro.idVisita;

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
           14. ENVIAR PARA GOOGLE SHEETS
        ================================================= */

        try {

            await enviarParaGoogleSheets(
                registro
            );

        } catch (erro) {

            console.error(
                "Falha no envio para o Google Sheets:",
                erro
            );


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

    if (
        modalSucesso
    ) {

        modalSucesso
            .classList
            .remove(
                "ativo"
            );

    }


    /* RESET */

    formulario.reset();


    /* =====================================================
       LIMPAR CAMPOS
    ===================================================== */

    formulario
        .querySelectorAll(
            "input, select, textarea"
        )
        .forEach(
            campo => {


                /*
                   DATA SERÁ DEFINIDA
                   NOVAMENTE DEPOIS.
                */

                if (
                    campo ===
                    dataVisita
                ) {

                    return;

                }


                /*
                   RADIO E CHECKBOX
                */

                if (
                    campo.type ===
                        "radio" ||
                    campo.type ===
                        "checkbox"
                ) {

                    campo.checked =
                        false;

                } else {

                    campo.value =
                        "";

                }

            }
        );


    /* =====================================================
       OBSERVAÇÕES
    ===================================================== */

    if (
        observacoes
    ) {

        observacoes.value =
            "";

    }


    if (
        contadorCaracteres
    ) {

        contadorCaracteres
            .textContent =
            "0";

    }


    /* =====================================================
       EMPRESA CONSERVADORA
    ===================================================== */

    if (
        empresaConservadora
    ) {

        empresaConservadora
            .selectedIndex =
            0;

    }


    if (
        outraConservadora
    ) {

        outraConservadora.value =
            "";

        outraConservadora.required =
            false;

    }


    if (
        campoOutraConservadora
    ) {

        campoOutraConservadora.hidden =
            true;

    }


    /* =====================================================
       APOIO
    ===================================================== */

    if (
        campoApoios
    ) {

        campoApoios.hidden =
            true;

    }


    checkboxesApoio
        .forEach(
            checkbox => {

                checkbox.checked =
                    false;

            }
        );


    /* =====================================================
       LOCALIZAÇÃO
    ===================================================== */

    if (
        bairro
    ) {

        bairro.value =
            "";

    }


    if (
        regiao
    ) {

        regiao.value =
            "";

    }


    /*
       Cidade e UF voltam
       automaticamente.
    */

    definirLocalizacaoPadrao();


    /* =====================================================
       DATA
    ===================================================== */

    definirDataAtual();


    /* =====================================================
       ERROS
    ===================================================== */

    limparErros();


    /* =====================================================
       ÚLTIMO REGISTRO
    ===================================================== */

    ultimoRegistro =
        null;


    /* =====================================================
       ID DO MODAL
    ===================================================== */

    if (
        idVisitaGerado
    ) {

        idVisitaGerado
            .textContent =
            "—";

    }


    /* =====================================================
       VOLTAR AO TOPO
    ===================================================== */

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
                idVisitaGerado
            ) {

                idVisitaGerado
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

function normalizarTexto(texto) {

    return String(texto || "")
        .normalize("NFD")
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

    if (!bairro) {
        return;
    }


    /* -----------------------------------------
       CONTAINER DO CAMPO
    ----------------------------------------- */

    const campoContainer =
        bairro.closest(
            ".campo"
        );


    if (!campoContainer) {
        return;
    }


    /* -----------------------------------------
       EVITAR CRIAR DUAS VEZES
    ----------------------------------------- */

    const listaExistente =
        campoContainer.querySelector(
            ".lista-bairros"
        );


    if (listaExistente) {

        listaExistente.remove();

    }


    /* -----------------------------------------
       CONFIGURAR INPUT
    ----------------------------------------- */

    bairro.setAttribute(
        "autocomplete",
        "off"
    );


    bairro.setAttribute(
        "placeholder",
        "Digite ou selecione o bairro..."
    );


    /* -----------------------------------------
       CRIAR LISTA
    ----------------------------------------- */

    const lista =
        document.createElement(
            "div"
        );


    lista.className =
        "lista-bairros";


    lista.hidden =
        true;


    campoContainer.style.position =
        "relative";


    campoContainer.appendChild(
        lista
    );


    /* =====================================================
       MOSTRAR BAIRROS
    ===================================================== */

    function mostrarBairros(
        filtro = ""
    ) {

        lista.innerHTML =
            "";


        const textoFiltro =
            normalizarTexto(
                filtro
            );


        const resultados =
            listaBairros.filter(
                nomeBairro => {

                    const nomeNormalizado =
                        normalizarTexto(
                            nomeBairro
                        );


                    return (
                        nomeNormalizado.includes(
                            textoFiltro
                        )
                    );

                }
            );


        /* -----------------------------------------
           NENHUM RESULTADO
        ----------------------------------------- */

        if (
            resultados.length === 0
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


        /* -----------------------------------------
           CRIAR OPÇÕES
        ----------------------------------------- */

        resultados.forEach(
            nomeBairro => {

                const opcao =
                    document.createElement(
                        "button"
                    );


                opcao.type =
                    "button";


                opcao.className =
                    "opcao-bairro";


                opcao.textContent =
                    nomeBairro;


                opcao.addEventListener(
                    "mousedown",
                    function (event) {

                        /*
                           Evita que o input perca
                           o foco antes da seleção.
                        */

                        event.preventDefault();

                    }
                );


                opcao.addEventListener(
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


                        /*
                           Dispara evento change
                           para manter o restante
                           do formulário sincronizado.
                        */

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
                    opcao
                );

            }
        );


        lista.hidden =
            false;

    }


    /* =====================================================
       AO CLICAR NO CAMPO
    ===================================================== */

    bairro.addEventListener(
        "focus",
        function () {

            mostrarBairros(
                this.value
            );

        }
    );


    /* =====================================================
       AO DIGITAR
    ===================================================== */

    bairro.addEventListener(
        "input",
        function () {

            /*
               Enquanto estiver digitando,
               a região fica vazia até
               encontrarmos um bairro válido.
            */

            const textoDigitado =
                this.value.trim();


            const bairroExato =
                listaBairros.find(
                    item =>
                        normalizarTexto(
                            item
                        ) ===
                        normalizarTexto(
                            textoDigitado
                        )
                );


            if (
                bairroExato
            ) {

                this.value =
                    bairroExato;


                atualizarRegiaoPorBairro();

            } else {

                if (
                    regiao
                ) {

                    regiao.value =
                        "";

                }

            }


            mostrarBairros(
                textoDigitado
            );

        }
    );


    /* =====================================================
       SETA PARA BAIXO
    ===================================================== */

    bairro.addEventListener(
        "keydown",
        function (event) {

            const opcoes =
                Array.from(
                    lista.querySelectorAll(
                        ".opcao-bairro"
                    )
                );


            if (
                opcoes.length === 0
            ) {

                return;

            }


            let indiceAtual =
                opcoes.findIndex(
                    opcao =>
                        opcao.classList.contains(
                            "ativo"
                        )
                );


            /* -----------------------------------------
               SETA PARA BAIXO
            ----------------------------------------- */

            if (
                event.key ===
                "ArrowDown"
            ) {

                event.preventDefault();


                indiceAtual++;


                if (
                    indiceAtual >=
                    opcoes.length
                ) {

                    indiceAtual =
                        0;

                }


                destacarOpcao(
                    opcoes,
                    indiceAtual
                );

            }


            /* -----------------------------------------
               SETA PARA CIMA
            ----------------------------------------- */

            if (
                event.key ===
                "ArrowUp"
            ) {

                event.preventDefault();


                indiceAtual--;


                if (
                    indiceAtual < 0
                ) {

                    indiceAtual =
                        opcoes.length - 1;

                }


                destacarOpcao(
                    opcoes,
                    indiceAtual
                );

            }


            /* -----------------------------------------
               ENTER
            ----------------------------------------- */

            if (
                event.key ===
                "Enter"
            ) {

                const ativa =
                    lista.querySelector(
                        ".opcao-bairro.ativo"
                    );


                if (
                    ativa &&
                    !lista.hidden
                ) {

                    event.preventDefault();

                    ativa.click();

                }

            }


            /* -----------------------------------------
               ESC
            ----------------------------------------- */

            if (
                event.key ===
                "Escape"
            ) {

                lista.hidden =
                    true;

            }

        }
    );


    /* =====================================================
       DESTACAR OPÇÃO COM TECLADO
    ===================================================== */

    function destacarOpcao(
        opcoes,
        indice
    ) {

        opcoes.forEach(
            opcao =>
                opcao.classList.remove(
                    "ativo"
                )
        );


        const selecionada =
            opcoes[indice];


        if (
            selecionada
        ) {

            selecionada.classList.add(
                "ativo"
            );


            selecionada.scrollIntoView({
                block: "nearest"
            });

        }

    }


    /* =====================================================
       FECHAR LISTA AO CLICAR FORA
    ===================================================== */

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


    /* =====================================================
       AO SAIR DO CAMPO
    ===================================================== */

    bairro.addEventListener(
        "blur",
        function () {

            const textoDigitado =
                this.value.trim();


            if (
                !textoDigitado
            ) {

                if (
                    regiao
                ) {

                    regiao.value =
                        "";

                }


                return;

            }


            /*
               Procura ignorando
               maiúsculas e acentos.
            */

            const encontrado =
                listaBairros.find(
                    item =>
                        normalizarTexto(
                            item
                        ) ===
                        normalizarTexto(
                            textoDigitado
                        )
                );


            if (
                encontrado
            ) {

                /*
                   Padroniza o nome.
                   Exemplo:
                   "OLARIA" vira "Olaria".
                */

                this.value =
                    encontrado;


                atualizarRegiaoPorBairro();

            }

        }
    );

}


/* =========================================================
   GARANTIR LOCALIZAÇÃO ANTES DO ENVIO
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


    /* BAIRROS */

    criarSeletorBairros();


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
