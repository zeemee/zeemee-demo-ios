import Relay from 'react-relay';

export default class extends Relay.Route {
  static queries = {
    me: () => Relay.QL`query { me }`,
  };

  static routeName = 'ViewerRoute';
}
