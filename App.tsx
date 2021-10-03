import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

//3rd Party Libraries
import GetLocation from 'react-native-get-location';

//Project Imports
import {PointOfInterestItem} from './components/PointOfInterest';
import TomTomPOIModule from './nativeWrappers/TomTomPOIModule';
import {ITomTomPOIResponse, Result} from './interfaces/ITomTomPOIResponse';

interface POIRequestParams {
  query: string;
  lat: number;
  lon: number;
}

const App = () => {
  //Define React Native Hooks
  const [pointOfInterestItems, setPointOfInterestItems] = useState<Result[]>();

  /**
   * Asynchronously Handles the POI API Request and awaits the response
   * @param query String to query the API for a POI Name
   * @param lat Number to define the  latitude location  in the API
   * @param lon Number to define the longitude location in the API
   */
  const onAPIRequest = async ({query, lat, lon}: POIRequestParams) => {
    try {
      return await TomTomPOIModule.createAPIRequest(query, lat, lon);
    } catch (e) {
      console.error(e);
      return '';
    }
  };

  /**
   * If the View.TextInput has a string longer than 3 characters, checks the
   * Gps Location and creates an  TomTom POI API call based on the TextInput
   * and Location
   * @param text Text in the TextInput View to use for the API query
   */
  function handleSearch({text}: {text: string}) {
    if (text.length < 3) {
      return;
    }
    GetLocation.getCurrentPosition({
      //Accesses Android Fine Location
      //Set to false to activate Coarse Location which is more battery friendly
      enableHighAccuracy: true,
      //If gps location cant be found in 15sec promise will fail
      timeout: 15000,
    }).then(location => {
      onAPIRequest({
        query: text,
        lat: location.latitude,
        lon: location.longitude,
      }).then(response => {
        console.log('API Response ', response);
        //Parse the Response JSON Object as an object of ITomTomPOIResponse Interface
        let results: ITomTomPOIResponse = JSON.parse(response.toString());
        //Here we notify that new data are ready using the Hook We created
        setPointOfInterestItems(results.results);
      });
    });
  }

  return (
    <SafeAreaView style={styles.sectionContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder={'Search for a Point of Interest'}
        onChangeText={text => handleSearch({text: text})}
      />
      <View style={styles.pointsWrapper}>
        <Text style={styles.sectionTitle}>Points Of Interest </Text>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{
            flexGrow: 1,
          }}
          keyboardShouldPersistTaps="handled">
          <View style={styles.items}>
            {/*Check if the list of Points of Interest is Undefined and map it
            Using the View PointOfInterestItems*/}
            {pointOfInterestItems &&
              pointOfInterestItems.map(item => {
                return (
                  <PointOfInterestItem
                    key={item.id}
                    poiName={item.poi.name}
                    poiDistance={Math.round(item.dist)}
                    poiStreet={item.address.freeformAddress}
                  />
                );
              })}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  pointsWrapper: {
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  items: {
    marginTop: 30,
  },
  searchInput: {
    top: 20,
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 30,
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
});

export default App;
