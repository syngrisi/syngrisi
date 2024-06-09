## Syngrisi Environment Variables 

### Native Mode

1. `SYNGRISI_DB_URI`
   - Description: [Connection URI](https://www.mongodb.com/docs/manual/reference/connection-string/) for Mongo DB service
   - Default Value: `mongodb://127.0.0.1:27017/SyngrisiDb`

2. `SYNGRISI_IMAGES_PATH`
   - Description: Path to the folder for Syngrisi images, including screenshots and diffs.
   - Default Value: `./.snapshots-images/`

3. `SYNGRISI_APP_PORT`
   - Description: TCP port for application server
   - Default Value: `3000`

4. `SYNGRISI_AUTH`
   - Description: Enables authentication
   - Default Value: `true`

5. `LOGLEVEL`
   - Description: Log level (`error` `warn`, `info`, `verbose`, `debug`, `silly`)
   - Default Value: `debug`

6. `SYNGRISI_PAGINATION_SIZE`
   - Description: Number of tests items on that return `/checks?page={page_num}` API
   - Default Value: `50`

7. `SYNGRISI_DISABLE_DEV_CORS`
   - Description: Disable CORS for vite dev server, only for dev and test purposes
   - Default Value: `-`

8. `SYNGRISI_COVERAGE`
   - Description: Enable coverage, if `true` generated coverage data to `./coverage`
   - Default Value: `-`

### Docker Mode

1. `SYNGRISI_DOCKER_IMAGES_PATH`
   - Description: Path to the internal Docker folder for Syngrisi images, including screenshots and diffs.
   - Default Value: `./.snapshots-images`

2. `SYNGRISI_DOCKER_PORT`
   - Description: Docker external Syngrisi App Server Port (host port)
   - Default Value: `5000`

3. `SYNGRISI_DOCKER_DB_PORT`
   - Description: Docker external Syngrisi Database Server Port (host port)
   - Default Value: `27017`

4. `SYNGRISI_DOCKER_DB_AUTH_ARG`
   - Description: To enable mongo database authentication set it to `--auth` be sure that you create user for `SyngrisiDb` database and add appropriate values to connection string
   - Default Value: `--noauth`

5. `SYNGRISI_DOCKER_BACKUPS_PATH`
   - Description: Host Backup Folder path
   - Default Value: `./backups/`

6. `SYNGRISI_DOCKER_DB_PATH`
   - Description: Host Path to Syngrisi Database files
   - Default Value: `./data/db_data`

7. `SYNGRISI_DB_URI`
   - Description: [Connection URI](https://www.mongodb.com/docs/manual/reference/connection-string/) for Mongo DB service
   - Default Value: `mongodb://127.0.0.1:27017/SyngrisiDb`

8. `SYNGRISI_IMAGES_PATH`
   - Description: Path to the folder for Syngrisi images, including screenshots and diffs.
   - Default Value: `./.snapshots-images/`

9. `SYNGRISI_AUTH`
   - Description: Enables authentication
   - Default Value: ``

10. `MONGODB_ROOT_USERNAME`
    - Description: Username for the Database Root user, that will be created at first Applications start
    - Default Value: -

11. `MONGODB_ROOT_PASSWORD`
    - Description: Password for the Database Root user, that will be created at first Applications start
    - Default Value: -

12. `SYNGRISI_TEST_MODE`
    - Description: Enables test admin user if equal `1`, used only for tests purposes
    - Default Value: `false`

13. `SYNGRISI_DISABLE_FIRST_RUN`
    - Description: Disable first run procedure, disabled if equal `1`, used only for tests purposes
    - Default Value: `false`

14. `SYNGRISI_SESSION_STORE_KEY`
    - Description: A Secret for session storage
    - Default Value: random generated

15. `SYNGRISI_HTTP_LOG`
    - Description: Enable HTTP logs, if `true` logging all HTTP request to `./logs/http.log` file
    - Default Value: `false`
