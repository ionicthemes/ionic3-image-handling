import { Component } from '@angular/core';
import { NavController, ActionSheetController} from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  photos : Array<string>;

  constructor(
    public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    public imagePicker: ImagePicker,
    public camera: Camera,
    public cropService: Crop
  ) {}

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Choose or take a picture',
      buttons: [
        {
          text: 'Take a picture',
          handler: () => {
            this.takePicture();
          }
        },
        {
          text: 'Choose pictures',
          handler: () => {
            this.openImagePicker();
          }
        }
      ]
    });
    actionSheet.present();
  }

  openImagePicker(){
    let options = {
      maximumImagesCount: 5,
    }
    this.photos = new Array<string>();
    this.imagePicker.getPictures(options)
    .then((results) => {
      this.reduceImages(results).then(() => {
        console.log('all images cropped!!');
      });
    }, (err) => { console.log(err) });
  }

  reduceImages(selected_pictures: any) : any{
    return selected_pictures.reduce((promise:any, item:any) => {
      return promise.then((result) => {
        return this.cropService.crop(item, {quality: 75}).then(cropped_image => this.photos.push(cropped_image));
      });
    }, Promise.resolve());
  }

  takePicture(){
    let options = {
      quality: 100,
      correctOrientation: true
    };

    this.camera.getPicture(options)
    .then((data) => {
      this.photos = new Array<string>();
      this.cropService
      .crop(data, {quality: 75})
      .then((newImage) => {
        this.photos.push(newImage);
      }, error => console.error("Error cropping image", error));
    }, function(error) {
      console.log(error);
    });
  }

}
