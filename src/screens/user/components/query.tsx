import React, { useContext } from 'react';
import * as GitHub from '../../../github-client';
import { useDeepCompareEffect, useSafeSetSate } from '../../../util/hooks';

interface OwnProps {
  query: string;
  variables: object;
  normalize: (d: any) => any;
  children: (d: any) => any;
}
type Props = OwnProps;

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

  useDeepCompareEffect(
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
