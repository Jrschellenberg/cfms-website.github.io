export default class Settings {
  constructor(data) {
    this.data = data;
  }
  getData() {
    return this.data;
  }
  static createInstance(data) {
    if (!Settings.instance) {
      Settings.instance = new Settings(data);
    }
    return Settings.instance;
  }
  static getInstance() {
    return Settings.instance;
  }
}