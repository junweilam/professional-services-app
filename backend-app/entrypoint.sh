#!/bin/bash

# Start your Node.js application
node server.js &


# # Wait for the MySQL server to be ready
# until mysql -hsql-server -uusers -ppw123123 -e 'SELECT 1'; do
#   echo 'Waiting for MySQL to be ready...'
#   sleep 5
# done

# # Run the seeding SQL script
echo 'Running database seeding...'

mysql -hsql-server -uroot -ppw123123 < seed.sql

echo 'Database seeder completed...'

# Start the MySQL server
exec "$@"

tail -f /dev/null
