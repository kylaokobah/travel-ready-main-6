import { CountryData } from "types";

export const isFound = (value: string, arr: string[]) => {
  const left = value.toLowerCase();
  return arr?.some((right) => left === right.toLowerCase());
};

export const findCountryByName = (name: string, arr: CountryData[]) => {
  return arr.find(obj => obj.name === name);
}