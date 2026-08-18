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

    dataVisita.value = `${ano}-${mes}-${dia}`;
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
        .querySelectorAll(
            ".erro-mensagem"
        )
        .forEach(
            (erro) => erro.remove()
        );


    document
        .querySelectorAll(
            ".campo-erro"
        )
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


    contadorCaracteres.textContent =
        "0";


    limparErros();


    definirDataAtual();


    /*
       Depois do reset, garante que
       o campo "Outros" volte a ficar
       escondido.
    */

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

                /*
                   RADIO / CHECKBOX
                */

                if (
                    campo.type === "radio" ||
                    campo.type === "checkbox"
                ) {

                    return campo.checked;

                }


                /*
                   A data é preenchida
                   automaticamente.

                   Por isso ela sozinha não
                   conta como formulário
                   preenchido.
                */

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

        /*
           Se não houver nenhum dado
           preenchido, apenas limpa.
        */

        if (!formularioPossuiDados()) {

            limparFormulario();

            return;

        }


        /*
           Se houver dados, pede confirmação
           antes de apagar.
        */

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


    /*
       Evita mensagens duplicadas.
    */

    const erroExistente =
        campo.querySelector(
            ".erro-mensagem"
        );


    if (erroExistente) {

        erroExistente.remove();

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

            /*
               Ignora campos escondidos
               que não sejam obrigatórios.
            */

            if (
                campo.hasAttribute(
                    "required"
                ) &&
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
        document.getElementById(
            "email"
        );


    if (
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
   ENVIO DO FORMULÁRIO
======================================== */

formulario.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        /*
           VALIDAÇÃO
        */

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

                primeiroErro.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }


            return;

        }


        /* ==================================
           COLETAR OS DADOS
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
           TRATAR EMPRESA CONSERVADORA
        ================================== */

        /*
           Se selecionar "Outros",
           salvamos diretamente o nome
           digitado pelo consultor.

           Exemplo:

           Selecionou:
           Outros

           Digitou:
           Elevadores ABC

           Resultado:
           empresaConservadora:
           "Elevadores ABC"
        */

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
           Remove o campo auxiliar para
           não criarmos uma coluna
           desnecessária no banco.
        */

        delete registro.outraConservadora;


        console.log(
            "Dados da visita:",
            registro
        );


        /*
        =========================================
        FUTURA INTEGRAÇÃO COM SUPABASE

        Aqui vamos enviar o objeto "registro"
        para o banco.

        IMPORTANTE:

        O formulário NÃO será apagado antes
        do Supabase confirmar que salvou.

        Isso evita perda dos dados caso
        o consultor esteja sem internet
        ou aconteça algum erro.

        =========================================
        */


        modalSucesso.classList.add(
            "ativo"
        );

    }
);


/* ========================================
   FECHAR MODAL
======================================== */

fecharModal.addEventListener(
    "click",
    function () {

        modalSucesso.classList.remove(
            "ativo"
        );

    }
);


modalSucesso.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            modalSucesso
        ) {

            modalSucesso.classList.remove(
                "ativo"
            );

        }

    }
);


/* ========================================
   REGISTRAR NOVA VISITA
   BOTÃO DO MODAL
======================================== */

novaVisita.addEventListener(
    "click",
    function () {

        limparFormulario();


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