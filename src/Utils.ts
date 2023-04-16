
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

export function getHostName(url: string) {
    return url ? new URL(url).hostname : '';
}

