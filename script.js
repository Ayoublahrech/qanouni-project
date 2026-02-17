/**
 * QANOUNI - Moteur d'Intelligence Juridique (v4.1)
 * Intelligence augmentée pour le Droit Marocain
 */

const API_KEY = "AIzaSyDMruCz9cDkT9ilzvvfN7HOKUJkCGi9dAY";
const MODEL_NAME = "gemini-2.5-flash-preview-09-2025";
const OFFICIAL_DOMAINS = [".gov.ma", ".ma", "sgg.gov.ma", "justice.gov.ma", "bulletin-officiel.ma"];

const chatWindow = document.getElementById('chatWindow');
const welcomeScreen = document.getElementById('welcomeScreen');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const loadingIndicator = document.getElementById('loadingIndicator');

// SYSTÈME D'INSTRUCTION EXPERT (Prompt Engineering v4.1)
const SYSTEM_PROMPT = `Tu es QANOUNI, l'assistant IA officiel dédié au droit marocain.
Ton rôle est de démocratiser l'accès à la justice marocaine avec précision et rigueur.

RÈGLES DE COMPORTEMENT :
1. CADRE LÉGAL : Réponds exclusivement selon la législation du Royaume du Maroc. Si une question concerne un autre pays, précise que tu es limité au droit marocain.
2. STRUCTURE DES RÉPONSES :
   - Commence par une réponse directe et simplifiée.
   - Détaille ensuite les fondements juridiques (ex: "Conformément à l'Article X du Dahir n°...").
   - Liste les étapes de procédure si nécessaire.
3. SOURCES : Cite impérativement les sources officielles (Bulletin Officiel, Portail de la Justice, SGG).
4. LANGUES : 
   - Si l'utilisateur écrit en Français, réponds en Français.
   - Si l'utilisateur écrit en Arabe ou en Darija, réponds en Arabe avec une clarté maximale.
   - Si le sujet est complexe, propose une brève explication en Darija (phonétique ou arabe) pour la vulgarisation.
5. SÉCURITÉ : Ne donne jamais de conseils personnels définitifs. Ajoute toujours : "Cette réponse est à titre informatif, consultez un avocat ou un adoul pour votre cas spécifique."
6. INTERDICTION : Ne génère jamais de contenu politique, religieux ou critique envers les institutions.`;

sendBtn.addEventListener('click', handleUserQuery);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleUserQuery(); });

async function handleUserQuery() {
    const query = userInput.value.trim();
    if (!query) return;

    if (welcomeScreen) welcomeScreen.remove();
    userInput.value = '';
    appendMessage('user', query);
    showLoading(true);

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
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "L'IA n'a pas pu générer de réponse. Vérifiez votre connexion.";
        const sources = data.candidates?.[0]?.groundingMetadata?.groundingAttributions || [];

        // Filtrage des sources pour ne garder que le .gov.ma ou .ma
        const officialSources = sources.filter(src => 
            OFFICIAL_DOMAINS.some(domain => src.web?.uri?.toLowerCase().includes(domain))
        );

        appendMessage('ai', aiText, officialSources);
    } catch (error) {
        console.error("Erreur:", error);
        appendMessage('ai', "Une erreur technique est survenue. L'API Gemini est peut-être saturée.");
    } finally {
        showLoading(false);
    }
}

function appendMessage(role, text, sources = []) {
    const msgDiv = document.createElement('div');
    msgDiv.className = role === 'user' ? 'flex justify-end mb-6' : 'flex justify-start mb-6';
    
    let sourceHtml = '';
    if (sources.length > 0) {
        sourceHtml = `
        <div class="mt-4 pt-3 border-t border-emerald-200">
            <p class="text-[9px] font-bold text-emerald-800 uppercase mb-2 tracking-widest">Sources Officielles Identifiées :</p>
            <div class="flex flex-wrap gap-2">
                ${sources.map(s => `
                    <a href="${s.web.uri}" target="_blank" class="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-[10px] px-2 py-1 rounded border border-emerald-300 transition-colors flex items-center gap-1">
                        <i class="fas fa-external-link-alt"></i> ${s.web.title.substring(0, 30)}...
                    </a>
                `).join('')}
            </div>
        </div>`;
    }

    const contentClass = role === 'user' 
        ? 'bg-emerald-900 text-white rounded-2xl rounded-tr-none px-5 py-4 shadow-lg' 
        : 'bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-none px-5 py-4 shadow-md';

    msgDiv.innerHTML = `
        <div class="${contentClass} max-w-[90%] md:max-w-[80%]">
            <div class="text-sm leading-relaxed">${text.replace(/\n/g, '<br>')}</div>
            ${sourceHtml}
        </div>`;

    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function showLoading(show) {
    loadingIndicator.classList.toggle('hidden', !show);
}
