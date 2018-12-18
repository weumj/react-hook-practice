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
    error: null as Error | null,
  });

  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => (mountedRef.current = false);
  }, []);

  const safeSetState = (arg: Partial<typeof state>) => mountedRef.current && setState(arg);

  useEffect(() => {
    if (isEqual(prevInputRef.current, [query, variables])) {
      return;
    }
    safeSetState({ fetching: true });
    client
      .request(query, variables)
      .then((res: any) =>
        safeSetState({
          data: normalize(res),
          error: null,
          loaded: true,
          fetching: false,
        }),
      )
      .catch((error: Error) =>
        safeSetState({
          error,
          data: null,
          loaded: false,
          fetching: false,
        }),
      );
  });

  const prevInputRef = useRef([query, variables]);
  useEffect(() => {
    prevInputRef.current = [query, variables];
  });

  return children(state);
}

export default Query;
