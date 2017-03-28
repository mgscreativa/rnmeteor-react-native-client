import Meteor from 'react-native-meteor';
import React, { Component, PropTypes } from 'react';
import Container from '../components/Container';
import { Card } from 'react-native-elements';
import Router from '../config/router';
import config from '../config/config';
import { Input, PrimaryButton, SecondaryButton } from '../components/Form';

class SignIn extends Component {
  static route = {
    navigationBar: {
      visible: true,
      title: 'Sign In',
    },
  };

  constructor(props) {
    super(props);

    this.state = {
      emailOrUsername: '',
      password: '',
      loading: false,
    };
  }

  signIn = () => {
    const { emailOrUsername, password } = this.state;

    if (emailOrUsername.length === 0) {
      return this.props.navigator.showLocalAlert('Email or username is required.', config.errorStyles);
    }

    if (password.length === 0) {
      return this.props.navigator.showLocalAlert('Password is required.', config.errorStyles);
    }

    this.setState({ loading: true });
    return Meteor.loginWithPassword(emailOrUsername, password, (error) => {
      this.setState({ loading: false });
      if (error) {
        this.props.navigator.showLocalAlert(error.reason, config.errorStyles);
      } else {
        this.props.navigator.immediatelyResetStack([Router.getRoute('profile')]);
      }
    });
  };

  render() {
    return (
      <Container scroll>
        <Card>
          <Input
            label="Email or Username"
            placeholder="Please enter your email or username..."
            keyboardType="email-address"
            onChangeText={(emailOrUsername) => this.setState({ emailOrUsername })}
            value={this.state.emailOrUsername}
          />
          <Input
            label="Password"
            placeholder="Please enter your password..."
            secureTextEntry
            onChangeText={(password) => this.setState({ password })}
            value={this.state.password}
          />
          <PrimaryButton
            title="Sign In"
            onPress={this.signIn}
            loading={this.state.loading}
          />
        </Card>
      </Container>
    );
  }
}

SignIn.propTypes = {
  navigator: PropTypes.object,
};

export default SignIn;

