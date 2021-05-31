# Frontend Project

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

To install this project, make sure you have [yarn](https://classic.yarnpkg.com/en/docs/install) installed.
Then run `yarn` or `yarn install` to install the dependencies.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

## Deployment
To deploy the frontend project, run the install and build command from above.

Remeber to change the user, group and working directory in the `serve.service` file to the user, group and path on your production server.
```
User=[username]
Group=[groupname]
WorkingDirectory=/path/to/project/web-app-nornir/frontend
```

Once you saved the changes, copy the `serve.service` file to `/etc/systemd/system/`

Enable and start the service with the following commands:
```
sudo systemctl enable serve.service
sudo systemctl start serve.service
```

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).
