class Profile {
  public imageUrl: string;
  public lastUpdated: string;

  constructor(imageUrl: string, lastUpdated?: string) {
    this.imageUrl = imageUrl;
    this.lastUpdated = lastUpdated || new Date().toISOString();
  }
}

export default Profile;
