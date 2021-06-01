import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { environment } from '../../environments/environment';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private requestWorker: AxiosInstance;
  private uploadWorker: AxiosInstance;
  private baseURL: string;
  private requestTimeout = 20 * 1000;

  constructor(
    public router: Router,
    public alertController: AlertController
  ) {
    this.init();
  }

  private async init() {
    this.baseURL = environment.baseApiPrefix;
    console.log(this.baseURL);
    this.requestWorker = axios.create({baseURL: this.baseURL});
    this.requestWorker.defaults.timeout = this.requestTimeout;
    this.requestWorker.interceptors.request.use(config => config, this.requestErrorInterceptor.bind(this));
    this.requestWorker.interceptors.response.use(this.responseDataInterceptor.bind(this), this.responseErrorInterceptor.bind(this));

    this.uploadWorker = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      transformRequest: [(data, headers) => {
        // 跳过qs序列化，直接返回文件数据发送
        if (headers['Content-Type'] === 'multipart/form-data') {
          return data;
        }
      }]
    });
    this.uploadWorker.defaults.timeout = this.requestTimeout;
    this.uploadWorker.interceptors.request.use(config => config, this.requestErrorInterceptor.bind(this));
    this.uploadWorker.interceptors.response.use(this.responseDataInterceptor.bind(this), this.responseErrorInterceptor.bind(this));
  }

  private requestErrorInterceptor(error: Error) {
    // console.log('request', error);
    return Promise.reject(error);
  }

  private async responseDataInterceptor(response: AxiosResponse) {
    const status = response.status; // 200
    switch (status) {
      case 403:
        const alertError = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: '提示',
          message: '权限状态已更新，请刷新后重试',
        });

        await alertError.present();
        setTimeout(() => {
          alertError.dismiss()
        }, 1000);
        this.router.navigate(['/login'])
        break
      case 401:
        const alertToken = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: '提示',
          message: '没有权限，请刷新后重试',
        });

        await alertToken.present();
        setTimeout(() => {
          alertToken.dismiss()
        }, 1000);
        this.router.navigate(['/login'])
        break
      default :
        console.log('response', status);
        return response;
    }
  }

  private responseErrorInterceptor(error: Error) {
    // console.log('response error', error);
    return Promise.reject(error);
  }

  private async get<I, O>(url, input?: I): Promise<O> {
    try {
      const {data} = await this.requestWorker.get(url, {params: input});
      return data;
    } catch (e) {
      throw e;
    }
  }

  private async post<I, O, P>(url, input?: I, params?: P): Promise<O> {
    try {
      const {data} = await this.requestWorker.post(url, input, {params});
      console.log(data);
      return data;
    } catch (e) {
      throw e;
    }
  }

  private async upload<I, O, P>(url, input?: I, params?: P): Promise<O> {
    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(input)) {
        formData.append(key, value);
      }
      const {data} = await this.uploadWorker.post(url, formData, {params});
      return data;
    } catch (e) {
      throw e;
    }
  }

  // api
  public async login(input: any): Promise<any> {
    return await this.post('/user/login', input);
  }
}
