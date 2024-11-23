export const setAuthToken = (token: string): boolean => {
  if (token) {
    localStorage.setItem("token", token);
    return true;
  }
  return false;
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

export const removeAuthToken = (): void => {
  localStorage.removeItem("token");
};
