

export interface DecodedToken {
    id: number;
    name: string;
    isAdmin:boolean;
    iat: number;
    exp: number;
    sub: string;
}