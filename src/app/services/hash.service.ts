import {Injectable} from '@angular/core';
import {sha3_512} from 'js-sha3';

@Injectable({
    providedIn: 'root'
})
export class HashService {
    constructor() {
    }

    public static getHashed(hashString: string, ...params: string[]): string {
        const hash = sha3_512.create();
        let param = '';
        params.forEach(value => param += value);
        hash.update(hashString + param);
        return hash.hex();
    }
}
