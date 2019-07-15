import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LegacyAreaFormatService {
  constructor() { }

  public isValid(numberList: string): boolean {
    const numbers = this.parseNumberList(numberList);

    return numbers.length === 10 || numbers.length === 8;
  }

  public toWkt(numberList: string): string {
    const numbers = this.parseNumberList(numberList);

    const pairs = this.pairPoints(numbers);

    const points = pairs
    .reduce(
      (wktPoints, [lon, lat]) => wktPoints + `${lon} ${lat},`, ''
    ).slice(0, -1);

    return `POLYGON((${points}))`;
  }

  private parseNumberList(polygon: string): number[] {
    return polygon
      .split(',')
      .map(num => +num)
      .filter(num => !isNaN(num));
  }

  private pairPoints(numbers): number[][] {
    const pairs = numbers.reduce((result, value, index, array) => {
      if (index % 2 === 0) {
        result.push(array.slice(index, index + 2));
      }

      return result;
    }, []);

    return (pairs.length === 4) ?
      [...pairs, pairs[0]] :
      pairs;
  }
}