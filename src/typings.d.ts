declare module '@emotion/styled/macro' {
  import styled from '@emotion/styled';
  export * from '@emotion';
  export default styled;
}

declare module 'netlify-auth-providers' {
  export default class {
    public authenticate: any;
    constructor(...args: any[]);
  }
}

declare const REACT_APP_NETLIFY_SITE_ID;
