import {
    cadastrar,
    editar,
    deletar,
    pesquisar
} from "./CRUD.js";

const btnCadastrar = document.getElementById("btn-cadastro");
const btnPesquisar = document.getElementById("btn-pesquisar");
const inputPesquisar = document.getElementById("input-pesquisar");
const inputCpf = document.getElementById("cpf");
const inputNome = document.getElementById("nome");
const listaUl = document.getElementById("lista");

async function mostrarLista(filtro = "") {
    listaUl.innerHTML = "";
    const snapshot = await pesquisar();

    if(!snapshot.exists()) {
        listaUl.innerHTML = "Nenhum cadastro encontrado";
        return;
    }

    snapshot.forEach(function(item) {
        const dados = item.val();
        const id = item.key;

        if(filtro && dados.nome.toLowerCase().includes(filtro.toLowerCase())) {
            return;
        }

        const li = document.createElement("li");
        li.textContent = dados.nome + " - " + dados.cpf;

        const btnEditarItem = document.createElement("button");
        btnEditarItem.textContent = "Editar";
        btnEditarItem.addEventListener("click", async function() {
            const novoNome = prompt("Novo nome: ", dados.nome);
            const novoCpf = prompt("Novo CPF: ", dados.cpf);

            if(novoNome && novoCpf) {
                await editar(id, novoNome, novoCpf);
                    alert ("Editado com sucesso!");
                    mostrarLista();
                
            }
        });

        const btnExcluirItem = document.createElement("button");
        btnExcluirItem.textContent = "Excluir";
        btnExcluirItem.addEventListener("click", async function() {
            const confirmar = confirm("Quer realmente excluir a conta " + dados.nome + "?");
            if(confirmar) {
                await deletar(id);
                alert("Conta excluída com sucesso! ");
                mostrarLista();
            }
        });

        li.appendChild(btnEditarItem);
        li.appendChild(btnExcluirItem);
        listaUl.appendChild(li);
    });
} 

btnCadastrar.addEventListener("click", async function() {
    const cpf = inputCpf.value.trim();
    const nome = inputNome.value.trim();

    if(cpf === "" || nome === "") {
        alert("Preencha todos os campos! ");
        return;
    }

    await cadastrar(nome, cpf);
    alert("Cadastrado com sucesso! ");

    inputCpf.value = "";
    inputNome.value = "";
    mostrarLista();
});

btnPesquisar.addEventListener("click", function() {
    mostrarLista(inputPesquisar.value);
})

inputPesquisar("keyup", function() {
    mostrarLista(inputPesquisar.value);
})

mostrarLista();