export interface ApiResult<W> {
  Status: boolean;
  Data: W;
  Error?:string;
}
