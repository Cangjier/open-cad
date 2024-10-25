cmake_minimum_required(VERSION 3.28)

# 1. 项目构建
# 1.1 项目名称
project(MyProject)

# 1.2 默认所有源文件
set(IGNORED_DIRS ".git" ".vs" "bin","build")
file(GLOB_RECURSE SOURCES
    "${CMAKE_SOURCE_DIR}/*.cpp"
    "${CMAKE_SOURCE_DIR}/*.cxx"
)
foreach(IGNORE_DIR ${IGNORED_DIRS})
    list(FILTER SOURCES EXCLUDE REGEX "${CMAKE_SOURCE_DIR}/${IGNORE_DIR}/.*")
endforeach()

add_executable(${PROJECT_NAME} ${SOURCES})

# 1.3 添加头文件路径
file(GLOB INCLUDE_DIRS LIST_DIRECTORIES true "${CMAKE_SOURCE_DIR}/*")
foreach(IGNORE_DIR ${IGNORED_DIRS})
    list(FILTER INCLUDE_DIRS EXCLUDE REGEX "${CMAKE_SOURCE_DIR}/${IGNORE_DIR}/.*")
endforeach()
target_include_directories(${PROJECT_NAME} PRIVATE ${INCLUDE_DIRS})

# 2. 三方库

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

## 3.2 输出路径
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_SOURCE_DIR}/bin)

## 3.3 警告等级
if(MSVC)
    target_compile_options(${PROJECT_NAME} PRIVATE /W4)
else()
    target_compile_options(${PROJECT_NAME} PRIVATE -Wall -Wextra -pedantic)
endif()

## 3.4 预处理宏
target_compile_definitions(${PROJECT_NAME} PRIVATE MY_DEFINE)

