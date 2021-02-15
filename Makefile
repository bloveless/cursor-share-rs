.DEFAULT: build

tag = 0.0.1-alpha.2

build:
	docker build --tag bloveless/cursor-share-rs:$(tag) .

deploy:
	docker buildx build --push --platform linux/arm64 --tag bloveless/cursor-share-rs:$(tag) .
