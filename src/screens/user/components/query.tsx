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

function useSetState<T = any>(initState: T): [T, (arg: Partial<T>) => void] {
  const [state, setState] = useReducer(
    (state, newState: Partial<T>) => ({ ...state, ...newState }),
    initState,
  );

  return [state, setState];
}

function useSafeSetSate<T = any>(initState: T): [T, (arg: Partial<T>) => void] {
  const [state, setState] = useSetState(initState);

  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => (mountedRef.current = false);
  }, []);

  const safeSetState = (arg: Partial<T>) => mountedRef.current && setState(arg);

  return [state, safeSetState];
}

interface States {
  loaded: boolean;
  fetching: boolean;
  data: object | null;
  error: Error | null;
}

function Query({ query, variables, children, normalize = data => data }: Props) {
  const client = useContext(GitHub.Context);
  const [state, setState] = useSafeSetSate({
    loaded: false,
    fetching: false,
    data: null,
    error: null,
  } as States);

  useEffect(() => {
    if (isEqual(prevInputRef.current, [query, variables])) {
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

  const prevInputRef = useRef([query, variables]);
  useEffect(() => {
    prevInputRef.current = [query, variables];
  });

  return children(state);
}

export default Query;
