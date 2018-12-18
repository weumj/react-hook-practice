import { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import * as GitHub from '../../../github-client';

interface OwnProps {
  query: string;
  variables: object;
  normalize: (d: any) => any;
  children: (d: any) => any;
}
type Props = OwnProps;

interface States {}

interface Contexts {}

class Query extends Component<Props, States, Contexts> {
  static propTypes = {
    query: PropTypes.string.isRequired,
    variables: PropTypes.object,
    children: PropTypes.func.isRequired,
    normalize: PropTypes.func,
  };
  static defaultProps = {
    normalize: (data: any) => data,
  };
  static contextType = GitHub.Context;

  state = { loaded: false, fetching: false, data: null, error: null };
  private isMounted = false;

  componentDidMount() {
    this.isMounted = true;
    this.query();
  }

  componentDidUpdate(prevProps: Props) {
    if (
      !isEqual(this.props.query, prevProps.query) ||
      !isEqual(this.props.variables, prevProps.variables)
    ) {
      this.query();
    }
  }

  componentWillUnmount() {
    this.isMounted = false;
  }

  query() {
    this.setState({ fetching: true });
    const client = this.context;
    client
      .request(this.props.query, this.props.variables)
      .then((res: any) =>
        this.safeSetState({
          data: this.props.normalize(res),
          error: null,
          loaded: true,
          fetching: false,
        }),
      )
      .catch((error: Error) =>
        this.safeSetState({
          error,
          data: null,
          loaded: false,
          fetching: false,
        }),
      );
  }

  safeSetState(...args: any[]) {
    this.isMounted && this.setState.apply(this, args as any);
  }

  render() {
    return this.props.children(this.state);
  }
}

export default Query;
