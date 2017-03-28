import Meteor from 'react-native-meteor';
import React, { Component, PropTypes } from 'react';
import { Card, Button } from 'react-native-elements';
import { SecondaryButton } from '../components/Form';
import Container from '../components/Container';
import { Header } from '../components/Text';
import LocateMeButton from '../components/LocateMeButton';
import colors from '../config/colors';
import config from '../config/config';
import Router from '../config/router';

class FindNearMe extends Component {
  static route = {
    navigationBar: {
      visible: false,
    },
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      useProductionServer: (config.useProductionServer),
      meteorServerName: (config.useProductionServer) ? 'development' : 'production',
    };
  }

  handleGeolocationSuccess = (position) => {
    const params = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };

    this.setState({ loading: true });
    Meteor.call('Locations.getNearestLocations', params, (error, locations) => {
      this.setState({ loading: false });
      if (error) {
        this.props.navigator.showLocalAlert(error.reason, config.errorStyles);
      } else {
        this.props.navigator.push(Router.getRoute('nearMe', { locations, position }));
      }
    });
  };

  handleGeolocationError = (error) => {
    this.props.navigator.showLocalAlert(error.message, config.errorStyles);
  };

  goToNearMe = () => {
    navigator.geolocation.getCurrentPosition(
      this.handleGeolocationSuccess,
      this.handleGeolocationError,
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  };

  goToFakeNearMe = (latitude, longitude) => {
    const position = {
      coords: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
    };

    this.handleGeolocationSuccess(position);
  };

  toggleDDPServer = () => {
    Meteor.disconnect();
    const SERVER_URL = (!this.state.useProductionServer) ? config.PRODUCTION_SERVER_URL : config.DEVELOPMENT_SERVER_URL;
    console.log('Connecting to :', SERVER_URL);
    Meteor.connect(SERVER_URL);
    this.setState({
      useProductionServer: !this.state.useProductionServer,
      meteorServerName: (!this.state.useProductionServer) ? 'development' : 'production',
    });
  };

  render() {
    const locations = [
      {
        _id: '1',
        name: 'MGS Creativa',
        latitude: '-34.542',
        longitude: '-58.541',
      },
      {
        _id: '2',
        name: 'Playtime',
        latitude: '-34.670',
        longitude: '-58.402',
      },
      {
        _id: '3',
        name: 'Google',
        latitude: '37.422',
        longitude: '-122.084',
      }
    ];

    return (
      <Container>
        <LocateMeButton
          onPress={this.goToNearMe}
          loading={this.state.loading}
        />
        <Header>
          Find Nearest Charging Stations
        </Header>
        <Card title="Use Fake Locations">
          {
            locations.map((location) => (
              <Button
                key={location._id}
                raised
                icon={{ name: 'my-location' }}
                title={location.name}
                backgroundColor={colors.primary}
                buttonStyle={{ marginVertical: 5 }}
                onPress={() => this.goToFakeNearMe(location.latitude, location.longitude)}
              />
            ))
          }
        </Card>
        <SecondaryButton
          title={`Switch to ${this.state.meteorServerName} Meteor server`}
          onPress={this.toggleDDPServer}
        />
      </Container>
    );
  }
}

FindNearMe.propTypes = {
  navigator: PropTypes.object,
};

export default FindNearMe;
