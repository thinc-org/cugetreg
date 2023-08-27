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
