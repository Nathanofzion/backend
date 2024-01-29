import { ContractEntriesResponse, ParsedRouterEntry } from "../../types";
import { scValToJs } from "mercury-sdk";
import * as StellarSdk from "@stellar/stellar-sdk";
/**
 * Enum representing the keys for data in the factory instance.
 */
enum DataKey {
  feeTo = 0,        // address public feeTo;
  feeToSetter = 1,  // address public feeToSetter;
  totalPairs = 2, // addresses of pairs created by the Factory.
  feesEnabled = 3,  // bool is taking fees?
}

/**
 * Parses the data from a ContractEntriesResponse object and returns an array of ParsedRouterEntry objects.
 * @param data The ContractEntriesResponse object to be parsed.
 * @returns An array of ParsedRouterEntry objects.
 * @throws Error if no entries are provided or if no valueXdr is found in an entry.
 */
export const factoryInstanceParser = (data: ContractEntriesResponse) => {
  if (!data.entryUpdateByContractIdAndKey) {
    throw new Error("No entries provided")
  }
  const parsedEntries: ParsedRouterEntry[] = []
  for (const entry of data.entryUpdateByContractIdAndKey.edges) {
    const base64Xdr = entry.node.valueXdr
    if (!base64Xdr) {
        throw new Error("No valueXdr found in the entry")
    }
    const parsedData:any = StellarSdk.xdr.ScVal.fromXDR(base64Xdr, "base64");
    const jsValues: any = scValToJs(parsedData)
    const parsedValue = {} as ParsedRouterEntry
    if(typeof(jsValues.storage) !== "undefined"){
      for (let key in jsValues.storage()) {
          const i: number = parseInt(key)
          const element = jsValues.storage()[key].val()
          Object.assign(parsedValue, {[DataKey[i]]: scValToJs(element)})
      }
    parsedEntries.push(parsedValue)
    }
  }
  return parsedEntries;
};
