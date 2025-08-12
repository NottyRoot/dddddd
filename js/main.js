function switchMode(mode, event) {
    const buttons = document.querySelectorAll('.toggle-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
    const input = document.getElementById('main-input');
    const timeInput = document.getElementById('mode-time');
    if (mode === 'url') {
        input.placeholder = 'Enter URL, Login, Email, CPF or Number...';
        timeInput.value = '1';
    } else {
        input.placeholder = 'Enter User:Pass...';
        timeInput.value = '2';
    }
}

document.getElementById('main-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const url = new URL(this.action, window.location.origin);
    formData.forEach((value, key) => url.searchParams.append(key, value));

    const popup = document.getElementById('popup');
    const loadingDiv = document.getElementById('loading');
    const completedDiv = document.getElementById('completed');
    const textarea = document.getElementById('dado');

    loadingDiv.style.display = 'block';
    completedDiv.style.display = 'none';
    popup.style.display = 'flex';
    textarea.value = '';

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'text/plain' },
            credentials: 'same-origin'
        });
        const text = await response.text();
        textarea.value = text || 'No data available or invalid query.';
        loadingDiv.style.display = 'none';
        completedDiv.style.display = 'block';
        await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
        textarea.value = 'Network error occurred.';
        console.error('Fetch error:', error);
    } finally {
        popup.style.display = 'none';
    }
});

document.getElementById('copy').addEventListener('click', () => {
    const textarea = document.getElementById('dado');
    textarea.select();
    document.execCommand('copy');
    document.getElementById('toast').classList.add('show');
    setTimeout(() => document.getElementById('toast').classList.remove('show'), 1500);
});

document.getElementById('salva').addEventListener('click', () => {
    const texto = document.getElementById('dado').value;
    const input = document.getElementById('main-input');
    let filename = input.value || 'resultado';
    filename = filename.replace(/^(https?:\/\/|www\.)/i, '').replace(/[^a-zA-Z0-9]/g, '_') || 'resultado';

    const blob = new Blob([texto], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.txt`;
    link.click();
});

const abrirBtn = document.getElementById('abrir-btn');
const fecharBtn = document.getElementById('fechar-btn');
const painel = document.getElementById('painel');

abrirBtn.addEventListener('click', () => {
    painel.classList.remove('closed');
    abrirBtn.style.display = 'none';
});

fecharBtn.addEventListener('click', () => {
    painel.classList.add('closed');
    abrirBtn.style.display = 'block';
});

document.getElementById('start-btn').addEventListener('click', () => {
    const curtain = document.querySelector('.intro-curtain');
    const audio = document.getElementById('start-sound');
    const snowflakeContainer = document.querySelector('.snowflake-container');
    audio.play();
    curtain.style.animation = 'curtainRise 2s ease-in-out forwards';
    setTimeout(() => {
        curtain.style.display = 'none';
        snowflakeContainer.classList.add('active');
        for (let i = 0; i < 50; i++) {
            const snowflake = document.createElement('div');
            snowflake.classList.add('snowflake');
            snowflake.style.left = `${Math.random() * 100}%`;
            snowflake.style.animationDuration = `${Math.random() * 10 + 5}s`; // Random duration 5-15s
            snowflake.style.animationDelay = `${Math.random() * 5}s`; // Random delay 0-5s
            snowflake.style.opacity = Math.random() * 0.5 + 0.3; // Random opacity
            snowflake.style.transform = `scale(${Math.random() * 0.5 + 0.5})`; // Random size
            snowflakeContainer.appendChild(snowflake);
        }
    }, 2000); // Match curtain animation duration
});