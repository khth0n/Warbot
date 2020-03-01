#!/bin/bash

SIGINT=$(pgrep WarbotRunner.sh)
kill -INT -$SIGINT
