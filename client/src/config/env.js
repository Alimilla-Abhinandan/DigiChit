// Environment configuration utility
const config = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  
  // Razorpay Configuration
  RAZORPAY_KEY_ID: import.meta.env.VITE_RAZORPAY_KEY_ID,
  
  // Environment
  NODE_ENV: import.meta.env.VITE_NODE_ENV,
  
  // API Endpoints
  get endpoints() {
    return {
      auth: {
        signin: `${this.API_BASE_URL}/auth/signin`,
        signup: `${this.API_BASE_URL}/auth/signup`,
        profile: `${this.API_BASE_URL}/auth/profile`,
        searchUsers: `${this.API_BASE_URL}/auth/search-users`
      },
      group: {
        create: `${this.API_BASE_URL}/group/create`,
        myGroups: `${this.API_BASE_URL}/group/my-groups`,
        available: `${this.API_BASE_URL}/group/available`,
        details: (groupId) => `${this.API_BASE_URL}/group/${groupId}`,
        requestJoin: (groupId) => `${this.API_BASE_URL}/group/request-join/${groupId}`,
        requests: (groupId) => `${this.API_BASE_URL}/group/requests/${groupId}`,
        requestAction: (groupId, requestId) => `${this.API_BASE_URL}/group/requests/${groupId}/${requestId}`
      },
      payment: {
        createOrder: `${this.API_BASE_URL}/payment/create-order`,
        verifyPayment: `${this.API_BASE_URL}/payment/verify-payment`
      }
    };
  }
};

export default config;
