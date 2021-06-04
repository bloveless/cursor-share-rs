.DEFAULT: deploy

api_tag = 0.0.1-alpha.3
ui_tag = 0.0.1-alpha.3

publish-api:
	docker build -f api/Dockerfile --platform linux/arm64 --tag bloveless/cursor-share-api:$(api_tag) ./api
	docker push bloveless/cursor-share-api:$(api_tag)

publish-ui:
	docker build -f ui/Dockerfile --platform linux/arm64 --tag bloveless/cursor-share-ui:$(ui_tag) ./ui
	docker push bloveless/cursor-share-ui:$(ui_tag)

deploy: publish-api publish-ui
	kubectl apply -k ./k8s
