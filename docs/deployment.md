# Deployment Notes

This project was deployed using Nuxthub on cloudflare workers as mentioned in the problem statment.

### Deployment Setup Instructions

- Run this command in the project root directory
```bash
npx nuxthub deploy
```
- Follow the instructions for the Nuxthub Deployment such as linking your github account, and setting up the cloudflare access token.
- Once the above is setup, enter the desired project name and follow the instructions to deploy the app on Nuxthub.
- Once deployed, the URL for the deployed app is provided on the terminal.

### Challenges Encountered

- Ensure Nuxthub package is installed in the project.
- Sometimes, there may be an error that says,

```bash
 ERROR  @nuxthub/core is not installed, make sure to install it with npx nuxt module add hub
```
Install the missing dependency by running the command -

```bash
npx nuxt module add hub
```

### Insights, Benefits and Improvements

- To manage an existing deployment, you can do so by running the following command,

```bash
npx nuxthub manage
```

- One of the benefits of using an Edge Deployment for an end user is that, the webapp is loaded much faster, optimizations are done such as minifying the javascript assets, it is scalable and can be distributed.

- One suggested improvement could be - making this an automated deployment through tools like github actions on specific hooks and also creating staging environment and ephemeral deployments.