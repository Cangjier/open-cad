add_library(__PROJECT_NAME__ INTERFACE)
target_sources(__PROJECT_NAME__ INTERFACE)
set(__PROJECT_NAME___DIR ${CMAKE_CURRENT_LIST_DIR})

# 首先查找所有文件
file(GLOB_RECURSE FOUND_PUBLIC_INTERFACE_FILES 
    "${__PROJECT_NAME___DIR}/*/PublicInterfaces/*"
    "${__PROJECT_NAME___DIR}/*/*/PublicInterfaces/*")

# 提取父目录路径
set(__PROJECT_NAME___INCLUDE_DIRS "")
foreach(file_path ${FOUND_PUBLIC_INTERFACE_FILES})
    get_filename_component(dir_path ${file_path} DIRECTORY)
    list(APPEND __PROJECT_NAME___INCLUDE_DIRS ${dir_path})
endforeach()

# 移除重复项
list(REMOVE_DUPLICATES __PROJECT_NAME___INCLUDE_DIRS)

target_include_directories(__PROJECT_NAME__ INTERFACE ${__PROJECT_NAME___INCLUDE_DIRS})

file(GLOB_RECURSE LIBS "${__PROJECT_NAME___DIR}/*.lib")
target_link_libraries(__PROJECT_NAME__ ${LIBS})

