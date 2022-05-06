export enum PageName {
    LANDING = '',
    SIGIN = '',
    DASHBOARD = 'Dashboard',
    COVID_19_CONDITION_SEARCH = 'COVID-19 Condition Search',
    PLACES_BY_INTEREST_SEARCH = 'Places Search By Interests',
}

export type UserData = {
    displayName: string,
    email: string,
    photoURL: string,
    Budget: number,
    countries_visited: string[],
    places_visited: string[],
    tags: string[],
    travel_histories: string[],
    countries_plan: string[],
    places_plan: string[],
    uid: string,
} | null;

export interface CovidResultData {
    country: string;
    confirmed: number;
    confirmed_daily: number;
    date: string;
    deaths: number;
    deaths_daily: number;
    population: number;
};

export interface CountryData {
    code: string;
    code3: string;
    name: string;
}

export interface TravelHistoryData {
    id: string;
    uid: string;
    photoURL: string;
    createAt: any;
    country: string;
    site: string;
    description: string;
    tags: string[];
    image: string;
    rating: number;
    likes: string[];
}

export interface TravelHistoryAddFormData {
    id: string;
    uid: string;
    photoURL: string;
    country: string;
    site: string;
    description: string;
    imageURL: string;
    imageFile: File | null;
    tags: string[];
    tag: string;
    rating: number;
}

declare module '@mui/material/styles' {
    interface TypographyVariants {
        guideline: React.CSSProperties;
    }

    // allow configuration using `createTheme`
    interface TypographyVariantsOptions {
        guideline?: React.CSSProperties;
    }
}

declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        guideline: true;
    }
}

export type AuthContextType = {
  authUser: UserData;
  setAuthUser: (arg0: UserData) => void;
}