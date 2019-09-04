docker-image:
	docker build -t angular-desktop-ui/web .

publish:
	heroku container:login
	heroku container:push web
	heroku container:release web
