class Profile {
  public imageUrl: string;
  public lastUpdated: string;

  constructor(imageUrl: string) {
    this.imageUrl = imageUrl;
    this.lastUpdated = new Date().toISOString();
  }
}

export default Profile;
