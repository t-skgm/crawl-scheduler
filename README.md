```bash
# Build crawler docker image
$ ./build-crawler.sh

# Compose up
$ docker-compose up --build

# Push digdag projects
$ digdag push crawler --project digdag/projects/crawler

# Start job
$ digdag start crawler crawl -p url="https://google.com" --session now

# Check result
$ mongo 127.0.0.1/crawler -u root -p password --authenticationDatabase="admin" --eval "printjson(db.contents.findOne())"
```
