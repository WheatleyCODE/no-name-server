run:
	docker run -d -p 5000:5000 --rm --name nonameserver ID
stop:
	docker stop nonameserver