const html = document.querySelector('html');
const btnFoco = document.querySelector('.app__card-button--foco');
const btnCurto = document.querySelector('.app__card-button--curto');
const btnLongo = document.querySelector('.app__card-button--longo');
const imgPrincipal = document.querySelector('.app__image');
const textoPrincipal = document.querySelector('.app__title');
const botoes = document.querySelectorAll('.app__card-button');
const musicaFocoInput = document.querySelector('#alternar-musica');
const btnStartPause = document.querySelector('#start-pause');
const musica = new Audio('/sons/luna-rise-part-one.mp3');
musica.loop = true;
const musicaTempoFinalizado = new Audio('/sons/beep.mp3');
const musicaIniciar = new Audio('/sons/play.wav');
const musicaPausar = new Audio('/sons/pause.mp3');
const textoIniciar = document.querySelector('span');
const imgBtnStartOuPause = document.querySelector('.app__card-primary-butto-icon');
const tempoNaTela = document.querySelector('#timer');

let tempoDecorridoEmSegundos = 1500;
let intervaloId = null;

musicaFocoInput.addEventListener('change', ()=> {
  if(musica.paused){
    musica.play();
  } else {
    musica.pause();
  }
})

btnFoco.addEventListener('click', () => {
  tempoDecorridoEmSegundos = 1500;
  trocarContexto('foco');
  btnFoco.classList.add('active');
});

btnCurto.addEventListener('click', ()=> {
  tempoDecorridoEmSegundos = 300;
  trocarContexto('descanso-curto');
  btnCurto.classList.add('active');
});

btnLongo.addEventListener('click', () => {
  tempoDecorridoEmSegundos = 900;
  trocarContexto('descanso-longo');
  btnLongo.classList.add('active');
})

function trocarContexto(contexto) {
  mostrarTempo()
  botoes.forEach((contexto) => {
    contexto.classList.remove('active')
  })
  html.setAttribute('data-contexto', contexto);
  imgPrincipal.setAttribute('src', `/imagens/${contexto}.png`);
  trocarTextoPrincipalDeAcordoComTexto(contexto);
  trocarContextoDoBotaoIniciar(contexto);
  zerar()
}

function trocarContextoDoBotaoIniciar(contexto) {
  if(contexto === 'foco') {
    btnStartPause.setAttribute('disabled', 'disabled');
    return;
  };
  if(contexto === 'descanso-curto' || contexto === 'descanso-longo') {
    btnStartPause.removeAttribute('disabled');
    return
  }
}

function trocarTextoPrincipalDeAcordoComTexto(contexto) {
  if(contexto === 'foco') {
    textoPrincipal.innerHTML = `
      Otimize sua produtividade,<br>
      <strong class="app__title-strong">mergulhe no que importa.</strong>
    `
    return;
  };

  if(contexto === 'descanso-curto') {
    textoPrincipal.innerHTML = `
      Que tal uma respirada?,<br>
      <strong class="app__title-strong">Faça uma pausa curta.</strong>
    `
    return;
  }

  if(contexto === 'descanso-longo') {
    textoPrincipal.innerHTML = `
      Hora de voltar à superfície,<br>
      <strong class="app__title-strong">Faça uma pausa longa.</strong>
    `
    return;
  }
};

const contagemRegressiva = () => {
  if (tempoDecorridoEmSegundos <= 0) {
    musicaTempoFinalizado.play()
    alert('Tempo finalizado');
    const focoAtivo = html.getAttribute('data-contexto') == 'foco';
    if (focoAtivo) {
      const evento = new CustomEvent('focoFinalizado');
      document.dispatchEvent(evento);
      tempoDecorridoEmSegundos = 1500;
      mostrarTempo()
    }
    btnStartPause.setAttribute('disabled', 'disabled');
    zerar();
    return
  }
  tempoDecorridoEmSegundos -= 1;
  console.log(tempoDecorridoEmSegundos);
  mostrarTempo()
}

btnStartPause.addEventListener('click', iniciarOuPausar);

function iniciarOuPausar() {
  if(intervaloId) {
    musicaPausar.play()

    zerar();
    return
  }
  textoIniciar.textContent = 'Pausar'
  intervaloId = setInterval(contagemRegressiva, 1000);
  musicaIniciar.play()
  imgBtnStartOuPause.setAttribute('src', '/imagens/pause.png');
}

function zerar() {
  clearInterval(intervaloId);
  textoIniciar.textContent = 'Iniciar';
  imgBtnStartOuPause.setAttribute('src', '/imagens/play_arrow.png');
  intervaloId = null;
}

function mostrarTempo() {
  const tempo = new Date(tempoDecorridoEmSegundos * 1000);
  const tempoFormatado = tempo.toLocaleTimeString('pt-BR', {minute:"2-digit", second:"2-digit"})
  tempoNaTela.innerHTML = `${tempoFormatado}`
}

mostrarTempo()
