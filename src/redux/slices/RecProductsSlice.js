const {createSlice} = require('@reduxjs/toolkit');

const RecProductsSlice = createSlice({
  name: 'recproducts',
  initialState: {
    data: null,
    isLoading: false,
  },
  reducers: {
    addRecProducts(state, action) {
      state.data = action.payload;
    },
  },
});
export const {addRecProducts} = RecProductsSlice.actions;
export default RecProductsSlice.reducer;
