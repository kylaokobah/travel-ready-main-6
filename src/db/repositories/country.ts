import db from "..";
import { collection, getDocs, query } from 'firebase/firestore';
import { CountryData } from "types";

const COLLECTION_NAME = 'countries';

export const getAllCountries = async (): Promise<Array<CountryData>> => {
    const q = query(collection(db, COLLECTION_NAME));

    const countriesSnapshot = await getDocs(q);
    const data: Array<any> = [];

    countriesSnapshot.docs.forEach((_data) => {
        data.push({ ..._data.data() });
    })

    return countriesSnapshot.docs.length > 0 ? data as Array<CountryData> : [];
}