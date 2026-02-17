const API_KEY = "AIzaSyDMruCz9cDkT9ilzvvfN7HOKUJkCGi9dAY";
const MODEL_NAME = "gemini-2.5-flash-preview-09-2025";
const OFFICIAL_DOMAINS = [".gov.ma", ".ma", "sgg.gov.ma", "justice.gov.ma", "bulletin-officiel.ma"];

const chatWindow = document.getElementById('chatWindow');
const welcomeScreen = document.getElementById('welcomeScreen');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const loadingIndicator = document.getElementById('loadingIndicator');

const SYSTEM_PROMPT = "Tu es QANOUNI, l'expert du droit marocain. Réponds selon la loi marocaine, cite tes sources officielles (.gov.ma) et sois pédagogique.";

sendBtn.addEventListener('click', handleUserQuery);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleUserQuery(); });

async function handleUserQuery() {
    const query = userInput.value.trim();
    if (!query) return;
    if (welcomeScreen) welcomeScreen.style.display = 'none';
    userInput.value = '';
    appendMessage('user', query);
    loadingIndicator.classList.remove('hidden');

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: query }] }],
                systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
                tools: [{ "google_search": {} }]
            })
        });
        const data = await response.json();
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Analyse impossible.";
        const sources = data.candidates?.[0]?.groundingMetadata?.groundingAttributions || [];
        const officialSources = sources.filter(src => OFFICIAL_DOMAINS.some(domain => src.web?.uri?.toLowerCase().includes(domain)));
        appendMessage('ai', aiText, officialSources);
    } catch (error) {
        appendMessage('ai', "Erreur de connexion.");
    } finally {
        loadingIndicator.classList.add('hidden');
    }
}

function appendMessage(role, text, sources = []) {
    const msgDiv = document.createElement('div');
    msgDiv.className = role === 'user' ? 'flex justify-end mb-6' : 'flex justify-start mb-6';
    let sourceHtml = sources.length > 0 ? `<div class="mt-2 text-[10px] text-emerald-700 underline font-bold">Sources: ${sources.map(s => `<a href="${s.web.uri}" target="_blank" class="mr-2">${s.web.title.substring(0,15)}...</a>`).join('')}</div>` : '';
    const pdfBtn = role === 'ai' ? `<button onclick="downloadAsPDF(\`${text.replace(/`/g, "'")}\`)" class="mt-2 text-[10px] font-bold text-slate-400 border px-2 py-1 rounded">PDF</button>` : '';
    msgDiv.innerHTML = `<div class="bg-white border p-4 rounded-xl shadow-sm max-w-[80%] text-sm"><div>${text.replace(/\n/g, '<br>')}</div>${sourceHtml}${pdfBtn}</div>`;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

window.downloadAsPDF = function(content) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("QANOUNI - Conseil Juridique", 10, 20);
    doc.setFontSize(10);
    const splitText = doc.splitTextToSize(content.replace(/<br>/g, '\n'), 180);
    doc.text(splitText, 10, 35);
    doc.save("Qanouni_Rapport.pdf");
};
