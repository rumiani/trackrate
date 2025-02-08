import { $Enums } from "@prisma/client";
import { CoinData } from "./coinDataTypes";

export enum AssetType {
  CRYPTO = "CRYPTO",
  FIAT = "FIAT",
  GOLD = "GOLD",
}

export interface AssetObjectTypes {
  enNames: string[];
  faNames: string[];
  code: string;
  type: AssetType;
}
export interface brsapiCurrencyTypes {
  date: string;
  time: string;
  name: string;
  price: number;
  change_percent: number;
  unit: string;
}

export type AssetDBTypes = {
  id: string;
  code: string;
  enName: string[];
  faName: string[];
  currentPrice: number;
  type: $Enums.AssetType;
  status: $Enums.TableStatus;
  updatedAt: Date;
};
export type AssetTypes = {
  code: string;
  enName: string[];
  faName: string[];
  type: $Enums.AssetType;
};

export interface BigAssetsDataObjectTypes {
  cryptoRateArray: CoinData[];
  currenciesRateArray: brsapiCurrencyTypes[];
  goldsRateArray: brsapiCurrencyTypes[];
}