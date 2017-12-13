import { Component, OnInit, OnChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
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
          <a [attr.href]="'https://www.facebook.com/sharer.php?u=https://www.papercutodyssey.dk/themes/' + theme.id + '/works/' + current_work.id" class="share-buttons facebook">FB</a>
        </li>
      </ul><!-- .info-list -->
    </div><!-- .info-column -->
    <div class="main-column">

      <img *ngIf="current_work.cover_image.url" [src]="current_work.cover_image.thumb.url" id="slideUpImage">

      <h2 class="text-center">{{ current_work.title }}</h2>

      <iframe *ngIf="current_work.youtube_in_top && current_work.youtube_url"
      width="100%" height="500px" [src]="getSafeYoutubeAndSouncloudUrl(current_work.youtube_url)"
      frameborder="0" allowfullscreen></iframe>

      <iframe *ngIf="current_work.soundcloud_in_top && current_work.soundcloud_url" width="100%" height="166" scrolling="no" frameborder="no"
      [src]="getSafeYoutubeAndSouncloudUrl(current_work.soundcloud_url)">
      </iframe>

      <p class="main-text" [innerHTML]="current_work.description"></p>

      <iframe *ngIf="current_work.youtube_in_bottom && current_work.youtube_url"
      width="100%" height="500px" [src]="getSafeYoutubeAndSouncloudUrl(current_work.youtube_url)"
      frameborder="0" allowfullscreen></iframe>

      <iframe *ngIf="current_work.soundcloud_in_bottom && current_work.soundcloud_url"
      width="100%" height="166" scrolling="no" frameborder="no"
      [src]="getSafeYoutubeAndSouncloudUrl(current_work.soundcloud_url)">
      </iframe>

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
        <h5 *ngIf="overview_work.type_of_content" class="overview-info">{{ overview_work.type_of_content }}</h5>
        <h5 class="overview-info">{{ overview_work.created_at | date: "dd.mm.yy" }} </h5>
      </div><!-- overview-box -->
  </div><!-- overview-column -->
  <div class="info-right-boxes kilder" data-info="boxes" id="kilder" (click)="openInfoBox('kilder', true)">
    <div class="kilde-wrapper-relative">
      <h3>Kilder</h3>
      <div class="kilde-box" *ngFor="let source of sources; let i_s = index" [attr.id]="'source' + source.id">
        <div class="source-image">
          <div *ngIf="source.image" class="source-image-inner" [style.background-image]="'url(' + source.image.thumb.url + ')'"></div>
        </div>
        <div class="source-content">
          <h5 class="text-center">{{ i_s + 1 }}</h5>
          <h4 class="text-center">{{ source.title }}</h4>
          <p class="source-description">
            {{source.description}}
            <a class="source-link" [attr.href]="source.link" target="_blank">{{source.link}}</a>
          </p>
        </div>
      </div><!-- kilde-box -->
    </div><!-- kilde-wrapper-relative -->
  </div>
  <div class="info-right-boxes goer" id="goer" data-info="boxes" (click)="openInfoBox('goer')">
    <h3>To do</h3>
    <div class="goer_box">
    </div>
  </div>
  <div *ngIf="kilder_opened || goer_opened" id="closeInfoBoxes" (click)="closeInfoBoxes()"></div>
  <div class="close-info-boxes-init hide-it" data-close-info-boxes="true" (click)="closeInfoBoxes()"></div>
  `
})
export class ContentComponent implements OnInit {
  works: {}[] = [];
  sources: {}[] = [];
  current_work: {};
  theme: {};
  kilder_opened: boolean = false;
  goer_opened: boolean = false;
  path: string;
  source_runned: boolean = false;
  constructor(
    private _http: HttpClient,
    private _sanitizer: DomSanitizer 
  ) {}

  ngOnInit(): void {
    interface WorkResponse {
      works: {}[];
      sources: {}[];
      theme: {};
      current_work: {};
    }
    var div_data = document.querySelector('[data-theme-id]');
    var theme_id = div_data.getAttribute('theme-id');
    var work_id = div_data.getAttribute('work-id');
    this.path = '/themes/' + theme_id + '/works/' + work_id + '.json';
      this._http.get<WorkResponse>(this.path)
      .subscribe(
        data => {
          this.works = data.works,
          this.theme = data.theme,
          this.sources = data.sources,
          this.current_work = data.current_work
        }
      )
  }

  ngAfterViewChecked(): void {
    if (!this.source_runned) {
      this.addEventToTinyMCEText();
      this.source_runned = true;
    }
  }

  getSafeYoutubeAndSouncloudUrl = function(url) {
    return this._sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  addEventToTinyMCEText = function() {
    var sources = Array.from(document.querySelectorAll('.main-text a[href="#source"]'));
    sources.forEach(function(source) {
      source.addEventListener('click', function() {
        document.querySelector('[data-close-info-boxes="true"]').classList.remove('hide-it');
        var boxes = Array.from(document.querySelectorAll('[data-info="boxes"]'));
        boxes.forEach(function(box) {
          box.classList.add('info-box-opened');
        });
        var clicked_source_text = document.getElementById('source' + source.getAttribute('title'));
        // Scroll to position
        var topPos = clicked_source_text.offsetTop;
        document.getElementById('kilder').scrollTop = topPos;
      });
    });
  }

  public openInfoBox(info_id, both = false): void {
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
    if (!document.querySelector('[data-close-info-boxes="true"]').classList.contains('hide-it')) {
      document.querySelector('[data-close-info-boxes="true"]').classList.add('hide-it');
    }
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

  changeCurrentWork = function(work_id, tinyMCEevent) {
    this.current_work = this.works.find(x => x.id == work_id);
    this.source_runned = false; // Now ngAfterViewChecked can run again, and place the event handlers in the TinyMCE text! 
  }

}
