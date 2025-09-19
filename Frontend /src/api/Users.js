import axiosClient from "./axiosClient";

// Get all users
export const getUsers = async () => {
  try {
    const res = await axiosClient.get("users/");
    return res.data;
  } catch (err) {
    console.error("Failed to fetch users:", err.message);
    throw err;
  }
};

// Create a new user
export const createUser = async (data) => {
  try {
    const res = await axiosClient.post("users/", data);
    return res.data; // returns created user with id
  } catch (err) {
    console.error("Failed to create user:", err.message);
    throw err;
  }
};

// Get user by ID
export const getUserById = async (id) => {
  try {
    const res = await axiosClient.get(`users/${id}/`);
    return res.data;
  } catch (err) {
    console.error(`Failed to get user ${id}:`, err.message);
    throw err;
  }
};

// Update user by ID
export const updateUser = async (id, data) => {
  try {
    const res = await axiosClient.patch(`users/${id}/`, data);
    return res.data;
  } catch (err) {
    console.error(`Failed to update user ${id}:`, err.message);
    throw err;
  }
};

// Delete user by ID
export const deleteUser = async (id) => {
  try {
    const res = await axiosClient.delete(`users/${id}/`);
    return res.data;
  } catch (err) {
    console.error(`Failed to delete user ${id}:`, err.message);
    throw err;
  }
};
