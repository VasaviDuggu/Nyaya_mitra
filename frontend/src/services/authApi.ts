export interface UserProfile {
  id: number;
  full_name: string;
  email?: string;
  phone_number?: string;
  auth_provider: string;
}

export interface UserDocument {
  id: number;
  filename: string;
  doc_type: string;
  uploaded_at: string;
  summary: string;
  extracted_dates: any[];
  legal_references: any[];
  checklist: any[];
  response_template: string;
}

export interface AuthResponse {
  status: string;
  token?: string;
  user?: UserProfile;
  message?: string;
  is_registered?: boolean;
  documents?: UserDocument[];
}

async function safeFetch(url: string, options: RequestInit): Promise<any> {
  let res: Response | null = null;
  
  try {
    res = await fetch(`http://localhost:8000${url}`, options);
  } catch (directErr) {
    try {
      res = await fetch(url, options);
    } catch (proxyErr) {
      throw new Error("Backend server is offline! Please start the Python backend by running 'python -m uvicorn main:app --reload' in your backend terminal.");
    }
  }

  if (!res) {
    throw new Error("Backend server is offline! Please start the Python backend by running 'python -m uvicorn main:app --reload' in your backend terminal.");
  }

  const text = await res.text();
  let data: any = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { detail: text };
    }
  }

  if (!res.ok) {
    if (res.status === 500 && (text.includes("ECONNREFUSED") || text.includes("500 Internal Server Error"))) {
      throw new Error("Backend server is offline! Please start the Python backend by running 'python -m uvicorn main:app --reload' in your backend terminal.");
    }
    const errorMsg = data.detail || data.message || `Server error (${res.status})`;
    throw new Error(errorMsg);
  }

  return data;
}

export const authApi = {
  async sendEmailOTP(email: string): Promise<AuthResponse> {
    return await safeFetch('/api/auth/send-email-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
  },

  async verifyEmailOTP(fullName: string, email: string, otp: string, password: string): Promise<AuthResponse> {
    return await safeFetch('/api/auth/verify-email-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: fullName, email, otp, password }),
    });
  },

  async signupWithEmail(fullName: string, email: string, password: string): Promise<AuthResponse> {
    return await safeFetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: fullName, email, password }),
    });
  },

  async loginWithEmail(email: string, password: string): Promise<AuthResponse> {
    return await safeFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  },

  async sendPhoneOTP(phoneNumber: string): Promise<AuthResponse> {
    return await safeFetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number: phoneNumber }),
    });
  },

  async verifyPhoneOTP(phoneNumber: string, otp: string, fullName?: string): Promise<AuthResponse> {
    return await safeFetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number: phoneNumber, otp, full_name: fullName }),
    });
  },

  async fetchCurrentUser(token: string): Promise<AuthResponse> {
    return await safeFetch('/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
  }
};
