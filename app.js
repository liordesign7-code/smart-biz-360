// ===========================
// SmartBiz360 - App Logic
// ===========================

// ---- Shared Utilities ----

function getCurrentBizId() {
  return sessionStorage.getItem('currentBizId');
}

function setCurrentBiz(bizId) {
  sessionStorage.setItem('currentBizId', bizId);
}

function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString('he-IL');
}

// ===========================
// INDEX PAGE LOGIC
// ===========================

function initIndexPage() {
  renderBusinessList();

  document.getElementById('addBizBtn').addEventListener('click', () => {
    const input = document.getElementById('newBizName');
    const name = input.value.trim();
    if (!name) return alert('נא להזין שם עסק');
    addBusiness(name);
    input.value = '';
    renderBusinessList();
  });
}

function renderBusinessList() {
  const list = document.getElementById('bizList');
  const businesses = getBusinesses();
  list.innerHTML = '';

  if (businesses.length === 0) {
    list.innerHTML = '<p class="empty">אין עסקים עדיין</p>';
    return;
  }

  businesses.forEach(biz => {
    const leads = getLeads(biz.id);
    const card = document.createElement('div');
    card.className = 'biz-card';
    card.innerHTML = `
      <div class="biz-info" onclick="openBiz('${biz.id}')">
        <h3>${biz.name}</h3>
        <span class="biz-meta">${leads.length} לידים · נוצר ${formatDate(biz.createdAt)}</span>
      </div>
      <button class="btn-delete" onclick="handleDeleteBiz('${biz.id}')">🗑</button>
    `;
    list.appendChild(card);
  });
}

function openBiz(bizId) {
  setCurrentBiz(bizId);
  window.location.href = 'crm.html';
}

function handleDeleteBiz(bizId) {
  if (!confirm('למחוק את העסק וכל הלידים שלו?')) return;
  deleteBusiness(bizId);
  renderBusinessList();
}

// ===========================
// CRM PAGE LOGIC
// ===========================

function initCrmPage() {
  const bizId = getCurrentBizId();
  if (!bizId) {
    window.location.href = 'index.html';
    return;
  }

  const businesses = getBusinesses();
  const biz = businesses.find(b => b.id === bizId);
  if (!biz) {
    window.location.href = 'index.html';
    return;
  }

  document.getElementById('bizName').textContent = biz.name;
  renderLeads(bizId);

  document.getElementById('addLeadBtn').addEventListener('click', () => {
    document.getElementById('leadForm').style.display = 'block';
  });

  document.getElementById('cancelLeadBtn').addEventListener('click', () => {
    document.getElementById('leadForm').style.display = 'none';
    clearLeadForm();
  });

  document.getElementById('saveLeadBtn').addEventListener('click', () => {
    const name = document.getElementById('leadName').value.trim();
    if (!name) return alert('שם ליד הוא שדה חובה');

    addLead(bizId, {
      name,
      phone: document.getElementById('leadPhone').value,
      email: document.getElementById('leadEmail').value,
      status: document.getElementById('leadStatus').value,
      notes: document.getElementById('leadNotes').value
    });

    document.getElementById('leadForm').style.display = 'none';
    clearLeadForm();
    renderLeads(bizId);
  });
}

function renderLeads(bizId) {
  const leads = getLeads(bizId);
  const container = document.getElementById('leadsList');
  container.innerHTML = '';

  if (leads.length === 0) {
    container.innerHTML = '<p class="empty">אין לידים עדיין. הוסף את הראשון!</p>';
    return;
  }

  leads.forEach(lead => {
    const card = document.createElement('div');
    card.className = 'lead-card';
    card.innerHTML = `
      <div class="lead-header">
        <strong>${lead.name}</strong>
        <span class="status status-${slugify(lead.status)}">${lead.status}</span>
      </div>
      ${lead.phone ? `<div class="lead-detail">📞 <a href="tel:${lead.phone}">${lead.phone}</a></div>` : ''}
      ${lead.email ? `<div class="lead-detail">✉️ <a href="mailto:${lead.email}">${lead.email}</a></div>` : ''}
      ${lead.notes ? `<div class="lead-notes">${lead.notes}</div>` : ''}
      <div class="lead-footer">
        <span class="lead-date">${formatDate(lead.createdAt)}</span>
        <div class="lead-actions">
          <select onchange="handleStatusChange('${lead.id}', this.value, '${bizId}')">
            ${['חדש','בטיפול','סגור','לא רלוונטי'].map(s =>
              `<option ${s === lead.status ? 'selected' : ''}>${s}</option>`
            ).join('')}
          </select>
          <button class="btn-delete" onclick="handleDeleteLead('${lead.id}', '${bizId}')">🗑</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function handleStatusChange(leadId, newStatus, bizId) {
  updateLead(leadId, { status: newStatus });
  renderLeads(bizId);
}

function handleDeleteLead(leadId, bizId) {
  if (!confirm('למחוק ליד זה?')) return;
  deleteLead(leadId);
  renderLeads(bizId);
}

function clearLeadForm() {
  ['leadName','leadPhone','leadEmail','leadNotes'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('leadStatus').value = 'חדש';
}

function slugify(str) {
  const map = { 'חדש': 'new', 'בטיפול': 'active', 'סגור': 'closed', 'לא רלוונטי': 'irrelevant' };
  return map[str] || 'new';
}
