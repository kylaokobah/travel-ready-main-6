import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';
import { CovidResultData } from 'types/index';

export interface CovidState {
    covidResult: CovidResultData[];
};

const initialState: CovidState = {
    covidResult: []
};

export const covidSlice = createSlice({
    name: 'covid',
    initialState,
    reducers: {
        setCovidResult: (state, action: PayloadAction<CovidResultData[]>) => {
            state.covidResult = action.payload;
        }
    }
})

export const { setCovidResult } = covidSlice.actions;
export const getCovidResult = (state: RootState) => state.covid.covidResult;
export default covidSlice.reducer;