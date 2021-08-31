Requirements:
-postgres
-nodejs
```bash
# install
sudo apt install nodejs postgresql postgresql-contrib

# configure postgres
# create db
sudo -u postgres createdb wtdb

# create user
sudo -u postgres createuser wtdb
sudo -u postgres psql
sudo -u postgres psql -c "alter user wtdb with encrypted password '25YaDfAYHSBvFcpk';"
```
