import axiosClient from "./axiosClient";

// Create Customer
export const createCustomer = async (customerData) => {
  try {
    const res = await axiosClient.post("customers/", customerData);

    if (res.status === 201) {
      return {
        success: true,
        data: res.data,
        message: "Customer created successfully!",
      };
    }
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to create customer."
    );
  }
};

// Get All Customers
export const getCustomers = async (params = {}) => {
  try {
    const res = await axiosClient.get("customers/", { params });
    return { success: true, data: res.data };
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to fetch customers."
    );
  }
};

// Get Single Customer by ID
export const getCustomerById = async (id) => {
  try {
    const res = await axiosClient.get(`customers/${id}/`);
    return { success: true, data: res.data };
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Customer not found.");
  }
};

// Update Customer
export const updateCustomer = async (id, customerData) => {
  try {
    const res = await axiosClient.put(`customers/${id}/`, customerData);
    return {
      success: true,
      data: res.data,
      message: "Customer updated successfully!",
    };
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to update customer."
    );
  }
};

// Delete Customer
export const deleteCustomer = async (id) => {
  try {
    await axiosClient.delete(`customers/${id}/`);
    return { success: true, message: "Customer deleted successfully!" };
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to delete customer."
    );
  }
};
