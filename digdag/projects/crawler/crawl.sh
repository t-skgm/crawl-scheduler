#!/bin/bash

URL=$1

# set -x # debug on
docker run -i --rm --cap-add=SYS_ADMIN \
  --net scheduler_net \
  --link mongodb:mongodb \
  --name puppeteer-chrome \
  -e "URL=${URL}" \
  puppeteer-chrome-linux
# set +x # debug off
