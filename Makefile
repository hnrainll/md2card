.DEFAULT_GOAL := help

NPM ?= npm
RSYNC ?= rsync
GIT ?= git
SSH_PORT ?= 22

-include .env.deploy

.PHONY: help pull install dev preview test typecheck build check deploy-config upload-config upload-dry-run upload deploy-dry-run deploy

help:
	@printf '%s\n' \
		'make pull            从当前分支上游快进拉取代码' \
		'make install         安装锁定版本的依赖' \
		'make dev             启动本地开发服务' \
		'make preview         预览 dist/ 生产构建' \
		'make test            运行单元测试' \
		'make typecheck       运行 TypeScript 类型检查' \
		'make build           类型检查并构建 dist/' \
		'make check           运行测试、类型检查和构建' \
		'make upload-dry-run  预览现有 dist/ 的上传差异' \
		'make upload          只上传现有 dist/ 到服务器' \
		'make deploy-dry-run  安装依赖、检查、构建并预演上传（不拉取）' \
		'make deploy          拉取、安装依赖、检查、构建并上传'

pull:
	$(GIT) pull --ff-only

install:
	$(NPM) ci

dev:
	$(NPM) run dev

preview:
	$(NPM) run preview

test:
	$(NPM) test

typecheck:
	$(NPM) exec -- tsc -b

build:
	$(NPM) run build

# build already includes TypeScript checking.
check:
	$(MAKE) test
	$(MAKE) build

deploy-config:
	@test -n "$(strip $(DEPLOY_TARGET))" || { printf '%s\n' '缺少 DEPLOY_TARGET。请在 .env.deploy 中设置 user@host:/absolute/path/，或在命令行传入。'; exit 2; }

upload-config: deploy-config
	@test -f dist/index.html -a -f dist/app/index.html || { printf '%s\n' '缺少 dist/index.html 或 dist/app/index.html。请先运行 make build，或使用 make deploy。'; exit 2; }

upload-dry-run: upload-config
	$(RSYNC) -rczn --itemize-changes -e "ssh -p $(SSH_PORT)" dist/ "$(DEPLOY_TARGET)"

upload: upload-config
	$(RSYNC) -rcz --itemize-changes -e "ssh -p $(SSH_PORT)" dist/ "$(DEPLOY_TARGET)"

deploy-dry-run: deploy-config
	$(MAKE) install
	$(MAKE) check
	$(MAKE) upload-dry-run

deploy: deploy-config
	$(MAKE) pull
	$(MAKE) install
	$(MAKE) check
	$(MAKE) upload
