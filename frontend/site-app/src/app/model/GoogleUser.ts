export class GoogleUser{

  private _firstName: string;
  private _lastName: string;
  private _email: string;
  private _profileImageUrl: string;

  constructor(firstName: string, lastName: string, email: string, profileImageUrl:string) {
    this._firstName = firstName;
    this._lastName = lastName;
    this._email = email;
    this._profileImageUrl = profileImageUrl;
  }


  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get email(): string {
    return this._email;
  }

  get profileImageUrl(): string {
    return this._profileImageUrl;
  }
}
