import axiosClient from "./axiosClient";

export const getTenants = async () => {
  try {
    const res = await axiosClient.get("tenants/");
    // if API returns { success: true, data: [...] }, use res.data.data
    return res.data || res;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Failed to fetch tenants.");
  }
};

// Create Item Category
export const createItemCategory = async (data) => {
  try {
    const res = await axiosClient.post("item-categories/", data);
    if (res.status === 201) {
      return {
        success: true,
        data: res.data,
        message: "Item category created successfully!",
      };
    }
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to create item category."
    );
  }
};

// Get All Item Categories
export const getItemCategories = async (params = {}) => {
  try {
    const res = await axiosClient.get("item-categories/", { params });
    return { success: true, data: res.data };
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to fetch item categories."
    );
  }
};

// Get Item Category by ID
export const getItemCategoryById = async (id) => {
  try {
    const res = await axiosClient.get(`item-categories/${id}/`);
    return { success: true, data: res.data };
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Item category not found.");
  }
};

// Update Item Category
export const updateItemCategory = async (id, data) => {
  try {
    const res = await axiosClient.patch(`item-categories/${id}/`, data);
    return {
      success: true,
      data: res.data,
      message: "Item category updated successfully!",
    };
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to update item category."
    );
  }
};

// Delete Item Category
export const deleteItemCategory = async (id) => {
  try {
    await axiosClient.delete(`item-categories/${id}/`);
    return { success: true, message: "Item category deleted successfully!" };
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to delete item category."
    );
  }
};

// ================= ITEMS =================

// Create Item
export const createItem = async (data) => {
  try {
    const res = await axiosClient.post("items/", data);
    if (res.status === 201) {
      return {
        success: true,
        data: res.data,
        message: "Item created successfully!",
      };
    }
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Failed to create item.");
  }
};

// Get All Items
export const getItems = async (params = {}) => {
  try {
    const res = await axiosClient.get("items/", { params });
    return { success: true, data: res.data };
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Failed to fetch items.");
  }
};

// Get Item by ID
export const getItemById = async (id) => {
  try {
    const res = await axiosClient.get(`items/${id}/`);
    return { success: true, data: res.data };
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Item not found.");
  }
};

// Update Item
export const updateItem = async (id, data) => {
  try {
    const res = await axiosClient.patch(`items/${id}/`, data);
    return {
      success: true,
      data: res.data,
      message: "Item updated successfully!",
    };
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Failed to update item.");
  }
};

// Delete Item
export const deleteItem = async (id) => {
  try {
    await axiosClient.delete(`items/${id}/`);
    return { success: true, message: "Item deleted successfully!" };
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Failed to delete item.");
  }
};

// Create Item Price
export const createItemPrice = async (data) => {
  try {
    const res = await axiosClient.post("item-prices/", data);
    if (res.status === 201) {
      return {
        success: true,
        data: res.data,
        message: "Item price created successfully!",
      };
    }
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to create item price."
    );
  }
};

// Get All Item Prices
export const getItemPrices = async (params = {}) => {
  try {
    const res = await axiosClient.get("item-prices/", { params });
    return { success: true, data: res.data };
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to fetch item prices."
    );
  }
};

// Get Item Price by ID
export const getItemPriceById = async (id) => {
  try {
    const res = await axiosClient.get(`item-prices/${id}/`);
    return { success: true, data: res.data };
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Item price not found.");
  }
};

// Update Item Price
export const updateItemPrice = async (id, data) => {
  try {
    const res = await axiosClient.patch(`item-prices/${id}/`, data);
    return {
      success: true,
      data: res.data,
      message: "Item price updated successfully!",
    };
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to update item price."
    );
  }
};

// Delete Item Price
export const deleteItemPrice = async (id) => {
  try {
    await axiosClient.delete(`item-prices/${id}/`);
    return { success: true, message: "Item price deleted successfully!" };
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to delete item price."
    );
  }
};
