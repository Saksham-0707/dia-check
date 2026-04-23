declare module "jsonwebtoken" {
  export interface JwtPayload {
    [key: string]: unknown;
    exp?: number;
    iat?: number;
  }

  export function verify(
    token: string,
    secretOrPublicKey: string,
  ): string | JwtPayload;

  const jwt: {
    verify: typeof verify;
  };

  export default jwt;
}
