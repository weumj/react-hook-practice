import React, { useContext, useReducer, useEffect } from 'react';
import * as GitHub from '../../../github-client';

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

  useEffect(
    () => {
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
    },
    [query, variables],
  );

  return children(state);
}

export default Query;
