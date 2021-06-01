import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {
  private source;
  private url: string;

  constructor(private http: HttpClient) {
    this.url = 'assets/dictionary.json';
  }

  appInit(url?: string) {
    return this.http.get(url || this.url).toPromise().then(data => this.source = data);
  }

  async update(url?: string) {
    await this.http.get(url || this.url).toPromise().then(data => this.source = data).catch(e => console.error('Get value-map error!', e));
    return this.source;
  }

  test() {
    console.log(this.source);
    return this.source;
  }

  getNodeType() {
    return this.source.nodeType;
  }

  getConditionAnomalyValue(code: string = ''): number {
    if (code) {
      return code.endsWith('0000') ? 0 : 1;
    } else {
      return 3;
    }
  }

  getTextByEquipmentType2(code: string): string {
    const equipmentType = this.source.equipmentType.type2;
    let text = '';
    try {
      text = equipmentType[code].zh;
    } catch (e) {
      text = null;
    }
    return text || code;
  }

  getTextByEquipmentType3(code: string): string {
    const equipmentType = this.source.equipmentType.type3;
    let text = '';
    try {
      text = equipmentType[code].zh;
    } catch (e) {
      text = null;
    }
    return text || code;
  }

  getEquipmentType2List() {
    return this.source.equipmentType.type2;
  }

  getEquipmentPartListByType3(type3: string) {
    const source = this.source.equipmentPart;
    const partListData = [];
    for (const key in source) {
      if (key.startsWith(type3)) {
        partListData.push({ code: key, name: source[key].zh });
      }
    }
    return partListData;
  }


  getTextByEquipmentPartCode(code: string) {
    const equipmentPart = this.source.equipmentPart;
    let text = '';
    try {
      text = equipmentPart[code].zh;
    } catch (e) {
      text = null;
    }
    return text || code;
  }

  getTextByConditionCode(code: string) {
    const condition = this.source.condition;
    let text = '';
    try {
      text = condition[code].zh;
    } catch (e) {
      text = null;
    }
    return text || code;
  }

  getDicList(type: string) {
    const typeGroup = type.split('.');
    let obj = this.source;
    typeGroup.forEach((item) => {
      if (obj[item]) {
        obj = obj[item];
      }
    });
    return Object.keys(obj).map(item => {
      return {
        code: item,
        label: obj[item] && obj[item].zh
      };
    });
  }

  getTextByCode(type: string, code: any) {
    const typeGroup = type.split('.');
    let text = '';
    let obj = this.source;
    typeGroup.forEach((item: any) => {
      if (obj[item]) {
        obj = obj[item];
      }
    });
    try {
      text = obj[code].zh;
    } catch (e) {
      text = null;
    }
    return text || code;
  }
}
