import { Injectable } from '@angular/core';

import * as localForage from 'localforage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private lf;

  constructor() {
    this.lf = localForage.createInstance({name: 'app'});
  }

  public async get(key) {
    return this.lf.getItem(key);
  }

  public async set(key, value) {
    return this.lf.setItem(key, value);
  }

  public remove(key) {
    return this.lf.removeItem(key);
  }
}
