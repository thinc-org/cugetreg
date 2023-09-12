package database

import (
	"crypto/tls"
	"github.com/opensearch-project/opensearch-go/v2"
	"github.com/opensearch-project/opensearch-go/v2/opensearchtransport"
	"net/http"
	"opensearch-cli/src/config"
	"os"
)

func InitOpenSearchClient(conf *config.OpensearchConfig, isDebug bool) (*opensearch.Client, error) {
	opensearchConf := opensearch.Config{
		Addresses:     []string{conf.Host},
		Username:      conf.Username,
		Password:      conf.Password,
		RetryOnStatus: []int{502, 503, 504, 429},
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{InsecureSkipVerify: conf.InsecureSkipVerify},
		},
	}

	if isDebug {
		opensearchConf.Logger = &opensearchtransport.ColorLogger{
			Output:             os.Stdout,
			EnableRequestBody:  true,
			EnableResponseBody: true,
		}
	}

	return opensearch.NewClient(opensearchConf)
}
