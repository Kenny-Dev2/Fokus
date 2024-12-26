const btnAdicionarTarefa = document.querySelector('.app__button--add-task');
const formAdicionarTarefa = document.querySelector('.app__form-add-task');
const textarea = document.querySelector('.app__form-textarea');
const ulTarefas = document.querySelector('.app__section-task-list');
const btnCancelarTarefa = document.querySelector('.app__form-footer__button--cancel');
const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description');
const btnRemoverTarefasConcluidas = document.querySelector('#btn-remover-concluidas');
const btnRemoverTodasTarefas = document.querySelector('#btn-remover-todas');
const btnStartPause = document.querySelector('#start-pause')

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

let tarefaSelecionada = null;
let liTarefaSelecionada = null;

function atualizarTarefa() {
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function criarElementoTarefa(tarefa) {
  const li = document.createElement('li');
  li.classList.add('app__section-task-list-item');

  const svg = document.createElement('svg');
  svg.innerHTML = `
    <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
      <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
    </svg>
  `;

  const paragrafo = document.createElement('p');
  paragrafo.classList.add('app__section-task-list-item-description');
  paragrafo.textContent = tarefa.descricao;

  const botao = document.createElement('button');
  botao.classList.add('app_button-edit');
  botao.addEventListener('click', (e) => {
    let textoEditado = prompt('Digite o novo texto: ');
 
    if ( textoEditado === null) {
      return;
    } 
    
    while (textoEditado.trim() === "") {
      alert('Por favor digite alguma tarefa para poder adicionar.');
      textoEditado = prompt('Digite o novo texto: ');
      
      if (textoEditado === null) {
        return
      }
    }

    paragrafo.textContent = textoEditado;
    tarefa.descricao = textoEditado;
    atualizarTarefa();

  })

  const imgBotao = document.createElement('img');
  imgBotao.setAttribute('src', '/imagens/edit.png');

  botao.appendChild(imgBotao);

  li.append(svg);
  li.append(paragrafo);
  li.append(botao);

 verificaAsTarefas(tarefa, li, botao);

  return li;
}

function verificaAsTarefas(tarefa, li, botao) {

  if(tarefa.completo) {
    li.classList.add('app__section-task-list-item-complete');
    botao.setAttribute('disabled', 'disabled');
  } else {
    li.onclick = () => {
      const listaDeTarefasSelecionadas = document.querySelectorAll('.app__section-task-list-item-active');
      listaDeTarefasSelecionadas.forEach((elemento) => {
        elemento.classList.remove('app__section-task-list-item-active')
      });
  
      if (tarefaSelecionada == tarefa) {
        paragrafoDescricaoTarefa.textContent = '';
        tarefaSelecionada = null;
        liTarefaSelecionada = null;
        return;
      }
      
      tarefaSelecionada = tarefa;
      liTarefaSelecionada = li;
      paragrafoDescricaoTarefa.textContent = tarefa.descricao;
      li.classList.add('app__section-task-list-item-active');
      btnStartPause.removeAttribute('disabled')
    }
  }
}

btnAdicionarTarefa.addEventListener('click', () => {
  formAdicionarTarefa.classList.toggle('hidden');
})

formAdicionarTarefa.addEventListener('submit', (e) => {
  e.preventDefault();
  if(textarea.value !== "") {
    const tarefa = {
      descricao: textarea.value
    }
    tarefas.push(tarefa);
    const elementoTarefa = criarElementoTarefa(tarefa)
    ulTarefas.append(elementoTarefa);
    atualizarTarefa();
  
    textarea.value = "";
    formAdicionarTarefa.classList.toggle('hidden');
  } else {
    alert('Por favor digite alguma tarefa para poder adicionar.')
  }
  
});

btnCancelarTarefa.addEventListener('click', () => {
  textarea.value = "";
  formAdicionarTarefa.classList.toggle('hidden')
})

tarefas.forEach((tarefa) => {
  const elementoTarefa = criarElementoTarefa(tarefa);
  ulTarefas.append(elementoTarefa)
})

document.addEventListener('focoFinalizado', () => {
  if (tarefaSelecionada && liTarefaSelecionada) {
    liTarefaSelecionada.classList.remove('app__section-task-list-item-active');
    liTarefaSelecionada.classList.add('app__section-task-list-item-complete');
    liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled');
    paragrafoDescricaoTarefa.textContent = "";
    tarefaSelecionada.completo = true;
    atualizarTarefa();
  }
})

const removerTarefas = (somenteCompletas) => {
  const seletor = somenteCompletas ? ".app__section-task-list-item-complete" : ".app__section-task-list-item";
  document.querySelectorAll(seletor).forEach((elemento) => {
    elemento.remove();
  });
  tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.completo) : [];
  atualizarTarefa()
}

btnRemoverTarefasConcluidas.onclick = () => removerTarefas(true);
btnRemoverTodasTarefas.onclick = () => removerTarefas(false);