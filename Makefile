.DEFAULT: deploy

tag = 0.0.1-alpha.2

deploy:
	docker build --platform linux/arm64 --tag bloveless/cursor-share-rs:$(tag) .
	docker push bloveless/cursor-share-rs:$(tag)

