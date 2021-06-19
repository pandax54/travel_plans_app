# Docker local development

This template is ready to be executed in a Dockerized environment for local development purposes (and also debugging).

## Usage

- To start the dockerized environment (api + database) run `make develop-docker`
- Then run `make watch`. This is needed to watch/compile changes on the source code so the API can be restarted seamlessly.
- Optional: To debug the application, the dockerized application is exposing an inspector endpoint that listens to the port `9222`. There are many ways to attach into the debugger, eg for VS Code you can check this [link](vscode_debug)
- Finally, to stop everything, simple run the following command `make develop-docker-stop`.


[vscode_debug]: https://github.com/microsoft/vscode-recipes/tree/master/Docker-TypeScript
