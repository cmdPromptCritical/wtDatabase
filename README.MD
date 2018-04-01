Requirements:
-elasticsearch

CONFIGURING ELASTICSEARCH
Change/add these lines to  elasticsearch.yml:
transport.host: localhost
network.host: 0.0.0.0
Change the max mem size in jvm.options to:
-Xms256m
-Xmx256m
And run this for good measure to make sure the service is configured to start on reboot:
sudo update-rc.d elasticsearch defaults 95 10