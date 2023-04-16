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
