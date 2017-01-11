#!/bin/bash
mongoimport -d syngulate -c articles --type csv --file articles.csv --headerline
