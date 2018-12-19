/* @jsx jsx */
import { jsx } from '@emotion/core';

jsx;

import React, { useEffect, useState } from 'react';
import { navigate, createHistory, HistoryUnsubscribe } from '@reach/router';
import Netlify from 'netlify-auth-providers';
import { GraphQLClient } from 'graphql-request';
import { PrimaryButton } from './shared/pattern';

const GitHubClientContext = React.createContext({} as any);
const { Provider, Consumer } = GitHubClientContext;

async function authWithGitHub() {
  return new Promise((resolve, reject) => {
    const authenticator = new Netlify({
      site_id: process.env.REACT_APP_NETLIFY_SITE_ID,
    });
    authenticator.authenticate(
      { provider: 'github', scope: 'public_repo,read:org,read:user' },
      (err: Error, data: any) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      },
    );
  });
}

const history = createHistory(window as any);

interface Props {
  client?: any;
  children: any;
}

interface States {
  client: any;
  error: Error | null;
}

function GitHubClientProvider(props: Props) {
  const [error, setError] = useState(null as States['error']);

  const [client, setClient] = useState(
    (): Props['client'] => {
      if (props.client) {
        return client;
      } else {
        const token = window.localStorage.getItem('github-token');
        if (token) {
          return getClient(token);
        } else {
          return null;
        }
      }
    },
  );

  function getClient(token: string) {
    const headers = { Authorization: `bearer ${token}` };
    const gClient = new GraphQLClient('https://api.github.com/graphql', {
      headers,
    });
    return Object.assign(gClient, { login, logout });
  }

  function logout() {
    window.localStorage.removeItem('github-token');
    setClient(null);
    setError(null);
    navigate('/');
  }

  async function login() {
    const data = (await authWithGitHub().catch(e => {
      console.log('Oh no', e);
      setError(error);
    })) as any;
    window.localStorage.setItem('github-token', data.token);
    setClient(getClient(data.token));
  }

  useEffect(() => {
    if (!client) {
      navigate('/');
    }

    const unsubscribeHistory = history.listen(() => {
      if (!client) {
        navigate('/');
      }
    });

    return function cleanup() {
      unsubscribeHistory();
    };
  }, []);

  return client ? (
    <Provider value={client}>{props.children}</Provider>
  ) : (
    <div
      css={{
        marginTop: 250,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {error ? (
        <div>
          <p>Oh no! There was an error.</p>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      ) : (
        <div>
          <PrimaryButton onClick={login}>Login with GitHub</PrimaryButton>
        </div>
      )}
    </div>
  );
}

export { GitHubClientProvider as Provider, Consumer, GitHubClientContext as Context };
