import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';
import { TravelHistoryData } from 'types/index';

export interface travelHistoryState {
    travelHistoryList: TravelHistoryData[];
};

const initialState: travelHistoryState = {
    travelHistoryList: []
};

export const travelHistorySlice = createSlice({
    name: 'travelHistory',
    initialState,
    reducers: {
        setTravelHistoryList: (state, action: PayloadAction<TravelHistoryData[]>) => {
            state.travelHistoryList = action.payload;
        }
    }
})

export const { setTravelHistoryList } = travelHistorySlice.actions;
export const getTravelHistoryList = (state: RootState) => state.travelHistory.travelHistoryList;
export default travelHistorySlice.reducer;