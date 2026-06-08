// CONTROLES DE ACESSIBILIDADE

// 1. MODO ESCURO
const btnDark = document.getElementById('toggle-dark');
btnDark.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = btnDark.querySelector('i');
    if(document.body.classList.contains('dark-mode')) {
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
    }
});

// 2. TAMANHO DA FONTE
let fontSize = 18;
const fontIncrease = document.getElementById('font-increase');
const fontDecrease = document.getElementById('font-decrease');

fontIncrease.addEventListener('click', () => {
    if(fontSize < 26) {
        fontSize += 2;
        document.documentElement.style.setProperty('--font-base', fontSize + 'px');
    }
});

fontDecrease.addEventListener('click', () => {
    if(fontSize > 14) {
        fontSize -= 2;
        document.documentElement.style.setProperty('--font-base', fontSize + 'px');
    }
});

// 3. LEITOR DE TEXTO (TEXT TO SPEECH)
const btnRead = document.getElementById('btn-read');
const btnStop = document.getElementById('btn-stop');
const synth = window.speechSynthesis;

btnRead.addEventListener('click', () => {
    // Pega todo o texto relevante do main
    const textToRead = document.querySelector('main').innerText;
    const utterThis = new SpeechSynthesisUtterance(textToRead);
    
    utterThis.lang = 'pt-BR';
    utterThis.rate = 1.1;

    utterThis.onstart = () => {
        btnRead.style.display = 'none';
        btnStop.style.display = 'block';
    };

    utterThis.onend = () => {
        btnRead.style.display = 'block';
        btnStop.style.display = 'none';
    };

    synth.speak(utterThis);
});

btnStop.addEventListener('click', () => {
    synth.cancel();
    btnRead.style.display = 'block';
    btnStop.style.display = 'none';
});
// Aguarda o DOM carregar completamente
document.addEventListener('DOMContentLoaded', () => {
    
    let cash = 10000;
    let currentRound = 1;

    const scenarios = {
        1: {
            text: "Uma frente fria histórica está chegando em 48 horas. O que você faz?",
            options: [
                { text: "Investir em aquecimento (R$ 5.000)", action: "investir", cost: 5000 },
                { text: "Arriscar e manter como está", action: "arriscar", cost: 0 }
            ]
        },
        2: {
            text: "Sensores indicam início de uma praga na lavoura vizinha. Ação rápida?",
            options: [
                { text: "Bioinsumos Preventivos (R$ 7.000)", action: "investir", cost: 7000 },
                { text: "Aguardar sinais na minha terra", action: "arriscar", cost: 0 }
            ]
        },
        3: {
            text: "O mercado internacional exige selo de rastreabilidade para pagar 20% a mais.",
            options: [
                { text: "Certificar Fazenda (R$ 4.000)", action: "investir", cost: 4000 },
                { text: "Vender pelo preço comum", action: "arriscar", cost: 0 }
            ]
        }
    };

    // Referências dos elementos
    const screenIntro = document.getElementById('game-intro');
    const screenPlay = document.getElementById('game-play');
    const screenCredit = document.getElementById('game-credit');
    const screenResult = document.getElementById('game-result');
    
    const cashDisplay = document.getElementById('game-cash');
    const roundDisplay = document.getElementById('game-round');
    const scenarioText = document.getElementById('scenario-text');
    const optionsDiv = document.getElementById('game-options');

    // Funções de Controle
    const startGame = () => {
        cash = 10000;
        currentRound = 1;
        screenIntro.style.display = 'none';
        screenResult.style.display = 'none';
        screenPlay.style.display = 'block';
        updateScreen();
    };

    const updateScreen = () => {
        cashDisplay.innerText = `R$ ${cash.toLocaleString('pt-BR')}`;
        roundDisplay.innerText = `${currentRound}/3`;
        
        const scenario = scenarios[currentRound];
        scenarioText.innerHTML = `<p style="margin-bottom:20px; font-size:1.2rem;">${scenario.text}</p>`;
        
        optionsDiv.innerHTML = '';
        scenario.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.innerText = opt.text;
            btn.className = 'btn-choice';
            btn.onclick = () => handleChoice(opt);
            optionsDiv.appendChild(btn);
        });
    };

    const handleChoice = (option) => {
        if (option.action === 'investir' && cash < option.cost) {
            screenPlay.style.display = 'none';
            screenCredit.style.display = 'block';
        } else {
            processChoice(option.action, option.cost);
        }
    };

    const processChoice = (action, cost = 0) => {
        screenCredit.style.display = 'none';
        screenPlay.style.display = 'block';

        if (action === 'investir') {
            cash -= cost;
            cash += (cost * 1.6); // Retorno de 60% sobre o investimento
            alert("Ótima decisão! O investimento protegeu sua produção e trouxe lucro.");
        } else {
            const loss = currentRound * 3500;
            cash -= loss;
            alert(`Prejuízo! A falta de prevenção custou R$ ${loss.toLocaleString('pt-BR')}.`);
        }

        if (currentRound < 3) {
            currentRound++;
            updateScreen();
        } else {
            showResult();
        }
    };

    const showResult = () => {
        screenPlay.style.display = 'none';
        screenResult.style.display = 'block';
        
        const title = document.getElementById('result-title');
        const text = document.getElementById('result-text');

        if (cash > 10000) {
            title.innerText = "🏆 Fazenda Próspera!";
            text.innerText = `Parabéns! Você provou que o Agro Forte é feito com estratégia. Saldo final: R$ ${cash.toLocaleString('pt-BR')}.`;
        } else {
            title.innerText = "🚜 Safra de Aprendizado";
            text.innerText = `O ano foi difícil e seu saldo final foi R$ ${cash.toLocaleString('pt-BR')}. Lembre-se: investir em prevenção com o crédito certo evita grandes perdas!`;
        }
    };

    // Listeners dos Botões Fixos
    document.getElementById('btn-start').addEventListener('click', startGame);
    document.getElementById('btn-restart').addEventListener('click', startGame);
    document.getElementById('btn-apply-credit').addEventListener('click', () => {
        cash += 10000;
        alert("Crédito AgroForte aprovado! R$ 10.000 injetados no seu caixa.");
        processChoice('investir', scenarios[currentRound].options[0].cost);
    });
    document.getElementById('btn-skip-credit').addEventListener('click', () => {
        processChoice('arriscar');
    });
});
