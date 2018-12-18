import React, { useContext } from 'react';
import * as GitHub from '../../../github-client';
import { useDeepCompareEffect, useSafeSetSate } from '../../../util/hooks';
import { User } from './profile';

interface OwnProps {
  query: string;
  variables: object;
  normalize: (d: any) => any;
}
type Props = OwnProps;

interface States {
  loaded: boolean;
  fetching: boolean;
  data: User | null;
  error: Error | null;
}

const Query = ({ children, ...props }: Props & { children: (d: any) => any }) =>
  children(useQuery(props));

export function useQuery({ query, variables, normalize = data => data }: Props) {
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

  return state;
}

export default Query;
