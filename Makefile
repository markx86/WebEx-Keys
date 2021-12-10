SOURCE_DIR_HOME = "src"
SOURCE_DIR = "${SOURCE_DIR_HOME}/webex-keys/"
BUILD_DIR = "build/"
VER = $(shell awk '/"version"/ {split($$0,a," "); gsub("\"","",a[2]); gsub(",","",a[2]); print a[2]}' src/webex-keys/manifest.json)
FINAL_NAME = "WebEx-Keys"

.PHONY: default
default:
	@echo "Building version ${VER}"
	@echo "Making build dir..." && mkdir -p "${BUILD_DIR}/wbkeys-${VER}"
	@echo "Building extension..." && web-ext build -s "${SOURCE_DIR}" -a "${BUILD_DIR}/wbkeys-${VER}" --overwrite-dest -n "${FINAL_NAME}-V${VER}.xpi"
	@echo "Zipping sources..." && zip -r "${BUILD_DIR}/wbkeys-${VER}/${FINAL_NAME}-V${VER}-source.zip" "${SOURCE_DIR_HOME}"
