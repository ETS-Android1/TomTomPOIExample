import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {PointOfInterestItem} from './components/PointOfInterest';
import TomTomPOIModule from './nativeWrappers/TomTomPOIModule';
import GetLocation from 'react-native-get-location';
import {ITomTomPOIResponse, Result} from './interfaces/ITomTomPOIResponse';

interface POIRequestParams {
  query: string;
  lan: number;
  lon: number;
}

const App = () => {
  const [pointOfInterestItems, setPointOfInterestItems] = useState<Result[]>();

  const onAPIRequest = async ({query, lan, lon}: POIRequestParams) => {
    try {
      return await TomTomPOIModule.createAPIRequest(query, lon, lan);
    } catch (e) {
      console.error(e);
      return '';
    }
  };

  function handleSearch({text}: {text: string}) {
    if (text.length <= 3) {
      return;
    }
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    }).then(location => {
      onAPIRequest({
        query: text,
        lan: location.latitude,
        lon: location.longitude,
      }).then(response => {
        console.log('API Response ', response);
        let results: ITomTomPOIResponse = JSON.parse(response.toString());
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
