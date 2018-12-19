import './global-styles.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, RouteComponentProps } from '@reach/router';
import ErrorBoundary, { FallbackProps } from 'react-error-boundary';
import ThemeProvider from './shared/theme-provider';
import { IsolatedContainer, LoadingMessagePage } from './shared/pattern';
import * as GitHubContext from './github-client';
import { Props as UserProps } from './screens/user';

const Home = React.lazy<React.ComponentType<RouteComponentProps>>(() => import('./screens/home'));
const User = React.lazy<React.ComponentType<RouteComponentProps<UserProps>>>(() =>
  import('./screens/user'),
);

function ErrorFallback({ error }: FallbackProps) {
  return (
    <IsolatedContainer>
      <p>There was an error</p>
      <pre style={{ maxWidth: 700 }}>{JSON.stringify(error, null, 2)}</pre>
    </IsolatedContainer>
  );
}

function App() {
  return (
    <ThemeProvider>
      <GitHubContext.Provider>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <React.Suspense fallback={<LoadingMessagePage>Loading Application</LoadingMessagePage>}>
            <Router>
              <Home path="/" />
              <User path="/:username" />
            </Router>
          </React.Suspense>
        </ErrorBoundary>
      </GitHubContext.Provider>
    </ThemeProvider>
  );
}

const ui = <App />;
const container = document.getElementById('root');

ReactDOM.render(ui, container);
