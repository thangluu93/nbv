import { Injectable } from '@angular/core';
import {ConfigService} from './config.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private configService: ConfigService) { }

  get httpConfigWithToken() {
    return this.configService.httpConfigWithToken
  }

  get httpConfig() {
    return this.configService.httpConfig
  }
}
