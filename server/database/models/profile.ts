class Profile {
  imageUrl: string;
  lastUpdated: string;
  
  constructor(imageUrl:string){
    this.imageUrl = imageUrl;
    this.lastUpdated = new Date().toISOString();
  }
}

export default Profile;
