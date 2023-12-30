import { initNear } from './near';
import { main as liquidate } from './burrow';

export function getHealthInfo() {
  initNear(false).then((nearObject) => {
      return liquidate(nearObject)
    }
  );
}
