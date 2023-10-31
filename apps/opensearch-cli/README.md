# About CU Get Reg Index in Opensearch

In Opensearch, we employ names to differentiate environments that utilize an index. For instance, the development environment is labeled as 'course-dev,' while the beta environment is denoted as 'course-beta.

### Installing

1. Copy `opensearch.example.yaml` in `config` and paste it in the same location then remove `.example` from its name.
2. update `opensearch.yaml` with a valid configuration

# Create Index

```shell
go run ./cli/app.go index create --index-name=<index name> --filename=<filename> --debug=<true/false>
```

| name       | description                                |
| ---------- | ------------------------------------------ |
| index name | name of index                              |
| filename   | name of index file in `./cli/index` (json) |
| debug      | enable debug mode (`true`/`false`)         |

## Example

### Create index using course-index.json in dev directory

```shell
go run ./cli/app.go index create --index-name=course-dev-1 --filename=dev/course-index.json
```

# Reindex

```shell
go run ./cli/app.go index reindex --index-name=<source index name> --dest=<dest index name> --debug=<true/false>
```

| name       | description                        |
| ---------- | ---------------------------------- |
| index name | name of index                      |
| dest       | name of destination index          |
| debug      | enable debug mode (`true`/`false`) |

## Example

### Reindex from course-dev-1 to course-dev-2

```shell
go run ./cli/app.go index reindex --index-name=course-dev-1 --dest=course-dev-2
```

# Delete Index

```shell
go run ./cli/app.go index reindex --index-name=<source index name> --dest=<dest index name> --debug=<true/false>
```

| name       | description                        |
|------------|------------------------------------|
| index name | name of index                      |
| debug      | enable debug mode (`true`/`false`) |

## Example

### Delete index course-dev-1

```shell
go run ./cli/app.go index delete --index-name=course-dev-1
```
