import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '<h1>XAcademy Challenge Fifa Players!</h1>';
  }
}
