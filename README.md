# Load dependencies #

npm install

# Generate security certificates

openssl req -nodes -new -x509 -keyout server.key -out server.cert

# run web server 

node index.js


