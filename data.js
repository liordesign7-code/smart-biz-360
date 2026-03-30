// ===========================
// SmartBiz360 - Data Layer
// ===========================

const DB_KEY = 'smartbiz360_data';

// Initial data structure
const defaultData = {
  businesses: [
    {
      id: 'biz_1',
      name: 'ליאור דיזיין',
      createdAt: new Date().toISOString()
    }
  ],
  leads: []
};

// Load all data from localStorage
function loadData() {
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) {
    saveData(defaultData);
    return defaultData;
  }
  return JSON.parse(raw);
}

// Save all data to localStorage
function saveData(data) {
  localStorage.setItem(DB_KEY, JSON.stringify(data));
}

// ---- Businesses ----

function getBusinesses() {
  return loadData().businesses;
}

function addBusiness(name) {
  const data = loadData();
  const newBiz = {
    id: 'biz_' + Date.now(),
    name: name.trim(),
    createdAt: new Date().toISOString()
  };
  data.businesses.push(newBiz);
  saveData(data);
  return newBiz;
}

function deleteBusiness(bizId) {
  const data = loadData();
  data.businesses = data.businesses.filter(b => b.id !== bizId);
  data.leads = data.leads.filter(l => l.bizId !== bizId);
  saveData(data);
}

// ---- Leads ----

function getLeads(bizId) {
  return loadData().leads.filter(l => l.bizId === bizId);
}

function addLead(bizId, leadData) {
  const data = loadData();
  const newLead = {
    id: 'lead_' + Date.now(),
    bizId: bizId,
    name: leadData.name.trim(),
    phone: leadData.phone || '',
    email: leadData.email || '',
    status: leadData.status || 'חדש',
    notes: leadData.notes || '',
    createdAt: new Date().toISOString()
  };
  data.leads.push(newLead);
  saveData(data);
  return newLead;
}

function updateLead(leadId, updates) {
  const data = loadData();
  const idx = data.leads.findIndex(l => l.id === leadId);
  if (idx !== -1) {
    data.leads[idx] = { ...data.leads[idx], ...updates };
    saveData(data);
    return data.leads[idx];
  }
  return null;
}

function deleteLead(leadId) {
  const data = loadData();
  data.leads = data.leads.filter(l => l.id !== leadId);
  saveData(data);
}
