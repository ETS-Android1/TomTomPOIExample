import {NativeModules} from 'react-native';
const {TomTomPOIModule} = NativeModules;

interface TomTomPOIModuleInterface {
  createAPIRequest(query: string, lon: number, lan: number): Promise<string>;
}

export default TomTomPOIModule as TomTomPOIModuleInterface;
