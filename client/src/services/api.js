import { io } from 'socket.io-client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let authToken = localStorage.getItem('jeevansetu_token') || null;

export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    localStorage.setItem('jeevansetu_token', token);
  } else {
    localStorage.removeItem('jeevansetu_token');
  }
};

export const getAuthToken = () => authToken;

// Generic Fetch Wrapper with Authorization header
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
    ...options.headers
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `HTTP ${res.status}`);
    }
    return data;
  } catch (err) {
    // Return custom error object for graceful degradation
    throw err;
  }
}

// --------------------------------------------------------------------
// Authentication API
// --------------------------------------------------------------------
export const authApi = {
  login: async (email, password) => {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (data.token) {
      setAuthToken(data.token);
    }
    return data;
  },

  register: async (userData) => {
    const data = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    if (data.token) {
      setAuthToken(data.token);
    }
    return data;
  },

  getProfile: async () => {
    return request('/auth/profile');
  },

  logout: () => {
    setAuthToken(null);
  }
};

// --------------------------------------------------------------------
// Blood Requests API
// --------------------------------------------------------------------
export const requestsApi = {
  create: async (requestData) => {
    return request('/requests', {
      method: 'POST',
      body: JSON.stringify(requestData)
    });
  },

  list: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/requests?${query}`);
  },

  getByCode: async (code) => {
    return request(`/requests/${code}`);
  },

  verify: async (id, verificationNotes) => {
    return request(`/requests/${id}/verify`, {
      method: 'PUT',
      body: JSON.stringify({ verification_notes: verificationNotes })
    });
  },

  updateStatus: async (id, status, remarks) => {
    return request(`/requests/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, remarks })
    });
  }
};

// --------------------------------------------------------------------
// Blood Banks & Inventory API
// --------------------------------------------------------------------
export const bloodBanksApi = {
  list: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/blood-banks?${query}`);
  },

  updateInventory: async (bankId, inventory) => {
    return request(`/blood-banks/${bankId}/inventory`, {
      method: 'PUT',
      body: JSON.stringify({ inventory })
    });
  }
};

// --------------------------------------------------------------------
// Donor Coordination API
// --------------------------------------------------------------------
export const donorApi = {
  register: async (donorData) => {
    return request('/donors/register', {
      method: 'POST',
      body: JSON.stringify(donorData)
    });
  },

  updateAvailability: async (availability, receiveEmergencyAlerts) => {
    return request('/donors/availability', {
      method: 'PUT',
      body: JSON.stringify({
        availability,
        receive_emergency_alerts: receiveEmergencyAlerts
      })
    });
  },

  getMatchedRequests: async () => {
    return request('/donors/matched-requests');
  },

  respondToRequest: async (requestId, decision) => {
    return request('/donors/respond', {
      method: 'POST',
      body: JSON.stringify({ request_id: requestId, decision })
    });
  }
};

// --------------------------------------------------------------------
// Admin API
// --------------------------------------------------------------------
export const adminApi = {
  getAnalytics: async () => {
    return request('/admin/analytics');
  },

  getAuditLogs: async () => {
    return request('/admin/audit-logs');
  },

  getAbuseReports: async () => {
    return request('/admin/abuse-reports');
  }
};

// --------------------------------------------------------------------
// Real-Time Socket.IO
// --------------------------------------------------------------------
let socket = null;

export const initSocket = (onNotification) => {
  if (!socket) {
    try {
      socket = io(SOCKET_URL, {
        reconnectionAttempts: 3,
        timeout: 5000
      });

      socket.on('connect', () => {
        console.log('[Socket.IO Client] Connected to JEEVANSETU coordination hub');
      });

      socket.on('new_request_broadcast', (data) => {
        if (onNotification) onNotification({ type: 'NEW_REQUEST', data });
      });

      socket.on('request_status_updated', (data) => {
        if (onNotification) onNotification({ type: 'STATUS_UPDATE', data });
      });
    } catch (e) {
      console.warn('[Socket.IO] Offline or server unavailable');
    }
  }
  return socket;
};

