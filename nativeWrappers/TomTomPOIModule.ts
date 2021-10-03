import {NativeModules} from 'react-native';

/**
 * Exposes the Native android TomTomPOIModule to React Native
 */
const {TomTomPOIModule} = NativeModules;

/**
 * Type annotations for the native Android TomTomPOIModule
 */
interface TomTomPOIModuleInterface {
  /**
   * Calls  the native Andorid TomTomPOIModule.createAPIRequest function witch
   * makes a call to the TomTom Points Of Interest Search API
   * @param {string=} query Search query for the POI API
   * @param {number=} lat Latitude of the current user location for the POI API
   * @param {number=} lon Longitude of the current user location for the POI API
   * @return {Promise<string>} Promise of a JSON Object as string containing the API Response
   */
  createAPIRequest(query: string, lat: number, lon: number): Promise<string>;
}

export default TomTomPOIModule as TomTomPOIModuleInterface;
