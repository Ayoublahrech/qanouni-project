const API_KEY = "AIzaSyDMruCz9cDkT9ilzvvfN7HOKUJkCGi9dAY";
const MODEL_NAME = "gemini-2.5-flash-preview-09-2025";
const OFFICIAL_DOMAINS = [".gov.ma", ".ma", "sgg.gov.ma", "justice.gov.ma", "bulletin-officiel.ma"];

const chatWindow = document.getElementById('chatWindow');
const welcomeScreen = document.getElementById('welcomeScreen');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const loadingIndicator = document.getElementById('loadingIndicator');

const SYSTEM_PROMPT = `Tu es QANOUNI, l'assistant juridique expert du droit marocain. 
Tes réponses doivent être basées uniquement sur la législation marocaine. 
Structure : 1. Résumé 2. Articles de loi 3. Démarches 4. Avertissement légal.`;

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

        if (!response.ok) throw new Error('Quota API dépassé ou clé invalide');

        const data = await response.json();
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Désolé, je ne peux pas répondre à cette question pour le moment.";
        const sources = data.candidates?.[0]?.groundingMetadata?.groundingAttributions || [];
        const officialSources = sources.filter(src => OFFICIAL_DOMAINS.some(domain => src.web?.uri?.toLowerCase().includes(domain)));

        appendMessage('ai', aiText, officialSources);
    } catch (error) {
        console.error(error);
        appendMessage('ai', "⚠️ Le service est actuellement saturé. Veuillez réessayer dans quelques instants ou vérifier votre connexion.");
    } finally {
        loadingIndicator.classList.add('hidden');
    }
}

function appendMessage(role, text, sources = []) {
    const msgDiv = document.createElement('div');
    msgDiv.className = role === 'user' ? 'flex justify-end mb-6' : 'flex justify-start mb-6';
    
    let sourceHtml = '';
    if (sources.length > 0) {
        sourceHtml = `<div class="mt-3 pt-2 border-t border-emerald-100"><p class="text-[9px] font-bold text-emerald-700 uppercase">Sources Officielles :</p><div class="flex flex-wrap gap-2 mt-1">`;
        sources.forEach(s => {
            sourceHtml += `<a href="${s.web.uri}" target="_blank" class="text-[10px] bg-emerald-50 px-2 py-1 rounded border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition-all">${s.web.title.substring(0,20)}...</a>`;
        });
        sourceHtml += `</div></div>`;
    }

    const pdfBtn = role === 'ai' ? `<button onclick="downloadAsPDF(\`${text.replace(/`/g, "'").replace(/\n/g, " ")}\`)" class="mt-3 text-[10px] font-bold text-emerald-600 border border-emerald-600 px-3 py-1 rounded-lg hover:bg-emerald-600 hover:text-white transition-all"><i class="fas fa-file-pdf mr-1"></i> TÉLÉCHARGER LE RAPPORT</button>` : '';

    const bubbleClass = role === 'user' 
        ? 'bg-emerald-900 text-white rounded-2xl rounded-tr-none shadow-lg' 
        : 'bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-none shadow-md';

    msgDiv.innerHTML = `
        <div class="${bubbleClass} p-5 max-w-[85%]">
            <div class="text-sm leading-relaxed">${text.replace(/\n/g, '<br>')}</div>
            ${sourceHtml}
            ${pdfBtn}
        </div>`;

    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

window.downloadAsPDF = function(content) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(27, 67, 50);
    doc.text("QANOUNI - RAPPORT JURIDIQUE", 10, 20);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Généré le : " + new Date().toLocaleDateString(), 10, 30);
    doc.line(10, 35, 200, 35);
    doc.setTextColor(0, 0, 0);
    const splitText = doc.splitTextToSize(content, 180);
    doc.text(splitText, 10, 45);
    doc.save("Qanouni_Conseil.pdf");
};
