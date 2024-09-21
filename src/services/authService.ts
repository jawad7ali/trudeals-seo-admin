import axios from 'axios';
import { SignInFormData, SignUpFormData } from '../utils/userTypes';

const API_URL = 'https://api.trudeals.com';

const login = ({ email, password }: SignInFormData) : Promise<any> => {
  return axios.post(`${API_URL}/admin-login`, {
    accountType: 'ADMIN',
    username: email,
    password
  })
};

const register = (payload: SignUpFormData) : Promise<any> => {
    return axios.post(`${API_URL}/register`, payload);
}
    
const logout = () => {
  localStorage.removeItem('auth');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('auth') || '{}');
};

export default {
  login,
  register,
  logout,
  getCurrentUser
};