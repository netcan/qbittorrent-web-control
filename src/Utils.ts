/*************************************************************************
    > Copyright (c) 2023 Netcan
    > File Name: Utils.ts
    > Blog: https://netcan.github.io/
    > Mail: netcan1996@gmail.com
************************************************************************/

import { FilterMatchMode } from 'primereact/api';

export function parseSize(size: number) {
    const sizeUnit = [ 'B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' ];
    let sizeUnitIdx = 0;
    while (size > 1024) {
        sizeUnitIdx++;
        size /= 1024;
    }

    return `${size.toFixed(2)} ${sizeUnit[sizeUnitIdx]}`;
}

export function parseSpeed(size: number) {
    return `${parseSize(size)}/s`;
}

export function parseEpoch(epoch: number) {
    return new Date(epoch * 1000).toLocaleString('zh');
}

export function parseDuration(seconds: number, units: number = 1): string {
    const TIME_UNITS = [
        [86400, "d"], [3600, "h"],
        [60, "m"], [1, "s"],
    ] as const;

    let unit = 0;
    let res = "";
    for (const [unitSeconds, unitLabel] of TIME_UNITS) {
        const unitValue = Math.floor(seconds / unitSeconds);
        seconds %= unitSeconds;
        if (unitValue > 0) {
            res += `${unitValue}${unitLabel} `;
            ++unit;
        }
        if (unit >= units) {
            return res.trim();
        }
    }
    return '0s';
}

export enum HOSTNAME {
    UNKNOWN = 'unknown'
};

export function getHostName(url: string) {
    return url ? new URL(url).hostname : HOSTNAME.UNKNOWN;
}

export function createFilter(value: string = '') {
    return { value: value, matchMode: FilterMatchMode.CONTAINS };
}

export function isSameClass<T extends { __proto__: any}>(lhs: T, rhs: T) {
    if (lhs === undefined || rhs === undefined) {
        return false;
    }
    return lhs.__proto__ === rhs.__proto__;
}
