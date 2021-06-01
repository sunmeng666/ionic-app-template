import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CodeService {
  private source;
  private url: string;

  constructor(private http: HttpClient) {
    this.url = 'assets/code.json';
  }

  appInit(url?: string) {
    return this.http.get(url || this.url).toPromise().then(data => this.source = data);
  }

  async update(url?: string) {
    await this.http.get(url || this.url).toPromise().then(data => this.source = data).catch(e => console.error('Get value-map error!', e));
    return this.source;
  }

  getTextByCode(code: string): string {
    const codeText = this.source.code;
    let text = '';
    try {
      text = codeText[code];
    } catch (e) {
      text = null;
    }
    return text || code;
  }

}
