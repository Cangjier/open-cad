cmake_minimum_required(VERSION 3.10)

# 1. 项目构建
# 1.1 项目名称
project(__PROJECT_NAME__)

## 1.2 输出路径
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_SOURCE_DIR}/bin)

## 1.3 Release/Debug
set(CMAKE_BUILD_TYPE "Release" CACHE STRING "Choose the type of build." FORCE)

## 1.3 默认所有源文件
set(IGNORED_DIRS "\\.git" "\\.vs" "bin" "build" "\\.vscode")
file(GLOB_RECURSE SOURCES
    "${CMAKE_SOURCE_DIR}/*.cpp"
    "${CMAKE_SOURCE_DIR}/*.cxx"
)
foreach(IGNORE_DIR ${IGNORED_DIRS})
    list(FILTER SOURCES EXCLUDE REGEX "${CMAKE_SOURCE_DIR}(/|\\\\)${IGNORE_DIR}(/|\\\\).*")
endforeach()

add_library(${PROJECT_NAME} SHARED ${SOURCES})

## 1.4 添加头文件路径
file(GLOB_RECURSE FOUND_INTERFACE_FILES 
    "${CMAKE_SOURCE_DIR}/*.h")
set(INCLUDE_DIRS "")
foreach(file_path ${FOUND_INTERFACE_FILES})
    get_filename_component(dir_path ${file_path} DIRECTORY)
    list(APPEND INCLUDE_DIRS ${dir_path})
endforeach()
list(REMOVE_DUPLICATES INCLUDE_DIRS)
target_include_directories(${PROJECT_NAME} PRIVATE ${INCLUDE_DIRS})

# 2. 三方库
if(WIN32)
    execute_process(COMMAND cmd /c echo %USERPROFILE%
    OUTPUT_VARIABLE HOME_DIR
    OUTPUT_STRIP_TRAILING_WHITESPACE)
elseif(UNIX)
    set(HOME_DIR $HOME)
else()
    message(FATAL_ERROR "Unknown platform!")
endif()
## 2.1 设置vcpkg工具链
set(CMAKE_TOOLCHAIN_FILE "C:/vcpkg/scripts/buildsystems/vcpkg.cmake" CACHE STRING "vcpkg toolchain file")

## 2.2 头文件目录
target_include_directories(${PROJECT_NAME} PRIVATE "C:/third_party/include")

## 2.3 库文件
file(GLOB_RECURSE LIBS
    "C:/third_party/lib/*.lib"
)
target_link_libraries(${PROJECT_NAME} ${LIBS})

## 2.4 find_package


# 3. 其他配置
## 3.1 C++标准
set(CMAKE_CXX_STANDARD 17)

## 3.2 警告等级
if(MSVC)
    target_compile_options(${PROJECT_NAME} PRIVATE /W4)
else()
    target_compile_options(${PROJECT_NAME} PRIVATE -Wall -Wextra -pedantic)
endif()

## 3.3 预处理宏
target_compile_definitions(${PROJECT_NAME} PRIVATE _WINDOWS_SOURCE)

