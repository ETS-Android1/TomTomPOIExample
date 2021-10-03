import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
  // @ts-ignore
} from 'accordion-collapse-react-native';

interface PointOfInterest {
  key: string;
  poiName: string;
  poiDistance: number;
  poiStreet: string;
  isLoading?: boolean;
}

export class PointOfInterestItem extends React.PureComponent<PointOfInterest> {
  render() {
    if (this.props.isLoading) {
      return <View>Loading POIS...</View>;
    }
    return (
      <Collapse style={styles.container}>
        <CollapseHeader style={styles.containerLeft}>
          <View style={styles.itemHeader}>
            <Text style={styles.badge}> ▼ </Text>
          </View>
          <Text>{this.props.poiName}</Text>
        </CollapseHeader>
        <CollapseBody style={styles.itemBody}>
          <Text style={styles.itemBody}>{this.props.poiStreet}</Text>
          <Text style={styles.itemBody}>
            Distance: {this.props.poiDistance} Meters
          </Text>
        </CollapseBody>
      </Collapse>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  containerLeft: {
    flex: 1,
    alignItems: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  itemHeader: {
    width: 24,
    height: 24,
    backgroundColor: '#55BCF6',
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  itemBody: {
    fontSize: 12,
    borderRadius: 5,
    flex: 2,
    padding: 4,
  },
  badge: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});
