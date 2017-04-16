import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { HeroSearchService } from './hero-search.service';
import { Hero } from './hero';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css'],
  providers: [HeroSearchService],
})
export class HeroSearchComponent implements OnInit {
  
  // Initialize heroes with type of a stream of Hero arrays.
  heroes: Observable<Hero[]>;

  // A Subject is a producer of an observable event stream;
  //   searchTerms produces an Observable of strings, the filter criteria for the name search.
  private searchTerms = new Subject<string>();

  constructor(
    private heroSearchService: HeroSearchService,
    private router: Router,
  ) { }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term); // Each call to search() puts a new string into this subject's observable stream by calling next().
  }

  
  // A Subject is also an Observable.
  //    Turn the stream of search terms into a stream of Hero arrays and assign the result to the heroes property.
  ngOnInit(): void {
    
    // this.heroes is a stream of Hero arrays...
    this.heroes = this.searchTerms
      .debounceTime(300) // Wait 300ms after each keystroke before considering the term.
      .distinctUntilChanged() // Ignore if next search term is same as previous.
      .switchMap(term => term // Switch to new observable each time the term changes.
                              //    switchMap() calls the search service for each search term that makes it through debounce and distinctUntilChanged.
                              //      It cancels and discards previous search observables, returning only the latest search service observable.
                              //    switchMap() preserves the original request order while returning only the observable from the most recent http method call.
                              //      Results from prior calls are canceled and discarded.
        // return the http search service observable
        ? this.heroSearchService.search(term)
        // or the observable of empty heroes if there was no search term
        : Observable.of<Hero[]>([]) // If the search text is empty, the http() method call is also short circuited and an observable containing an empty array is returned.
      )
      .catch(error => {  // catch intercepts a failed observable.
                         //     The simple example prints the error to the console; a real life app would do better.
                         //     Then to clear the search result, you return an observable containing an empty array.
        // TODO: add real error handling
        console.log(error);
        return Observable.of<Hero[]>([]);
      });

  }

  gotoDetail(hero: Hero): void {
    let link = ['/detail', hero.id];
    this.router.navigate(link);
  }

}