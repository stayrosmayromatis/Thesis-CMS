export interface InternalDataTransfter<T>
{
  Status:boolean;
  Data:T | null;
  Error?: InternalErrorObject | string;
  Description?: string ;
}
export interface InternalErrorObject{
  ErrorCode: ProjectErrorCodes;
}
export enum ProjectErrorCodes{
  AlreadyExists = 8
}
