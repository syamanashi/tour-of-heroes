import { Injectable } from '@angular/core';

import { Hero } from './hero';
import { HEROES } from './mock.heroes';

@Injectable()
export class HeroService {

  getHeroes(): Promise<Hero[]> {
    return Promise.resolve(HEROES);
  }

  // Synchronous (old):
  // getHeroes(): Hero[] {
  //   return HEROES;
  // }

}