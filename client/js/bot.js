// Bot Functionality
let selectedPersona = 'lawyer';
let personas = [];

document.addEventListener('DOMContentLoaded', () => {
  loadPersonas();
  setupBotUI();
  updateCreditsDisplay();
  loadConsultationHistory();
});

async function loadPersonas() {
  try {
    const result = await apiCall('/personas', 'GET');
    personas = result.personas || [];
    displayPersonas();
  } catch (error) {
    console.error('Error loading personas:', error);
  }
}

function displayPersonas() {
  const personasList = document.getElementById('personas-list');
  if (!personasList) return;
  personasList.innerHTML = personas.map(persona => `
    <button class="persona-btn ${persona.id === selectedPersona ? 'active' : ''}" onclick="selectPersona('${persona.id}')">
      <strong>${persona.name}</strong>
      <small>${persona.description}</small>
    </button>
  `).join('');
}

function selectPersona(personaId) {
  selectedPersona = personaId;
  const data = personas.find(p => p.id === personaId);
  document.getElementById('selected-persona-name').textContent = data.name;
  document.getElementById('selected-persona-desc').textContent = data.description;
  document.querySelectorAll('.persona-btn').forEach(b => b.classList.remove('active'));
  event.target.closest('.persona-btn').classList.add('active');
  showToast(`تم اختيار ${data.name}`, 'success');
}

function setupBotUI() {
  const askBtn = document.getElementById('ask-btn');
  if (askBtn) askBtn.addEventListener('click', askQuestion);
  
  const clearBtn = document.getElementById('clear-history-btn');
  if (clearBtn) clearBtn.addEventListener('click', clearHistory);
}

async function askQuestion() {
  const question = document.getElementById('question-input')?.value?.trim();
  if (!question) {
    showToast('يرجى كتابة السؤال', 'warning');
    return;
  }
  
  try {
    showLoading(true);
    const result = await apiCall('/ask', 'POST', {question, personaId: selectedPersona});
    addMessageToChat(question, 'user');
    addMessageToChat(result.response, 'bot');
    document.getElementById('question-input').value = '';
    updateCreditsDisplay();
    loadConsultationHistory();
  } catch (error) {
    showToast('خطأ في معالجة السؤال', 'error');
  } finally {
    showLoading(false);
  }
}

function addMessageToChat(content, role) {
  const messages = document.getElementById('chat-messages');
  if (!messages) return;
  const div = document.createElement('div');
  div.className = `message ${role}`;
  div.innerHTML = `<div class="message-content">${content}</div>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

async function updateCreditsDisplay() {
  if (currentUser) {
    document.getElementById('credits-display').textContent = currentUser.balance || '0';
  }
}

async function loadConsultationHistory() {
  try {
    const result = await apiCall('/history?limit=10', 'GET', null, false);
    const historyList = document.getElementById('history-list');
    if (historyList && result.history) {
      historyList.innerHTML = result.history.map(item => `
        <div class="history-item">
          <strong>${item.question.substring(0, 30)}...</strong>
          <small>${formatDate(item.created_at)}</small>
        </div>
      `).join('') || '<p class="empty-state">لا توجد استشارات</p>';
    }
  } catch (error) {
    console.error('Error loading history:', error);
  }
}

async function clearHistory() {
  if (!confirm('هل تريد حذف كل السجل؟')) return;
  try {
    await apiCall('/history', 'DELETE');
    loadConsultationHistory();
    showToast('تم حذف السجل', 'success');
  } catch (error) {
    showToast('خطأ في حذف السجل', 'error');
  }
}
