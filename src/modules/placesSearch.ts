import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';
import { TravelHistoryData } from 'types/index';

export interface PlacesSearchState {
    PlacesSearchResult: TravelHistoryData[];
};

const initialState: PlacesSearchState = {
    PlacesSearchResult: []
};

export const placesSearchSlice = createSlice({
    name: 'placesSearch',
    initialState,
    reducers: {
        setPlacesSearchResult: (state, action: PayloadAction<TravelHistoryData[]>) => {
            state.PlacesSearchResult = action.payload;
        }
    }
})

export const { setPlacesSearchResult } = placesSearchSlice.actions;
export const getPlacesSearchResult = (state: RootState) => state.placesSearch.PlacesSearchResult;
export default placesSearchSlice.reducer;