import axiosClient from './axiosClient';

/**
 * Service to handle dynamic machine lookups and data
 */
export const machineApi = {
    /**
     * Look up machine ID and status by scanning the MTS code (QR)
     * This query hits the DB to ensure new machines are automatically supported.
     */
    getMachineByMtsCode: async (mtsCode) => {
        try {
            // Simplified to hit the direct endpoint suggested by the user
            const response = await axiosClient.get(`/machine_qr_lookup`, {
                params: { qr_code: mtsCode }
            });

            
            // Expected format: { status: "success", data: { id: "F1_01", ... } }
            if (response.status === "success" && response.data) {
                // Ensure the ID is in the format F1_XX
                let machineId = response.data.id;
                if (!machineId.startsWith('F1_')) {
                    machineId = `F1_${machineId.toString().padStart(2, '0')}`;
                }
                return { id: machineId };
            }
            
            throw new Error(response.message || "Không tìm thấy thông tin máy");
        } catch (error) {
            console.error("DB Query failed:", error);
            throw error;
        }
    }
};
