import axiosClient from "./axiosClient";

// Get all tenants
export const getTenants = async () => {
  try {
    const res = await axiosClient.get("tenants/");
    return res.data;
  } catch (error) {
    if (error.response?.data) {
      throw new Error(JSON.stringify(error.response.data));
    }
    throw new Error("Failed to fetch tenants.");
  }
};

// Create a new tenant
export const createTenant = async (data) => {
  try {
    const res = await axiosClient.post("tenants/", data);
    return res.data;
  } catch (error) {
    if (error.response?.data) {
      throw new Error(JSON.stringify(error.response.data));
    }
    throw new Error("Failed to create tenant.");
  }
};

// Get tenant by ID
export const getTenantById = async (id) => {
  try {
    const res = await axiosClient.get(`tenants/${id}/`);
    return res.data;
  } catch (error) {
    if (error.response?.data) {
      throw new Error(JSON.stringify(error.response.data));
    }
    throw new Error("Failed to fetch tenant.");
  }
};

// Update tenant by ID
export const updateTenant = async (id, data) => {
  try {
    const res = await axiosClient.patch(`tenants/${id}/`, data);
    return res.data;
  } catch (error) {
    if (error.response?.data) {
      throw new Error(JSON.stringify(error.response.data));
    }
    throw new Error("Failed to update tenant.");
  }
};

// Delete tenant by ID
export const deleteTenant = async (id) => {
  try {
    const res = await axiosClient.delete(`tenants/${id}/`);
    return res.data;
  } catch (error) {
    if (error.response?.data) {
      throw new Error(JSON.stringify(error.response.data));
    }
    throw new Error("Failed to delete tenant.");
  }
};
