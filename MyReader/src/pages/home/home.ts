import { Component } from '@angular/core';
import { NavController, LoadingController, ActionSheetController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { InAppBrowser } from 'ionic-native';
import { RedditService } from '../../providers/reddit-service';
 
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
 
  public feeds: Array<any>;
  private url: string = "https://www.reddit.com/new.json";
  private newerPosts: string = "https://www.reddit.com/new.json?before=";  
  private olderPosts: string = "https://www.reddit.com/new.json?after=";
 
  public hasFilter: boolean = false;
  public noFilter: Array<any>;
  public searchTerm: string = '';
 
  constructor(public navCtrl: NavController, public http: Http, 
       public loadingCtrl: LoadingController, public actionSheetCtrl: ActionSheetController, public redditService: RedditService) {
 
    this.fetchContent();
 
  }
 
  fetchContent ():void {
    let loading = this.loadingCtrl.create({
      content: 'Fetching content...'
    });

    loading.present();

    this.redditService.fetchData(this.url).then(data => {
        this.feeds = data;
        this.noFilter = this.feeds;
        loading.dismiss();
    }) 
  }
 
  doRefresh(refresher) {
 
    let paramsUrl = this.feeds[0].data.name;

    this.redditService.fetchData(this.newerPosts + paramsUrl).then(data => {
        this.feeds = data.concat(this.feeds);
        this.noFilter = this.feeds;
        this.hasFilter = false;
        refresher.complete();
    })

  }  
 
  doInfinite(infiniteScroll) {
 
    let paramsUrl = (this.feeds.length > 0) ? this.feeds[this.feeds.length - 1].data.name : "";

    this.redditService.fetchData(this.olderPosts + paramsUrl).then(data => {
        this.feeds = this.feeds.concat(data);
        this.noFilter = this.feeds;
        this.hasFilter = false;
        infiniteScroll.complete();
    })

  }   
 
  itemSelected (url: string):void {
    let browser = new InAppBrowser(url, '_system');
  } 
  
  showFilters() :void {
 
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Opções de Filtro:',
      buttons: [
        {
          text: 'Musica',
          handler: () => {
            this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === "music");
            this.hasFilter = true;
          }
        },
        {
          text: 'Filmes',
          handler: () => {
            this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === "movies");
            this.hasFilter = true;
          }
        },
        {
          text: 'Jogos',
          handler: () => {
            this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === "gaming");
            this.hasFilter = true;
          }
        },
        {
          text: 'Fotos',
          handler: () => {
            this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === "pics");
            this.hasFilter = true;
          }
        },                
        {
          text: 'Perguntas Reddit',
          handler: () => {
            this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === "askreddit");
            this.hasFilter = true;
          }
        },        
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.feeds = this.noFilter;
            this.hasFilter = false;
          }
        }
      ]
    });
 
    actionSheet.present();
 
  }

  filterItems() {
    this.hasFilter = false;
    this.feeds = this.noFilter.filter((item) => {
        return item.data.title.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    });
  }        
 
}