/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Movies {

    id?: number;
    title: string;
    releaseYear: number;
    overview: string;
    price: number;
    posterPath: any;
    rented: boolean;
    userId:number;

  }