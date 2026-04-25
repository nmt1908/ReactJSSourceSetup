import axios from 'axios';

/**
 * LEO Senior Standard Reactor - Auth Service
 * @description Authentication against global user system
 */
export const authApi = {
    login: async (username, password) => {
        try {
            const response = await axios.post('http://gmo021.cansportsvg.com/api/global-user/login', {
                username,
                password
            });
            return response.data;
        } catch (error) {
            console.error("Login API Error:", error);
            throw error;
        }
    }
};
