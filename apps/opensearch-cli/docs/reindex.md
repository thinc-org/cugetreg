# Reindex Guideline

1. Create new index (destination index) by using command `go run ./cli/app.go index create --index-name=<new index name> --file-name=<file path>`
2. Run reindex command `go run ./cli/app.go index reindex --index-name=<old index name> --dest=<new index name>`
3. Delete the old one `go run ./cli/app.go index delete --index-name=<old index name>`
