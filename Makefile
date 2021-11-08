run:
	docker run -d -p 4200:3000 --rm --name nonameserver wheatleycode/nonameserver
stop:
	docker stop nonameserver