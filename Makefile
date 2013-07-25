
build:
	@spm build

deploy:
	@rm -rf product
	@mkdir  product
	@mkdir  product/1.0.0
	@cp     dist/*.* product/1.0.0
	@echo
	@echo   " deploy to product/1.0.0"
	@ech