# Certificates

Certificate is registered to **3dtisk@3dtovarna.cz**

## General info

Nginx is used to proxy http servers (`3dprint-shop` and `3dprint-shop-static-files`) into https server

`3dprint-shop` from port 8041 to 8040

`3dprint-shop-static-files` from port 8001 to 8000



## How to renew certificate

Stop services which are running on ports 80 and 443 (currently it is apache2) as those ports are needed for authentication of the domain

Run

```bash
$ sudo certbot renew
```

Restart the stopped services

Done!