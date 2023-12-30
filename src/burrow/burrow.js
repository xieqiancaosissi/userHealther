import Big from 'big.js';
import { keysToCamel } from './utils';
import { parseAsset } from './asset';
import { parsePriceData } from './priceData';
import {
  parseAccount,
  processAccount,
} from "./account";

Big.DP = 27;

const main = async (nearObjects) => {
  const { burrowContract, priceOracleContract, NearConfig } = nearObjects;

  const rawAssets = keysToCamel(await burrowContract.get_assets_paged());
  const assets = rawAssets.reduce((assets, [assetId, asset]) => {
    assets[assetId] = parseAsset(asset);
    return assets;
  }, {});
  // console.log(assets);

  const [rawPriceData, numAccountsStr] = (
    await Promise.all([
      priceOracleContract.get_price_data({
        asset_ids: Object.keys(assets),
      }),
      burrowContract.get_num_accounts(),
    ])
  ).map(keysToCamel);

  const lp_token_infos = await burrowContract.get_last_lp_token_infos();
  
  const numAccounts = parseInt(numAccountsStr);

  const prices = parsePriceData(rawPriceData);

  console.log("Num accounts: ", numAccounts);
  // Due to upgrade to 0.7.0, the supplied are returned from state.
  const limit = 40;

  const promises = [];
  for (let i = 0; i < numAccounts; i += limit) {
    promises.push(
      burrowContract.get_accounts_paged({ from_index: i, limit })
    );
  }
  const accounts_from_api = (await Promise.all(promises)).flat()
  const accounts_parsed = accounts_from_api.map((a) => parseAccount(a)).flat()
  const accounts = accounts_parsed.map((a) => processAccount(a, assets, prices, lp_token_infos))

  accounts.sort((a, b) => {
    return a.healthFactor.cmp(b.healthFactor);
  });

  console.log(
    accounts
      .filter((a) => a.healthFactor.lt(2))
      .map(
        (a) =>
          `${a.accountId} -> ${a.healthFactor
            .mul(100)
            .toFixed(2)}% -> $${a.borrowedSum.toFixed(2)}`
      )
      .slice(0, 20)
  );
}
export { main };
