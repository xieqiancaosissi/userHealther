import { init_env, getConfig } from '@ref-finance/ref-sdk';
export function hello() {
    init_env('mainet')
    return getConfig()
}


