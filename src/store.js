import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const fetchAssets = createAsyncThunk("people/getPrices", async () => {
    const prices = await fetch(
        "https://raw.githubusercontent.com/NearDeFi/token-prices/main/ref-prices.json",
    ).then((r) => r.json());
    return prices;
})
const peopleSlice = createSlice({
  name: 'people',
  initialState: {
    name: 'xieqian',
    age: '34',
    height: '160',
    weight: '100',
    tokenPrices: null,
    status: null,
  },
  reducers: {
    changeName: (state, action) => {
        state.name = action.payload;
    },
    changeAge: (state, action) => {
        state.age = action.payload;
    },
    changeHeight: (state, action) => {
        state.height = action.payload;
    },
    changeWeight: (state, action) => {
        state.weight = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAssets.pending, (state, action) => {
        state.status = 'pending'
    });
    builder.addCase(fetchAssets.fulfilled, (state, action) => {
        state.status = 'fulfilled';
        state.tokenPrices = action.payload;
    });
    builder.addCase(fetchAssets.rejected, (state, action) => {
        state.status = 'rejected';
    })
  }
})

const { changeName, changeAge, changeHeight, changeWeight } = peopleSlice.actions;
const people_reducer = peopleSlice.reducer;

export default configureStore({
    reducer: {
        "people": people_reducer,
    }
})
export { changeName, changeAge, changeHeight, changeWeight, fetchAssets } 