import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import Container from '../components/Container';
import FloatingButton from '../components/FloatingButton';
import Router from '../config/router';

class NearMe extends Component {
  static route = {
    navigationBar: {
      visible: true,
      title: 'Near Me',
    },
  };

  subTitle = (location) => {
    let subtitle = '';
    if (location.street_address) {
      subtitle = location.street_address;
    }

    if (location.access_days_time && subtitle.length) {
      subtitle = `${subtitle} - ${location.access_days_time}`;
    } else if (location.access_days_time) {
      subtitle = location.access_days_time;
    }

    return subtitle;
  };

  goToLocationDetails = (location) => {
    this.props.navigator.push(Router.getRoute('locationDetails', { location }));
  };

  replaceScreen = () => {
    const {
      locations,
      position,
    } = this.props.route.params;

    this.props.navigator.replace(Router.getRoute('nearMeMap', { locations, position }));
  };

  render() {
    const {
      locations,
    } = this.props.route.params;

    return (
      <View>
        <Container scroll>
          <List>
            {
              locations.map((location) => (
                <ListItem
                  key={location._id}
                  title={location.station_name}
                  subtitle={this.subTitle(location)}
                  onPress={() => this.goToLocationDetails(location)}
                />
              ))
            }
          </List>
        </Container>
        <FloatingButton
          icon="map"
          onPress={this.replaceScreen}
        />
      </View>
  );
  }
}

NearMe.propTypes = {
  route: PropTypes.object,
  navigator: PropTypes.object,
};

export default NearMe;
