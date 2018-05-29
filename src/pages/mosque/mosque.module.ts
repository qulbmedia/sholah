import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MosquePage } from './mosque';

@NgModule({
  declarations: [
    MosquePage,
  ],
  imports: [
    IonicPageModule.forChild(MosquePage),
  ],
})
export class MosquePageModule {}
