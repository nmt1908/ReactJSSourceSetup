import axiosClient from './axiosClient';

/**
 * Service to handle mold-related operations
 */
export const moldApi = {
    /**
     * Get unique list of Nike Tool Codes (Models)
     */
    getModels: async () => {
        const response = await axiosClient.get('/api/mold/models');
        return response; // Assuming format { status: "success", data: [...] }
    },

    /**
     * Get unique sizes for a specific model
     */
    getSizes: async (model) => {
        const response = await axiosClient.get('/api/mold/sizes', {
            params: { model }
        });
        return response;
    },

    /**
     * Get mold names for a specific model and size
     */
    getNames: async (model, size) => {
        const response = await axiosClient.get('/api/mold/names', {
            params: { model, size }
        });
        return response;
    },

    /**
     * Find mold ID based on model, size, and name
     */
    findMoldId: async (model, size, name) => {
        const response = await axiosClient.get('/api/mold/find', {
            params: { model, size, name }
        });
        return response;
    },

    /**
     * Mount a mold onto a machine
     */
    mountMold: async (machineId, moldId, empNo) => {
        const response = await axiosClient.post('/api/mold/mount', {
            machine_id: machineId,
            mold_id: moldId,
            emp_no: empNo
        });
        return response;
    },

    /**
     * Unmount a mold from a machine
     */
    unmountMold: async (machineId, empNo) => {
        const response = await axiosClient.post('/api/mold/unmount', {
            machine_id: machineId,
            emp_no: empNo
        });
        return response;
    },

    /**
     * Get currently mounted mold for a machine
     */
    getCurrentMold: async (machineId) => {
        const response = await axiosClient.get(`/api/mold/current/${machineId}`);
        return response;
    },

    /**
     * Get all currently mounted molds (for Dashboard)
     */
    getAllActiveMolds: async () => {
        const response = await axiosClient.get('/api/mold/all_active');
        return response;
    },

    /**
     * Get mounting history logs
     */
    getHistory: async (sort = 'date') => {
        const response = await axiosClient.get('/api/mold/history', {
            params: { sort }
        });
        return response;
    }
};
