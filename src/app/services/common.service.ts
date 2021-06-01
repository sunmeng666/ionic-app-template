import { Injectable } from '@angular/core';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private storage: StorageService
  ) {
  }

  getHealthInfo(type, health) {
    let name = '未知';
    let color = '#f7f8f9';
    let value;
    switch (health) {
      case 'A':
        name = '设备健康';
        color = '#3DBD7D';
        value = 0;
        break;
      case 'B':
        name = '轻微波动';
        color = '#40AFFF';
        value = 1;
        break;
      case 'C':
        name = '横向关注';
        color = '#FFBF00';
        value = 2;
        break;
      case 'D':
        name = '低值报警';
        color = '#FB990B';
        value = 3;
        break;
      case 'E':
        name = '高值报警';
        color = '#F56A00';
        value = 4;
        break;
    }

    switch (type) {
      case 'name':
        return name;
      case 'color':
        return color;
      case 'value':
        return value;
      default:
        return {
          name,
          color,
          value
        };
    }
  }

  getEquipmentStatus(status) {
    let text = '';
    let color = '';
    if (status === 1) {
      text = '正常运行';
      color = '#3DBD7D';
    } else if (status === 2) {
      text = '异常警告';
      color = '#F56A00';
    } else if (status === 3) {
      text = '计划停机';
      color = '#FFBF00';
    } else if (status === 4) {
      text = '离线待检';
      color = '#D9D9D9';
    }
    return { text, color };
  }

  parseTime(eventTimestamp) {
    if (eventTimestamp === null) {
      return '';
    }
    if (isToday(parseISO(eventTimestamp))) {
      return '今天' + format(parseISO(eventTimestamp), 'HH:mm');
    }
    if (isYesterday(parseISO(eventTimestamp))) {
      return '昨天' + format(parseISO(eventTimestamp), 'HH:mm');
    }
    if (format(new Date(), 'yyyy') === format(parseISO(eventTimestamp), 'yyyy')) {
      return format(parseISO(eventTimestamp), 'MM-dd');
    } else {
      return format(parseISO(eventTimestamp), 'yyyy-MM-dd');
    }
  }

  getMaintenanceType(code) {
    if (code === '001') {
      return '设备维修';
    }
    if (code === '002') {
      return '设备保养';
    }
    if (code === '003') {
      return '设备润滑';
    }
  }

  async getAccess(permission) {
    const userPermissions = await this.storage.get('ROLE_PERMISSIONS_LIST') || [];
    return userPermissions.includes(permission.id);
  }

  zeroValue(value, text) {
    if (value <= 0) {
      return text + '请输入大于0的值';
    }
  }

  oneValue(value, text) {
    if (value <= 1) {
      return text + '请输入大于1的值';
    }
  }

  fiveValue(value, text) {
    if (value <= 5) {
      return text + '请输入大于5的值';
    }
  }

  hundredValue(value, text) {
    if (value <= 100) {
      return text + '请输入大于100的值';
    }
  }

  threeValue(value, text) {
    if (value < 3) {
      return text + '请输入大于等于3的值';
    }
  }

  decimalsValue(value, text) {
    if (value < 0.01) {
      return text + '请输入大于0.01的值';
    }
  }

}
