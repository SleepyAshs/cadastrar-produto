'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}


const getLocalStorage = () => JSON.parse(localStorage.getItem('db_Produto')) ?? []
const setLocalStorage = (dbProduto) => localStorage.setItem("db_Produto", JSON.stringify(dbProduto))

// CRUD
const deleteProduto = (index) => {
    const dbProduto = readProduto()
    dbProduto.splice(index, 1)
    setLocalStorage(dbProduto)
}

const updateProduto = (index, Produto) => {
    const dbProduto = readProduto()
    dbProduto[index] = Produto
    setLocalStorage(dbProduto)
}

const readProduto = () => getLocalStorage()

const createProduto = (Produto) => {
    const dbProduto = getLocalStorage()
    dbProduto.push (Produto)
    setLocalStorage(dbProduto)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}


const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
}

const saveProduto = () => {
    
    if (isValidFields()) {
        const Produto = {
            nome: document.getElementById('nome').value,
            preco: document.getElementById('preco').value,
            descricao: document.getElementById('descricao').value,
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createProduto(Produto)
            updateTable()
            closeModal()
        } else {
            updateProduto(index, Produto)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (Produto, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${Produto.nome}</td>
        <td>${Produto.preco}</td>
        <td>${Produto.descricao}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tableProduto>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableProduto>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbProduto = readProduto()
    clearTable()
    dbProduto.forEach(createRow)
}

const fillFields = (Produto) => {
    document.getElementById('nome').value = Produto.nome
    document.getElementById('preco').value = Produto.preco
    document.getElementById('descricao').value = Produto.descricao
}

const editProduto = (index) => {
    const Produto = readProduto()[index]
    Produto.index = index
    fillFields(Produto)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editProduto(index)
        } else {
            const Produto = readProduto()[index]
            const response = confirm(`Deseja realmente excluir o Produto ${Produto.nome}`)
            if (response) {
                deleteProduto(index)
                updateTable()
            }
        }
    }
}

updateTable()

document.getElementById('cadastrarProduto')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveProduto)

document.querySelector('#tableProduto>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)