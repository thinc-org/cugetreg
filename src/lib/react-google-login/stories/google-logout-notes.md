## How to use
```
import React from 'react';
import ReactDOM from 'react-dom';
import GoogleLogin from 'react-google-login';
// or
import { GoogleLogin } from 'react-google-login';


const responseGoogle = (response) => {
  console.log(response);
}

ReactDOM.render(
  <GoogleLogin
    clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
    buttonText="Login"
    onSuccess={responseGoogle}
    onFailure={responseGoogle}
    cookiePolicy={'single_host_origin'}
  />,
  document.getElementById('googleButton')
);
```

## Google button without styling or custom button
```
ReactDOM.render(
  <GoogleLogin
    clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
    render={renderProps => (
      <button onClick={renderProps.onClick} disabled={renderProps.disabled}>This is my custom Google button</button>
    )}
    buttonText="Login"
    onSuccess={responseGoogle}
    onFailure={responseGoogle}
    cookiePolicy={'single_host_origin'}
  />,
  document.getElementById('googleButton')
);
```

## onSuccess callback

If responseType is not 'code', callback will return the GoogleAuth object.

If responseType is 'code', callback will return the offline token for use on your server.

If you use the hostedDomain param, make sure to validate the id_token (a JSON web token) returned by Google on your backend server:
 1. In the `responseGoogle(response) {...}` callback function, you should get back a standard JWT located at `response.hg.id_token`
 2. Send this token to your server (preferably as an `Authorization` header)
 3. Have your server decode the id_token by using a common JWT library such as [jwt-simple](https://github.com/hokaccha/node-jwt-simple) or by sending a GET request to `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=YOUR_TOKEN_HERE`
 4. The returned decoded token should have an `hd` key equal to the hosted domain you'd like to restrict to.


## Logout
Use GoogleLogout button to logout the user from google.

```
    import { GoogleLogout } from 'react-google-login';
    <GoogleLogout
      clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
      buttonText="Logout"
      onLogoutSuccess={logout}
    >
    </GoogleLogout>
  ```

## Logout Props

|    params    |   value  |             default value            |   description    |
|:------------:|:--------:|:------------------------------------:|:----------------:|
|    clientId  |  string  |               REQUIRED               | You can create a clientID by creating a [new project on Google developers website.](https://developers.google.com/identity/sign-in/web/sign-in) |
|    jsSrc     |  string  | https://apis.google.com/js/api.js | URL of the Javascript file normally hosted by Google |
| hostedDomain |  string  |                   -                  |  The G Suite domain to which users must belong to sign in |
|     scope    |  string  |             profile email            |                  |
| accessType   |  string  |              online                  | Can be either 'online' or 'offline'. Use offline with responseType 'code' to retrieve a refresh token |
|   onLogoutSuccess  | function |               REQUIRED               |                  |
|   onFailure  | function |               REQUIRED               |                  |
|   buttonText |  string  |             Login with Google        |                  |
|   className  |  string  |                   -                  |                  |
| disabledStyle|  object  |                   -                  |                  |
|   loginHint  |  string  |                   -                  |                  |
|     tag      |  string  |                button                |  sets element tag (div, a, span, etc     |
|     type      |  string  |               button                |sets button type (submit || button)     |
| fetchBasicProfile | boolean | true                            |                  |
| disabled | boolean | false                            |                  |
| discoveryDocs | - | https://developers.google.com/discovery/v1/using |
| uxMode       |  string  |  popup   | The UX mode to use for the sign-in flow. Valid values are popup and redirect. |
| theme | string | light | If set to `dark` the button will follow the Google brand guidelines for dark. Otherwise it will default to light (https://developers.google.com/identity/branding-guidelines) |
| icon | boolean | true | Show (`true`) or hide (`false`) the Google Icon |
| redirectUri       |  string  |  -   | If using ux_mode='redirect', this parameter allows you to override the default redirect_uri that will be used at the end of the consent flow. The default redirect_uri is the current URL stripped of query parameters and hash fragment. |
| isSignedIn | boolean | false | If true will return GoogleUser object on load, if user has given your app permission |
| render       | function | -                                     | Render prop to use a custom element, use renderProps.onClick |
Google Scopes List: [scopes](https://developers.google.com/identity/protocols/googlescopes)

## onSuccess callback ( w/ offline false)

onSuccess callback returns a GoogleUser object which provides access
to all of the GoogleUser methods listed here: https://developers.google.com/identity/sign-in/web/reference#users .

You can also access the returned values via the following properties on the returned object.

| property name |  value   |             definition               |
|:-------------:|:--------:|:------------------------------------:|
|   googleId    |  string  |           Google user ID             |
|   tokenId     |  string  |              Token Id                |
|  accessToken  |  string  |            Access Token              |
|   tokenObj    |  object  |        Token details object          |
|  profileObj   |  object  |        Profile details object        |

## onSuccess callback ( w/ offline true)

| property name |  value   |             definition               |
|:-------------:|:--------:|:------------------------------------:|
|    code       |  object  |           offline token              |

You can also pass child components such as icons into the button component.

```
  <GoogleLogin
    clientId={'658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com'}
    onSuccess={responseGoogle}
    onFailure={responseGoogle}
  >
    <FontAwesome
      name='google'
    />
    <span> Login with Google</span>
  </GoogleLogin>

```

## onFailure callback

onFailure callback is called when either initialization or a signin attempt fails.

| property name |  value   |             definition               |
|:-------------:|:--------:|:------------------------------------:|
|   error       |  string  |           Error code                 |
|   details     |  string  |      Detailed error description      |

Common error codes include:

| error code | description |
|:----------:|:-----------:|
| `idpiframe_initialization_failed` | initialization of the Google Auth API failed (this will occur if a client doesn't have [third party cookies enabled](https://github.com/google/google-api-javascript-client/issues/260)) |
| `popup_closed_by_user` | The user closed the popup before finishing the sign in flow.|
| `access_denied` | The user denied the permission to the scopes required |
| `immediate_failed` | No user could be automatically selected without prompting the consent flow. |

More details can be found in the official Google docs:
 * [GoogleAuth.then(onInit, onError)](https://developers.google.com/identity/sign-in/web/reference#googleauththenoninit-onerror)
 * [GoogleAuth.signIn(options)](https://developers.google.com/identity/sign-in/web/reference#googleauthsigninoptions)
 * [GoogleAuth.grantOfflineAccess(options)](https://developers.google.com/identity/sign-in/web/reference#googleauthgrantofflineaccessoptions)
