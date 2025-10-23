import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categories: [],
  flatCategories: [], // Flattened for easier dropdown rendering
  loading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
      // Flatten categories for dropdown
      state.flatCategories = flattenCategories(action.payload);
    },
    addCategory: (state, action) => {
      state.categories.push(action.payload);
      state.flatCategories = flattenCategories(state.categories);
    },
    updateCategory: (state, action) => {
      const updateCategoryRecursive = (categories, updatedCategory) => {
        return categories.map(category => {
          if (category.category_uuid === updatedCategory.category_uuid) {
            return { ...category, ...updatedCategory };
          }
          if (category.children && category.children.length > 0) {
            return {
              ...category,
              children: updateCategoryRecursive(category.children, updatedCategory)
            };
          }
          return category;
        });
      };
      state.categories = updateCategoryRecursive(state.categories, action.payload);
      state.flatCategories = flattenCategories(state.categories);
    },
    removeCategory: (state, action) => {
      const removeCategoryRecursive = (categories, categoryUuid) => {
        return categories.filter(category => {
          if (category.category_uuid === categoryUuid) {
            return false;
          }
          if (category.children && category.children.length > 0) {
            category.children = removeCategoryRecursive(category.children, categoryUuid);
          }
          return true;
        });
      };
      state.categories = removeCategoryRecursive(state.categories, action.payload);
      state.flatCategories = flattenCategories(state.categories);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

// Helper function to flatten categories
const flattenCategories = (categories, level = 0, parentName = '') => {
  let flattened = [];
  categories.forEach(category => {
    const displayName = parentName ? `${parentName} > ${category.name}` : category.name;
    flattened.push({
      ...category,
      level,
      displayName,
      fullPath: parentName ? `${parentName} > ${category.name}` : category.name,
    });
    if (category.children && category.children.length > 0) {
      flattened = flattened.concat(
        flattenCategories(category.children, level + 1, displayName)
      );
    }
  });
  return flattened;
};

export const {
  setCategories,
  addCategory,
  updateCategory,
  removeCategory,
  setLoading,
  setError,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;