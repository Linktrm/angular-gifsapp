import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

const GIPHY_API_URL = 'https://api.giphy.com/v1/gifs';
const GIPHY_API_KEY = 'lV5c9yxoM7xqzUx8pG0jiBlDH6S7RyMF';

@Injectable({providedIn: 'root'})
export class GifsService {
  public gifList: Gif[] = [];
  private _tagsHistory: string[] = [];

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
    if(this._tagsHistory.length !== 0) this.searchTag(this._tagsHistory[0]);
  }

  get tagsHistory() {
    return [...this._tagsHistory];
  }

  private organizeHistory(tag:string):void {
    tag = tag.toLowerCase();

    if(this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag);
    }

    this._tagsHistory.unshift(tag);
    this._tagsHistory = this._tagsHistory.splice(0, 10);
    this.saveLocalStorage();
  }

  private saveLocalStorage():void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage():void {
    if(!localStorage.getItem('history')) return;
    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);
  }

  searchTag(tag: string):void {
    if(tag.length === 0) return;

    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', GIPHY_API_KEY)
      .set('limit', '10')
      .set('q', tag);

    this.http.get<SearchResponse>(`${GIPHY_API_URL}/search`, {params})
      .subscribe(resp => {
        this.gifList = resp.data;
      });

    //fetch('https://api.giphy.com/v1/gifs/search?api_key=lV5c9yxoM7xqzUx8pG0jiBlDH6S7RyMF&q=Overwatch&limit=10')
    //.then(resp => resp.json())
    //.then(data => console.log(data));

  }

}
