const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = {
    // Auth
    login: async (username: string, password: string) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        return response.json();
    },

    // Users
    getUsers: async () => {
        const response = await fetch(`${API_URL}/users`);
        return response.json();
    },

    createUser: async (userData: any) => {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        return response.json();
    },

    deleteUser: async (id: string) => {
        await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
    },

    // Products
    getProducts: async () => {
        const response = await fetch(`${API_URL}/products`);
        return response.json();
    },

    createProduct: async (productData: any) => {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
        });
        return response.json();
    },

    updateProduct: async (id: string, productData: any) => {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
        });
        return response.json();
    },

    deleteProduct: async (id: string) => {
        await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
    },

    uploadProductImage: async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`${API_URL}/products/upload`, {
            method: 'POST',
            body: formData,
        });
        return response.json();
    },

    // Orders
    getOrders: async () => {
        const response = await fetch(`${API_URL}/orders`);
        return response.json();
    },

    createOrder: async (orderData: any) => {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
        });
        return response.json();
    },

    updateOrderStatus: async (id: string, status: string) => {
        const response = await fetch(`${API_URL}/orders/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });
        return response.json();
    },
};
