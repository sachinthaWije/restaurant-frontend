import axios from "axios";

const API_URL="http://localhost:8090/api/auth/";

class AuthService{
    register(username, email,phone, password, role, restaurantId = null) {
        return axios.post(API_URL + 'register/customer', {
          username,
          email,
          phone,
          password,
          role,
          restaurantId
        });
      }

      login(username, password) {
        return axios.post(API_URL + 'login', {
          username,
          password
        }).then(response => {
          console.log("resp",response)
          if (response.data.jwt) {
            localStorage.setItem('user', JSON.stringify(response.data));
          }
          return response.data;
        });
      }

      logout() {
        localStorage.removeItem('user');
      }
    
      getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
      }
    
      getCurrentUserRole() {
        const user = JSON.parse(localStorage.getItem('user'));
        return user ? user.role : null;
      }
}
export default new AuthService();
