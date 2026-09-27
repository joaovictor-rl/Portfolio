const semAnimacao = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Abre o painel. O círculo da animação nasce no ponto do clique
// (ou no centro do link, quando aberto pelo teclado).
function abrirPainel(painel, evento, link) {
  let x = evento.clientX;
  let y = evento.clientY;

  if (evento.detail === 0) {
    const caixa = link.getBoundingClientRect();
    x = caixa.left + caixa.width / 2;
    y = caixa.top + caixa.height / 2;
  }

  painel.style.setProperty('--x', `${x}px`);
  painel.style.setProperty('--y', `${y}px`);
  painel.showModal();
}

// Fecha o painel depois que a animação de fechar termina
function fecharPainel(painel) {
  if (semAnimacao) {
    painel.close();
    return;
  }

  painel.classList.add('fechando');
  painel.addEventListener('animationend', function terminou(evento) {
    if (evento.target !== painel) return;
    painel.removeEventListener('animationend', terminou);
    painel.classList.remove('fechando');
    painel.close();
  });
}

document.querySelectorAll('[data-abrir]').forEach(link => {
  link.addEventListener('click', evento => {
    evento.preventDefault();
    abrirPainel(document.getElementById(link.dataset.abrir), evento, link);
  });
});

document.querySelectorAll('.painel').forEach(painel => {
  painel.querySelector('[data-fechar]').addEventListener('click', () => fecharPainel(painel));

  // Tecla Esc
  painel.addEventListener('cancel', evento => {
    evento.preventDefault();
    fecharPainel(painel);
  });
});

// Libera o efeito do mouse na lista quando a animação de entrada acaba
setTimeout(() => document.body.classList.remove('intro'), semAnimacao ? 0 : 2900);
