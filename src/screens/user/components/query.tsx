import React, { useContext, useReducer, useEffect, useRef } from 'react';
import * as GitHub from '../../../github-client';
import isEqual from 'lodash/isEqual';

interface OwnProps {
  query: string;
  variables: object;
  normalize: (d: any) => any;
  children: (d: any) => any;
}
type Props = OwnProps;

function Query({ query, variables, children, normalize = data => data }: Props) {
  const client = useContext(GitHub.Context);
  const [state, setState] = useReducer((state, newState) => ({ ...state, ...newState }), {
    loaded: false,
    fetching: false,
    data: null,
    error: null,
  });

  useEffect(() => {
    if (isEqual(prevInput.current, [query, variables])) {
      return;
    }
    setState({ fetching: true });
    client
      .request(query, variables)
      .then((res: any) =>
        setState({
          data: normalize(res),
          error: null,
          loaded: true,
          fetching: false,
        }),
      )
      .catch((error: Error) =>
        setState({
          error,
          data: null,
          loaded: false,
          fetching: false,
        }),
      );
  });

  const prevInput = useRef([query, variables]);
  useEffect(() => {
    prevInput.current = [query, variables];
  });

  return children(state);
}

export default Query;
