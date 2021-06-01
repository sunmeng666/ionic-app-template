import { Injectable, NgZone } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { cropImage } from '../utils/crop-image';
import { ActionSheetController } from '@ionic/angular';

type Command = 'add' | 'remove' | 'cancel';

@Injectable({
  providedIn: 'root'
})
export class AppPhotoService {

  constructor(
    private actionSheetController: ActionSheetController,
    private camera: Camera,
    private zone: NgZone,
  ) {
  }

  async presentActionSheet(input: string): Promise<[Command, string?, string?]> {

    const options = await new Promise(async resolve => {
      const cameraButton = {
        text: '拍照',
        handler: () => {
          resolve({
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            correctOrientation: true,
          });
        }
      };
      const libraryButton = {
        text: '从相册选取',
        handler: () => {
          resolve({
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            correctOrientation: true,
          });
        }
      };

      const removeButton = {
        text: '删除',
        handler: () => {
          resolve('remove');
        }
      };

      const cancelButton = {
        text: '取消',
        role: 'cancel',
        handler: () => {
          resolve('cancel');
        }
      };

      const buttons = input
        ? [cameraButton, libraryButton, removeButton, cancelButton]
        : [cameraButton, libraryButton, cancelButton];
      const actionSheet = await this.actionSheetController.create({
        // header: 'Albums',
        buttons
      });
      await actionSheet.present();
    });

    if (typeof options === 'string') {
      const command = options as Command;
      return [command];
    }

    return new Promise<[Command, string?, string?]>(resolve => {
      this.camera.getPicture(options).then(async (imageData: string) => {
        const low = await cropImage('data:image/jpeg;base64,' + imageData, { width: 300, height: 300 });
        const high = await cropImage('data:image/jpeg;base64,' + imageData, { width: 1200, height: 1200 });
        console.log('low', low);
        console.log('high', high);
        resolve(['add', low, high]);
      }, (err) => {
        resolve(['cancel']);
      });
    });
  }

}
