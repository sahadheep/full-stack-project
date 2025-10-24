const KEY = 'scaler_updates_auth';

function setTokens({ access, user, expiresIn }) {
  try {
    const payload = {
      access,
      user,
      expiresAt: expiresIn ? Date.now() + (expiresIn * 1000) : null
    };
    sessionStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    // noop
  }
}

function getTokens() {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    
    const data = JSON.parse(raw);
    
    // Check if token is expired
    if (data.expiresAt && Date.now() >= data.expiresAt) {
      clearTokens();
      return null;
    }
    
    return {
      access: data.access,
      user: data.user
    };
  } catch {
    return null;
  }
}

function clearTokens() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // noop
  }
}

export default { setTokens, getTokens, clearTokens };
