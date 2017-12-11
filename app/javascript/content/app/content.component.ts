import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs";

@Component({
  selector: 'content',
  template: `
  <div class="info-main-wrapper">
    <div class="info-column">
      <ul class="info-list">
        <li data-theme-title="true">
          Tema <br>
          {{ theme.title }}
        </li>
        <li>
          Dato<br>
          {{ current_work.created_at | date: 'dd.mm.yy'}}
        </li>
        <li *ngIf="current_work.type_of_content">
          Type<br>
          {{ current_work.type_of_content }}
        </li>
        <li *ngIf="current_work.created_by">
          Tekst af<br>
          {{ current_work.created_by }}
        </li>
        <li *ngIf="current_work.photo_by">
          Foto af<br>
          {{ current_work.photo_by }}
        </li>
        <li>
          Tags<br>
          Kommer snart
        </li>
        <li>Del:
          <a href="#" class="share-buttons">FB</a>
          <a href="#" class="share-buttons">IG</a>
        </li>
      </ul><!-- .info-list -->
    </div><!-- .info-column -->
    <div class="main-column">
      <img *ngIf="current_work.cover_image.url" [src]="current_work.cover_image.thumb.url" id="slideUpImage">
      <h2 class="text-center">{{ current_work.title }}</h2>
      <p class="main-text" [innerHTML]="current_work.description"></p>
    </div><!-- .main-column -->
  </div>
  <div class="overview-column">
    <h3 class="overview-header">Alt i tema</h3>
      <div class="overview-box" *ngFor="let overview_work of works; let i = index" (click)="changeCurrentWork(overview_work.id)">
        <img [src]="overview_work.cover_image.thumb.url" (load)="setImageUrl(overview_work.cover_image.thumb.url, i)" hidden>
        <div class="overview-image" [attr.id]="i">
          <div *ngIf="overview_work.id == current_work.id" id="currentCross"></div>
        </div>
        <h4 class="overview-title">{{ overview_work.title }}</h4>
        <h5 class="overview-info">{{ overview_work.type_of_content }}</h5>
        <h5 class="overview-info">{{ overview_work.created_at | date: "dd.mm.yy" }} </h5>
      </div><!-- overview-box -->
  </div><!-- overview-column -->
  <div class="info-right-boxes kilder" data-info="boxes" id="kilder" (click)="openInfoBox('kilder', true)">
    <h3>Kilder</h3>
    <div class="kilde_box">
    </div>
  </div>
  <div class="info-right-boxes goer" id="goer" data-info="boxes" (click)="openInfoBox('goer')">
    <h3>Gør</h3>
    <div class="goer_box">
    </div>
  </div>
  <div *ngIf="kilder_opened || goer_opened " id="closeInfoBoxes" (click)="closeInfoBoxes()"></div>
  `
})
export class ContentComponent implements OnInit {
  works: {}[] = [];
  current_work: {};
  theme: {};
  kilder_opened: boolean = false;
  goer_opened: boolean = false;
  path: string;
  constructor(private http: HttpClient) {}
  

  ngOnInit(): void {
    interface WorkResponse {
      works: {}[];
      theme: {};
    }
    var theme_id = document.querySelector('[data-theme-id]').getAttribute('theme-id');
    this.path = '/themes/' + theme_id + '/works.json';
    this.http.get<WorkResponse>(this.path)
    .subscribe(
      data => { this.works = data.works, this.current_work = data.works[0], this.theme = data.theme }
    )
  }

  openInfoBox = function(info_id, both = false) {
    var box = document.getElementById(info_id);
    if (both) { // Kilder clicked, slide out both windows
      this.classToInfoBoxes('add');
    } else if (info_id == 'goer' && this.goer_opened ){ // Goer is clicked while Kilder is opened
      document.getElementById('kilder').classList.remove('info-box-opened');
    } else {
      box.classList.add('info-box-opened');
    }
    (info_id == "kilder") ? this.kilder_opened = true : this.goer_opened = true 
  }

  closeInfoBoxes = function() {
    this.classToInfoBoxes('remove');
    this.kilder_opened = false;
    this.goer_opened = false;
  }

  classToInfoBoxes = function(remove_or_add) {
    var boxes = Array.from(document.querySelectorAll('[data-info="boxes"]'));
    boxes.forEach(function(box) {
      if (remove_or_add == 'remove') {
        box.classList.remove('info-box-opened');
      } else {
        box.classList.add('info-box-opened');
      }
    });
  }

  setImageUrl = function(image_url, id) {
    var image_div = document.getElementById(id);
    image_div.style.backgroundImage = 'url(' + image_url + ')';
    image_div.classList.add('overview-image-show');
  }

  changeCurrentWork = function(work_id) {
    this.current_work = this.works.find(x => x.id == work_id);
  }
  
}
