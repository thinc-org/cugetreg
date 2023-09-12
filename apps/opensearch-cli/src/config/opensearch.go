package config

import (
	"github.com/pkg/errors"
	"github.com/spf13/viper"
)

type OpensearchConfig struct {
	Host               string `mapstructure:"host"`
	Username           string `mapstructure:"username"`
	Password           string `mapstructure:"password"`
	InsecureSkipVerify bool   `mapstructure:"skip-ssl"`
}

func LoadOpensearchConfig() (config *OpensearchConfig, err error) {
	viper.AddConfigPath("./config")
	viper.SetConfigName("opensearch")
	viper.SetConfigType("yaml")

	viper.AutomaticEnv()

	err = viper.ReadInConfig()
	if err != nil {
		return nil, errors.Wrap(err, "error occurs while reading the config")
	}

	conf := OpensearchConfig{}

	err = viper.Unmarshal(&conf)
	if err != nil {
		return nil, errors.Wrap(err, "error occurs while unmarshal the config")
	}

	return &conf, err
}
