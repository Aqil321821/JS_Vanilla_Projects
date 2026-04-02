const chatFileInput = document.getElementById('chatFile');
const searchInput = document.getElementById('searchInput');
const senderFilter = document.getElementById('senderFilter');
const mySenderSelect = document.getElementById('mySender');
const chatContainer = document.getElementById('chatContainer');
const chatTitle = document.getElementById('chatTitle');
const totalMessages = document.getElementById('totalMessages');
const totalSenders = document.getElementById('totalSenders');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const chatWrapper = document.querySelector('.chat-wrapper');

let allMessages = [];
let filteredMessages = [];
let currentUserName = '';

chatFileInput.addEventListener('change', handleFileUpload);
searchInput.addEventListener('input', applyFilters);
senderFilter.addEventListener('change', applyFilters);
mySenderSelect.addEventListener('change', handleMySenderChange);

if (fullscreenBtn) {
  let isFullscreen = false;

  fullscreenBtn.addEventListener('click', () => {
    isFullscreen = !isFullscreen;

    if (isFullscreen) {
      chatWrapper.classList.add('fullscreen');
      fullscreenBtn.textContent = '❌ Exit';
    } else {
      chatWrapper.classList.remove('fullscreen');
      fullscreenBtn.textContent = '⛶ Full Screen';
    }
  });
}

function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  chatTitle.textContent = file.name;

  const reader = new FileReader();

  reader.onload = function (event) {
    const text = event.target.result;

    allMessages = parseWhatsAppChat(text);

    populateSenderFilter(allMessages);
    populateMySenderSelect(allMessages);
    updateStats(allMessages);
    applyFilters();
  };

  reader.onerror = function () {
    showEmptyState('Could not read the file.');
  };

  reader.readAsText(file);
}

function parseWhatsAppChat(text) {
  const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalizedText.split('\n');

  const messages = [];
  let currentMessage = null;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const parsed = parseMessageStart(line);

    if (parsed) {
      if (currentMessage) {
        messages.push(currentMessage);
      }
      currentMessage = parsed;
    } else {
      if (currentMessage) {
        currentMessage.message += '\n' + rawLine;
      }
    }
  }

  if (currentMessage) {
    messages.push(currentMessage);
  }

  return messages.map((msg) => ({
    ...msg,
    message: msg.message.trim(),
  }));
}

function parseMessageStart(line) {
  // Examples:
  // 12/10/24, 9:30 pm - Ali: Hello
  // 12/10/2024, 9:30 PM - Ali: Hello
  // 12/10/24, 21:30 - Ali: Hello
  // 12/10/24, 9:30 pm - Messages to this chat and calls are now secured with end-to-end encryption.

  const regex =
    /^(\d{1,2}\/\d{1,2}\/\d{2,4}),\s(\d{1,2}:\d{2}(?:\s?[apAP][mM])?)\s-\s(.*)$/;

  const match = line.match(regex);

  if (!match) return null;

  const date = match[1];
  const time = match[2];
  const rest = match[3];

  const senderMatch = rest.match(/^([^:]+):\s([\s\S]*)$/);

  if (senderMatch) {
    return {
      date,
      time,
      sender: senderMatch[1].trim(),
      message: senderMatch[2].trim(),
      type: 'user',
    };
  }

  return {
    date,
    time,
    sender: 'System',
    message: rest.trim(),
    type: 'system',
  };
}

function populateSenderFilter(messages) {
  const senders = getUniqueUserSenders(messages);

  senderFilter.innerHTML = `<option value="all">All Senders</option>`;

  senders.forEach((sender) => {
    const option = document.createElement('option');
    option.value = sender;
    option.textContent = sender;
    senderFilter.appendChild(option);
  });

  const systemExists = messages.some((msg) => msg.type === 'system');

  if (systemExists) {
    const systemOption = document.createElement('option');
    systemOption.value = 'System';
    systemOption.textContent = 'System';
    senderFilter.appendChild(systemOption);
  }

  totalSenders.textContent = senders.length;
}

function populateMySenderSelect(messages) {
  const senders = getUniqueUserSenders(messages);

  mySenderSelect.innerHTML = `<option value="">Select Your Name</option>`;

  senders.forEach((sender) => {
    const option = document.createElement('option');
    option.value = sender;
    option.textContent = sender;
    mySenderSelect.appendChild(option);
  });

  const autoCandidate = senders.find((sender) => {
    const lower = sender.toLowerCase();
    return lower === 'you' || lower === 'me';
  });

  if (autoCandidate) {
    currentUserName = autoCandidate;
    mySenderSelect.value = autoCandidate;
  } else {
    currentUserName = '';
  }
}

function handleMySenderChange() {
  currentUserName = mySenderSelect.value;
  applyFilters();
}

function applyFilters() {
  const searchValue = searchInput.value.toLowerCase().trim();
  const selectedSender = senderFilter.value;

  filteredMessages = allMessages.filter((msg) => {
    const searchableText = `${msg.sender} ${msg.message}`.toLowerCase();

    const matchesSearch = searchableText.includes(searchValue);

    const matchesSender =
      selectedSender === 'all' ||
      msg.sender === selectedSender ||
      (selectedSender === 'System' && msg.type === 'system');

    return matchesSearch && matchesSender;
  });

  renderMessages(filteredMessages);
  updateFilteredStats(filteredMessages);
}

function renderMessages(messages) {
  chatContainer.innerHTML = '';

  if (!messages.length) {
    showEmptyState('No messages found.');
    return;
  }

  let lastDate = '';

  messages.forEach((msg) => {
    if (msg.date !== lastDate) {
      chatContainer.appendChild(createDateDivider(msg.date));
      lastDate = msg.date;
    }

    let messageElement;

    if (msg.type === 'system') {
      messageElement = createSystemMessage(msg);
    } else {
      messageElement = createUserMessage(msg);
    }

    chatContainer.appendChild(messageElement);
  });
}

function createDateDivider(date) {
  const dateDivider = document.createElement('div');
  dateDivider.className = 'date-divider';
  dateDivider.textContent = date;
  return dateDivider;
}

function createSystemMessage(msg) {
  const wrapper = document.createElement('div');
  wrapper.className = 'message-row received';

  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';
  bubble.style.background = '#fff3cd';
  bubble.style.borderRadius = '12px';
  bubble.style.maxWidth = '85%';

  bubble.innerHTML = `
    <div class="sender-name" style="color:#856404;">System</div>
    <div class="message-text">${formatMessageText(msg.message)}</div>
    <div class="message-time">${escapeHTML(msg.time)}</div>
  `;

  wrapper.appendChild(bubble);
  return wrapper;
}

function createUserMessage(msg) {
  const row = document.createElement('div');

  const isSent =
    currentUserName &&
    msg.sender.toLowerCase().trim() === currentUserName.toLowerCase().trim();

  row.className = `message-row ${isSent ? 'sent' : 'received'}`;

  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';

  bubble.innerHTML = `
    <div class="sender-name">${escapeHTML(msg.sender)}</div>
    <div class="message-text">${formatMessageText(msg.message)}</div>
    <div class="message-time">${escapeHTML(msg.time)}</div>
  `;

  row.appendChild(bubble);
  return row;
}

function updateStats(messages) {
  const userSenders = getUniqueUserSenders(messages);
  totalMessages.textContent = messages.length;
  totalSenders.textContent = userSenders.length;
}

function updateFilteredStats(messages) {
  const userSenders = getUniqueUserSenders(messages);
  totalMessages.textContent = messages.length;
  totalSenders.textContent = userSenders.length;
}

function getUniqueUserSenders(messages) {
  return [
    ...new Set(
      messages
        .filter((msg) => msg.type === 'user')
        .map((msg) => msg.sender)
    ),
  ];
}

function showEmptyState(message) {
  chatContainer.innerHTML = `
    <div class="empty-state">
      <p>${escapeHTML(message)}</p>
    </div>
  `;
}

function formatMessageText(text) {
  return escapeHTML(text).replace(/\n/g, '<br>');
}

function escapeHTML(str = '') {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}