const formulario = document.getElementById("formVisita");

const telefone = document.getElementById("telefone");
const valorContrato = document.getElementById("valorContrato");

const observacoes = document.getElementById("observacoes");
const contadorCaracteres = document.getElementById("contadorCaracteres");

const modalSucesso = document.getElementById("modalSucesso");
const fecharModal = document.getElementById("fecharModal");
const novaVisita = document.getElementById("novaVisita");

const btnLimparFormulario =
    document.getElementById("btnLimparFormulario");

const dataVisita = document.getElementById("dataVisita");

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


/* ========================================
   ÚLTIMO REGISTRO REALIZADO
======================================== */

let ultimoRegistro = null;

/* ========================================
   SEGURANÇA LOCAL DOS REGISTROS
======================================== */

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
            "Erro ao salvar registro local:",
            erro
        );

        return false;

    }

}


function adicionarPendente(registro) {

    const pendentes =
        obterPendentes();

    const jaExiste =
        pendentes.some(
            item =>
                item.idVisita ===
                registro.idVisita
        );

    if (!jaExiste) {

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

const URL_GOOGLE_SHEETS =
    "https://script.google.com/macros/s/AKfycbzuILbvHjE_eZGbU-uMKm5xrg5Dgj0Fe2AMruSqeJ8-zSi1CfGss25yirURW8i1gu7FMg/exec";


async function enviarParaGoogleSheets(
    registro
) {

    if (!navigator.onLine) {

        throw new Error(
            "SEM_INTERNET"
        );

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

/* ========================================
   DATA PADRÃO = HOJE
======================================== */

function definirDataAtual() {

    const hoje = new Date();

    const ano = hoje.getFullYear();

    const mes = String(
        hoje.getMonth() + 1
    ).padStart(2, "0");

    const dia = String(
        hoje.getDate()
    ).padStart(2, "0");

    dataVisita.value =
        `${ano}-${mes}-${dia}`;
}

definirDataAtual();


/* ========================================
   MÁSCARA DE TELEFONE
======================================== */

telefone.addEventListener(
    "input",
    function () {

        let valor =
            this.value.replace(/\D/g, "");

        valor =
            valor.substring(0, 11);


        if (valor.length > 10) {

            valor = valor.replace(
                /^(\d{2})(\d{5})(\d{4})$/,
                "($1) $2-$3"
            );

        } else if (valor.length > 6) {

            valor = valor.replace(
                /^(\d{2})(\d{4})(\d{0,4})$/,
                "($1) $2-$3"
            );

        } else if (valor.length > 2) {

            valor = valor.replace(
                /^(\d{2})(\d+)/,
                "($1) $2"
            );

        } else if (valor.length > 0) {

            valor = valor.replace(
                /^(\d{0,2})/,
                "($1"
            );

        }

        this.value = valor;

    }
);


/* ========================================
   FORMATAÇÃO DO VALOR EM REAIS
======================================== */

valorContrato.addEventListener(
    "input",
    function () {

        let valor =
            this.value.replace(/\D/g, "");

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

        this.value = valor;

    }
);


/* ========================================
   CONTADOR DE OBSERVAÇÕES
======================================== */

observacoes.setAttribute(
    "maxlength",
    "1000"
);

observacoes.addEventListener(
    "input",
    function () {

        contadorCaracteres.textContent =
            this.value.length;

    }
);


/* ========================================
   EMPRESA CONSERVADORA - OUTROS
======================================== */

function atualizarCampoOutraConservadora() {

    const selecionouOutros =
        empresaConservadora.value === "Outros";

    campoOutraConservadora.hidden =
        !selecionouOutros;

    outraConservadora.required =
        selecionouOutros;

    if (!selecionouOutros) {

        outraConservadora.value = "";

    }

}


empresaConservadora.addEventListener(
    "change",
    function () {

        atualizarCampoOutraConservadora();

        if (this.value === "Outros") {

            outraConservadora.focus();

        }

    }
);


/* ========================================
   REMOVER MENSAGENS DE ERRO
======================================== */

function limparErros() {

    document
        .querySelectorAll(".erro-mensagem")
        .forEach(
            (erro) => erro.remove()
        );

    document
        .querySelectorAll(".campo-erro")
        .forEach(
            (campo) => {

                campo.classList.remove(
                    "campo-erro"
                );

            }
        );

}


/* ========================================
   FUNÇÃO CENTRAL PARA LIMPAR FORMULÁRIO
======================================== */

function limparFormulario() {

    formulario.reset();

    contadorCaracteres.textContent = "0";

    limparErros();

    definirDataAtual();

    atualizarCampoOutraConservadora();

}


/* ========================================
   VERIFICAR SE EXISTEM DADOS PREENCHIDOS
======================================== */

function formularioPossuiDados() {

    const campos =
        formulario.querySelectorAll(
            "input, select, textarea"
        );

    return Array
        .from(campos)
        .some(
            (campo) => {

                if (
                    campo.type === "radio" ||
                    campo.type === "checkbox"
                ) {

                    return campo.checked;

                }

                if (
                    campo.id === "dataVisita"
                ) {

                    return false;

                }

                return (
                    campo.value.trim() !== ""
                );

            }
        );

}


/* ========================================
   BOTÃO LIMPAR DADOS
======================================== */

btnLimparFormulario.addEventListener(
    "click",
    function () {

        if (!formularioPossuiDados()) {

            limparFormulario();

            return;

        }

        const confirmar =
            window.confirm(
                "Deseja realmente limpar todos os dados preenchidos?"
            );

        if (!confirmar) {

            return;

        }

        limparFormulario();

        formulario.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }
);


/* ========================================
   MOSTRAR ERRO
======================================== */

function mostrarErro(
    elemento,
    mensagem
) {

    const campo =
        elemento.closest(".campo");

    if (!campo) {

        return;

    }

    campo.classList.add(
        "campo-erro"
    );

    const erroExistente =
        campo.querySelector(
            ".erro-mensagem"
        );

    if (erroExistente) {

        erroExistente.remove();

    }

    const erro =
        document.createElement("div");

    erro.className =
        "erro-mensagem";

    erro.textContent =
        mensagem;

    campo.appendChild(
        erro
    );

}


/* ========================================
   VALIDAR RADIO
======================================== */

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


/* ========================================
   VALIDAÇÃO DO FORMULÁRIO
======================================== */

function validarFormulario() {

    limparErros();

    let valido = true;

    const campos =
        formulario.querySelectorAll(
            "input:not([type='radio']), select, textarea"
        );

    campos.forEach(
        (campo) => {

            if (
                campo.hasAttribute("required") &&
                !campo.value.trim()
            ) {

                mostrarErro(
                    campo,
                    "Este campo é obrigatório."
                );

                valido = false;

            }

        }
    );


    /* MODALIDADE */

    if (
        !validarRadio(
            "modalidade",
            "Selecione uma modalidade de negócios."
        )
    ) {

        valido = false;

    }


    /* NATUREZA */

    if (
        !validarRadio(
            "natureza",
            "Selecione a natureza da visita."
        )
    ) {

        valido = false;

    }


    /* MARCA */

    if (
        !validarRadio(
            "marca",
            "Selecione a marca."
        )
    ) {

        valido = false;

    }


    /* TIPO DE EQUIPAMENTO */

    if (
        !validarRadio(
            "tipoEquipamento",
            "Selecione o tipo de equipamento."
        )
    ) {

        valido = false;

    }


    /* ========================================
       E-MAIL
    ======================================== */

    const email =
        document.getElementById("email");

    if (email.value.trim()) {

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

            valido = false;

        }

    }


    /* ========================================
       TELEFONE
    ======================================== */

    const numerosTelefone =
        telefone.value.replace(
            /\D/g,
            ""
        );

    if (
        telefone.value &&
        numerosTelefone.length < 10
    ) {

        mostrarErro(
            telefone,
            "Informe um telefone válido com DDD."
        );

        valido = false;

    }


    /* ========================================
       VALOR DO CONTRATO
    ======================================== */

    if (
        valorContrato.value &&
        valorContrato.value === "0,00"
    ) {

        mostrarErro(
            valorContrato,
            "Informe um valor de contrato maior que zero."
        );

        valido = false;

    }


    return valido;

}


/* ========================================
   GERAR ID ÚNICO DA VISITA
======================================== */

function gerarIdVisita() {

    const agora =
        new Date();

    const data =
        [
            agora.getFullYear(),

            String(
                agora.getMonth() + 1
            ).padStart(2, "0"),

            String(
                agora.getDate()
            ).padStart(2, "0")

        ].join("");


    const hora =
        [
            String(
                agora.getHours()
            ).padStart(2, "0"),

            String(
                agora.getMinutes()
            ).padStart(2, "0"),

            String(
                agora.getSeconds()
            ).padStart(2, "0")

        ].join("");


    const aleatorio =
        Math.random()
            .toString(36)
            .substring(2, 6)
            .toUpperCase();


    return (
        `RJCAP-${data}-${hora}-${aleatorio}`
    );

}


/* ========================================
   ORGANIZAR DADOS PARA EXPORTAÇÃO
======================================== */

function rotulosRegistro(registro) {

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

        "Valor do Contrato":
            `R$ ${registro.valorContrato}`,

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


/* ========================================
   EXPORTAR EXCEL
======================================== */

function exportarRegistroExcel() {

    if (!ultimoRegistro) {

        alert(
            "Registre uma visita antes de exportar."
        );

        return;

    }


    if (
        typeof XLSX === "undefined"
    ) {

        alert(
            "Não foi possível carregar o recurso de Excel. Verifique sua internet e tente novamente."
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


    planilha["!cols"] =
        Object.keys(linha).map(
            (chave) => {

                return {
                    wch: Math.min(
                        Math.max(
                            chave.length + 2,
                            18
                        ),
                        42
                    )
                };

            }
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


/* ========================================
   EXPORTAR PDF
======================================== */

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
            "Não foi possível carregar o recurso de PDF. Verifique sua internet e tente novamente."
        );

        return;

    }


    const {
        jsPDF
    } = window.jspdf;


    const pdf =
        new jsPDF({
            unit: "mm",
            format: "a4"
        });


    const dados =
        rotulosRegistro(
            ultimoRegistro
        );


    let y = 20;


    /* TÍTULO */

    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.setFontSize(18);

    pdf.text(
        "RJCAP - Registro de Visita Comercial",
        15,
        y
    );


    y += 10;


    /* ID */

    pdf.setFontSize(10);

    pdf.setFont(
        "helvetica",
        "normal"
    );

    pdf.text(
        `ID: ${ultimoRegistro.idVisita}`,
        15,
        y
    );


    y += 12;


    /* DADOS */

    Object.entries(
        dados
    ).forEach(
        ([rotulo, valor]) => {

            if (
                rotulo === "ID da Visita"
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
                    120
                );


            if (
                y +
                valorLinhas.length * 6 >
                282
            ) {

                pdf.addPage();

                y = 20;

            }


            pdf.setFont(
                "helvetica",
                "bold"
            );


            pdf.text(
                `${rotulo}:`,
                15,
                y
            );


            pdf.setFont(
                "helvetica",
                "normal"
            );


            pdf.text(
                valorLinhas,
                75,
                y
            );


            y += Math.max(
                8,
                valorLinhas.length * 6
            );

        }
    );


    pdf.save(
        `${ultimoRegistro.idVisita}.pdf`
    );

}


/* ========================================
   BOTÕES DE EXPORTAÇÃO
======================================== */

if (exportarExcel) {

    exportarExcel.addEventListener(
        "click",
        exportarRegistroExcel
    );

}


if (exportarPdf) {

    exportarPdf.addEventListener(
        "click",
        exportarRegistroPdf
    );

}


/* ========================================
   ENVIO DO FORMULÁRIO
======================================== */

formulario.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        /* VALIDAÇÃO */

        if (
            !validarFormulario()
        ) {

            const primeiroErro =
                document.querySelector(
                    ".campo-erro"
                );


            if (primeiroErro) {

                primeiroErro.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }


            return;

        }


        /* ==================================
           COLETAR DADOS
        ================================== */

        const dados =
            new FormData(
                formulario
            );


        const registro = {};


        dados.forEach(
            (valor, chave) => {

                registro[chave] =
                    valor;

            }
        );


        /* ==================================
           EMPRESA CONSERVADORA - OUTROS
        ================================== */

        if (
            registro.empresaConservadora ===
            "Outros"
        ) {

            registro.empresaConservadora =
                outraConservadora
                    .value
                    .trim();

        }


        /*
           Remove o campo auxiliar.

           Assim não teremos uma coluna
           "outraConservadora" futuramente
           na nossa base.
        */

        delete registro.outraConservadora;


        /* ==================================
           CRIAR ID ÚNICO
        ================================== */

        registro.idVisita =
            gerarIdVisita();

           /* ========================================
   SALVAR CÓPIA LOCAL ANTES DO ENVIO
======================================== */

adicionarPendente(registro);

const copiaSalva =
    obterPendentes().some(
        item =>
            item.idVisita ===
            registro.idVisita
    );

if (!copiaSalva) {

    alert(
        "Não foi possível criar a cópia de segurança deste registro. Não feche a página e tente novamente."
    );

    return;
} 



        /* ==================================
           GUARDAR O REGISTRO
        ================================== */

        ultimoRegistro = {
            ...registro
        };


        /* ==================================
           MOSTRAR ID NO MODAL
        ================================== */

        if (idVisitaGerado) {

            idVisitaGerado.textContent =
                registro.idVisita;

        }


        console.log(
            "Dados da visita:",
            registro
        );
  

/* ========================================
   ENVIAR REGISTRO PARA O GOOGLE SHEETS
======================================== */

try {

    await enviarParaGoogleSheets(
        registro
    );

} catch (erro) {

    console.error(
        "Falha no envio da visita:",
        erro
    );


    if (
        erro.message === "SEM_INTERNET"
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
            "Uma cópia foi salva neste aparelho para evitar a perda dos dados."
        );

    }

    return;
}


        /* ABRIR MODAL */

        modalSucesso.classList.add(
            "ativo"
        );

    }
);


/* ========================================
   FECHAR MODAL + LIMPAR REGISTRO
======================================== */

function fecharModalELimpar() {

    // Fecha o modal
    modalSucesso.classList.remove("ativo");

    // Reseta todos os campos HTML
    formulario.reset();

    // Limpa manualmente inputs, selects e textareas
    formulario
        .querySelectorAll("input, select, textarea")
        .forEach((campo) => {

            // Não mexer na data aqui
            // porque ela será redefinida abaixo
            if (campo === dataVisita) {
                return;
            }

            if (
                campo.type === "radio" ||
                campo.type === "checkbox"
            ) {
                campo.checked = false;
            } else {
                campo.value = "";
            }

        });


    // Zera observações
    if (observacoes) {
        observacoes.value = "";
    }

    if (contadorCaracteres) {
        contadorCaracteres.textContent = "0";
    }


    // Reseta empresa conservadora
    if (empresaConservadora) {
        empresaConservadora.selectedIndex = 0;
    }

    if (outraConservadora) {
        outraConservadora.value = "";
        outraConservadora.required = false;
    }

    if (campoOutraConservadora) {
        campoOutraConservadora.hidden = true;
    }


    // Limpa mensagens de erro
    limparErros();


    // Coloca novamente a data atual
    definirDataAtual();


    // Apaga o registro temporário
    ultimoRegistro = null;


    // Limpa o ID mostrado no modal
    if (idVisitaGerado) {
        idVisitaGerado.textContent = "—";
    }


    // Volta ao início da página
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* ========================================
   BOTÃO X
======================================== */

fecharModal.addEventListener(
    "click",
    function (event) {

        event.preventDefault();
        event.stopPropagation();

        fecharModalELimpar();

    }
);


/* ========================================
   TOCAR FORA DO MODAL
======================================== */

modalSucesso.addEventListener(
    "click",
    function (event) {

        if (event.target === modalSucesso) {

            fecharModalELimpar();

        }

    }
);


/* ========================================
   REGISTRAR NOVA VISITA
======================================== */

novaVisita.addEventListener(
    "click",
    function () {

        limparFormulario();


        ultimoRegistro = null;


        if (idVisitaGerado) {

            idVisitaGerado.textContent =
                "—";

        }


        modalSucesso.classList.remove(
            "ativo"
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


/* ========================================
   REMOVER ERRO DO CAMPO
======================================== */

function removerErroDoCampo(
    elemento
) {

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


/* ========================================
   AO DIGITAR
======================================== */

formulario.addEventListener(
    "input",
    function (event) {

        removerErroDoCampo(
            event.target
        );

    }
);


/* ========================================
   AO ALTERAR SELECT / RADIO
======================================== */

formulario.addEventListener(
    "change",
    function (event) {

        removerErroDoCampo(
            event.target
        );

    }
   
);
