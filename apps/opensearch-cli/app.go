package main

import (
	"bytes"
	"flag"
	"fmt"
	"github.com/opensearch-project/opensearch-go/v2"
	"github.com/samithiwat/elastic-with-go/src/config"
	"github.com/samithiwat/elastic-with-go/src/database"
	"go.uber.org/zap"

	"github.com/fatih/color"
	"github.com/pkg/errors"
	"math/rand"
	"os"
	"strings"
	"time"
)

var (
	fileName  string
	indexName string
	isDebug   bool
	indexCmd  *flag.FlagSet
)

const BaseIndexFilePath = "./cli/index"

func init() {
	indexCmd = flag.NewFlagSet("index", flag.ExitOnError)

	indexCmd.StringVar(&indexName, "index-name", "", "Index name")
	indexCmd.StringVar(&fileName, "filename", "", "Index filename")
	indexCmd.BoolVar(&isDebug, "debug", false, "Enable the debug log")
	flag.Parse()

	rand.Seed(time.Now().UnixNano())
}

func main() {
	logger, _ := zap.NewProduction()

	conf, err := config.LoadOpensearchConfig()
	if err != nil {
		logger.Fatal(
			"failed to start service",
			zap.Error(err),
			zap.String("statement", "load config"),
		)
	}

	client, err := database.InitOpenSearchClient(conf, isDebug)
	if err != nil {
		logger.Fatal(
			"Failed to open elasticsearch client",
			zap.Error(err),
			zap.String("statement", "init client"),
		)
	}

	if len(os.Args) < 2 {
		logger.Fatal(
			"Invalid input",
			zap.Error(err),
		)
	}

	switch os.Args[1] {
	case "index":
		switch os.Args[2] {
		case "create":
			if err := handleCreateIndex(client); err != nil {
				logger.Fatal(
					"Error while creating the index",
					zap.Error(err),
				)
			}

			fmt.Println(strings.Repeat("_", 65))
			fmt.Printf("successfully create the index, %s \n", indexName)
		default:
			logger.Fatal("Invalid input (invalid command)")
		}
	case "help":
		if len(os.Args) < 3 {
			handleHelp()
		} else {
			switch os.Args[2] {
			case "index":
				handleHelpIndex()
			default:
				handleHelp()
			}
		}

	default:
		logger.Fatal("Invalid input (invalid command)")
	}

}

func handleHelp() {
	cyan := color.New(color.FgCyan)
	cyanUnderline := color.New(color.FgCyan).Add(color.Underline)
	red := color.New(color.FgRed)
	green := color.New(color.FgGreen)

	fmt.Print(strings.Repeat(" ", 25))
	cyanUnderline.Println("Search CLI")

	fmt.Print(strings.Repeat(" ", 2))
	cyanUnderline.Println(strings.Repeat(" ", 61))

	cyan.Print(strings.Repeat(" ", 2), "|", strings.Repeat(" ", 2))
	red.Print("name")
	cyan.Print(strings.Repeat(" ", 15), "|", strings.Repeat(" ", 2))
	red.Print("description\n")

	cyan.Print(strings.Repeat(" ", 2), "|", strings.Repeat(" ", 2))
	green.Print("index")
	cyan.Print(strings.Repeat(" ", 14), "|", strings.Repeat(" ", 2))
	fmt.Print("manage index commands (more info `help index`)\n")
}

func handleHelpIndex() {
}

func handleCreateIndex(client *opensearch.Client) error {
	if err := indexCmd.Parse(os.Args[3:]); err != nil {
		return err
	}

	indexJsonRaw, err := os.ReadFile(BaseIndexFilePath + "/" + fileName)
	if err != nil {
		return err
	}

	res, err := client.Indices.Create(
		indexName,
		client.Indices.Create.WithBody(bytes.NewReader(indexJsonRaw)),
	)

	if err != nil {
		return err
	}

	if res.IsError() {
		return errors.New(res.String())
	}

	return nil
}
