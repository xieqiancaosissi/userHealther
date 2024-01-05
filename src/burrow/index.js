import { initNear } from './near';
import { main as liquidate } from './burrow';

export async function getHealthInfo(accountId) {
  return initNear(false).then((nearObject) => {
      return liquidate(nearObject, accountId)
    }
  );
}
